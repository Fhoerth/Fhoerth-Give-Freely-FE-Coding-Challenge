import { API } from '~API';
import { browser } from '~browser';

import { clients } from '../clients';
import { MessageType } from '../enums';
import type {
  AddListener,
  BroadcastMessage,
  BroadcastRequest,
  BroadcastResponse,
  FetchParticipantsResponse,
  OpenExternalLinkRequest,
  OpenExternalLinkResponse,
  PingRequest,
  PingResponse,
} from '../types';
import { createDeclarativeNetRequestInterceptor } from './createDeclarativeNetRequestInterceptor';

export class BackgroundCommunicationChannel {
  #requestInterceptorId = 0;

  initialize(): void {
    this.#attachListeners();
  }

  #handshakeListener: AddListener = (request, sender, sendResponse) => {
    if (request?.type !== MessageType.PING) {
      return;
    }

    try {
      const id = clients.getId(sender);
      const pingRequest: PingRequest = request;

      const handshakePromises = clients.maybeCreateHandshakePromises(
        pingRequest.channelId,
        pingRequest.clients,
      );

      handshakePromises
        .then(() => {
          const pingResponse: PingResponse = {
            type: MessageType.PONG,
            success: true,
            message: 'OK',
          };

          sendResponse(pingResponse);
        })
        .catch((reason) => {
          const pingResponse: PingResponse = {
            type: MessageType.PONG,
            success: false,
            message: reason instanceof Error ? reason.message : 'Unknown error',
          };

          try {
            sendResponse(pingResponse);
          } catch {
            console.error(`Couldn't send response to tab id ${id}`);
          }
        });

      const clientToBeConnected = clients.getOrCreateClientToBeConnected(
        pingRequest.channelId,
        pingRequest.client,
      );
      const { callback } = clientToBeConnected;

      void callback.resolve();
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : 'Unknown error';
      const pingResponse: PingResponse = {
        message,
        type: MessageType.PONG,
        success: false,
      };

      try {
        sendResponse(pingResponse);
      } catch {
        console.error(message);
      }
    }

    return true;
  };

  #broadcastListener: AddListener = (
    request,
    sender,
    sendResponse,
  ): void | boolean => {
    if (request?.type !== MessageType.BROADCAST_REQUEST) {
      return;
    }

    if (!clients.isTab(sender.tab?.id)) {
      return;
    }

    const broadcastRequest: BroadcastRequest = request;
    const tabClients = clients.getClients(broadcastRequest.channelId);
    const id = clients.getId(sender);

    if (!tabClients) {
      const message = `Couldn't find clients for tab id ${id}`;
      const broadcastResponse: BroadcastResponse = {
        type: MessageType.BROADCAST_RESPONSE,
        channelId: broadcastRequest.channelId,
        success: false,
        message,
      };

      try {
        return sendResponse(broadcastResponse);
      } catch {
        console.error(`Couldn't send response to tab id ${id}`);
      }

      return;
    }

    const recipients = tabClients.filter(
      (client) => client !== broadcastRequest.sender,
    );

    void Promise.all(
      recipients.map(
        (recipient) =>
          new Promise<void>((resolve, reject) => {
            const broadcastMessage: BroadcastMessage = {
              recipient,
              channelId: broadcastRequest.channelId,
              type: MessageType.BROADCAST_MESSAGE,
              broadcastChannel: broadcastRequest.broadcastChannel,
              payload: broadcastRequest.payload,
              sender: broadcastRequest.sender,
            };

            try {
              browser.tabs.sendMessage(Number(id), broadcastMessage, resolve);
            } catch {
              reject(new Error(`Couldn't send message to tab id ${id}`));
            }
          }),
      ),
    )
      .then(() => {
        const broadcastResponse: BroadcastResponse = {
          type: MessageType.BROADCAST_RESPONSE,
          channelId: broadcastRequest.channelId,
          success: true,
          message: 'OK',
        };

        try {
          return sendResponse(broadcastResponse);
        } catch {
          throw new Error(`Couldn't send response to tab id ${id}`);
        }
      })
      .catch((reason) => {
        const broadcastResponse: BroadcastResponse = {
          type: MessageType.BROADCAST_RESPONSE,
          channelId: broadcastRequest.channelId,
          success: true,
          message: reason instanceof Error ? reason.message : 'Unknown error',
        };

        try {
          return sendResponse(broadcastResponse);
        } catch {
          console.error(`Couldn't send response to tab id ${id}`);
        }
      });

    return true;
  };

  #requestListener: AddListener = (request, sender, sendResponse) => {
    if (request?.type !== MessageType.FETCH_PARTICIPANTS_REQUEST) {
      return;
    }

    const id = clients.getId(sender);

    void API.fetchParticipants()
      .then((result) => {
        const fetchParticipantsResponse: FetchParticipantsResponse = {
          type: MessageType.FETCH_PARTICIPANTS_RESPONSE,
          success: true,
          message: 'OK',
          payload: result.record.websites,
        };

        try {
          sendResponse(fetchParticipantsResponse);
        } catch {
          throw new Error(`Couldn't send response to tab id ${id}`);
        }
      })
      .catch(() => {
        const fetchParticipantsResponse: FetchParticipantsResponse = {
          type: MessageType.FETCH_PARTICIPANTS_RESPONSE,
          success: false,
          message: `Couldn't fetch participants`,
          payload: [],
        };

        try {
          sendResponse(fetchParticipantsResponse);
        } catch {
          console.error(`Couldn't send response to tab id ${id}`);
        }

        return;
      });

    return true;
  };

  #openExternalLinkListener: AddListener = (
    request,
    sender,
    sendResponse,
  ): void | boolean => {
    if (request?.type !== MessageType.OPEN_EXTERNAL_LINK) {
      return;
    }

    const id = clients.getId(sender);
    const openExternalLinkRequest = request as OpenExternalLinkRequest;

    this.#requestInterceptorId += 1;

    const requestInterceptorId = this.#requestInterceptorId;
    const { url, requestHeaders } = openExternalLinkRequest.payload;
    const rule = createDeclarativeNetRequestInterceptor(
      requestInterceptorId,
      url,
      requestHeaders,
    );

    void chrome.declarativeNetRequest
      .updateDynamicRules({
        addRules: [rule],
      })
      .then(() => {
        return browser.tabs.create({
          url: openExternalLinkRequest.payload.url,
        });
      })
      .then(() => {
        return chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [requestInterceptorId],
        });
      })
      .then(() => {
        const response: OpenExternalLinkResponse = {
          type: MessageType.OPEN_EXTERNAL_LINK,
          success: true,
          message: 'OK',
        };

        sendResponse(response);
      })
      .catch(() => {
        const errorMessage = `Couldn't send response to tab id ${id}, or open new tab`;
        try {
          const response: OpenExternalLinkResponse = {
            type: MessageType.OPEN_EXTERNAL_LINK,
            success: true,
            message: errorMessage,
          };

          sendResponse(response);
        } catch {
          console.error(errorMessage);
        }
      });

    return true;
  };

  #attachListeners(): void {
    browser.runtime.onMessage.addListener(this.#handshakeListener);
    browser.runtime.onMessage.addListener(this.#broadcastListener);
    browser.runtime.onMessage.addListener(this.#requestListener);
    browser.runtime.onMessage.addListener(this.#openExternalLinkListener);
  }
}

import { browser } from '~browser';

import { ChannelName, Client, MessageType } from '../enums';
import type {
  FetchParticipantsRequest,
  FetchParticipantsResponse,
  PingRequest,
  PingResponse,
} from '../types';

export interface Options {
  channelName: ChannelName;
  client: Client;
  clients: Client[];
}

export class CommunicationChannel {
  #channelName: ChannelName;
  #client: Client;
  #clients: Client[];

  constructor(options: Options) {
    this.#channelName = options.channelName;
    this.#client = options.client;
    this.#clients = options.clients;
  }

  async initialize(): Promise<void> {
    const request: PingRequest = {
      channelName: this.#channelName,
      type: MessageType.PING,
      client: this.#client,
      clients: this.#clients,
    };

    const response: PingResponse = await browser.runtime.sendMessage(request);

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async sendToBackground<
    Request extends Record<string, unknown>,
    Response extends Record<string, unknown> & {
      success: boolean;
      message: string;
    },
  >(request: Request): Promise<Response> {
    const response: Response = await browser.runtime.sendMessage(request);

    if (!response.success) {
      throw new Error(response.message);
    }

    return response;
  }

  async fetchParticipants(): Promise<FetchParticipantsResponse> {
    const response = await this.sendToBackground<
      FetchParticipantsRequest,
      FetchParticipantsResponse
    >({
      type: MessageType.FETCH_PARTICIPANTS_REQUEST,
    });

    return new Promise<FetchParticipantsResponse>((resolve, reject): void => {
      if (response.success) {
        return resolve(response);
      }

      reject(response);
    });
  }
}

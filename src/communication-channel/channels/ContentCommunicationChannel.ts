import { browser } from '~browser';

import { BroadcastChannel, ChannelName, Client, MessageType } from '../enums';
import type {
  AddListener,
  BroadcastMessage,
  BroadcastRequest,
  BroadcastResponse,
} from '../types';
import { CommunicationChannel } from './CommunicationChannel';
import type { Options } from './CommunicationChannel';

type Payload = Record<string, unknown>;
type SubscriptionCallback = (payload: Payload) => void;

export class ContentCommunicationChannel extends CommunicationChannel {
  #channelName: ChannelName;
  #client: Client;
  #subscriptions = new Map<BroadcastChannel, SubscriptionCallback>();
  #messages = new Map<BroadcastChannel, Set<BroadcastMessage>>();

  constructor(options: Options) {
    super(options);
    this.#channelName = options.channelName;
    this.#client = options.client;
  }

  async initialize(): Promise<void> {
    super.initialize();
    this.#attachBroadcastListener();
  }

  async broadcast<Payload extends Record<string, unknown>>(
    broadcastChannel: BroadcastChannel,
    payload: Payload,
  ): Promise<BroadcastResponse> {
    const request: BroadcastRequest = {
      broadcastChannel,
      payload,
      type: MessageType.BROADCAST_REQUEST,
      channelName: this.#channelName,
      sender: this.#client,
    };

    return this.sendToBackground<BroadcastRequest, BroadcastResponse>(request);
  }

  subscribeToChannel<Payload extends Record<string, unknown>>(
    broadcastChannel: BroadcastChannel,
    callback: (payload: Payload) => void,
  ): () => void {
    const unsubscribeFromBroadcastChannel = () => {
      this.#subscriptions.delete(broadcastChannel);
    };

    this.#subscriptions.set(broadcastChannel, callback as SubscriptionCallback);

    const maybeMessages = this.#messages.get(broadcastChannel);

    if (maybeMessages) {
      for (const message of maybeMessages) {
        callback(message.payload as Payload);
      }

      this.#messages.delete(broadcastChannel);
    }

    return unsubscribeFromBroadcastChannel;
  }

  #getOrCreateChannelMessages(
    broadcastChannel: BroadcastChannel,
  ): Set<BroadcastMessage> {
    const maybeMessagesSet = this.#messages.get(broadcastChannel);

    if (!maybeMessagesSet) {
      this.#messages.set(broadcastChannel, new Set());

      return this.#getOrCreateChannelMessages(broadcastChannel);
    }

    return maybeMessagesSet;
  }

  #broadcastListener: AddListener = (message, _sender, sendResponse): void => {
    if (message?.type !== MessageType.BROADCAST_MESSAGE) {
      return;
    }

    const broadcastMessage: BroadcastMessage = message;
    const { channelName, sender, recipient, broadcastChannel, payload } =
      broadcastMessage;

    if (
      channelName === this.#channelName &&
      recipient === this.#client &&
      sender !== this.#client
    ) {
      const maybeSubscription = this.#subscriptions.get(broadcastChannel);

      if (maybeSubscription) {
        maybeSubscription(payload);
      } else {
        const messages = this.#getOrCreateChannelMessages(broadcastChannel);
        messages.add(broadcastMessage);
      }
    }

    sendResponse();
  };

  #attachBroadcastListener(): void {
    browser.runtime.onMessage.addListener(this.#broadcastListener);
  }
}

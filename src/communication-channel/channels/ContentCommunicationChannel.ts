import { browser } from '~browser';

import { Channel, Client, MessageType } from '../enums';
import type {
  AddListener,
  BroadcastMessage,
  BroadcastRequest,
  BroadcastResponse,
} from '../types';
import { CommunicationChannel } from './CommunicationChannel';

type SubscriptionCallback = (payload: Record<string, unknown>) => void;

export class ContentCommunicationChannel extends CommunicationChannel {
  #client: Client;
  #subscriptions = new Map<Channel, SubscriptionCallback>();

  constructor(client: Client, clients: Client[] = []) {
    super(client, clients);
    this.#client = client;
  }

  async initialize(): Promise<void> {
    super.initialize();
    this.#attachBroadcastListener();
  }

  async broadcast<Payload extends Record<string, unknown>>(
    channel: Channel,
    payload: Payload,
  ): Promise<BroadcastResponse> {
    const request: BroadcastRequest = {
      type: MessageType.BROADCAST_REQUEST,
      channel,
      payload,
      sender: this.#client,
    };

    return this.sendToBackground<BroadcastRequest, BroadcastResponse>(request);
  }

  subscribeToChannel<Payload extends Record<string, unknown>>(
    channel: Channel,
    callback: (payload: Payload) => void,
  ): () => void {
    const unsubscribeFromChannel = () => {
      this.#subscriptions.delete(channel);
    };

    this.#subscriptions.set(channel, callback as SubscriptionCallback);

    return unsubscribeFromChannel;
  }

  #broadcastListener: AddListener = (message, _sender, sendResponse) => {
    if (message?.type !== MessageType.BROADCAST_MESSAGE) {
      return;
    }

    const broadcastMessage: BroadcastMessage = message;
    const { sender, recipient, channel, payload } = broadcastMessage;

    if (sender !== this.#client && recipient === this.#client) {
      const maybeSubscription = this.#subscriptions.get(channel);

      if (maybeSubscription) {
        maybeSubscription(payload);
      }
    }

    sendResponse();
  };

  #attachBroadcastListener(): void {
    browser.runtime.onMessage.addListener(this.#broadcastListener);
  }
}

import { browser } from '~browser';

import { Channel, ChannelName, Client, MessageType } from '../enums';
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
  #subscriptions = new Map<Channel, SubscriptionCallback>();
  #messages = new Map<Channel, Set<BroadcastMessage>>();

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
    channel: Channel,
    payload: Payload,
  ): Promise<BroadcastResponse> {
    const request: BroadcastRequest = {
      channel,
      payload,
      type: MessageType.BROADCAST_REQUEST,
      channelName: this.#channelName,
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

    const maybeMessages = this.#messages.get(channel);

    if (maybeMessages) {
      for (const message of maybeMessages) {
        callback(message.payload as Payload);
      }
      this.#messages.delete(channel);
    }

    return unsubscribeFromChannel;
  }

  #getOrCreateChannelMessages(channel: Channel): Set<BroadcastMessage> {
    const maybeMessagesSet = this.#messages.get(channel);

    if (!maybeMessagesSet) {
      this.#messages.set(channel, new Set());

      return this.#getOrCreateChannelMessages(channel);
    }

    return maybeMessagesSet;
  }

  #broadcastListener: AddListener = (message, _sender, sendResponse): void => {
    if (message?.type !== MessageType.BROADCAST_MESSAGE) {
      return;
    }

    const broadcastMessage: BroadcastMessage = message;
    const { channelName, sender, recipient, channel, payload } =
      broadcastMessage;

    if (
      channelName === this.#channelName &&
      recipient === this.#client &&
      sender !== this.#client
    ) {
      const maybeSubscription = this.#subscriptions.get(channel);

      if (maybeSubscription) {
        maybeSubscription(payload);
      } else {
        const messages = this.#getOrCreateChannelMessages(channel);
        messages.add(broadcastMessage);
      }
    }

    sendResponse();
  };

  #attachBroadcastListener(): void {
    browser.runtime.onMessage.addListener(this.#broadcastListener);
  }
}

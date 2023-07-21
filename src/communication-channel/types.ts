import type { Participant } from '~API/types';

import { BroadcastChannel, ChannelId, Client, MessageType } from './enums';

export type AddListener = Parameters<
  typeof chrome.runtime.onMessage.addListener
>[0];
export type MessageSender = Parameters<AddListener>[1];
export type Callback = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason: any) => void;
};

export type PingRequest = {
  type: MessageType.PING;
  channelId: ChannelId;
  client: Client;
  clients: Client[];
};

export type PingResponse = {
  type: MessageType.PONG;
  success: boolean;
  message: string;
};

export type BroadcastRequest<P extends Record<string, unknown> = {}> = {
  type: MessageType.BROADCAST_REQUEST;
  broadcastChannel: BroadcastChannel;
  channelId: ChannelId;
  sender: Client;
  payload: P;
};

export type BroadcastResponse = {
  type: MessageType.BROADCAST_RESPONSE;
  channelId: ChannelId;
  success: boolean;
  message: string;
};

export type BroadcastMessage<P extends Record<string, unknown> = {}> = {
  type: MessageType.BROADCAST_MESSAGE;
  channelId: ChannelId;
  broadcastChannel: BroadcastChannel;
  sender: Client;
  recipient: Client;
  payload: P;
};

export type ParticipantsChangeMessage = { participants: Participant[] };
export type OpenModalMessage = { opened: true };

export type FetchParticipantsRequest = {
  type: MessageType.FETCH_PARTICIPANTS_REQUEST;
};

export type FetchParticipantsResponse = {
  type: MessageType.FETCH_PARTICIPANTS_RESPONSE;
  success: boolean;
  message: string;
  payload: Participant[];
};

export type OpenExternalLinkRequest = any;
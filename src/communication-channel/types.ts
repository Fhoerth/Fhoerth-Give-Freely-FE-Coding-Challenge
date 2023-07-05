import type { Participant } from '~API/types';

import { Channel, Client, MessageType } from './enums';

export type Id = String;
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
  channel: Channel;
  sender: Client;
  payload: P;
};

export type BroadcastResponse = {
  type: MessageType.BROADCAST_RESPONSE;
  success: boolean;
  message: string;
};

export type BroadcastMessage<P extends Record<string, unknown> = {}> = {
  type: MessageType.BROADCAST_MESSAGE;
  channel: Channel;
  sender: Client;
  payload: P;
};

export type ParticipantsChangeMessage = { participants: Participant[] };

export type FetchParticipantsRequest = {
  type: MessageType.FETCH_PARTICIPANTS_REQUEST;
};

export type FetchParticipantsResponse =
  | {
      type: MessageType.FETCH_PARTICIPANTS_RESPONSE;
      success: true;
      message: 'OK';
      payload: Participant[];
    }
  | {
      type: MessageType.FETCH_PARTICIPANTS_RESPONSE;
      success: false;
      message: string;
      payload: null;
    };

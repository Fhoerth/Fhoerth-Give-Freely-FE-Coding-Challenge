import type { Participant } from '~API/types';

import { Channel, Client, MessageType, Name } from './enums';

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
  name: Name;
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
  name: Name;
  sender: Client;
  payload: P;
};

export type BroadcastResponse = {
  type: MessageType.BROADCAST_RESPONSE;
  name: Name;
  success: boolean;
  message: string;
};

export type BroadcastMessage<P extends Record<string, unknown> = {}> = {
  type: MessageType.BROADCAST_MESSAGE;
  name: Name;
  channel: Channel;
  sender: Client;
  recipient: Client;
  payload: P;
};

export type ParticipantsChangeMessage = { participants: Participant[] };
export type OpenModalMessage = { opened: true };

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

import { browser } from '~browser';

import { Client, MessageType, Name } from '../enums';
import type {
  FetchParticipantsRequest,
  FetchParticipantsResponse,
  PingRequest,
  PingResponse,
} from '../types';

export interface Options {
  name: Name;
  client: Client;
  clients: Client[];
}

export class CommunicationChannel {
  #name: Name;
  #client: Client;
  #clients: Client[];

  constructor(options: Options) {
    this.#name = options.name;
    this.#client = options.client;
    this.#clients = options.clients;
  }

  async initialize(): Promise<void> {
    const request: PingRequest = {
      name: this.#name,
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
    return this.sendToBackground<
      FetchParticipantsRequest,
      FetchParticipantsResponse
    >({
      type: MessageType.FETCH_PARTICIPANTS_REQUEST,
    });
  }
}

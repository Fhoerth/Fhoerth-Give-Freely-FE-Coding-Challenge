import { browser } from '~browser';

import { Client, MessageType } from '../enums';
import type { PingRequest, PingResponse } from '../types';

export class CommunicationChannel {
  #client: Client;
  #clients: Client[];

  constructor(client: Client, clients: Client[] = []) {
    this.#client = client;
    this.#clients = clients;
  }

  async initialize(): Promise<void> {
    const request: PingRequest = {
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
}

import { assert } from '~utils/assert';

import type { Client } from './enums';
import { ChannelId } from './enums';
import type { Callback, MessageSender } from './types';

type TabId = number;
type PopupUrl = string;

class Clients {
  #clients = new Map<ChannelId, Client[]>();
  #clientsToBeConnected = new Map<
    ChannelId,
    { client: Client; callback: Callback }[]
  >();
  #handshakePromises = new Map<ChannelId, Promise<void[]>>();

  static createVoidPromise(): Callback {
    let resolvePromise: () => void;
    let rejectPromise: (reason: any) => void;

    const promise = new Promise<void>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    return { promise, resolve: resolvePromise!, reject: rejectPromise! };
  }

  getOrCreateClients(channelId: ChannelId, clients: Client[]): Client[] {
    const maybeClients = this.#clients.get(channelId);

    if (!maybeClients) {
      this.#clients.set(channelId, clients);

      return this.getOrCreateClients(channelId, clients);
    }

    return maybeClients;
  }

  getOrCreateClientToBeConnected(
    channelId: ChannelId,
    client: Client,
  ): {
    client: Client;
    callback: Callback;
  } {
    const maybeClientsToBeConnected = this.#clientsToBeConnected.get(channelId);

    if (!maybeClientsToBeConnected) {
      this.#clientsToBeConnected.set(channelId, []);

      return this.getOrCreateClientToBeConnected(channelId, client);
    }

    const maybeClientToBeConnected = maybeClientsToBeConnected.find(
      (toBeConnected) => toBeConnected.client === client,
    );

    if (!maybeClientToBeConnected) {
      maybeClientsToBeConnected.push({
        client,
        callback: Clients.createVoidPromise(),
      });

      return this.getOrCreateClientToBeConnected(channelId, client);
    }

    return maybeClientToBeConnected;
  }

  maybeCreateHandshakePromises(
    channelId: ChannelId,
    clients: Client[],
  ): Promise<void[]> {
    const maybePromises = this.#handshakePromises.get(channelId);

    if (!maybePromises) {
      const tabClients = this.getOrCreateClients(channelId, clients);
      const promises = Promise.all(
        tabClients
          .map((clientId) =>
            this.getOrCreateClientToBeConnected(channelId, clientId),
          )
          .map(({ callback }) => callback.promise),
      );

      this.#handshakePromises.set(channelId, promises);

      return this.maybeCreateHandshakePromises(channelId, clients);
    }

    return maybePromises;
  }

  isTab(sender: string | number | undefined): sender is TabId {
    if (typeof (sender as string) === 'number') {
      return true;
    }

    return false;
  }

  isPopup(sender: string | undefined): sender is PopupUrl {
    if (typeof (sender as string) === 'string') {
      return (
        (sender as string).startsWith('chrome-extension://') &&
        (sender as string).endsWith('popup.html')
      );
    }

    return false;
  }

  getId(sender: MessageSender): string {
    const { id } = sender.tab || {};
    const { url } = sender;

    if (this.isTab(id)) {
      return String(id);
    }

    if (this.isPopup(url)) {
      return url;
    }

    throw new Error('sender must comer from a tab or the popup extension');
  }

  getClients(channelId: ChannelId): Client[] | null {
    return this.#clients.get(channelId) || null;
  }
}

const clients = new Clients();

export { clients };

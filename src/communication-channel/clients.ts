import { assert } from '~utils/assert';

import type { Client } from './enums';
import { ChannelName } from './enums';
import type { Callback, MessageSender } from './types';

type TabId = number;
type PopupUrl = string;

class Clients {
  #clients = new Map<ChannelName, Client[]>();
  #clientsToBeConnected = new Map<
    ChannelName,
    { client: Client; callback: Callback }[]
  >();
  #handshakePromises = new Map<ChannelName, Promise<void[]>>();

  static createVoidPromise(): Callback {
    let resolvePromise: () => void;
    let rejectPromise: (reason: any) => void;

    const promise = new Promise<void>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    return { promise, resolve: resolvePromise!, reject: rejectPromise! };
  }

  getOrCreateClients(channelName: ChannelName, clients: Client[]): Client[] {
    const maybeClients = this.#clients.get(channelName);

    if (!maybeClients) {
      this.#clients.set(channelName, clients);

      return this.getOrCreateClients(channelName, clients);
    }

    return maybeClients;
  }

  getOrCreateClientToBeConnected(
    channelName: ChannelName,
    client: Client,
  ): {
    client: Client;
    callback: Callback;
  } {
    const maybeClientsToBeConnected =
      this.#clientsToBeConnected.get(channelName);

    if (!maybeClientsToBeConnected) {
      this.#clientsToBeConnected.set(channelName, []);

      return this.getOrCreateClientToBeConnected(channelName, client);
    }

    const maybeClientToBeConnected = maybeClientsToBeConnected.find(
      (toBeConnected) => toBeConnected.client === client,
    );

    if (!maybeClientToBeConnected) {
      maybeClientsToBeConnected.push({
        client,
        callback: Clients.createVoidPromise(),
      });

      return this.getOrCreateClientToBeConnected(channelName, client);
    }

    return maybeClientToBeConnected;
  }

  maybeCreateHandshakePromises(
    channelName: ChannelName,
    clients: Client[],
  ): Promise<void[]> {
    const maybePromises = this.#handshakePromises.get(channelName);

    if (!maybePromises) {
      const tabClients = this.getOrCreateClients(channelName, clients);
      const promises = Promise.all(
        tabClients
          .map((clientName) =>
            this.getOrCreateClientToBeConnected(channelName, clientName),
          )
          .map(({ callback }) => callback.promise),
      );

      this.#handshakePromises.set(channelName, promises);

      return this.maybeCreateHandshakePromises(channelName, clients);
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

  getClients(channelName: ChannelName): Client[] | null {
    return this.#clients.get(channelName) || null;
  }
}

const clients = new Clients();

export { clients };

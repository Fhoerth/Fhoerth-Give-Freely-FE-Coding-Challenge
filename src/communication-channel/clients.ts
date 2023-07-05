import { assert } from '~utils/assert';

import type { Client } from './enums';
import { Name } from './enums';
import type { Callback, MessageSender } from './types';

type TabId = number;
type PopupUrl = string;

class Clients {
  #clients = new Map<Name, Client[]>();
  #clientsToBeConnected = new Map<
    Name,
    { client: Client; callback: Callback }[]
  >();
  #handshakePromises = new Map<Name, Promise<void[]>>();

  static createVoidPromise(): Callback {
    let resolvePromise: () => void;
    let rejectPromise: (reason: any) => void;

    const promise = new Promise<void>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    return { promise, resolve: resolvePromise!, reject: rejectPromise! };
  }

  getOrCreateClients(name: Name, clients: Client[]): Client[] {
    const maybeClients = this.#clients.get(name);

    if (!maybeClients) {
      this.#clients.set(name, clients);

      return this.getOrCreateClients(name, clients);
    }

    return maybeClients;
  }

  getOrCreateClientToBeConnected(
    name: Name,
    client: Client,
  ): {
    client: Client;
    callback: Callback;
  } {
    const maybeClientsToBeConnected = this.#clientsToBeConnected.get(name);

    if (!maybeClientsToBeConnected) {
      this.#clientsToBeConnected.set(name, []);

      return this.getOrCreateClientToBeConnected(name, client);
    }

    const maybeClientToBeConnected = maybeClientsToBeConnected.find(
      (toBeConnected) => toBeConnected.client === client,
    );

    if (!maybeClientToBeConnected) {
      maybeClientsToBeConnected.push({
        client,
        callback: Clients.createVoidPromise(),
      });

      return this.getOrCreateClientToBeConnected(name, client);
    }

    return maybeClientToBeConnected;
  }

  maybeCreateHandshakePromises(name: Name, clients: Client[]): Promise<void[]> {
    const maybePromises = this.#handshakePromises.get(name);

    if (!maybePromises) {
      const tabClients = this.getOrCreateClients(name, clients);
      const promises = Promise.all(
        tabClients
          .map((clientName) =>
            this.getOrCreateClientToBeConnected(name, clientName),
          )
          .map(({ callback }) => callback.promise),
      );

      this.#handshakePromises.set(name, promises);

      return this.maybeCreateHandshakePromises(name, clients);
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

  getClients(name: Name): Client[] | null {
    return this.#clients.get(name) || null;
  }
}

const clients = new Clients();

export { clients };

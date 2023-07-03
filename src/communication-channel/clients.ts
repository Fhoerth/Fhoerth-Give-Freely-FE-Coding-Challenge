import { assert } from '~utils/assert';

import type { Client } from './enums';
import type { Callback, Id, MessageSender } from './types';

type TabId = number;
type PopupUrl = string;

class Clients {
  #clients = new Map<Id, Client[]>();
  #clientsToBeConnected = new Map<
    Id,
    { client: Client; callback: Callback }[]
  >();
  #handshakePromises = new Map<Id, Promise<void[]>>();

  static createVoidPromise(): Callback {
    let resolvePromise: () => void;
    let rejectPromise: (reason: any) => void;

    const promise = new Promise<void>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    return { promise, resolve: resolvePromise!, reject: rejectPromise! };
  }

  getOrCreateClients(id: Id, clients: Client[]): Client[] {
    const maybeClients = this.#clients.get(id);

    if (!maybeClients) {
      this.#clients.set(id, clients);

      return this.getOrCreateClients(id, clients);
    }

    return maybeClients;
  }

  getOrCreateClientToBeConnected(
    id: Id,
    client: Client,
  ): {
    client: Client;
    callback: Callback;
  } {
    const maybeClientsToBeConnected = this.#clientsToBeConnected.get(id);

    if (!maybeClientsToBeConnected) {
      this.#clientsToBeConnected.set(id, []);

      return this.getOrCreateClientToBeConnected(id, client);
    }

    const maybeClientToBeConnected = maybeClientsToBeConnected.find(
      (toBeConnected) => toBeConnected.client === client,
    );

    if (!maybeClientToBeConnected) {
      maybeClientsToBeConnected.push({
        client,
        callback: Clients.createVoidPromise(),
      });

      return this.getOrCreateClientToBeConnected(id, client);
    }

    return maybeClientToBeConnected;
  }

  maybeCreateHandshakePromises(id: Id, clients: Client[]): Promise<void[]> {
    const maybePromises = this.#handshakePromises.get(id);

    if (!maybePromises) {
      const tabClients = this.getOrCreateClients(id, clients);
      const promises = Promise.all(
        tabClients
          .map((clientName) =>
            this.getOrCreateClientToBeConnected(id, clientName),
          )
          .map(({ callback }) => callback.promise),
      );

      this.#handshakePromises.set(id, promises);

      return this.maybeCreateHandshakePromises(id, clients);
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

  getId(sender: MessageSender): Id {
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

  getClients(id: Id): Client[] | null {
    return this.#clients.get(id) || null;
  }
}

const clients = new Clients();

export { clients };

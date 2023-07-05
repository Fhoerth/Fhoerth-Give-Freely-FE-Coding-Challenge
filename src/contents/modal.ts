import type { PlasmoCSConfig } from 'plasmo';

import { renderModal } from '~applications';
import {
  Channel,
  Client,
  ContentCommunicationChannel,
} from '~communication-channel';
import type { ParticipantsChangeMessage } from '~communication-channel';
import { onDomContentLoaded } from '~contents-utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.google.com/search*', 'https://*.google.com.ar/search*'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel(Client.MODAL, [
    Client.MODAL,
    Client.BELL,
    Client.SEARCH,
  ]);

  await channel.initialize();

  const fetchParticipantsResponse = await channel.fetchParticipants();

  if (!fetchParticipantsResponse.success) {
    throw new Error(fetchParticipantsResponse.message);
  }

  const participants = fetchParticipantsResponse.payload;

  renderModal(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

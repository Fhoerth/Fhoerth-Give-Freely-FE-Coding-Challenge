import type { PlasmoCSConfig } from 'plasmo';

import { renderBell, renderModal } from '~applications';
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
  const channel = new ContentCommunicationChannel(Client.BELL, [
    Client.BELL,
    Client.SEARCH,
    Client.MODAL,
  ]);

  await channel.initialize();

  const fetchParticipantsResponse = await channel.fetchParticipants();
  const participants = fetchParticipantsResponse.payload;

  if (!fetchParticipantsResponse.success) {
    throw new Error(fetchParticipantsResponse.message);
  }

  renderBell(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

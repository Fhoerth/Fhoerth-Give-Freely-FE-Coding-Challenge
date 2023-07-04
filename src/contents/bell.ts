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

  channel.subscribeToChannel<ParticipantsChangeMessage>(
    Channel.PARTICIPANTS_CHANGE,
    (payload) => {
      console.log('Received participants change message', payload.changed);
    },
  );

  const fetchParticipantsResponse = await channel.fetchParticipants();
  const websites = fetchParticipantsResponse.payload;

  console.log('Response from Bell', websites);

  renderBell(channel);

  console.log('DOM Content Loaded - bell');
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

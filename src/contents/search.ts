import type { PlasmoCSConfig } from 'plasmo';

import {
  Channel,
  Client,
  ContentCommunicationChannel,
  MessageType,
} from '~communication-channel';
import type { ParticipantsChangeMessage } from '~communication-channel';
import { onDomContentLoaded } from '~contents-utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.google.com/search*', 'https://*.google.com.ar/search*'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel(Client.SEARCH, [
    Client.SEARCH,
    Client.BELL,
  ]);

  await channel.initialize();

  channel.broadcast<ParticipantsChangeMessage>(Channel.PARTICIPANTS_CHANGE, {
    changed: true,
  });

  console.log('DOM Content Loaded - search');
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

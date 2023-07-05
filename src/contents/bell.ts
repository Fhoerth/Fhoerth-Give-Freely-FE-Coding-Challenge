import type { PlasmoCSConfig } from 'plasmo';

import { renderBell } from '~applications';
import { Client, ContentCommunicationChannel } from '~communication-channel';
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

  renderBell(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

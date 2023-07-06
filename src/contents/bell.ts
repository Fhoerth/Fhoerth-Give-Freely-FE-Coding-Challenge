import type { PlasmoCSConfig } from 'plasmo';

import { renderBell } from '~applications/bell/renderBell';
import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { ChannelId, Client } from '~communication-channel/enums';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.google.com/search*', 'https://*.google.com.ar/search*'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelId: ChannelId.GOOGLE,
    client: Client.BELL,
    clients: [Client.BELL, Client.SEARCH, Client.MODAL],
  });

  await channel.initialize();

  renderBell(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

import type { PlasmoCSConfig } from 'plasmo';

import { renderModal } from '~applications/modal/renderModal';
import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { ChannelName, Client } from '~communication-channel/enums';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.google.com/search*', 'https://*.google.com.ar/search*'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelName: ChannelName.GOOGLE,
    client: Client.MODAL,
    clients: [Client.BELL, Client.SEARCH, Client.MODAL],
  });

  await channel.initialize();

  renderModal(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

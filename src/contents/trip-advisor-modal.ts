import type { PlasmoCSConfig } from 'plasmo';

import { renderModal } from '~applications/trip-advisor-modal/renderModal';
import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { ChannelId, Client, MessageType } from '~communication-channel/enums';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['https://*.tripadvisor.com/*'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelId: ChannelId.GLOBAL_MODAL,
    client: Client.GLOBAL_MODAL,
    clients: [Client.GLOBAL_MODAL],
  });

  await channel.initialize();

  renderModal(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

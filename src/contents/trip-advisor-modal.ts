import type { PlasmoCSConfig } from 'plasmo';

import { renderModal } from '~applications/trip-advisor-modal/renderModal';
import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { ChannelId, Client } from '~communication-channel/enums';
import { assert } from '~utils/assert';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

assert(process.env.PLASMO_PUBLIC_PARTICIPANTS_API_URL);

export const config: PlasmoCSConfig = {
  matches: [
    'https://*.tripadvisor.com/*',
    'https://api.jsonbin.io/v3/b/64678cf09d312622a36121b8*',
  ],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelId: ChannelId.GLOBAL_MODAL,
    client: Client.GLOBAL_MODAL,
    clients: [Client.GLOBAL_MODAL],
  });

  await channel.initialize();

  if (
    window.location.href ===
    'https://api.jsonbin.io/v3/b/64678cf09d312622a36121b8'
  ) {
    await channel.fetchParticipants();
    return;
  }

  renderModal(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

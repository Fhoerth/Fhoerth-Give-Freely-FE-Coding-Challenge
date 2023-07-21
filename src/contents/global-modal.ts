import type { PlasmoCSConfig } from 'plasmo';

import { renderModal } from '~applications/global-modal/renderModal';
import { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { MessageType, ChannelId, Client } from '~communication-channel/enums';
import type { OpenExternalLinkRequest } from '~communication-channel/types';
import { onDomContentLoaded } from '~utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

async function domContentLoaded(): Promise<void> {
  const channel = new ContentCommunicationChannel({
    channelId: ChannelId.GLOBAL_MODAL,
    client: Client.GLOBAL_MODAL,
    clients: [],
  });

  await channel.initialize();

  const request: OpenExternalLinkRequest = {
    type: MessageType.OPEN_EXTERNAL_LINK,
    channelId: ChannelId,
  };
  await channel.sendToBackground<OpenExternalLinkRequest, any>(request);

  renderModal(channel);
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

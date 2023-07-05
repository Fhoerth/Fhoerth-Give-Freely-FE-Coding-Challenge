import twBaseText from 'data-text:~styles/base.css';
import twStyleText from 'data-text:~styles/style.css';
import { createRoot } from 'react-dom/client';

import type { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { createModalShadowRoot } from '~utils/createModalShadowRoot';

import { Modal } from '.';
import { CommunicationChannelContextProvider } from '../common/Context';

export function renderModal(channel: ContentCommunicationChannel): void {
  const root = createRoot(createModalShadowRoot([twBaseText, twStyleText]));

  root.render(
    <CommunicationChannelContextProvider channel={channel}>
      <Modal />
    </CommunicationChannelContextProvider>,
  );
}

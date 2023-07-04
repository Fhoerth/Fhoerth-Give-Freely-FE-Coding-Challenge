import { createRoot } from 'react-dom/client';

import type { ContentCommunicationChannel } from '~communication-channel';
import { createModalShadowRoot } from '~utils/createModalShadowRoot';

import { CommunicationChannelContextProvider } from './Context';
import { Modal } from './Modal';

export function renderModal(channel: ContentCommunicationChannel): void {
  const root = createRoot(createModalShadowRoot());

  root.render(
    <CommunicationChannelContextProvider channel={channel}>
      <Modal />
    </CommunicationChannelContextProvider>,
  );
}

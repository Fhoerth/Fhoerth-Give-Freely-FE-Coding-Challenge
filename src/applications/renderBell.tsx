import baseText from 'data-text:~base.css';
import styleText from 'data-text:~style.css';
import { createRoot } from 'react-dom/client';

import type { ContentCommunicationChannel } from '~communication-channel';
import { createGoogleComBellShadowRoot } from '~utils/createGoogleComBellShadowRoot';

import { Bell } from './Bell';
import { CommunicationChannelContextProvider } from './Context';

export function renderBell(channel: ContentCommunicationChannel): void {
  const root = createRoot(createGoogleComBellShadowRoot([baseText, styleText]));

  root.render(
    <CommunicationChannelContextProvider channel={channel}>
      <Bell />
    </CommunicationChannelContextProvider>,
  );
}

import styles from 'data-text:./Bell/styles.css';
import twBaseText from 'data-text:~base.css';
import tWStyleText from 'data-text:~style.css';
import { createRoot } from 'react-dom/client';

import type { ContentCommunicationChannel } from '~communication-channel';
import { createGoogleComBellShadowRoot } from '~utils/createGoogleComBellShadowRoot';

import { Bell } from './Bell';
import { CommunicationChannelContextProvider } from './Context';

export function renderBell(channel: ContentCommunicationChannel): void {
  const root = createRoot(
    createGoogleComBellShadowRoot([styles, twBaseText, tWStyleText]),
  );

  root.render(
    <CommunicationChannelContextProvider channel={channel}>
      <Bell />
    </CommunicationChannelContextProvider>,
  );
}

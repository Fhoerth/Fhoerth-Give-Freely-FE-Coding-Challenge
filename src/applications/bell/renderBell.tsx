import styles from 'data-text:./styles.css';
import twBaseText from 'data-text:~styles/base.css';
import tWStyleText from 'data-text:~styles/style.css';
import { createRoot } from 'react-dom/client';

import type { ContentCommunicationChannel } from '~communication-channel/channels/ContentCommunicationChannel';
import { createGoogleComBellShadowRoot } from '~utils/createGoogleComBellShadowRoot';

import { Bell } from '.';
import { CommunicationChannelContextProvider } from '../common/Context';

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

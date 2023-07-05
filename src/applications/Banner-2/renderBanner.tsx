import twBaseText from 'data-text:~styles/base.css';
import twStyleText from 'data-text:~styles/style.css';
import { createRoot } from 'react-dom/client';

import type { Participant } from '~API/types';
import { createBannerShadowRoot } from '~utils/createBannerShadowRoot';

import { Banner } from '.';

export function renderBanner(participant: Participant): void {
  const root = createRoot(createBannerShadowRoot([twBaseText, twStyleText]));

  root.render(<Banner participant={participant} />);
}

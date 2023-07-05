import twBaseText from 'data-text:~base.css';
import twStyleText from 'data-text:~style.css';
import { createRoot } from 'react-dom/client';

import type { Participant } from '~API/types';
import { createBannerShadowRoot } from '~utils/createBannerShadowRoot';

import { Banner } from './Banner';

export function renderBanner(participant: Participant): void {
  const root = createRoot(createBannerShadowRoot([twBaseText, twStyleText]));

  root.render(<Banner participant={participant} />);
}

import baseText from 'data-text:~base.css';
import styleText from 'data-text:~style.css';
import { createRoot } from 'react-dom/client';

import type { Participant } from '~API/types';
import { createBannerShadowRoot } from '~utils/createBannerShadowRoot';

import { Banner } from './Banner';

export function renderBanner(participant: Participant): void {
  const root = createRoot(createBannerShadowRoot([baseText, styleText]));

  root.render(<Banner participant={participant} />);
}

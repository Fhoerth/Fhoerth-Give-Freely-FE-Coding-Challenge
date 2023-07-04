import { createRoot } from 'react-dom/client';

import type { Participant } from '~API/types';
import { createBannerShadowRoot } from '~utils/createBannerShadowRoot';

import { Banner } from './Banner';

export function renderBanner(participant: Participant): void {
  const root = createRoot(createBannerShadowRoot());

  root.render(<Banner participant={participant} />);
}

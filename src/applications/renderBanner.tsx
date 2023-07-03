import { createRoot } from 'react-dom/client';

import { createBannerShadowRoot } from '~utils/createBannerShadowRoot';

import { Banner } from './Banner';

export function renderBanner(): void {
  const root = createRoot(createBannerShadowRoot());

  root.render(<Banner />);
}

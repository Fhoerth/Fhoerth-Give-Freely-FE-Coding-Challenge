import { createRoot } from 'react-dom/client';

import { createGoogleComShadowRootForBell } from '~utils/createGoogleComShadowRootForBell';

import { Bell } from './Bell';

export function renderBell(): void {
  const root = createRoot(createGoogleComShadowRootForBell());

  root.render(<Bell />);
}

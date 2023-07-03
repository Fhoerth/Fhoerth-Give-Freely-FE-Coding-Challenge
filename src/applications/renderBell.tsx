import { createRoot } from 'react-dom/client';

import { createGoogleComBellShadowRoot } from '~utils/createGoogleComBellShadowRoot';

import { Bell } from './Bell';

export function renderBell(): void {
  const root = createRoot(createGoogleComBellShadowRoot());

  root.render(<Bell />);
}

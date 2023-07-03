import { createRoot } from 'react-dom/client';

import { createGoogleComShadowBellRoot } from '~utils/createGoogleComShadowBellRoot';

import { Bell } from './Bell';

export function renderBell(): void {
  const root = createRoot(createGoogleComShadowBellRoot());

  root.render(<Bell />);
}

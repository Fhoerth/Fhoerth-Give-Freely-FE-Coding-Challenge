import { createRoot } from 'react-dom/client';

import type { Participant } from '~API/types';
import { createModalShadowRoot } from '~utils/createModalShadowRoot';

import { Modal } from './Modal';

export function renderModal(): void {
  const root = createRoot(createModalShadowRoot());

  root.render(<Modal />);
}

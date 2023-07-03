import { assert } from '~utils/assert';

function findBody(): HTMLBodyElement {
  const body = document.querySelector('body');

  assert(body, 'Unable to locate body html element');

  return body;
}

export function createBannerShadowRoot(): ShadowRoot {
  const maxZIndexForContent = Math.pow(2, 31) - 2;
  const body = findBody();

  const container = document.createElement('div');

  container.style.position = 'relative';
  container.style.zIndex = String(maxZIndexForContent);
  container.setAttribute('data-testid', 'giveFreely-participant-banner');

  body.appendChild(container);

  const shadowRoot = container.attachShadow({ mode: 'open' });

  return shadowRoot;
}

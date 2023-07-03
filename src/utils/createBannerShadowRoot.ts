import { assert } from '~utils/assert';

function findBody(): HTMLBodyElement {
  const body = document.querySelector('body');

  assert(body, 'Unable to locate body html element');

  return body;
}

export function createBannerShadowRoot(): ShadowRoot {
  const root = document.createElement('giveFreely-participant-banner');
  const shadowRoot = root.attachShadow({
    mode: 'open',
  });
  document.documentElement.prepend(root);

  return shadowRoot;
}

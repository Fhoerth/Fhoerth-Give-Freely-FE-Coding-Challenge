import { assert } from '~utils/assert';

function findFormContainer(): HTMLFormElement {
  const form = document.querySelector('form');

  assert(form, 'Unable to locate google form html element');

  return form;
}

export function createGoogleComBellShadowRoot(): ShadowRoot {
  const form = findFormContainer();
  const iconBar = form.nextElementSibling;

  const root = document.createElement('giveFreely-participant-banner');
  root.style.position = 'relative';

  const shadowRoot = root.attachShadow({
    mode: 'closed',
  });

  iconBar?.prepend(root);

  return shadowRoot;
}

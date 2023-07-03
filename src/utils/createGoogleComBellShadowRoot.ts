import baseCssText from 'data-text:~base.css';
import cssText from 'data-text:~style.css';

import { assert } from '~utils/assert';

function findFormContainer(): HTMLFormElement {
  const form = document.querySelector('form');

  assert(form, 'Unable to locate google form html element');

  return form;
}

export function createGoogleComBellShadowRoot(): HTMLDivElement {
  const form = findFormContainer();
  const iconBar = form.nextElementSibling;

  const root = document.createElement('giveFreely-participant-banner');
  const shadowRoot = root.attachShadow({
    mode: 'closed',
  });

  const html = document.createElement('div');
  html.setAttribute('id', 'html');

  const body = document.createElement('div');
  body.setAttribute('id', 'body');

  const style = document.createElement('style');
  style.textContent = baseCssText.concat('\n').concat(cssText);

  root.style.position = 'relative';

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);
  iconBar?.prepend(root);

  return body;
}

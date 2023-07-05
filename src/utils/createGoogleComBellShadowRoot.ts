import { assert } from '~utils/assert';

function findFormContainer(): HTMLFormElement {
  const form = document.querySelector('form');

  assert(form, 'Unable to locate google form html element');

  return form;
}

export function createGoogleComBellShadowRoot(
  styles: string[],
): HTMLDivElement {
  const root = document.createElement('giveFreely-participant-banner');
  const shadowRoot = root.attachShadow({
    mode: 'closed',
  });

  const form = findFormContainer();
  const iconBar = form.nextElementSibling;

  const html = document.createElement('div');
  const body = document.createElement('div');
  const style = document.createElement('style');

  html.setAttribute('id', 'html');
  body.setAttribute('id', 'body');

  style.textContent = styles.join('\n');

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);
  iconBar?.prepend(root);

  return body;
}

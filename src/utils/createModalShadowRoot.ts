import baseCssText from 'data-text:~base.css';
import cssText from 'data-text:~style.css';

export function createModalShadowRoot(): HTMLDivElement {
  const maxZIndexForContent = Math.pow(2, 31) - 2;
  const root = document.createElement('giveFreely-participants-modal');

  const shadowRoot = root.attachShadow({
    mode: 'closed',
  });

  const html = document.createElement('div');
  const body = document.createElement('div');
  const style = document.createElement('style');

  html.setAttribute('id', 'html');
  body.setAttribute('id', 'body');

  html.style.zIndex = String(maxZIndexForContent);
  html.style.position = 'absolute';
  html.style.top = '0';
  html.style.left = '0';

  style.textContent = baseCssText.concat('\n').concat(cssText);

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);

  document.documentElement.prepend(root);

  return body;
}

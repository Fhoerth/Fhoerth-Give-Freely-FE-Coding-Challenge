import baseCssText from 'data-text:~base.css';
import cssText from 'data-text:~style.css';

export function createBannerShadowRoot(): HTMLDivElement {
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

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);

  document.documentElement.prepend(root);

  return body;
}

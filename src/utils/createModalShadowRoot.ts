const maxZIndexForContent = Math.pow(2, 31) - 2;

export function createModalShadowRoot(styles: string[]): HTMLDivElement {
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

  style.textContent = styles.join('\n');

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);

  document.documentElement.prepend(root);

  return body;
}

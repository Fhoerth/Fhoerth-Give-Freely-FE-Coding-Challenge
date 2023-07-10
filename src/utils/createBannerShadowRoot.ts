export function createBannerShadowRoot(styles: string[]): HTMLDivElement {
  const root = document.createElement('giveFreely-participant-banner');
  const shadowRoot = root.attachShadow({
    mode: 'open',
  });

  const html = document.createElement('div');
  const body = document.createElement('div');
  const style = document.createElement('style');

  html.setAttribute('id', 'html');
  body.setAttribute('id', 'body');

  style.textContent = styles.join('\n');

  html.append(body);
  shadowRoot.append(style);
  shadowRoot.append(html);

  document.documentElement.prepend(root);

  return body;
}

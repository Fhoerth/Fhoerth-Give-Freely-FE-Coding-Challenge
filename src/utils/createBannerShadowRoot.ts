export function createBannerShadowRoot(): ShadowRoot {
  const root = document.createElement('giveFreely-participant-banner');
  const shadowRoot = root.attachShadow({
    mode: 'closed',
  });
  document.documentElement.prepend(root);

  return shadowRoot;
}

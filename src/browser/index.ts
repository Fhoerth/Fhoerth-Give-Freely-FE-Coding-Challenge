export const browser = (globalThis.browser ||
  globalThis.chrome) as typeof chrome;

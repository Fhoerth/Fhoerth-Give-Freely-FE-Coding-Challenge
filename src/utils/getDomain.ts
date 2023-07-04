export function getDomain(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^([a-zA-Z0-9-_])*\.?/, '')
    .replace(/\/.*$/, '');
}

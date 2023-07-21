import type { HttpHeader } from '../types';

const allResourceTypes = Object.values(
  chrome.declarativeNetRequest.ResourceType,
);

export function createDeclarativeNetRequestInterceptor(
  id: number,
  url: string,
  headers?: HttpHeader[],
): chrome.declarativeNetRequest.Rule {
  return {
    id,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: headers
        ? headers.map((header) => ({
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            header: header.key,
            value: header.value,
          }))
        : [],
    },
    condition: {
      urlFilter: url.concat('*'),
      resourceTypes: allResourceTypes,
    },
  };
}

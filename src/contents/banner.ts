import type { PlasmoCSConfig } from 'plasmo';

import { API } from '~API';
import { renderBanner } from '~applications';
import { onDomContentLoaded } from '~contents-utils/onDomContentLoaded';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

function bannerMatches(): boolean {
  const exampleDomain = 'http://www.example.org';
  const url = new URL(exampleDomain);
  const regexp = new RegExp(url.origin || '', 'gi');

  return !!regexp.exec(window.location.origin || '');
}

function injectBanner() {
  alert('Matched');
  renderBanner();
}

async function domContentLoaded(): Promise<void> {
  try {
    const response = await API.fetchParticipants();

    console.log(response);

    if (bannerMatches()) {
      injectBanner();
    }

    window.addEventListener('locationchange', () => {
      if (bannerMatches()) {
        injectBanner();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function main(): void {
  onDomContentLoaded(domContentLoaded);
}

void main();

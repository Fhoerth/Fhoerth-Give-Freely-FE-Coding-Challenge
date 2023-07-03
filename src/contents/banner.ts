import type { PlasmoCSConfig } from 'plasmo';

import { renderBanner } from '~applications';
import { Client, ContentCommunicationChannel } from '~communication-channel';
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
  renderBanner();
}

async function domContentLoaded(): Promise<void> {
  try {
    const channel = new ContentCommunicationChannel(Client.BELL);

    await channel.initialize();

    const fetchParticipantsResponse = await channel.fetchParticipants();
    const websites = fetchParticipantsResponse.payload;

    console.log('Response from Banner', websites);

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

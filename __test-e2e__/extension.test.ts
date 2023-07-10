import { jest } from '@jest/globals';
import path from 'path';
import puppeteer from 'puppeteer';

const pathToExtension = path.join(process.cwd(), 'build', 'chrome-mv3-prod');

const options = {
  width: 1920,
  height: 1080,
};

async function testExtensionOn(site: string): Promise<void> {
  const browser = await puppeteer.launch({
    headless: false,
    pipe: true,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      `--window-size=${options.width},${options.height}`,
    ],
  });
  const page = await browser.newPage();
  page.setViewport({ height: options.height, width: options.width });

  await page.goto('https://www.google.com');
  await browser.waitForTarget((target) => target.type() === 'service_worker');

  await page.$eval(
    'textarea',
    (element, value) => {
      element.value = `site:${value}`;
    },
    [site],
  );
  await page.$eval('center > input', (element) => {
    element.click();
  });
  await page.waitForNavigation();

  await page.$eval('giveFreely-notifications', (element) => {
    const { shadowRoot } = element;

    if (shadowRoot) {
      const bell = shadowRoot.querySelector(
        "div[data-testid='giveFreely__bell-icon']",
      );

      if (bell) {
        (bell as HTMLElement).click();
      }
    }

    return null;
  });
  await page.$eval('giveFreely-participants-modal', () => true);
  await browser.close();
}

jest.setTimeout(40000);

describe('extension', () => {
  it('works on uber site', async () => {
    await testExtensionOn('https://uber.com');
  });

  it('works on expedia site', async () => {
    await testExtensionOn('https://expedia.com');
  });

  it('works on trip advisor site', async () => {
    await testExtensionOn('https://tripadvisor.com');
  });
});

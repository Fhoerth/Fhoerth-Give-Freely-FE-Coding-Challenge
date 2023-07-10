import { jest } from '@jest/globals';
import path from 'path';
import puppeteer from 'puppeteer';

const pathToExtension = path.join(process.cwd(), 'build', 'chrome-mv3-prod');

async function testExtensionInSite(site: string): Promise<void> {
  const options = {
    width: 1920,
    height: 1080,
  };
  const browser = await puppeteer.launch({
    headless: false,
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
  await page.waitForNetworkIdle();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval('giveFreely-notifications', () => true);
  await browser.close();
}

jest.setTimeout(40000);

describe('extension', () => {
  it('works on uber site', async () => {
    await testExtensionInSite('https://uber.com');
  });

  it('works on expedia site', async () => {
    await testExtensionInSite('https://expedia.com');
  });

  it('works on trip advisor site', async () => {
    await testExtensionInSite('https://tripadvisor.com');
  });
});

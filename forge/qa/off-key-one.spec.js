const { test, expect, devices } = require('@playwright/test');

const URL = 'http://127.0.0.1:4321/games/off-key-one/';
const targets = [
  {
    name: 'iphone-se',
    viewport: { width: 375, height: 667 },
    userAgent: devices['iPhone 12'].userAgent,
  },
  {
    name: 'pixel-7',
    viewport: { width: 412, height: 915 },
    userAgent: devices['Pixel 7'].userAgent,
  },
];

for (const target of targets) {
  test(`${target.name} layout smoke test`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: target.viewport,
      isMobile: true,
      hasTouch: true,
      userAgent: target.userAgent,
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    await page.goto(URL, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toHaveText('Off-Key One');
    await expect(page.locator('#nextRoundBtn')).toBeVisible();
    await expect(page.locator('#voteBtn')).toBeVisible();

    const metrics = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      rootScrollWidth: document.documentElement.scrollWidth,
      rootClientWidth: document.documentElement.clientWidth,
      minButtonHeight: Math.min(...Array.from(document.querySelectorAll('button')).map((btn) => Math.round(btn.getBoundingClientRect().height))),
      smallestText: Math.min(...Array.from(document.querySelectorAll('body, body *')).map((el) => parseFloat(getComputedStyle(el).fontSize) || 999)),
    }));

    console.log(`[qa:${target.name}]`, JSON.stringify(metrics));
    expect(metrics.rootScrollWidth).toBeLessThanOrEqual(metrics.rootClientWidth + 1);
    expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.bodyClientWidth + 1);
    expect(metrics.minButtonHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.smallestText).toBeGreaterThanOrEqual(14);
    expect(pageErrors).toEqual([]);

    await page.screenshot({ path: `forge/qa/off-key-one-${target.name}.png`, fullPage: true });
    await context.close();
  });
}

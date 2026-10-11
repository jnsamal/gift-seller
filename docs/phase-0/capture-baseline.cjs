// Audit-only harness. Uses the desktop's bundled Playwright; no app dependencies changed.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, 'evidence');
const routes = ['/', '/category/personalised-gifts', '/product/personalised-photo-frame', '/search?q=frame', '/search?q=zzzznomatch', '/cart', '/checkout', '/login', '/verify-otp?id=9876543210', '/order/success/ORD-12345', '/track-order', '/track-order/ORD-12345', '/category/all', '/account', '/privacy', '/product/artisan-chocolate-box'];
(async () => {
  fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  try {
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      for (const route of routes) {
        const errors = [];
        const listener = e => errors.push(e.message);
        page.on('pageerror', listener);
        const row = { route, width, height, errors };
        try {
          const response = await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle', timeout: 45000 });
          row.status = response.status();
          await page.waitForTimeout(1800);
          row.title = await page.title();
          row.headings = await page.locator('h1').allTextContents();
          row.layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src) }));
          const name = `${width}-${route.replace(/[^a-z0-9]/gi, '_') || 'home'}.png`;
          await page.screenshot({ path: path.join(out, 'screenshots', name), fullPage: true, animations: 'disabled' });
          row.screenshot = name;
        } catch (e) { row.failure = e.message; }
        results.push(row);
        page.off('pageerror', listener);
        fs.writeFileSync(path.join(out, 'browser-baseline.json'), JSON.stringify(results, null, 2));
        console.log(width, route, row.status || row.failure);
      }
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });

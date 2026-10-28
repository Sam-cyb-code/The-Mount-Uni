import { chromium } from 'playwright';

const viewports = [
  { width: 320, height: 600 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing viewports on http://localhost:3000...\n');

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const scrollW = doc.scrollWidth;
      const clientW = doc.clientWidth;
      const innerW = window.innerWidth;
      const overflows = [];

      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > clientW + 1) {
          overflows.push({
            tag: el.tagName,
            id: el.id,
            className: (typeof el.className === 'string' ? el.className.slice(0, 70) : ''),
            right: Math.round(rect.right),
            excess: Math.round(rect.right - clientW),
            text: (el.textContent || '').trim().slice(0, 30),
          });
        }
      }

      // Group by top-level or unique classes
      const uniqueExcess = overflows.slice(0, 8);

      return {
        scrollW,
        clientW,
        innerW,
        hasOverflow: scrollW > clientW,
        diff: scrollW - clientW,
        topOverflows: uniqueExcess,
      };
    });

    console.log(`Viewport ${vp.width}x${vp.height}: scrollWidth=${result.scrollW}, clientWidth=${result.clientW}, diff=${result.diff}`);
    if (result.hasOverflow) {
      console.log(`  ❌ OVERFLOW detected (+${result.diff}px)`);
      for (const item of result.topOverflows.slice(0, 4)) {
        console.log(`     - [${item.tag}] class="${item.className}" excess=+${item.excess} text="${item.text}"`);
      }
    } else {
      console.log('  ✅ No overflow');
    }
    console.log('');
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

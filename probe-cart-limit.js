const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  for (let i = 0; i < 7; i++) {
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')].filter((b) => b.textContent && b.textContent.includes('Adicionar ao carrinho'));
      if (buttons.length) buttons[0].click();
    });
    await page.waitForTimeout(400);
    const cart = await page.locator('a[href="/carrinho"]').textContent();
    console.log(`click ${i+1}: ${cart}`);
  }

  await page.goto('https://verzel-store.qa-test-verzel-store.workers.dev/carrinho', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const body = await page.locator('body').innerText();
  console.log('BODY', body.slice(0, 1000));
  await browser.close();
})();

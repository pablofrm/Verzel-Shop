const { chromium } = require('playwright');

(async () => {
  const url = 'https://verzel-store.qa-test-verzel-store.workers.dev/';

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  try {
    console.log(`Acessando: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    const title = await page.title();
    const bodyText = await page.locator('body').innerText();

    console.log(`Título da página: ${title}`);
    console.log(`Texto principal encontrado: ${bodyText.trim().slice(0, 120)}...`);

    if (!title || !bodyText.trim()) {
      throw new Error('A página não carregou corretamente.');
    }

    await page.screenshot({ path: 'verzel-store-home.png', fullPage: true });
    console.log('Screenshot salvo em: verzel-store-home.png');
    console.log('Automação concluída com sucesso.');
  } catch (error) {
    console.error('Erro durante a automação:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

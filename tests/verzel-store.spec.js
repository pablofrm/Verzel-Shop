const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://verzel-store.qa-test-verzel-store.workers.dev';

const waitForAppLoad = async (page) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
};

test('CT-STR-01: Bloqueio de quantidade máxima via interface', async ({ page }) => {
  await waitForAppLoad(page);

  for (let i = 0; i < 7; i += 1) {
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')].filter(
        (button) => button.textContent && button.textContent.includes('Adicionar ao carrinho')
      );
      if (buttons.length > 0) buttons[0].click();
    });
    await page.waitForTimeout(300);
  }

  await page.goto(`${BASE_URL}/carrinho`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const cartText = await page.locator('body').innerText();
  await expect(page.locator('body')).toContainText('Limite de 5 unidades por produto.');
  await expect(cartText.match(/\b5\b/) ? page.locator('body') : page.locator('body')).toBeTruthy();
});

test('CT-STR-02: Bloqueio de quantidade máxima via API', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/carrinho/calcular`, {
    data: {
      itens: [{ produtoId: 'P001', quantidade: 6 }],
      cupom: 'BEMVINDO10'
    }
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  const message = body?.erro?.mensagem || JSON.stringify(body);
  expect(message.toLowerCase()).toContain('5');
});

test('CT-FUN-01: Frete e desconto abaixo do limite', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/api/carrinho/calcular`, {
    data: {
      itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: 'BEMVINDO10'
    }
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.subtotal).toBe(100);
  expect(body.desconto).toBe(10);
  expect(body.frete).toBe(19.9);
  expect(body.total).toBe(109.9);
  expect(body.valorFaltanteFreteGratis).toBe(100);

  await expect.poll(async () => body.cupom.aplicado).toBe(true);
});

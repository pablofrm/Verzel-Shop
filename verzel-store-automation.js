const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const BASE_URL = 'https://verzel-store.qa-test-verzel-store.workers.dev';

async function runScenario(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

async function ctStr01() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    for (let i = 0; i < 7; i += 1) {
      await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('button')].filter(
          (button) => button.textContent && button.textContent.includes('Adicionar ao carrinho')
        );

        if (buttons.length > 0) {
          buttons[0].click();
        }
      });
      await page.waitForTimeout(400);
    }

    await page.goto(`${BASE_URL}/carrinho`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const cartText = await page.locator('body').innerText();
    assert.match(cartText, /Limite de 5 unidades por produto\./i, 'A UI deveria bloquear a 6ª unidade.');
    assert.match(cartText, /5\s*\n|5\s*$/, 'A quantidade final deve permanecer em 5.');
  } finally {
    await browser.close();
  }
}

async function ctStr02() {
  const response = await fetch(`${BASE_URL}/api/carrinho/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itens: [{ produtoId: 'P001', quantidade: 6 }],
      cupom: 'BEMVINDO10'
    })
  });

  const body = await response.json();

  assert.equal(
    response.status,
    400,
    `Esperado status 400 para quantidade máxima inválida. Recebido: ${response.status}. Body: ${JSON.stringify(body)}`
  );

  const message = body?.erro?.mensagem || JSON.stringify(body);
  assert.match(message, /5|máximo|quantidade/i, 'A mensagem de erro deve informar que o limite por produto é 5.');
}

async function ctFun01() {
  const response = await fetch(`${BASE_URL}/api/carrinho/calcular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      itens: [{ produtoId: 'P005', quantidade: 1 }],
      cupom: 'BEMVINDO10'
    })
  });

  assert.equal(response.status, 200, `Esperado status 200 para cálculo válido. Recebido: ${response.status}`);

  const body = await response.json();
  assert.equal(body.subtotal, 100, 'Subtotal deve ser R$ 100,00.');
  assert.equal(body.desconto, 10, 'Desconto deve ser R$ 10,00.');
  assert.equal(body.frete, 19.9, 'Frete deve ser R$ 19,90.');
  assert.equal(body.total, 109.9, 'Total deve ser R$ 109,90.');
  assert.equal(body.valorFaltanteFreteGratis, 100, 'Faltante para frete grátis deve ser R$ 100,00.');
  assert.equal(body.cupom.aplicado, true, 'Cupom deve ser aplicado.');
}

(async () => {
  await runScenario('CT-STR-01: Bloqueio de quantidade máxima via interface', ctStr01);
  await runScenario('CT-STR-02: Bloqueio de quantidade máxima via API', ctStr02);
  await runScenario('CT-FUN-01: Frete e desconto abaixo do limite', ctFun01);
})();

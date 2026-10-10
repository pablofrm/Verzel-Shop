# Documentação de Testes - Verzel Store (Carrinho e Checkout)

Este documento centraliza todos os Casos de Teste (agrupados por heurísticas) e o arquivo BDD (Gherkin) unificado para a validação das regras de negócio do carrinho de compras.

---

## Parte 1: Casos de Teste Agrupados

### Structure (Estrutura)
Foco nos componentes físicos e lógicos do sistema.

**CT-STR-01: Bloqueio de quantidade máxima via Interface (CA10)**
* **Ação:** No carrinho de compras, tentar adicionar uma 6ª unidade do mesmo produto clicando no botão "+" ou digitando no campo de quantidade.
* **Resultado Esperado:** A interface deve impedir a ação (botão desabilitado) ou exibir uma mensagem de erro, mantendo a quantidade em 5.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

**CT-STR-02: Bloqueio de quantidade máxima via API (CA10)**
* **Ação:** Enviar um payload (ex: via Postman) para a rota de atualização do carrinho contendo `quantidade: 6` para um ID de produto.
* **Resultado Esperado:** A API deve retornar um status code de erro (ex: 400 Bad Request) informando que o limite por produto é 5.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

### Function (Função)
Foco no que o sistema faz (regras de negócio, cálculos, estados).

**CT-FUN-01: Regras combinadas de frete e desconto abaixo do limite (CA01, CA07, CA08, CA09)**
* **Ação:** Adicionar produtos totalizando R$ 100,00 e aplicar o cupom BEMVINDO10.
* **Resultado Esperado:** Subtotal de R$ 100,00; desconto de R$ 10,00 (10%); frete de R$ 19,90; total de R$ 109,90. Mensagem: "Falta R$ 100,00 para o frete grátis".
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

**CT-FUN-02: Isenção de frete no valor limítrofe exato (CA06, CA08)**
* **Ação:** Adicionar produtos totalizando exatamente R$ 200,00 e aplicar o cupom BEMVINDO10.
* **Resultado Esperado:** Frete grátis (avaliação antes do desconto). Valor total a pagar: R$ 180,00.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

**CT-FUN-03: Substituição de cupons (CA05)**
* **Ação:** Aplicar um cupom válido. Tentar aplicar um segundo sem remover o primeiro. Remover o primeiro e aplicar o segundo com sucesso.
* **Resultado Esperado:** Bloqueio da segunda aplicação automática. Permissão apenas após clicar em "remover" o atual.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

### Data (Dados)
Foco no processamento de informações (formatação, limites, casas decimais).

**CT-DAT-01: Sensibilidade e sanitização do código do cupom (CA02)**
* **Ação:** Inserir o cupom com espaços e variações de caixa (ex: "  bEmViNdO10  ").
* **Resultado Esperado:** Aplicação de 10% de desconto (como "BEMVINDO10"), higienizando espaços e ignorando case.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

**CT-DAT-02: Entrada de dados inválidos (CA03)**
* **Ação:** Digitar um cupom inexistente (ex: CUPOMFALSO99).
* **Resultado Esperado:** Exibir apenas "Cupom inválido." sem alterar os valores do carrinho.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

**CT-DAT-03: Arredondamento matemático padrão (CA11)**
* **Ação:** Adicionar produto de R$ 33,33 e aplicar cupom de 10% (R$ 3,333).
* **Resultado Esperado:** Desconto arredondado para R$ 3,33. Subtotal com desconto: R$ 30,00 (duas casas decimais mantidas na UI e API).
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

### Platform (Plataforma)
Foco no ambiente de execução.

**CT-PLA-01: Exibição responsiva das mensagens dinâmicas (CA03, CA04, CA07)**
* **Ação:** Acessar o carrinho via mobile (ex: 360x640) com o aviso "Falta R$ XX,XX para o frete grátis" visível e aplicar um cupom inválido.
* **Resultado Esperado:** As mensagens não devem quebrar o layout, sobrepor botões ou sumir sob o teclado virtual.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

### Operations (Operações)
Foco nos fluxos e uso real da aplicação.

**CT-OPE-01: Reversão de status de frete por ação do usuário (CA06, CA07)**
* **Ação:** Em um carrinho com R$ 250,00 (frete grátis ativado), remover/alterar itens até o subtotal cair para R$ 190,00.
* **Resultado Esperado:** Frete grátis revogado, cobrança de R$ 19,90 ativada e exibição dinâmica da mensagem "Falta R$ 10,00 para frete grátis".
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

### Time (Tempo)
Foco em concorrência, expirações e delays.

**CT-TIM-01: Validação de ciclo de vida do cupom (CA04)**
* **Ação:** Inserir um código de cupom configurado para ter expirado.
* **Resultado Esperado:** Exibir estritamente a mensagem "Cupom expirado." e impedir qualquer alteração de valores.
* **Evidência do Teste:** `[Link/Nome do arquivo]`
* **Registro de Bug:**
  * **Descrição:** `[Descreva o bug, se houver]`
  * **Evidência do Bug:** `[Link/Nome do arquivo]`

---

## Parte 2: Gherkin Unificado (BDD)

```gherkin
Funcionalidade: Carrinho de Compras e Checkout
  Como um cliente da loja Verzel Store
  Quero adicionar produtos ao carrinho, aplicar cupons e calcular frete
  Para finalizar minha compra com os valores e restrições corretas

  # CT-STR-01: Bloqueio de quantidade máxima via Interface (CA10)
  Cenário: Impedir a adição de mais de 5 unidades do mesmo produto pela UI
    Dado que estou no carrinho de compras
    E possuo 5 unidades de um determinado produto adicionadas
    Quando tento adicionar uma 6ª unidade clicando no botão "+" ou digitando no campo de quantidade
    Então a interface deve impedir a ação
    E manter a quantidade final em 5
    E o botão de adição deve ser desabilitado ou uma mensagem de erro deve ser exibida

  # CT-STR-02: Bloqueio de quantidade máxima via API (CA10)
  Cenário: Validar limite de quantidade de produto diretamente na API
    Dado que envio uma requisição para a API de atualização do carrinho
    Quando envio um payload contendo a quantidade "6" para um ID de produto específico
    Então a API deve retornar um status code de erro "400 Bad Request"
    E a mensagem de resposta deve informar que o limite máximo por produto é 5

  # CT-FUN-01: Regras combinadas de frete e desconto abaixo do limite (CA01, CA07, CA08, CA09)
  Cenário: Calcular frete e desconto quando o subtotal não atinge o frete grátis
    Dado que adicionei produtos ao carrinho totalizando o subtotal de R$ 100,00
    Quando aplico o cupom de desconto "BEMVINDO10"
    Então o subtotal exibido deve ser R$ 100,00
    E o desconto aplicado deve ser de R$ 10,00
    E o frete deve ser calculado em R$ 19,90
    E o valor total da compra deve ser R$ 109,90
    E o carrinho deve exibir a mensagem dinâmica: "Falta R$ 100,00 para o frete grátis"

  # CT-FUN-02: Isenção de frete no valor limítrofe exato (CA06, CA08)
  Cenário: Garantir isenção de frete baseada no subtotal antes do desconto
    Dado que adicionei produtos ao carrinho totalizando exatamente o subtotal de R$ 200,00
    Quando aplico o cupom de desconto "BEMVINDO10"
    Então o frete deve ser exibido como grátis
    E o valor total a pagar deve ser R$ 180,00

  # CT-FUN-03: Substituição de cupons (CA05)
  Cenário: Bloquear acúmulo de cupons e exigir remoção manual
    Dado que já tenho um cupom válido aplicado no carrinho
    Quando tento aplicar um segundo cupom sem remover o primeiro
    Então o sistema deve bloquear a segunda aplicação
    Quando eu clico em "remover" o cupom atual
    E aplico o segundo cupom novamente
    Então o sistema deve aplicar o segundo cupom com sucesso

  # CT-DAT-01: Sensibilidade e sanitização do código do cupom (CA02)
  Cenário: Higienizar código de cupom com variações de texto
    Dado que estou no carrinho de compras
    Quando insiro o cupom com espaços e variações de caixa "  bEmViNdO10  "
    Então o sistema deve higienizar os espaços e ignorar a diferença de maiúsculas e minúsculas
    E aplicar com sucesso o desconto de 10% correspondente ao cupom "BEMVINDO10"

  # CT-DAT-02: Entrada de dados inválidos (CA03)
  Cenário: Validar comportamento ao inserir um cupom inexistente
    Dado que estou no carrinho de compras
    Quando digito um código de cupom que não existe no banco de dados, como "CUPOMFALSO99"
    Então o sistema deve exibir estritamente a mensagem de erro "Cupom inválido."
    E não deve alterar o subtotal, o frete ou o total da compra

  # CT-DAT-03: Arredondamento matemático padrão (CA11)
  Cenário: Garantir arredondamento correto de desconto para duas casas decimais
    Dado que possuo no carrinho um produto no valor de R$ 33,33
    Quando aplico o cupom de desconto de 10%
    Então o desconto deve ser arredondado matematicamente para R$ 3,33
    E o subtotal com desconto deve ser de R$ 30,00
    E os valores na interface e na API devem conter sempre duas casas decimais

  # CT-PLA-01: Exibição responsiva das mensagens dinâmicas (CA03, CA04, CA07)
  Cenário: Validar integridade do layout em dispositivos móveis
    Dado que acesso o carrinho via dispositivo móvel com resolução de tela estreita (ex: 360x640)
    E o aviso de frete dinâmico "Falta R$ XX,XX para o frete grátis" está visível
    Quando aplico um cupom inválido
    Então a mensagem de erro "Cupom inválido." e a mensagem do frete não devem quebrar o layout da tela
    E não devem sobrepor os botões de checkout
    E não devem ficar ocultas pelo teclado virtual do dispositivo

  # CT-OPE-01: Reversão de status de frete por ação do usuário (CA06, CA07)
  Cenário: Revogar frete grátis se o subtotal cair abaixo do limite
    Dado que montei um carrinho com subtotal de R$ 250,00
    E o status de frete grátis foi ativado
    Quando altero a quantidade ou removo itens reduzindo o subtotal para R$ 190,00
    Então o sistema deve imediatamente revogar a isenção de frete
    E passar a cobrar a taxa de R$ 19,90
    E exibir dinamicamente a mensagem "Falta R$ 10,00 para frete grátis"

  # CT-TIM-01: Validação de ciclo de vida do cupom (CA04)
  Cenário: Impedir o uso de cupom fora do prazo de validade
    Dado que estou no carrinho de compras
    Quando insiro um código de cupom configurado com validade já expirada
    Então o sistema deve exibir estritamente a mensagem de erro "Cupom expirado."
    E impedir qualquer aplicação de desconto nos valores do carrinho
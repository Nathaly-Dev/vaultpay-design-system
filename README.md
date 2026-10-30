# VaultPay Design System

Design system único dos 3 produtos da VaultPay: **Assist**, **Insights** e **Triage**.

> ⚠️ **A VaultPay é uma empresa fictícia.** Marca, nome e produtos são inventados, para estudo e portfólio.

> 🚧 **Em andamento.** Hoje existe a fundação (tokens, marca e vitrine). Veja o [Roadmap](#roadmap).

## Por quê

Três produtos com cara de uma empresa só precisam de **uma** fonte de cores, fontes e peças. Aqui é o "manual da marca em forma de código": cada produto aponta para uma versão marcada deste repositório, e todos usam exatamente a mesma coisa.

## Marca

Cor característica **Ouro** (`#F5A623`) sobre grafite quente. Logo: um "V" com um ponto em cima, como o disco de um cofre.

## Como usar

Em um produto (a partir da primeira versão marcada):

```bash
npm install github:Nathaly-Dev/vaultpay-design-system#v0.1.0
```

```css
@import "@vaultpay/design-system/fonts.css";
@import "@vaultpay/design-system/tokens.css";
```

As fontes (Manrope e IBM Plex Mono, licença OFL) vêm junto e são auto-hospedadas: nada é carregado de CDN. Origem e licenças em [`fonts/README.md`](fonts/README.md).

O tema segue o sistema (`prefers-color-scheme`). Para forçar: `<html data-theme="light">` ou `<html data-theme="dark">`.

Logo: `logo/vaultpay-mark.svg` (ouro sobre grafite) pode ir em `<img>`. O `logo/vaultpay-mark-mono.svg` usa `currentColor`, então precisa ser colocado **direto na página** (SVG inline) para herdar a cor do texto; em `<img>` ele fica preto.

## Vitrine

Para ver a marca, as cores e a tipografia nos dois temas, sirva a pasta e abra `showcase/index.html`:

```bash
python -m http.server 4173
```

## Como desenvolver

```bash
npm run tokens:build   # gera src/tokens.css a partir de tokens/tokens.json
npm run check          # tokens em dia + contraste + testes
```

A fonte da verdade é `tokens/tokens.json`; o `src/tokens.css` é gerado. O contraste de cada par de cores (texto e fundo, foco, estados) é **medido por programa** nos dois temas, mínimo AA.

## Roadmap

- [ ] **1. Fundação:** tokens claro e escuro, marca, vitrine.
- [ ] **2. Peças básicas e de conversa:** botão, campo, badge, card; balões, digitando, citação de fonte, "encaminhado para atendente".
- [ ] **3. Dados:** tabela, filtros, paginação, bloco de código.
- [ ] **4. Painéis:** cards de métrica, gráficos, estados vazio, carregando e erro.

## Licença

[MIT](LICENSE).

## Como usei IA neste projeto

Uso o Claude Code como mentor técnico: ele propõe e escreve partes do código e me explica o porquê. Eu decido a direção (por exemplo, escolhi a cor Ouro entre três propostas) e reviso cada PR.

# HANDOFF: VaultPay Design System

Estado em **2026-11-10**. Leia isto antes de continuar. Regras e comandos ficam no [`CLAUDE.md`](CLAUDE.md); o histórico de versões, no [`CHANGELOG.md`](CHANGELOG.md).

## Onde estamos

| Etapa | Estado |
|---|---|
| 1. Fundação: tokens, contraste medido, fontes auto-hospedadas, marca e vitrine | ✅ |
| 2. Peças básicas e de conversa (Assist) | ✅ |
| Responsivo para os 3 produtos (v0.3.0) e claro como padrão sempre (v0.4.0) | ✅ |
| 3. Dados (tabela, filtros, paginação, bloco de código) | ⬜ quando Insights e Triage começarem |
| 4. Painéis (cards de métrica, gráficos, estados vazio/carregando/erro) | ⬜ idem |

Tags publicadas: `v0.1.0` a `v0.4.0`. O Assist usa a versão mais nova que tiver copiado (ver `web/src/design-system.manifest.json` dele). Contagem de testes: ver o CI.

## O que existe e como foi validado

| Parte | Onde | Evidência |
|---|---|---|
| Tokens (fonte da verdade) | `tokens/tokens.json` → `src/tokens.css` (gerado) | teste garante que o CSS está em dia |
| Contraste WCAG AA | `scripts/check-contrast.mjs` | todos os pares nos dois temas; mutação em memória reprova cor ruim |
| Ouro nunca é cor de estado; moeda sempre ouro | `tests/tokens.test.mjs`, `tests/logo.test.mjs` | testes automáticos |
| Fontes (Plus Jakarta Sans, IBM Plex Mono; Manrope só para o logo) | `fonts/`, `src/fonts.css` | integridade e origem em `fonts/README.md` |
| Marca (8 SVGs gerados por `scripts/build_logo.py`) | `logo/` | palavra em contorno puro; screenshots claro, escuro e celular |
| Peças (`vp-*`) | `src/components.css` | testes: só tokens, estados com a própria família de cor, menos movimento respeitado |
| Qualquer tela | tokens `breakpoint-*`, cartão compacto, `vp-drawer`, `scrim` | teste: `@media` só com os tamanhos combinados; mutação; vitrine medida em 375, 900×560 e 1280 |
| Claro como padrão sempre | `scripts/lib/tokens.mjs` | teste: o CSS gerado não tem `prefers-color-scheme`; escuro só com `data-theme="dark"` |
| CI | `.github/workflows/ci.yml` | `npm run check` e gitleaks |

## Pendências

| Item | Observação |
|---|---|
| Botão com cara de link ("Apagar conversa") | hoje no CSS do Assist; trazer para cá |
| Regras novas do `CLAUDE.md` ainda não aplicadas em tudo | "uma seção por tela", "qualquer aparelho" (testar em aparelho real), "sem repetição por tela": conferir vitrine e produtos |
| Leitor de tela e daltonismo simulado | só o contraste foi medido |
| Busca de semelhança da marca (Google Lens) | fica com a Nathaly |
| Kerning da palavra | usa a largura das letras, sem a tabela de kerning da fonte |
| O gerador de logos (Python) não roda no CI | os testes validam os SVGs gerados |
| Vitrine no GitHub Pages; proteção da `main` | precisam da confirmação dela |

## Como retomar

```bash
npm run check
python -m http.server 4173 --bind 127.0.0.1
```

Depois abra `http://127.0.0.1:4173/showcase/index.html`. Nova versão: mudar `tokens.json` (`version`) e `package.json`, `npm run tokens:build`, CHANGELOG, PR; depois do merge, tag `vX.Y.Z` com descrição no commit do merge; o produto copia da tag e confere por hash.

As armadilhas desta máquina (PowerShell, barras invertidas no Bash, PR preso em commit antigo depois de erro 500 do GitHub) estão no HANDOFF do Assist.

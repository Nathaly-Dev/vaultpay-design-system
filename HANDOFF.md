# HANDOFF: VaultPay Design System

Estado em **2026-10-30**. Leia isto antes de continuar. Regras e comandos ficam no [`CLAUDE.md`](CLAUDE.md).

## Onde estamos

**Etapa 1 (fundação e marca) concluída e mergeada.** O repositório tem tokens claro e escuro, contraste medido, fontes auto-hospedadas, a marca final com 8 versões do logo e a vitrine.

**Próximo passo: etapa 2, as peças de conversa** que o Assist vai usar: balão do cliente e do atendente, campo de mensagem, sugestões, "digitando", citação de fonte e o estado "encaminhado para atendente". Mostrar a proposta (visual) antes de codar. Vale esperar a API do Assist (Fase 3) definir o formato da resposta: texto, fontes, resultado e motivo.

## O que existe e como foi validado

| Parte | Onde | Evidência |
|---|---|---|
| Tokens (fonte da verdade) | `tokens/tokens.json` → `src/tokens.css` (gerado) | teste garante que o CSS está em dia |
| Contraste WCAG | `scripts/check-contrast.mjs` | 78 de 78 pares, nos dois temas; mutação em memória reprova cor ruim |
| Ouro nunca é cor de estado; moeda da marca sempre é ouro | `tests/tokens.test.mjs`, `tests/logo.test.mjs` | testes automáticos |
| Fontes Manrope e IBM Plex Mono (latim, licença OFL) | `fonts/`, `src/fonts.css` | assinatura woff2, integridade e origem em `fonts/README.md` |
| Marca final | `logo/` (8 SVGs), gerados por `scripts/build_logo.py` | palavra em contorno puro; traço e espaçamento medidos na fonte; screenshots claro, escuro e celular |
| Vitrine | `showcase/` | conferida no navegador |
| CI | `.github/workflows/ci.yml` | `npm run check` e gitleaks verdes na `main` |

Testes: 22 passando (`npm run check`).

## A marca (decidida pela Nathaly em 2026-10-30)

- Cor **Ouro** `#F5A623` sobre grafite quente `#14110D`.
- Símbolo: o "v" é um cofre aberto e uma **moeda de ouro inclinada cai dentro dele**. Na palavra, esse símbolo é o primeiro "v" de "vaultpay".
- O "V com ponto acima" foi **descartado**: já existe em várias marcas. Ela rejeitou propostas ilustradas (moedas, cubos, lingotes); gosta de minimalismo e quer ver opções desenhadas, poucas por vez.

## Pendências

| Item | Observação |
|---|---|
| Busca de semelhança da marca (Google Lens) | eu não faço busca por imagem; fica com a Nathaly |
| Kerning da palavra | usa a largura das letras, sem a tabela de kerning da fonte |
| O gerador de logos (Python + fontTools) não roda no CI | os testes validam os SVGs gerados |
| Leitor de tela e daltonismo simulado | só o contraste foi medido |
| Vitrine publicada no GitHub Pages | ainda não configurado (precisa da confirmação dela) |
| Primeira versão marcada (`v0.1.0`) | os produtos vão apontar para uma tag; criar quando a etapa 2 entrar |
| `main` sem proteção no GitHub | pedir confirmação |

## Como retomar

```bash
npm run check
python -m http.server 4173 --bind 127.0.0.1
```

Depois abra `http://127.0.0.1:4173/showcase/index.html`. Para regerar logos: `pip install --require-hashes -r scripts/requirements-logo.txt` e `python scripts/build_logo.py`.

As armadilhas do PowerShell desta máquina estão no HANDOFF do Assist (BOM, aspas removidas nos argumentos, `git commit -F`).

# VaultPay Design System

Design system único dos 3 produtos da **VaultPay (empresa FICTÍCIA)**: Assist (atendimento com IA), Insights (perguntas sobre dados) e Triage (back-office). Projeto de portfólio da Nathaly (primeiro emprego como Engenheira de IA Jr).
Complementa o `~/.claude/CLAUDE.md` global; em segurança vale o mais rígido. Os 3 produtos usam **exatamente** este sistema: nenhum produto define estilo próprio.

## Modo de trabalho
- Português do Brasil. **Ao explicar, linguagem não técnica e amigável**: analogia do dia a dia, exemplo primeiro, termo técnico depois com uma frase do que significa.
- Uma etapa por vez, proposta aprovada antes de arquitetura ou lib nova. Cada etapa = um PR, com screenshots (claro e escuro, celular e PC) antes de dizer que está pronto.

## Marca
- Cor característica: **Ouro** `#F5A623` sobre grafite quente `#14110D`. Logo: um "V" com um ponto em cima (disco de cofre).
- **Não** usar o design system pessoal da Nathaly (roxo): a marca é da VaultPay.
- A cor da marca **não vira cor de estado**. Aviso/erro/sucesso/info têm famílias próprias, e todo estado é **cor + ícone + rótulo** (nunca só cor).

## Regras
- **Fonte da verdade:** `tokens/tokens.json`. O `src/tokens.css` é **gerado** (`npm run tokens:build`); nunca editar à mão.
- Todo valor visual vem de token. Nada de cor, tamanho ou fonte solto em componente.
- Tema claro **e** escuro desenhados (escuro por camadas de elevação), respeitando `prefers-color-scheme`.
- **Contraste medido por programa** (`npm run contrast`), mínimo AA (4,5:1 texto; 3:1 foco e borda de campo). Falhou = corrigir a cor, não afrouxar o teste.
- Fontes e assets **auto-hospedados** (sem CDN que exponha o IP do visitante). Fontes: **Manrope** (texto) e **IBM Plex Mono** (números e código), só alfabeto latino, em `fonts/` com licença OFL. Plex Mono só tem os pesos 400 e 500.
- Poucas dependências; cada uma nova é decisão registrada. Hoje: zero.
- Hairline em vez de sombra pesada; um único botão primário por tela; números com `tabular-nums`.
- Dados fictícios sempre.

## Comandos
```bash
npm run tokens:build   # gera src/tokens.css a partir de tokens/tokens.json
npm run check          # tokens em dia + contraste + testes
```

## Roadmap
1. Fundação: tokens, marca, vitrine (em andamento)
2. Peças básicas e de conversa (Assist)
3. Dados (tabela, filtros, paginação, bloco de código)
4. Painéis (cards de métrica, gráficos, estados vazio/carregando/erro), só quando Insights e Triage começarem

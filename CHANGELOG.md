# Changelog

Versões seguem o [SemVer](https://semver.org/lang/pt-BR/). Os produtos (Assist, Insights, Triage) apontam para uma tag.

## 0.3.0 (2026-11-04)

Qualquer tela, nos três produtos.

- Tamanhos de tela combinados (tokens `breakpoint-sm` 30rem, `breakpoint-md` 48rem, `breakpoint-short` 40rem de altura). Teste garante que toda regra de tela das peças usa só esses valores.
- Cartão de sugestão compacto no celular e em tela baixa: uma linha (ícone + título); a pergunta sai da vista, mas continua para o leitor de tela.
- Nova peça `vp-drawer`: gaveta do menu no celular, para `<dialog>`, com animação desligada para quem pede menos movimento.
- Novos tokens `scrim` (fundo escurecido atrás da gaveta, por tema) e `drawer-width`.
- Botão de ícone (`vp-btn--icon`) com o mesmo formato redondo do botão comum: botões lado a lado não têm mais cantos diferentes.
- Vitrine: seção "Qualquer tela" com os cartões e a gaveta.

## 0.2.0 (2026-11-03)

Redesenho pedido pela Nathaly: mais cor no tema claro, menos linha e regras iguais nos dois temas.

- Fonte da interface: **Plus Jakarta Sans** (a Manrope fica só para o gerador do logo). Novo peso `weight-bold` (700).
- Tema claro em camadas: página bege (`surface-0`) e cartões brancos.
- Painel da marca (`vp-brand-panel`, tokens `brand-*`): menu grafite nos dois temas, com o item ativo em ouro.
- Mensagens sem borda e com texto maior; valores em negrito que não quebram; balão do cliente em ouro suave.
- Fonte citada vira etiqueta que abre o trecho (`<details>`).
- Novos: aviso de atenção (`vp-msg--warning`) com ação (`vp-msg__action`), `vp-note--warning`/`--danger`, `vp-chip`, `vp-segmented`, rótulo do digitando.
- Contraste conferido nos dois temas (92 pares).

## 0.1.0 (2026-11-03)

Primeira versão marcada.

- Tokens claro e escuro (`tokens.css`), com contraste AA medido.
- Fontes Manrope e IBM Plex Mono auto-hospedadas (`fonts.css`).
- Marca Ouro: símbolo do cofre com a moeda, 8 versões do logo.
- Peças de conversa (`components.css`): balões, fonte citada, encaminhado, erro, digitando, campo de mensagem, sugestão, navegação lateral e botão.

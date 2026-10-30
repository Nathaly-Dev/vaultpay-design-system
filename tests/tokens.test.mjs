import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { checkContrast, contrastPairs, contrastRatio } from "../scripts/lib/contrast.mjs";
import { buildCss, CSS_PATH, loadTokens, resolveTheme } from "../scripts/lib/tokens.mjs";

const tokens = loadTokens();
const normalize = (text) => text.replaceAll("\r\n", "\n");

test("contraste: valores conhecidos do WCAG", () => {
  assert.equal(contrastRatio("#000000", "#FFFFFF").toFixed(1), "21.0");
  assert.equal(contrastRatio("#FFFFFF", "#FFFFFF"), 1);
  // #777777 sobre branco é o caso clássico que fica logo abaixo de 4,5:1.
  assert.ok(contrastRatio("#777777", "#FFFFFF") < 4.5);
});

test("todos os pares de cores passam no contraste, nos dois temas", () => {
  const failures = checkContrast(tokens).filter((r) => !r.ok);
  assert.deepEqual(
    failures.map((r) => `${r.theme}: ${r.fg} sobre ${r.bg} = ${r.ratio.toFixed(2)}`),
    [],
  );
});

test("a verificação de contraste realmente reprova uma cor ruim", () => {
  const broken = structuredClone(tokens);
  broken.themes.light["text-primary"] = broken.themes.light["surface-0"];

  assert.ok(checkContrast(broken).some((r) => !r.ok && r.theme === "light"));
});

test("os dois temas definem exatamente os mesmos tokens", () => {
  assert.deepEqual(Object.keys(tokens.themes.light).sort(), Object.keys(tokens.themes.dark).sort());
});

test("toda referência resolve para uma cor existente", () => {
  for (const theme of Object.keys(tokens.themes)) {
    assert.doesNotThrow(() => resolveTheme(tokens, theme));
  }
});

test("os pares verificados só usam tokens que existem", () => {
  const defined = new Set(Object.keys(tokens.themes.light));
  for (const [fg, bg] of contrastPairs()) {
    assert.ok(defined.has(fg), `token inexistente: ${fg}`);
    assert.ok(defined.has(bg), `token inexistente: ${bg}`);
  }
});

test("a cor da marca (ouro) nunca é usada como cor de estado", () => {
  const gold = new Set(Object.values(tokens.primitives.gold));
  for (const theme of Object.keys(tokens.themes)) {
    const colors = resolveTheme(tokens, theme);
    for (const status of ["success", "warning", "danger", "info"]) {
      for (const part of ["fill", "bg", "text", "border"]) {
        assert.ok(!gold.has(colors[`${status}-${part}`]), `${theme}: ${status}-${part} usa ouro`);
      }
    }
  }
});

test("src/tokens.css está em dia com tokens.json", () => {
  assert.equal(normalize(readFileSync(CSS_PATH, "utf-8")), normalize(buildCss(tokens)));
});

test("o CSS gerado cobre tema claro, escuro automático e escuro forçado", () => {
  const css = buildCss(tokens);

  assert.match(css, /:root\[data-theme="light"\]/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /:root:not\(\[data-theme="light"\]\)/);
  assert.match(css, /:root\[data-theme="dark"\]/);
  assert.match(css, /color-scheme: dark;/);
});

test("o CSS gerado não tem cor solta nos temas: só referências às cores base", () => {
  const themed = buildCss(tokens)
    .split("\n")
    .filter(
      (line) =>
        /--vp-(surface-\d|text-(primary|secondary|muted|disabled|accent)|accent|focus|on-)/.test(line) &&
        !line.includes("var("),
    );

  assert.deepEqual(themed, []);
});

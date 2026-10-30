import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const TOKENS_PATH = fileURLToPath(new URL("../../tokens/tokens.json", import.meta.url));
export const CSS_PATH = fileURLToPath(new URL("../../src/tokens.css", import.meta.url));

const PREFIX = "vp";
const REFERENCE = /^([a-z]+)\.(\d+)$/;

export function loadTokens(path = TOKENS_PATH) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

// "gold.500" é uma referência a uma cor base; qualquer outro texto (ex.: uma sombra) é valor literal.
export function isReference(value) {
  return REFERENCE.test(value);
}

export function resolveHex(tokens, value) {
  const match = REFERENCE.exec(value);
  if (!match) return value;
  const hex = tokens.primitives[match[1]]?.[match[2]];
  if (!hex) throw new Error(`referência desconhecida: ${value}`);
  return hex;
}

export function resolveTheme(tokens, theme) {
  return Object.fromEntries(
    Object.entries(tokens.themes[theme]).map(([name, value]) => [name, resolveHex(tokens, value)]),
  );
}

export function buildCss(tokens) {
  const primitives = Object.entries(tokens.primitives).flatMap(([hue, stops]) =>
    Object.entries(stops).map(([stop, hex]) => `  --${PREFIX}-${hue}-${stop}: ${hex};`),
  );
  const statics = Object.entries(tokens.static).map(
    ([name, value]) => `  --${PREFIX}-${name}: ${value};`,
  );

  const themeLines = (theme, indent) =>
    Object.entries(tokens.themes[theme]).map(([name, value]) => {
      const match = REFERENCE.exec(value);
      const css = match ? `var(--${PREFIX}-${match[1]}-${match[2]})` : value;
      return `${indent}--${PREFIX}-${name}: ${css};`;
    });

  return [
    "/* GERADO por scripts/build-tokens.mjs a partir de tokens/tokens.json. Não edite à mão. */",
    `/* VaultPay Design System v${tokens.version} */`,
    "",
    ":root {",
    ...primitives,
    "",
    ...statics,
    "}",
    "",
    "/* Tema claro (padrão) */",
    ':root,\n:root[data-theme="light"] {',
    "  color-scheme: light;",
    ...themeLines("light", "  "),
    "}",
    "",
    "/* Tema escuro automático, a menos que o produto force o claro */",
    "@media (prefers-color-scheme: dark) {",
    '  :root:not([data-theme="light"]) {',
    "    color-scheme: dark;",
    ...themeLines("dark", "    "),
    "  }",
    "}",
    "",
    "/* Tema escuro forçado */",
    ':root[data-theme="dark"] {',
    "  color-scheme: dark;",
    ...themeLines("dark", "  "),
    "}",
    "",
  ].join("\n");
}

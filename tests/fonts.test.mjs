import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTokens } from "../scripts/lib/tokens.mjs";

const FONTS_CSS = fileURLToPath(new URL("../src/fonts.css", import.meta.url));
const FONTS_DIR = fileURLToPath(new URL("../fonts/", import.meta.url));
const css = readFileSync(FONTS_CSS, "utf-8");
const files = [...css.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((m) => resolve(dirname(FONTS_CSS), m[1]));
const families = new Set([...css.matchAll(/font-family:\s*"([^"]+)"/g)].map((m) => m[1]));

test("toda fonte declarada no CSS existe de verdade", () => {
  assert.ok(files.length >= 3, "esperava pelo menos 3 arquivos de fonte");
  for (const file of files) assert.ok(existsSync(file), `arquivo não encontrado: ${file}`);
});

test("os arquivos de fonte são woff2 de verdade (assinatura wOF2)", () => {
  for (const file of files) {
    assert.equal(readFileSync(file).subarray(0, 4).toString("ascii"), "wOF2", file);
  }
});

test("a primeira família de cada token de fonte tem @font-face", () => {
  const { static: s } = loadTokens();
  for (const token of ["font-sans", "font-mono"]) {
    const first = /^"([^"]+)"/.exec(s[token])?.[1];
    assert.ok(families.has(first), `${token} começa com "${first}", sem @font-face em fonts.css`);
  }
});

test("as licenças das duas fontes acompanham os arquivos", () => {
  for (const name of ["LICENSE-Manrope-OFL.txt", "LICENSE-IBMPlexMono-OFL.txt"]) {
    const text = readFileSync(`${FONTS_DIR}${name}`, "utf-8");
    assert.match(text, /SIL Open Font License/, name);
  }
});

test("nenhuma fonte é carregada de fora (sem CDN)", () => {
  assert.doesNotMatch(css, /https?:\/\//);
});

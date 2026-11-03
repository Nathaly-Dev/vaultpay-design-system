import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const css = readFileSync(new URL("../src/components.css", import.meta.url), "utf8");
const tokensCss = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

// Sem comentários, para um exemplo citado num comentário não contar como uso.
const code = css.replace(/\/\*[\s\S]*?\*\//g, "");
const defined = new Set([...`${tokensCss}\n${code}`.matchAll(/(--vp-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

test("toda variável usada nas peças existe", () => {
  const used = new Set([...code.matchAll(/var\((--vp-[a-z0-9-]+)\)/g)].map((m) => m[1]));
  assert.deepEqual([...used].filter((name) => !defined.has(name)), []);
});

test("nenhuma cor solta nas peças", () => {
  assert.deepEqual(code.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/g) ?? [], []);
});

test("nenhuma fonte solta nas peças", () => {
  const fonts = [...code.matchAll(/font-family:\s*([^;]+);/g)].map((m) => m[1].trim());
  assert.deepEqual(fonts.filter((value) => !value.startsWith("var(--vp-font-")), []);
});

test("tamanhos em px só para linha fina e contorno de foco", () => {
  const sizes = code.match(/\b\d+(?:\.\d+)?px\b/g) ?? [];
  assert.deepEqual(sizes.filter((value) => !["1px", "2px"].includes(value)), []);
});

test("as peças respeitam quem pede menos movimento", () => {
  assert.match(code, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/);
});

test("encaminhamento usa a família de informação, nunca a cor da marca", () => {
  const handoff = [...code.matchAll(/\.vp-msg--handoff[^{]*\{([^}]*)\}/g)].map((m) => m[1]).join("");
  assert.match(handoff, /--vp-info-/);
  assert.doesNotMatch(handoff, /--vp-(?:accent|gold|brand)/);
});

test("o pacote publica as peças", () => {
  assert.equal(pkg.exports["./components.css"], "./src/components.css");
});

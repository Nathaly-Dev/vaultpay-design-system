import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTokens, resolveTheme } from "../scripts/lib/tokens.mjs";

const LOGO_DIR = fileURLToPath(new URL("../logo/", import.meta.url));
const read = (name) => readFileSync(`${LOGO_DIR}${name}`, "utf-8");
const EXPECTED = [
  "favicon.svg",
  "vaultpay-app-icon.svg",
  "vaultpay-mark-mono.svg",
  "vaultpay-mark-on-dark.svg",
  "vaultpay-mark-on-light.svg",
  "vaultpay-mark.svg",
  "vaultpay-wordmark-on-dark.svg",
  "vaultpay-wordmark-on-light.svg",
];

test("todas as versões do logo existem e não sobrou logo antigo", () => {
  assert.deepEqual(readdirSync(LOGO_DIR).filter((f) => f.endsWith(".svg")).sort(), EXPECTED);
});

test("todo logo é um SVG acessível, com viewBox e título", () => {
  for (const name of EXPECTED) {
    const svg = read(name);
    assert.match(svg, /^<svg [^>]*viewBox="[^"]+"/, name);
    assert.match(svg, /role="img"/, name);
    assert.match(svg, /<title>VaultPay<\/title>/, name);
  }
});

test("a palavra é contorno puro: não depende de fonte instalada", () => {
  for (const name of ["vaultpay-wordmark-on-dark.svg", "vaultpay-wordmark-on-light.svg"]) {
    assert.doesNotMatch(read(name), /<text|font-family|@font-face/, name);
  }
});

test("nenhum logo carrega nada de fora", () => {
  for (const name of EXPECTED) {
    const withoutNamespace = read(name).replace('xmlns="http://www.w3.org/2000/svg"', "");
    assert.doesNotMatch(withoutNamespace, /https?:\/\//, name);
  }
});

test("var() do CSS só aparece em style, nunca em atributo (atributo não entende var)", () => {
  for (const name of EXPECTED) {
    assert.doesNotMatch(read(name), /(fill|stroke)="var\(/, name);
  }
});

test("as cores fixas dos logos são cores dos tokens", () => {
  const { primitives } = loadTokens();
  const palette = new Set(Object.values(primitives).flatMap((ramp) => Object.values(ramp)));
  for (const name of EXPECTED) {
    for (const [hex] of read(name).matchAll(/#[0-9A-Fa-f]{6}/g)) {
      assert.ok(palette.has(hex.toUpperCase()), `${name} usa ${hex}, que não está nos tokens`);
    }
  }
});

test("a moeda da marca é sempre ouro, nos dois temas", () => {
  const tokens = loadTokens();
  const gold = new Set(Object.values(tokens.primitives.gold));
  for (const theme of Object.keys(tokens.themes)) {
    const colors = resolveTheme(tokens, theme);
    assert.ok(gold.has(colors["brand-coin"]), `${theme}: brand-coin não é ouro`);
    assert.ok(gold.has(colors["brand-coin-edge"]), `${theme}: brand-coin-edge não é ouro`);
  }
});

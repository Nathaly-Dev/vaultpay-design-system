import { resolveTheme } from "./tokens.mjs";

// Fórmula oficial do WCAG 2.x: luminância relativa de uma cor sRGB.
export function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fgHex, bgHex) {
  const [light, dark] = [luminance(fgHex), luminance(bgHex)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const SURFACES = ["surface-0", "surface-1", "surface-2", "surface-3"];
const STATUSES = ["success", "warning", "danger", "info"];

// [texto/elemento, fundo, mínimo]. 4,5 = texto normal (AA); 3 = foco e borda de campo (WCAG 1.4.11).
export function contrastPairs() {
  const pairs = [];
  for (const fg of ["text-primary", "text-secondary", "text-muted", "text-accent"]) {
    for (const bg of SURFACES) pairs.push([fg, bg, 4.5]);
  }
  pairs.push(["on-accent", "accent", 4.5], ["on-accent", "accent-hover", 4.5]);
  pairs.push(["text-on-accent-subtle", "accent-subtle", 4.5]);
  for (const bg of ["surface-0", "surface-1"]) {
    pairs.push(["focus", bg, 3], ["border-input", bg, 3]);
  }
  for (const s of STATUSES) {
    pairs.push([`on-${s}`, `${s}-fill`, 4.5], [`${s}-text`, `${s}-bg`, 4.5]);
    for (const bg of ["surface-0", "surface-1"]) pairs.push([`${s}-text`, bg, 4.5]);
  }
  return pairs;
}

export function checkContrast(tokens, pairs = contrastPairs()) {
  const results = [];
  for (const theme of Object.keys(tokens.themes)) {
    const colors = resolveTheme(tokens, theme);
    for (const [fg, bg, min] of pairs) {
      const ratio = contrastRatio(colors[fg], colors[bg]);
      results.push({ theme, fg, bg, min, ratio, ok: ratio >= min });
    }
  }
  return results;
}

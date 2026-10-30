// Gera src/tokens.css a partir de tokens/tokens.json.
// Com --check, só confere se o arquivo está em dia (usado no CI) e não escreve nada.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { buildCss, CSS_PATH, loadTokens } from "./lib/tokens.mjs";

const css = buildCss(loadTokens());
const normalize = (text) => text.replaceAll("\r\n", "\n");

if (process.argv.includes("--check")) {
  const onDisk = existsSync(CSS_PATH) ? readFileSync(CSS_PATH, "utf-8") : "";
  if (normalize(onDisk) !== normalize(css)) {
    console.error("src/tokens.css está desatualizado. Rode: npm run tokens:build");
    process.exit(1);
  }
  console.log("src/tokens.css está em dia.");
} else {
  writeFileSync(CSS_PATH, css);
  console.log("src/tokens.css gerado.");
}

// Mede o contraste de cada par de cores nos dois temas. Falhou algum = sai com erro.
import { checkContrast } from "./lib/contrast.mjs";
import { loadTokens } from "./lib/tokens.mjs";

const results = checkContrast(loadTokens());
const failures = results.filter((r) => !r.ok);

for (const r of failures) {
  console.error(
    `FALHOU [${r.theme}] ${r.fg} sobre ${r.bg}: ${r.ratio.toFixed(2)}:1 (mínimo ${r.min}:1)`,
  );
}

const lowest = results.reduce((a, b) => (a.ratio / a.min < b.ratio / b.min ? a : b));
console.log(
  `${results.length - failures.length} de ${results.length} pares passam. ` +
    `Menor margem: [${lowest.theme}] ${lowest.fg} sobre ${lowest.bg} = ${lowest.ratio.toFixed(2)}:1 (mínimo ${lowest.min}:1).`,
);
process.exit(failures.length ? 1 : 0);

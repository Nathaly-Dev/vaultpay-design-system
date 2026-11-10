const RAMPS = {
  gold: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
};

function renderRamps() {
  for (const el of document.querySelectorAll("[data-ramp]")) {
    const hue = el.dataset.ramp;
    for (const stop of RAMPS[hue]) {
      const name = `--vp-${hue}-${stop}`;
      const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      el.insertAdjacentHTML(
        "beforeend",
        `<div class="swatch"><i style="background:var(${name})"></i><span><b>${hue}-${stop}</b><code>${hex}</code></span></div>`,
      );
    }
  }
}

function applyTheme(choice) {
  const root = document.documentElement;
  root.setAttribute("data-theme", choice);
  for (const button of document.querySelectorAll("[data-theme-choice]")) {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === choice));
  }
  try {
    localStorage.setItem("vp-theme", choice);
  } catch {
    // Sem armazenamento (janela privada): o tema só não é lembrado.
  }
}

function savedTheme() {
  try {
    // Claro como padrão sempre; "system" ficou de versões antigas e vira claro.
    return localStorage.getItem("vp-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

// Coloca o SVG do logo direto na página, para ele herdar a cor do texto e os tokens.
async function inlineSvgs() {
  for (const el of document.querySelectorAll("[data-inline-svg]")) {
    try {
      const response = await fetch(el.dataset.inlineSvg);
      if (response.ok) el.innerHTML = await response.text();
    } catch {
      // Aberta como arquivo (file://), a página não consegue buscar o SVG; o resto funciona.
    }
  }
}

renderRamps();
inlineSvgs();
applyTheme(savedTheme());
for (const button of document.querySelectorAll("[data-theme-choice]")) {
  button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
}

const drawer = document.getElementById("demo-drawer");
document.querySelector("[data-open-drawer]").addEventListener("click", () => drawer.showModal());
document.querySelector("[data-close-drawer]").addEventListener("click", () => drawer.close());
// Toque fora da gaveta (no fundo escurecido) chega com o próprio <dialog> como alvo.
drawer.addEventListener("click", (event) => event.target === drawer && drawer.close());

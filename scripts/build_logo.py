"""Gera todos os logos da VaultPay a partir de uma geometria única.

A marca: o "v" é um cofre aberto e uma moeda de ouro cai dentro dele.
A palavra "vaultpay" usa o próprio símbolo como primeiro "v"; o resto ("aultpay")
vem da fonte Manrope convertida em contorno, para aparecer igual sem depender de fonte.

Ferramenta só de desenvolvimento (não entra no pacote):
    pip install --require-hashes -r scripts/requirements-logo.txt
    python scripts/build_logo.py
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
LOGO_DIR = ROOT / "logo"
FONT_PATH = ROOT / "fonts" / "manrope-latin-wght-normal.woff2"

# Cores fixas vêm dos tokens (tokens/tokens.json): gold.500/600/700/800 e neutral.100/900.
ON_DARK = {"mark": "#F3EFE8", "coin": "#F5A623", "edge": "#A76A07"}
ON_LIGHT = {"mark": "#14110D", "coin": "#D98A0B", "edge": "#7A4B05"}
APP_BG = "#14110D"

WORD = "aultpay"
WORD_WEIGHT = 700
LETTER_SPACING = -0.035  # em, igual ao preview aprovado

# Geometria do V numa caixa de 64: braços de (14, 22) até a ponta (32, 51) e (50, 22).
V_TOP, V_APEX, V_LEFT, V_RIGHT = 22, 51, 14, 50
SMALL_STROKE = 8.5  # versão de 20 px ou menos, mais grossa para não sumir


def paint(prop: str, value: str) -> str:
    # Atributo de SVG não aceita var() do CSS; nesse caso a cor precisa ir em style.
    return f'style="{prop}:{value}"' if value.startswith("var(") else f'{prop}="{value}"'


def mark_shapes(colors: dict, stroke: float, *, mono: bool = False) -> str:
    """O símbolo completo, numa caixa de 64 x 64."""
    edge_attr = 'fill="currentColor" opacity="0.5"' if mono else paint("fill", colors["edge"])
    rim = "" if mono else (
        f'<ellipse cx="32" cy="14" rx="5.8" ry="2.3" fill="none" {paint("stroke", colors["edge"])} stroke-width="0.6"/>'
    )
    return (
        f'<path d="M{V_LEFT} {V_TOP}L32 {V_APEX}L{V_RIGHT} {V_TOP}" fill="none" '
        f'{paint("stroke", colors["mark"])} stroke-width="{stroke:.2f}" '
        'stroke-linecap="round" stroke-linejoin="round"/>'
        '<g transform="rotate(-20 32 14)">'
        f'<ellipse cx="32" cy="15.8" rx="8.2" ry="3.6" {edge_attr}/>'
        f'<rect x="23.8" y="14" width="16.4" height="1.8" {edge_attr}/>'
        f'<ellipse cx="32" cy="14" rx="8.2" ry="3.6" {paint("fill", colors["coin"])}/>'
        f"{rim}</g>"
    )


def small_mark_shapes(colors: dict) -> str:
    """Versão para 20 px ou menos: traço mais grosso e a moeda vira um ponto (detalhe de 1 px vira borrão)."""
    return (
        f'<path d="M14 21L32 51L50 21" fill="none" stroke="{colors["mark"]}" stroke-width="{SMALL_STROKE}" '
        'stroke-linecap="round" stroke-linejoin="round"/>'
        f'<circle cx="32" cy="11.5" r="6.2" fill="{colors["coin"]}"/>'
    )


def svg(view_box: str, body: str, label: str = "VaultPay") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-label="{label}">'
        f"<title>{label}</title>{body}</svg>\n"
    )


def inline_mark(stroke: float) -> str:
    """Para usar direto na página: o V segue a cor do texto e a moeda segue os tokens da marca."""
    colors = {
        "mark": "currentColor",
        "coin": "var(--vp-brand-coin, #F5A623)",
        "edge": "var(--vp-brand-coin-edge, #A76A07)",
    }
    return svg("0 0 64 64", mark_shapes(colors, stroke))


def app_icon(shapes: str) -> str:
    # O símbolo ocupa ~80% do quadrado, centralizado.
    return svg(
        "0 0 64 64",
        f'<rect width="64" height="64" rx="14" fill="{APP_BG}"/>'
        f'<g transform="translate(6.4 4.8) scale(0.8)">{shapes}</g>',
    )


def load_word_font() -> TTFont:
    font = TTFont(str(FONT_PATH))
    return instantiateVariableFont(font, {"wght": WORD_WEIGHT})


def glyph_bounds(font: TTFont, char: str) -> tuple:
    glyph_set = font.getGlyphSet()
    pen = BoundsPen(glyph_set)
    glyph_set[font.getBestCmap()[ord(char)]].draw(pen)
    return pen.bounds


def stroke_from_font(font: TTFont) -> float:
    """Traço do V = espessura da haste do "l" na fonte, para o v pesar igual às letras."""
    x_min, _, x_max, _ = glyph_bounds(font, "l")
    return (x_max - x_min) / font["head"].unitsPerEm * 64


def wordmark(font: TTFont, colors: dict, stroke: float) -> str:
    upm = font["head"].unitsPerEm
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    scale = upm / 64  # o símbolo ocupa 1 em

    # Vertical: a ponta do V desce abaixo da linha de base o mesmo tanto que as letras redondas ("a").
    overshoot = -glyph_bounds(font, "a")[1]
    sy = overshoot - (V_APEX + stroke / 2) * scale
    sx = 0.0
    ink_left = sx + (V_LEFT - stroke / 2) * scale
    ink_right = sx + (V_RIGHT + stroke / 2) * scale

    # Horizontal: entre o V e o "a", o mesmo espaço que a fonte põe no par "va".
    v_glyph = cmap[ord("v")]
    v_rsb = hmtx[v_glyph][0] - glyph_bounds(font, "v")[2]
    parts = []
    x = ink_right + v_rsb + LETTER_SPACING * upm
    y_min, y_max, x_max = 0.0, 0.0, 0.0
    for char in WORD:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyph_set)
        glyph_set[name].draw(pen)
        bounds = BoundsPen(glyph_set)
        glyph_set[name].draw(bounds)
        if bounds.bounds:
            _, b_ymin, b_xmax, b_ymax = bounds.bounds
            y_min, y_max = min(y_min, -b_ymax), max(y_max, -b_ymin)
            x_max = max(x_max, x + b_xmax)
        parts.append(f'<path transform="translate({x:.1f} 0) scale(1 -1)" d="{pen.getCommands()}"/>')
        x += hmtx[name][0] + LETTER_SPACING * upm

    symbol = f'<g transform="translate({sx:.1f} {sy:.1f}) scale({scale:.4f})">{mark_shapes(colors, stroke)}</g>'

    # Topo visível da moeda inclinada dentro da caixa de 64 (y 9,6).
    top = min(y_min, sy + 9.6 * scale)
    bottom = max(y_max, sy + (V_APEX + stroke / 2) * scale)
    pad = 0.04 * upm
    view_box = (
        f"{ink_left - pad:.1f} {top - pad:.1f} {x_max - ink_left + 2 * pad:.1f} {bottom - top + 2 * pad:.1f}"
    )
    letters = f'<g fill="{colors["mark"]}">{"".join(parts)}</g>'
    return svg(view_box, symbol + letters)


def main() -> None:
    font = load_word_font()
    stroke = stroke_from_font(font)
    mono = {"mark": "currentColor", "coin": "currentColor"}
    files = {
        "vaultpay-mark.svg": inline_mark(stroke),
        "vaultpay-mark-on-dark.svg": svg("0 0 64 64", mark_shapes(ON_DARK, stroke)),
        "vaultpay-mark-on-light.svg": svg("0 0 64 64", mark_shapes(ON_LIGHT, stroke)),
        "vaultpay-mark-mono.svg": svg("0 0 64 64", mark_shapes(mono, stroke, mono=True)),
        "vaultpay-app-icon.svg": app_icon(mark_shapes(ON_DARK, stroke)),
        "favicon.svg": app_icon(small_mark_shapes(ON_DARK)),
        "vaultpay-wordmark-on-dark.svg": wordmark(font, ON_DARK, stroke),
        "vaultpay-wordmark-on-light.svg": wordmark(font, ON_LIGHT, stroke),
    }
    print(f"traço do V: {stroke:.2f} (de 64), igual à haste da fonte")
    for name, content in files.items():
        (LOGO_DIR / name).write_text(content, encoding="utf-8", newline="\n")
        print(f"logo/{name}")


if __name__ == "__main__":
    main()

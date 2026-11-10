# Builds the Realco lockups as outlined SVG paths (no font dependency at runtime).
# Wordmark: Barlow Condensed SemiBold (600), the face of the boards, set a touch open. Marque: a roof over three
# bricks, one brick per door (Lettings, Stays, Build). Usage: python3 scripts/logo.py <BarlowCondensed-SemiBold.ttf> <out dir>
# (the static SemiBold from Google Fonts; a variable Barlow Condensed is instanced at wght 600).
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

font_path, out = sys.argv[1], sys.argv[2]
display = TTFont(font_path)
if "fvar" in display:
    display = instantiateVariableFont(display, {"wght": 600})

INK, PAPER, CLAY, TEAL, GOLD = "#1c2534", "#f5f0e6", "#9a4429", "#1b6561", "#79570b"


def run(font, text, size, x, y, tracking=0.0):
    """Return (svg path d, advance width, bbox) for text at baseline (x, y). Applies kerning from GPOS pairs if simple."""
    gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm; s = size / upm
    pen = SVGPathPen(gs, ntos=lambda v: ("%.1f" % v).rstrip("0").rstrip(".")); bp = BoundsPen(gs); cx = x
    for i, ch in enumerate(text):
        glyph = gs[cmap[ord(ch)]]
        glyph.draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        glyph.draw(TransformPen(bp, (s, 0, 0, -s, cx, y)))
        cx += glyph.width * s + (tracking * size if i < len(text) - 1 else 0)
    return pen.getCommands(), cx - x, bp.bounds


def marque_paths(x, y, size, roof, bricks):
    """Roof over three bricks, drawn inside a size x size box at (x, y). bricks = (c1, c2, c3) fills."""
    k = size / 64
    r = f'<path d="M{x + 11 * k:.2f} {y + 32 * k:.2f}L{x + 32 * k:.2f} {y + 12 * k:.2f}L{x + 53 * k:.2f} {y + 32 * k:.2f}" fill="none" stroke="{roof}" stroke-width="{5 * k:.2f}" stroke-linecap="square" stroke-linejoin="miter"/>'
    bw, bh, gap = 11.5 * k, 13 * k, 2.25 * k
    x0 = x + (size - (3 * bw + 2 * gap)) / 2
    b = "".join(f'<rect x="{x0 + i * (bw + gap):.2f}" y="{y + 38 * k:.2f}" width="{bw:.2f}" height="{bh:.2f}" fill="{c}"/>' for i, c in enumerate(bricks))
    return r + b


def wrap(body, w, h, label="Realco", bg=None):
    rect = f'<rect width="{w:.1f}" height="{h:.1f}" rx="4" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" role="img" aria-label="{label}">{rect}{body}</svg>'


def wordmark(fill, size=100, x=0, y=0):
    d, w, b = run(display, "Realco", size, x, y, tracking=0.012)
    return f'<path fill="{fill}" d="{d}"/>', w, b


def horizontal(fill, bricks=None, bg=None):
    size = 100
    _, w, b = wordmark(fill, size)
    cap = -b[1]  # cap height above baseline (R)
    m = cap * 1.0  # marque box equals cap height
    pad = 6; gap = 18
    base = pad + cap
    path, w, b = wordmark(fill, size, pad + m + gap, base)
    body = marque_paths(pad, pad, m, fill, bricks or (fill, fill, fill)) + path
    W = pad + m + gap + w + pad; H = base + (b[3] - base) + pad
    return wrap(body, W, H, bg=bg)


def stacked(fill, bricks=None, bg=None):
    size = 96; W = 360
    _, w, b = wordmark(fill, size)
    m = 120; pad = 24
    body = marque_paths((W - m) / 2, pad, m, fill, bricks or (fill, fill, fill))
    base = pad + m + 28 + (-b[1])
    path, _, b2 = wordmark(fill, size, (W - w) / 2 - b[0], base)
    H = base + (b2[3] - base) + pad
    return wrap(body + path, W, H, bg=bg)


def marque(fill, bricks=None, bg=None, size=64):
    body = marque_paths(0, 0, size, fill, bricks or (fill, fill, fill))
    return wrap(body, size, size, label="Realco marque", bg=bg)


doors = (CLAY, TEAL, GOLD)
files = {
    "realco-horizontal-ink.svg": horizontal(INK),
    "realco-horizontal-paper.svg": horizontal(PAPER),
    "realco-horizontal-doors.svg": horizontal(INK, doors),
    "realco-stacked-ink.svg": stacked(INK),
    "realco-stacked-paper-on-ink.svg": stacked(PAPER, bg=INK),
    "realco-stacked-doors.svg": stacked(INK, doors),
    "realco-marque-ink.svg": marque(INK),
    "realco-marque-paper.svg": marque(PAPER),
    "realco-marque-doors.svg": marque(INK, doors),
    "realco-marque-tile.svg": marque(PAPER, bg=INK),
    "realco-marque-tile-doors.svg": marque(PAPER, (CLAY, TEAL, GOLD), bg=INK),
}
for name, svg in files.items():
    open(f"{out}/{name}", "w").write(svg)
print("ok", len(files))

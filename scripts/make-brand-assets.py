#!/usr/bin/env python3
"""
Generates app/opengraph-image.png and the favicon set from lib/site.ts.

RUN THIS AGAIN WHEN THE BRAND NAME LANDS:
    npm run build && python3 scripts/make-brand-assets.py

WHY A SCRIPT AND NOT next/og: `ImageResponse` needs a request-time runtime and
fails the build under `output: 'export'` (verified 2026-07-25: "Failed to
collect page data for /opengraph-image"). So the images are generated here,
once, and committed. Next's file conventions pick them up from app/ and emit
the og:image / icon tags automatically, which is a plain file copy at build.

This is deliberately NOT wired into `npm run build`: Vercel's build image has
no guaranteed Python or Pillow, and a marketing site should not gain a build
dependency for two static files that change once a year.

Poppins comes from the woff2 that next/font already downloaded into out/, so
the images use the same typeface as the site with no font file committed and
no network fetch. Run `npm run build` first so out/ exists.
"""

import re
import glob
import pathlib
import tempfile

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Locked design tokens (CLAUDE.md "Design system"). Keep in step with globals.css.
INK = (0, 50, 98)             # Berkeley blue #003262
INK_SOFT = (97, 107, 118)     # #616b76
GOLD = (253, 181, 21)         # California gold #fdb515
PAPER = (255, 255, 255)
GRADIENT = [                  # the fixed body gradient, top to bottom
    (207, 224, 245),          # #cfe0f5
    (220, 231, 241),          # #dce7f1
    (238, 231, 214),          # #eee7d6
    (244, 236, 212),          # #f4ecd4
]


def brand() -> str:
    """Single source of truth: lib/site.ts, per the CLAUDE.md invariant."""
    src = (ROOT / "lib" / "site.ts").read_text(encoding="utf-8")
    return re.search(r'export const BRAND = "([^"]+)"', src).group(1)


def poppins(weight: int) -> pathlib.Path:
    """Extract the latin Poppins subset for `weight` from the built CSS."""
    css = "".join(
        pathlib.Path(f).read_text(encoding="utf-8")
        for f in glob.glob(str(ROOT / "out/_next/static/**/*.css"), recursive=True)
    )
    for face in re.findall(r"@font-face\{[^}]*\}", css):
        if "Fallback" in face:
            continue
        w = re.search(r"font-weight:(\d+)", face)
        src = re.search(r"url\(([^)]+\.woff2)\)", face)
        rng = re.search(r"unicode-range:([^;}]*)", face)
        # "U+??" is the basic-latin subset; the others are latin-ext/devanagari.
        if w and src and rng and int(w.group(1)) == weight and rng.group(1).startswith("U+??"):
            # The url() is relative to the stylesheet ("../media/x.woff2"), so
            # resolve by basename under the export's media directory.
            basename = src.group(1).rsplit("/", 1)[-1]
            found = glob.glob(str(ROOT / "out/_next/static/media" / basename))
            if not found:
                raise SystemExit(f"font {basename} not found in out/_next/static/media")
            woff2 = pathlib.Path(found[0])
            ttf = pathlib.Path(tempfile.gettempdir()) / f"poppins-{weight}.ttf"
            font = TTFont(woff2)
            font.flavor = None  # woff2 -> plain ttf, which Pillow can read
            font.save(ttf)
            return ttf
    raise SystemExit(f"no latin Poppins @font-face for weight {weight}; run npm run build first")


def wrap(draw, text, font, max_width):
    lines, line = [], []
    for word in text.split():
        trial = " ".join(line + [word])
        if draw.textlength(trial, font=font) <= max_width or not line:
            line.append(word)
        else:
            lines.append(" ".join(line))
            line = [word]
    if line:
        lines.append(" ".join(line))
    return lines


def gradient_bg(w, h):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    seg = h / (len(GRADIENT) - 1)
    for y in range(h):
        i = min(int(y / seg), len(GRADIENT) - 2)
        t = (y - i * seg) / seg
        a, b = GRADIENT[i], GRADIENT[i + 1]
        d.line([(0, y), (w, y)], fill=tuple(round(a[c] + (b[c] - a[c]) * t) for c in range(3)))
    return img


def make_og(name: str) -> None:
    W, H, PAD = 1200, 630, 84
    img = gradient_bg(W, H)
    d = ImageDraw.Draw(img)

    f_mark = ImageFont.truetype(str(poppins(600)), 40)
    f_head = ImageFont.truetype(str(poppins(600)), 62)
    f_foot = ImageFont.truetype(str(poppins(500)), 25)

    d.text((PAD, PAD - 8), name, font=f_mark, fill=INK)

    headline = "When someone asks AI for a recommendation, does it say your name?"
    lines = wrap(d, headline, f_head, W - PAD * 2)
    y = 214
    for line in lines:
        d.text((PAD, y), line, font=f_head, fill=INK)
        y += 78

    # The one gold element, echoing the hero badge dot (gold is rationed).
    dot_y = H - PAD - 4
    d.ellipse([PAD, dot_y, PAD + 15, dot_y + 15], fill=GOLD)
    d.text((PAD + 30, dot_y - 9), "AI visibility, measured", font=f_foot, fill=INK_SOFT)

    out = ROOT / "app" / "opengraph-image.png"
    img.save(out, "PNG", optimize=True)
    print(f"  {out.relative_to(ROOT)}  {W}x{H}  {out.stat().st_size // 1024}KB")


def make_icon() -> None:
    """Blue rounded square + the gold dot. Deliberately wordless: it must survive
    the brand-name decision and still read at 16px."""
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=112, fill=INK + (255,))
    r = 104
    d.ellipse([S // 2 - r, S // 2 - r, S // 2 + r, S // 2 + r], fill=GOLD + (255,))

    png = ROOT / "app" / "icon.png"
    img.save(png, "PNG", optimize=True)

    ico = ROOT / "app" / "favicon.ico"
    img.save(ico, "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"  {png.relative_to(ROOT)}  {S}x{S}  {png.stat().st_size // 1024}KB")
    print(f"  {ico.relative_to(ROOT)}  multi-size  {ico.stat().st_size // 1024}KB")


if __name__ == "__main__":
    name = brand()
    print(f"generating brand assets for {name!r}")
    make_og(name)
    make_icon()
    print("done. Commit the PNGs; Next emits the og:image and icon tags from app/.")

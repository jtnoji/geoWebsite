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

Both families come from the woff2 files next/font already downloaded into out/,
so the images use the same typefaces as the site with no font file committed and
no network fetch. Run `npm run build` first so out/ exists.

Regenerated 2026-08-02 for the Berkeley system and the locked brand name.
Needs Pillow + fontTools, which the system Python does not have: make a venv
and run `<venv>/bin/python scripts/make-brand-assets.py` after `npm run build`.
"""

import re
import glob
import pathlib
import tempfile

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The two families the site ships. Names must match the `font-family` in the
# built CSS exactly — see face().
SANS = "Libre Franklin"
DISPLAY = "Cormorant Garamond"

# Locked design tokens (CLAUDE.md "Design system"). Keep in step with globals.css.
INK = (14, 35, 64)            # Berkeley Navy #0e2340
INK_SOFT = (74, 86, 102)      # Harbour #4a5666 (darkened for AA, see globals.css)
MIST = (178, 183, 188)        # Mist #b2b7bc
SKY = (127, 166, 217)         # Sky #7fa6d9 — on navy only
PAPER = (242, 241, 236)       # Paper #f2f1ec — the flat ground

# Plume geometry, brand sheet §01. Heights are multiples of the plume width.
PLUME_RATIOS = (1.7, 2.3, 2.9)
PLUME_GAP = 0.3


def brand() -> str:
    """Single source of truth: lib/site.ts, per the CLAUDE.md invariant."""
    src = (ROOT / "lib" / "site.ts").read_text(encoding="utf-8")
    return re.search(r'export const BRAND = "([^"]+)"', src).group(1)


def face(family: str, weight: int, italic: bool = False) -> pathlib.Path:
    """Extract the latin subset of `family` at `weight` from the built CSS.

    Family and style are part of the match on purpose. The site ships two
    families (Libre Franklin and Cormorant Garamond), and weight 400 exists in
    BOTH plus in both families' italics — so matching on weight alone silently
    returns whichever @font-face the CSS concatenation happened to put first.
    That is a coin flip, not a selection.
    """
    css = "".join(
        pathlib.Path(f).read_text(encoding="utf-8")
        for f in glob.glob(str(ROOT / "out/_next/static/**/*.css"), recursive=True)
    )
    want_style = "italic" if italic else "normal"
    for block in re.findall(r"@font-face\{[^}]*\}", css):
        if "Fallback" in block:
            continue
        fam = re.search(r"font-family:\s*'?\"?([^;}'\"]+)", block)
        w = re.search(r"font-weight:(\d+)", block)
        style = re.search(r"font-style:\s*([^;}]+)", block)
        src = re.search(r"url\(([^)]+\.woff2)\)", block)
        rng = re.search(r"unicode-range:([^;}]*)", block)
        # "U+??" is the basic-latin subset; the others are latin-ext/devanagari.
        if not (fam and w and src and rng and rng.group(1).startswith("U+??")):
            continue
        if fam.group(1).strip() != family or int(w.group(1)) != weight:
            continue
        if (style.group(1).strip() if style else "normal") != want_style:
            continue
        # The url() is relative to the stylesheet ("../media/x.woff2"), so
        # resolve by basename under the export's media directory.
        basename = src.group(1).rsplit("/", 1)[-1]
        found = glob.glob(str(ROOT / "out/_next/static/media" / basename))
        if not found:
            raise SystemExit(f"font {basename} not found in out/_next/static/media")
        slug = f"{family.lower().replace(' ', '-')}-{weight}-{want_style}"
        ttf = pathlib.Path(tempfile.gettempdir()) / f"{slug}.ttf"
        font = TTFont(pathlib.Path(found[0]))
        font.flavor = None  # woff2 -> plain ttf, which Pillow can read
        font.save(ttf)
        return ttf
    raise SystemExit(
        f"no latin @font-face for {family} {weight} {want_style}; run npm run build first"
    )


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


def plumes(d, x, baseline, u, tones):
    """Draw the three-plume mark with its heels on `baseline`, left edge at `x`.

    Each plume is CSS `border-radius: 60% 60% 60% 0` — three rounded corners and
    one square heel. Pillow only does circular corners, so a u/2 radius on the
    three rounded ones is the closest read at icon sizes.
    """
    for ratio, tone in zip(PLUME_RATIOS, tones):
        h = ratio * u
        d.rounded_rectangle(
            [x, baseline - h, x + u, baseline],
            radius=u / 2,
            corners=(True, True, True, False),
            fill=tone,
        )
        x += u * (1 + PLUME_GAP)


def make_og(name: str) -> None:
    W, H, PAD = 1200, 630, 84
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # Wordmark and headline wear the display serif, as they do on the site; the
    # footer line stays Libre Franklin, as the site's labels do. Cormorant runs
    # small for its point size, hence the larger numbers than the sans used.
    # Weight 400 both times: 500/600 are no longer loaded (brand sheet §05).
    f_mark = ImageFont.truetype(str(face(DISPLAY, 400)), 50)
    f_head = ImageFont.truetype(str(face(DISPLAY, 400)), 74)
    f_foot = ImageFont.truetype(str(face(SANS, 500)), 25)

    # On-paper lockup: Mist, Harbour, Navy, with the wordmark 1.6u off the mark.
    u = 17
    mark_w = u * 3 + u * PLUME_GAP * 2
    plumes(d, PAD, PAD + 34, u, (MIST, INK_SOFT, INK))
    d.text((PAD + mark_w + 1.6 * u, PAD - 14), name, font=f_mark, fill=INK)

    headline = "When someone asks AI for a recommendation, does it say your name?"
    lines = wrap(d, headline, f_head, W - PAD * 2)
    y = 206
    for line in lines:
        d.text((PAD, y), line, font=f_head, fill=INK)
        y += 84

    # Echoes the hero badge. Navy, not Sky: this sits on paper, and Sky is
    # legal only against navy (brand sheet §04).
    dot_y = H - PAD - 4
    d.ellipse([PAD, dot_y, PAD + 15, dot_y + 15], fill=INK)
    d.text((PAD + 30, dot_y - 9), "AI visibility, measured", font=f_foot, fill=INK_SOFT)

    out = ROOT / "app" / "opengraph-image.png"
    img.save(out, "PNG", optimize=True)
    print(f"  {out.relative_to(ROOT)}  {W}x{H}  {out.stat().st_size // 1024}KB")


def make_icon() -> None:
    """The app icon from brand sheet §06: a navy rounded square carrying the
    reversed plume mark — two whites and Sky, heels on a shared baseline."""
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # radius 14/46 of the side, per the sheet's 46px icon.
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=round(S * 14 / 46), fill=INK + (255,))

    # 7/46 plume width and a 10/46 bottom inset, again from the sheet.
    u = S * 7 / 46
    mark_w = u * 3 + u * PLUME_GAP * 2
    plumes(
        d,
        (S - mark_w) / 2,
        S - S * 10 / 46,
        u,
        ((255, 255, 255, 102), (255, 255, 255, 199), SKY + (255,)),
    )

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

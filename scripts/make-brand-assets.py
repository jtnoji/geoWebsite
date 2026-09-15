#!/usr/bin/env python3
"""
Generates app/opengraph-image.png and the favicon set from lib/site.ts and
lib/home.ts.

RUN THIS AGAIN WHEN THE BRAND NAME, THE HERO HEADLINE OR THE PALETTE MOVES:
    npm run build && <venv>/bin/python scripts/make-brand-assets.py

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

Regenerated 2026-09-14 for the Sable system: Libre Franklin and JetBrains Mono
(Cormorant is gone), the night ground, and the home hero headline, which is
read out of lib/home.ts so the card cannot drift from the page.
Needs Pillow, fontTools and brotli, which the system Python does not have: make
a venv (`python3 -m venv .venv && .venv/bin/pip install pillow fonttools brotli`).
"""

import re
import glob
import pathlib
import tempfile

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The two families the site ships. Names must match the `font-family` in the
# built CSS exactly — see face().
SANS = "Libre Franklin"
MONO = "JetBrains Mono"

# Sable design tokens (CLAUDE.md "Design system", app/globals.css). Keep in step.
INK = (14, 35, 64)            # #0e2340 — the icon square
NIGHT = (4, 8, 15)            # #04080f — the dark bands, and the card's ground
SKY = (127, 166, 217)         # #7fa6d9 — the bright note on dark
COBALT = (47, 111, 208)       # #2f6fd0 — only as the glow's colour here
WHITE = (255, 255, 255)

# Plume geometry, brand sheet §01. Heights are multiples of the plume width.
PLUME_RATIOS = (1.7, 2.3, 2.9)
PLUME_GAP = 0.3


def brand() -> str:
    """Single source of truth: lib/site.ts, per the CLAUDE.md invariant."""
    src = (ROOT / "lib" / "site.ts").read_text(encoding="utf-8")
    return re.search(r'export const BRAND = "([^"]+)"', src).group(1)


def offer_title() -> str:
    src = (ROOT / "lib" / "site.ts").read_text(encoding="utf-8")
    return re.search(r'export const OFFER_TITLE = "([^"]+)"', src).group(1)


def hero() -> tuple[str, str]:
    """The home h1, both halves, straight out of lib/home.ts."""
    src = (ROOT / "lib" / "home.ts").read_text(encoding="utf-8")
    block = src.split("export const HERO = {", 1)[1]
    heading = re.search(r'\n\s*heading: "([^"]+)"', block).group(1)
    accent = re.search(r'\n\s*headingAccent: "([^"]+)"', block).group(1)
    return heading, accent


def face(family: str, weight: int, italic: bool = False) -> pathlib.Path:
    """Extract the latin subset of `family` at `weight` from the built CSS.

    Family and style are part of the match on purpose. Weight 400 exists in
    both families the site ships, and in Libre Franklin's italic too, so
    matching on weight alone silently returns whichever @font-face the CSS
    concatenation happened to put first. That is a coin flip, not a selection.
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
        # "U+??" is the basic-latin subset; the others are latin-ext and friends.
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


def tracked(d, xy, text, font, fill, tracking):
    """Pillow has no letter-spacing, so tracked labels are set glyph by glyph."""
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking
    return x


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
    img = Image.new("RGBA", (W, H), NIGHT + (255,))

    # One soft glow on the right, standing in for the site's light beams: the
    # card is a still of the hero, not a copy of its CSS.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([700, 120, 1380, 800], fill=COBALT + (110,))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(150)))
    d = ImageDraw.Draw(img)

    # The wordmark and the headline wear Libre Franklin as they do on the site:
    # 500 for the wordmark, the hero's one 300 for the headline. The label at
    # the foot is JetBrains Mono, like every label on the site.
    f_mark = ImageFont.truetype(str(face(SANS, 500)), 44)
    f_sub = ImageFont.truetype(str(face(SANS, 500)), 17)
    f_head = ImageFont.truetype(str(face(SANS, 300)), 68)
    f_foot = ImageFont.truetype(str(face(MONO, 400)), 20)

    # On-night lockup: two whites and Sky, the wordmark 1.6u off the mark, the
    # "AI SEO" subline on the wordmark's baseline as the header sets it.
    u = 15
    mark_w = u * 3 + u * PLUME_GAP * 2
    baseline = PAD + 40
    plumes(d, PAD, baseline, u, (WHITE + (107,), WHITE + (199,), SKY + (255,)))
    word_x = PAD + mark_w + 1.6 * u
    d.text((word_x, baseline), name, font=f_mark, fill=WHITE, anchor="ls")
    sub_x = word_x + d.textlength(name, font=f_mark) + 16
    tracked(d, (sub_x, baseline - 15), "AI SEO", f_sub, WHITE + (184,), 5)

    heading, accent = hero()
    y = 212
    for text, fill in ((heading, WHITE), (accent, SKY)):
        for line in wrap(d, text, f_head, W - PAD * 2):
            d.text((PAD, y), line, font=f_head, fill=fill)
            y += 78

    foot_y = H - PAD - 6
    tracked(d, (PAD, foot_y), offer_title().upper(), f_foot, WHITE + (150,), 3)

    out = ROOT / "app" / "opengraph-image.png"
    img.convert("RGB").save(out, "PNG", optimize=True)
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
        ((255, 255, 255, 107), (255, 255, 255, 199), SKY + (255,)),
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

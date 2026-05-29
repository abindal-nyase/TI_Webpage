"""
download_logos.py — Download optimized logos from verified sources.

Handles:
  - SVGs: saved as-is; strips embedded white background rects if found
  - Transparent PNGs/WebP: convert to WebP directly
  - Opaque PNGs/JPGs: flood-fill background removal (corner-sample), then WebP

Usage:
    python backend/download_logos.py

Output: public/logos/<slug>.svg  or  public/logos/<slug>.webp
"""

import io, pathlib, struct, zlib
import xml.etree.ElementTree as ET
import requests
import numpy as np
from PIL import Image

OUT_DIR = pathlib.Path("public/logos")
OUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

# ── Logo manifest ──────────────────────────────────────────────────────────────
# fmt: (slug, url, "svg" | "raster-transparent" | "raster-opaque", bg_color)
# bg_color only used for raster-opaque: (R,G,B) to flood-remove; None = auto-detect from corners

LOGOS = [
    # Construction
    ("clune-construction",     "https://www.clunegc.com/wp-content/uploads/2025/12/clune-logo.svg",                                                                                  "svg",               None),
    ("mata-construction",      "https://www.mataconstruction.com/wp-content/uploads/2025/01/Mata_whitelogo_vertical.png",                                                            "raster-transparent", None),
    ("novo-construction",      "https://images.squarespace-cdn.com/content/v1/6053a68a1095223d1ab06d48/2d6ded21-458a-4c31-a845-f18d899fcfc9/footerlogo.png",                        "raster-transparent", None),
    ("swinerton",              "https://swinerton.com/wp-content/uploads/2019/05/Swinerton-logo-300x138-300x138.png",                                                                "raster-transparent", None),
    ("turner-townsend",        "https://www.turnerandtownsend.com/media/0ezniaz3/logo-white.svg",                                                                                    "svg",               None),
    # Real estate
    ("brookfield-properties",  "https://static.themebuilder.aws.arc.pub/brookfieldproperties/1708645875032.svg",                                                                    "svg",               None),
    ("cbre",                   "https://upload.wikimedia.org/wikipedia/commons/2/25/CBRE_Group_logo_%28till_2021%29.svg",                                                            "svg",               None),
    ("cim",                    "https://cdn.prod.website-files.com/672bf5bf6c7413f157a23868/675225ffa7b0eacc72c5eef5_CIM.svg",                                                      "svg",               None),
    ("cushman-wakefield",      "https://upload.wikimedia.org/wikipedia/commons/8/88/Cushman_%26_Wakefield_logo.svg",                                                                "svg",               None),
    ("hines",                  "https://searchlogovector.com/wp-content/uploads/2018/04/hines-group-logo-vector.png",                                                               "raster-opaque",     None),
    ("irvine-company",         "https://www.irvinecompany.com/wp-content/themes/irvinecompany-2019/assets/img/irvineco_600x60.png",                                                 "raster-opaque",     None),
    ("rising-realty-partners", "https://risingrp.com/wp-content/uploads/2023/05/Group-48097389.png",                                                                                "raster-opaque",     None),
    ("tishman-speyer",         "https://iconape.com/wp-content/files/kv/300905/png/tishman-speyer-logo.png",                                                                        "raster-transparent", None),
    # Architecture / engineering
    ("aecom",                  "https://upload.wikimedia.org/wikipedia/commons/f/f8/AECOM_1c-black_rgb.svg",                                                                        "svg",               None),
    ("gensler",                "https://upload.wikimedia.org/wikipedia/commons/0/0d/Gensler_logo.svg",                                                                              "svg",               None),
    ("hok",                    "https://upload.wikimedia.org/wikipedia/commons/2/2b/HOK_logo.svg",                                                                                  "svg",               None),
    ("perkins-will",           "https://upload.wikimedia.org/wikipedia/commons/2/23/PW-logo-black.svg",                                                                             "svg",               None),
    ("som",                    "https://www.som.com/wp-content/uploads/2021/08/SOM_Logo_White-1.png",                                                                               "raster-transparent", None),
    # Mid-size architecture
    ("dlr-group",              "https://upload.wikimedia.org/wikipedia/commons/1/17/DLR_Group_Logo.svg",                                                                            "svg",               None),
    ("huntsman",               "https://static.wixstatic.com/media/fda526_7fd1f10cc0df47aba22ae6a4b4683ea4~mv2.png",                                                               "raster-opaque",     None),
    ("johnson-fain",           "https://www.johnsonfain.com/wp-content/uploads/2023/12/logo.png",                                                                                   "raster-transparent", None),
    ("lpa",                    "https://lpadesignstudios.com/assets/img/LPA-logo.svg",                                                                                              "svg",               None),
    ("ware-malcomb",           "https://waremalcomb.com/wp-content/uploads/2023/10/Header-Logo.svg",                                                                                "svg",               None),
    # Boutique
    ("asdsky",                 "https://images.squarespace-cdn.com/content/v1/65b95f5a0557b67560904abc/5c37287b-b782-4db8-84ce-7bc072e6e7b0/ASDSKY_color.png?format=1500w",        "raster-opaque",     None),
    ("formm-studio",           "https://images.squarespace-cdn.com/content/v1/6694ca48363d933e3418f721/cbe2640c-ef44-4045-82c8-9395654972a4/FORMM+Branding_FORMM+Logo+-+Black.png?format=1500w", "raster-opaque", None),
    ("gruen",                  "https://www.gruenassociates.com/wp-content/uploads/2019/07/Gruen-logo2016.png",                                                                     "raster-opaque",     None),
    ("shlemmer-kamus-algaze",  "https://cdn.prod.website-files.com/694b64270f37be7700951925/694c24553325a1877601005e_saa_logo_transparent.webp",                                    "raster-transparent", None),
    ("studio-one-eleven",      "https://studio-111.com/wp-content/uploads/2023/01/studio-one-eleven-logo-sm.svg",                                                                   "svg",               None),
]


def fetch(url):
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.content


def strip_svg_background(svg_bytes):
    """Remove rect elements that look like solid background fills from an SVG."""
    try:
        root = ET.fromstring(svg_bytes)
        ns = {"svg": "http://www.w3.org/2000/svg"}
        ET.register_namespace("", "http://www.w3.org/2000/svg")
        # Remove any rect that spans the full viewBox and has a solid fill
        for parent in root.iter():
            to_remove = []
            for child in list(parent):
                tag = child.tag.split("}")[-1] if "}" in child.tag else child.tag
                if tag == "rect":
                    fill = child.get("fill", "").lower()
                    style = child.get("style", "").lower()
                    is_bg_fill = (
                        fill in ("white", "#fff", "#ffffff", "#f0f0f0")
                        or "fill:white" in style
                        or "fill:#fff" in style
                        or "fill:#ffffff" in style
                    )
                    # Also check if it covers the whole area (no x/y offset, large w/h)
                    x = float(child.get("x", "0") or "0")
                    y = float(child.get("y", "0") or "0")
                    if is_bg_fill and x == 0 and y == 0:
                        to_remove.append(child)
            for el in to_remove:
                parent.remove(el)
        # Re-serialise
        ET.indent(root, space="  ")
        return ET.tostring(root, encoding="unicode", xml_declaration=False).encode()
    except Exception:
        return svg_bytes  # return original if parsing fails


def sample_bg_color(img_rgba, sample_size=5):
    """Detect background color by sampling all four corners."""
    arr = np.array(img_rgba)
    h, w = arr.shape[:2]
    s = sample_size
    corners = [
        arr[:s, :s],
        arr[:s, w-s:],
        arr[h-s:, :s],
        arr[h-s:, w-s:],
    ]
    samples = np.concatenate([c.reshape(-1, 4) for c in corners])
    # Ignore already-transparent pixels
    opaque = samples[samples[:, 3] > 128]
    if len(opaque) == 0:
        return (255, 255, 255)
    median = np.median(opaque[:, :3], axis=0).astype(int)
    return tuple(median)


def remove_bg_flood(img_rgba, fuzz=30):
    """Remove background by color-matching from corners with a tolerance."""
    bg = sample_bg_color(img_rgba)
    arr = np.array(img_rgba, dtype=np.int32)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    dist = np.sqrt(
        (r - bg[0])**2 + (g - bg[1])**2 + (b - bg[2])**2
    )
    mask = (dist < fuzz) & (a > 128)
    arr[:,:,3] = np.where(mask, 0, arr[:,:,3])
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def process_raster(data, mode):
    img = Image.open(io.BytesIO(data)).convert("RGBA")
    if mode == "raster-opaque":
        img = remove_bg_flood(img, fuzz=35)
    out = io.BytesIO()
    img.save(out, "WEBP", quality=90)
    return out.getvalue()


def run():
    ok = fail = skip = 0

    for slug, url, mode, _ in LOGOS:
        svg_path    = OUT_DIR / f"{slug}.svg"
        webp_path   = OUT_DIR / f"{slug}.webp"

        try:
            data = fetch(url)

            if mode == "svg":
                cleaned = strip_svg_background(data)
                svg_path.write_bytes(cleaned)
                # Remove stale webp if a fresh svg is written
                if webp_path.exists():
                    webp_path.unlink()
                print(f"  SVG   {svg_path.name}")
            else:
                webp = process_raster(data, mode)
                webp_path.write_bytes(webp)
                print(f"  WEBP  {webp_path.name}")

            ok += 1

        except Exception as e:
            print(f"  FAIL  {slug}: {e}")
            fail += 1

    print(f"\n{ok} ok, {fail} failed, {skip} skipped.")


if __name__ == "__main__":
    run()

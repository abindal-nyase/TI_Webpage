"""
process_logos.py — Remove backgrounds from company logos and convert to WebP.

Usage:
    pip install "rembg[cpu]" pillow
    python backend/process_logos.py

Input:  assets/company-logos/   (original files, untouched)
Output: public/logos/           (transparent WebP, ready for web)

Re-run any time new logos are added to assets/company-logos/.
"""

from rembg import remove
from PIL import Image
import io, pathlib, shutil

ASSETS_DIR = pathlib.Path("assets/company-logos")
OUT_DIR    = pathlib.Path("public/logos")
EXTS       = {".jpg", ".jpeg", ".png", ".webp"}

NAME_MAP = {
    "Clune Construction.jpg":               "clune-construction",
    "Mata Construction.png":                "mata-construction",
    "Novo Construction.png":                "novo-construction",
    "Swinerton.png":                        "swinerton",
    "Brookfield Properties.png":            "brookfield-properties",
    "CBRE.png":                             "cbre",
    "CIM.png":                              "cim",
    "Cushman_&_Wakefield_logo.svg.png":     "cushman-wakefield",
    "Hines_Interests_Logo.svg.png":         "hines",
    "irvine company.png":                   "irvine-company",
    "Rising Realty Partners.png":           "rising-realty-partners",
    "Tishman Speyer.jpg":                   "tishman-speyer",
    "Turner & Townsend.png":                "turner-townsend",
    "AECOM.jpg":                            "aecom",
    "AREA Architecture.jpg":               "area-architecture",
    "ASDSKY_color.webp":                    "asdsky",
    "dlr-group.jpg":                        "dlr-group",
    "Formm Studio.png":                     "formm-studio",
    "Gensler_logo.svg.png":                 "gensler",
    "Gruen Logo.jpg":                       "gruen",
    "HED Design.webp":                      "hed-design",
    "HOK_logo.png":                         "hok",
    "Huntsman_Architectural_Group_Logo.jpg":"huntsman",
    "Johnson Fain.png":                     "johnson-fain",
    "KDA.png":                              "kda",
    "LPA, Inc..jpg":                        "lpa",
    "perkins_will_logo.jpg":                "perkins-will",
    "RIOS, Inc..png":                       "rios",
    "Shlemmer- Kamus- Algaze.png":          "shlemmer-kamus-algaze",
    "SKIDMORE, OWINGS & MERRILL LLP.jpg":   "som",
    "studio_one_eleven_logo.jpg":           "studio-one-eleven",
    "Ware Malcomb.jpg":                     "ware-malcomb",
}


def process():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok, fail = 0, 0

    for original_name, slug in NAME_MAP.items():
        src = ASSETS_DIR / original_name
        dst = OUT_DIR / f"{slug}.webp"

        if not src.exists():
            print(f"  MISSING  {original_name}")
            fail += 1
            continue

        try:
            img_bytes = src.read_bytes()
            result    = remove(img_bytes)
            img       = Image.open(io.BytesIO(result)).convert("RGBA")
            img.save(dst, "WEBP", quality=90)
            print(f"  OK  {dst.name}")
            ok += 1
        except Exception as e:
            print(f"  FAIL {original_name}: {e}")
            fail += 1

    print(f"\n{ok} processed, {fail} failed.")


if __name__ == "__main__":
    process()

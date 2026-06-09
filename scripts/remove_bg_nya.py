"""
Remove backgrounds from all NYA images in public/nya-img/.
Uses isnet-general-use model for best edge quality.
Output overwrites each file in-place as PNG (i7.jpg -> i7.png).
"""
import os
import sys
from pathlib import Path
from rembg import remove, new_session
from PIL import Image
import io

NYA_DIR = Path(r"c:\Projects\TI_Webpage\public\nya-img")

# All source images (i7 is jpg)
IMAGES = [
    ("i1.png", "i1.png"),
    ("i2.png", "i2.png"),
    ("i3.png", "i3.png"),
    ("i4.png", "i4.png"),
    ("i5.png", "i5.png"),
    ("i6.png", "i6.png"),
    ("i7.jpg", "i7.png"),   # convert jpg -> png with no bg
    ("i8.png", "i8.png"),
]

print("Loading isnet-general-use model (downloads once if not cached)...")
session = new_session("isnet-general-use")
print("Model ready.\n")

for src_name, dst_name in IMAGES:
    src_path = NYA_DIR / src_name
    dst_path = NYA_DIR / dst_name

    if not src_path.exists():
        print(f"  SKIP  {src_name} (not found)")
        continue

    print(f"  Processing {src_name} ...", end=" ", flush=True)
    with open(src_path, "rb") as f:
        data = f.read()

    result_bytes = remove(data, session=session)
    img = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
    img.save(dst_path, "PNG")

    # Quick sanity: corner alpha should be 0 (transparent)
    corner = img.getpixel((0, 0))
    status = "OK" if corner[3] < 10 else f"WARN corner alpha={corner[3]}"
    print(f"saved {img.width}x{img.height} RGBA  [{status}]")

# If i7.jpg still exists and is no longer needed, remove it
old_jpg = NYA_DIR / "i7.jpg"
if old_jpg.exists() and (NYA_DIR / "i7.png").exists():
    old_jpg.unlink()
    print("\nRemoved i7.jpg (replaced by i7.png)")

print("\nAll done.")

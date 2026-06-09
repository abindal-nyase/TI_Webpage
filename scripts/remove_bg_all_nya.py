"""
Remove backgrounds from all 16 images in assets/NYA Img/.
Saves results in-place with the same filename.
i7.jpg is converted to i7.png (JPG can't store transparency).
Uses birefnet-general for best results on architectural/venue photos.
"""
import io
from pathlib import Path
from rembg import remove, new_session
from PIL import Image

FOLDER = Path(r"C:\Projects\TI_Webpage\assets\NYA Img")

FILES = [
    ("i1.png",  "i1.png"),
    ("i1I.png", "i1I.png"),
    ("i2.png",  "i2.png"),
    ("i2I.png", "i2I.png"),
    ("i3.png",  "i3.png"),
    ("i3I.png", "i3I.png"),
    ("i4.png",  "i4.png"),
    ("i4I.png", "i4I.png"),
    ("i5.png",  "i5.png"),
    ("i5I.png", "i5I.png"),
    ("i6.png",  "i6.png"),
    ("i6I.png", "i6I.png"),
    ("i7.jpg",  "i7.png"),   # JPG -> PNG to preserve transparency
    ("i7I.png", "i7I.png"),
    ("i8.png",  "i8.png"),
    ("i8I.png", "i8I.png"),
]

print("Loading birefnet-general model (downloads on first use)...")
session = new_session("birefnet-general")
print("Model ready.\n")

for src_name, dst_name in FILES:
    src = FOLDER / src_name
    dst = FOLDER / dst_name

    if not src.exists():
        print(f"  SKIP  {src_name} (not found)")
        continue

    print(f"  {src_name} -> {dst_name} ...", end=" ", flush=True)
    result = remove(src.read_bytes(), session=session)
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    img.save(dst, "PNG")

    corner = img.getpixel((0, 0))
    status = "OK" if corner[3] < 10 else f"WARN corner alpha={corner[3]}"
    print(f"{img.width}x{img.height}  [{status}]")

    # Remove old jpg if we renamed it
    if src_name != dst_name and src.exists():
        src.unlink()
        print(f"           removed original {src_name}")

print("\nAll done.")

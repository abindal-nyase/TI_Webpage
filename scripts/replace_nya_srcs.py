import re

src_file = r'C:\Users\mbeshay\Downloads\preview (5).html'
dst_file = r'C:\Projects\TI_Webpage\preview-nya.html'

with open(src_file, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace any src=".../<i1-i8>.png" — exact filename match only (not i1l.png, i1text.png, etc.)
def replacer(m):
    return f'src="/nya-img/{m.group(1)}"'

new_html, count = re.subn(
    r'src="[^"]*/( i[1-8]\.png)"',
    replacer,
    html
)

# Also handle the file:/// local path for i1 which has no leading slash separator issue
new_html2, count2 = re.subn(
    r'src="[^"]*(i[1-8]\.png)"',
    lambda m: f'src="/nya-img/{m.group(1)}"',
    html
)

# Use the broader replacement (count2 includes all)
with open(dst_file, 'w', encoding='utf-8') as f:
    f.write(new_html2)

print(f'Replaced {count2} src(s). Saved to: {dst_file}')

# Show what was changed
matches = re.findall(r'src="[^"]*(i[1-8]\.png)"', html)
print(f'\nFiles matched and replaced:')
for m in sorted(set(matches)):
    print(f'  {m} -> /nya-img/{m}')

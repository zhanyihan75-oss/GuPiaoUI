import pdfplumber
import os

pdf_path = r'C:\\Users\\来一杯鲤鱼可可\\Desktop\\詹毅涵 作品集 2026.pdf'
out_dir = r'B:\\GuPiaoUI\\portfolio-pages'
os.makedirs(out_dir, exist_ok=True)

with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        # Render full page as image
        full_img = page.to_image(resolution=150)
        full_path = os.path.join(out_dir, f'page_{i+1}_full.png')
        full_img.save(full_path)
        print(f'Page {i+1}: saved {full_path}')

print(f'Done. Total pages: {len(pdf.pages)}')
print(f'Output: {out_dir}')

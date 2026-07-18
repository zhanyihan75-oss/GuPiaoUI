import pdfplumber
import json

pdf_path = r"C:\\Users\\来一杯鲤鱼可可\\Desktop\\詹毅涵 作品集 2026.pdf"

with pdfplumber.open(pdf_path) as pdf:
    pages = []
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        tables = page.extract_tables()
        pages.append({
            "page": i + 1,
            "total_pages": len(pdf.pages),
            "text": text if text else "",
            "table": tables
        })

output_path = r"B:\\GuPiaoUI\\portfolio-extracted.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(pages, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(pages)} pages")
for p in pages:
    print(f"\n--- Page {p['page']} ---")
    print(p['text'][:2000] if p['text'] else '(no text)')

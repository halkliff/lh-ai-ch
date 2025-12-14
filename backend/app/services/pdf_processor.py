import fitz


async def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    page_count = len(doc)
    doc.close()
    return text, page_count

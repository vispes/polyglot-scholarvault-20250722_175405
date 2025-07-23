export async function extractTextFromPdf(file: File): Promise<string> {
  if (!file) throw new Error('No file provided');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer
    }).promise;

    const pages: string[] = [];
    const pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter(item => 'str' in item)
        .map(item => (item as PDFItem).str)
        .join(' ');
      pages.push(pageText);
    }

    return pages.join('\f');
  } catch (error) {
    throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

type Page = {
  pageNumber: number;
  content: string;
};

type PDFItem = {
  str: string;
};

export function splitPages(text: string): Page[] {
  const pages = text.split('\f');
  return pages.map((content, index) => ({
    pageNumber: index + 1,
    content
  }));
}
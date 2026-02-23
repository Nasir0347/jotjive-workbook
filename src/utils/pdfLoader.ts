import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PDFPageInfo {
  width: number;
  height: number;
  scale: number;
}

export async function loadPDF(url: string): Promise<pdfjs.PDFDocumentProxy> {
  const loadingTask = pdfjs.getDocument(url);
  return await loadingTask.promise;
}

export async function getPageInfo(
  pdf: pdfjs.PDFDocumentProxy, 
  pageNumber: number,
  scale: number = 1.5
): Promise<PDFPageInfo> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  return {
    width: viewport.width,
    height: viewport.height,
    scale
  };
}

export async function renderPageToCanvas(
  pdf: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.5
): Promise<void> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');

  // Handle high-DPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = viewport.width * dpr;
  canvas.height = viewport.height * dpr;
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  context.scale(dpr, dpr);

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
}

import { useEffect, useRef, useState, memo, useMemo } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFRendererProps, PageType } from '../../types';

// Set up PDF.js worker - use CDN without ?import
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export const PDFRenderer: React.FC<PDFRendererProps> = memo(({
  pdfUrl,
  pageNumber = 1,
  scale: propScale,
  containerWidth,
  containerHeight,
  onRenderComplete,
  onDimensionsChange,
  onPageInfoDetected,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cache DPR to avoid recalculating
  const dpr = useMemo(() => window.devicePixelRatio || 1, []);

  useEffect(() => {
    let isCancelled = false;

    const renderPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (isCancelled) return;

        const page = await pdf.getPage(pageNumber);

        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d', { alpha: false });
        if (!context) return;

        // Calculate dynamic scale if container dimensions are provided
        const unscaledViewport = page.getViewport({ scale: 1 });
        let finalScale = propScale || 1.5;

        if (containerWidth || containerHeight) {
          // If only width is provided (height=0 or undefined), scale to fit width (landscape mode)
          // If only height is provided (width=0 or undefined), scale to fit height (portrait mode)
          if (containerWidth && containerWidth > 0 && (!containerHeight || containerHeight === 0)) {
            // Landscape: fit to width, let height overflow
            finalScale = containerWidth / unscaledViewport.width;
          } else if (containerHeight && containerHeight > 0 && (!containerWidth || containerWidth === 0)) {
            // Portrait: fit to height, let width adjust
            finalScale = containerHeight / unscaledViewport.height;
          } else if (containerWidth && containerWidth > 0 && containerHeight && containerHeight > 0) {
            // Both provided: use fit-to-contain logic (legacy)
            const scaleW = containerWidth / unscaledViewport.width;
            const scaleH = containerHeight / unscaledViewport.height;
            finalScale = Math.min(scaleW, scaleH);
          }

          // Apply any additional scale multiplier if provided
          if (propScale) finalScale *= propScale;
        }

        // Get viewport with calculated scale
        const viewport = page.getViewport({ scale: finalScale });

        // Handle high-DPI displays
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        // Scale context for high-DPI
        context.scale(dpr, dpr);

        onDimensionsChange?.(viewport.width, viewport.height);

        // Clear canvas
        context.clearRect(0, 0, viewport.width, viewport.height);

        // Render PDF page
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;

        // --- PAGE TYPE DETECTION (optimized) ---
        if (onPageInfoDetected) {
          try {
            const textContent = await page.getTextContent();

            // Look for text at the bottom of the page (bottom 100 units usually covers the footer)
            // Pattern: [T/P/Q/A/G]-[Number]
            const labelPattern = /([TPQAG])-(\d+)/;
            let detectedType: PageType | null = null;
            let detectedLabel = '';

            for (const item of textContent.items) {
              if ('str' in item) {
                const text = item.str.trim();
                const transform = item.transform; // [a, b, c, d, e, f] where f is y-coord
                const y = transform[5];

                // Check if text matches pattern AND is at the bottom of the page
                // PDF coordinates: (0,0) is bottom-left. So y < 100 is the bottom footer area.
                if (labelPattern.test(text) && y < 100) {
                  const match = text.match(labelPattern);
                  if (match) {
                    const typeLetter = match[1];
                    detectedLabel = text;

                    switch (typeLetter) {
                      case 'T': detectedType = PageType.T; break;
                      case 'P': detectedType = PageType.P; break;
                      case 'Q': detectedType = PageType.Q; break;
                      case 'A': detectedType = PageType.A; break;
                      case 'G': detectedType = PageType.G; break;
                    }
                    break;
                  }
                }
              }
            }

            if (detectedType) {
              onPageInfoDetected(detectedType, detectedLabel);
            } else {
              // No page type detected, set as EMPTY page type
              onPageInfoDetected(PageType.EMPTY, 'EMPTY');
            }
          } catch (ocrErr) {
            console.warn('Page type detection failed:', ocrErr);
          }
        }
        // --------------------------------

        if (!isCancelled) {
          setIsLoading(false);
          onRenderComplete?.();
        }

      } catch (err) {
        if (!isCancelled) {
          console.error('[PDFRenderer] Error:', err);
          const error = err instanceof Error ? err : new Error('Failed to render PDF');
          setError(error);
          setIsLoading(false);
          onError?.(error);
        }
      }
    };

    renderPDF();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, pageNumber, propScale, containerWidth, containerHeight, onRenderComplete, onError, onDimensionsChange, onPageInfoDetected, dpr]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-700 font-medium">Failed to load PDF</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading PDF...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-lg shadow-sm max-w-full h-auto block object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ zIndex: 1 }}
      />
    </div>
  );
});

PDFRenderer.displayName = 'PDFRenderer';

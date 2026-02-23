import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFRendererProps } from '../../types';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const PDFRenderer: React.FC<PDFRendererProps> = ({
  pdfUrl,
  pageNumber = 1,
  scale: propScale,
  containerWidth,
  containerHeight,
  onRenderComplete,
  onDimensionsChange,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate dynamic scale if container dimensions are provided
        const unscaledViewport = page.getViewport({ scale: 1 });
        let finalScale = propScale || 1.5;

        if (containerWidth || containerHeight) {
          const scaleW = containerWidth ? (containerWidth / unscaledViewport.width) : Infinity;
          const scaleH = containerHeight ? (containerHeight / unscaledViewport.height) : Infinity;

          // Fit-to-contain logic
          finalScale = Math.min(scaleW, scaleH);

          // Apply any additional scale multiplier if provided
          if (propScale) finalScale *= propScale;
        }

        // Get viewport with calculated scale
        const viewport = page.getViewport({ scale: finalScale });

        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
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

        if (!isCancelled) {
          setIsLoading(false);
          onRenderComplete?.();
        }

      } catch (err) {
        if (!isCancelled) {
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
  }, [pdfUrl, pageNumber, propScale, containerWidth, containerHeight, onRenderComplete, onError]);

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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading PDF...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-lg shadow-sm ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

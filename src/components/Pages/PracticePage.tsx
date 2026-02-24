import { useCallback, useState } from 'react';
import { PDFRenderer } from '../PageRenderer/PDFRenderer';
import { CanvasOverlay } from '../Handwriting/CanvasOverlay';
import { PageProps, HandwritingStroke } from '../../types';
import { useSession } from '../../context/SessionContext';

export const PracticePage: React.FC<PageProps> = ({ page }) => {
  const { setStrokes, getStrokes } = useSession();
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });

  const savedStrokes = getStrokes(page.id);

  const handleStrokesChange = useCallback((strokes: HandwritingStroke[]) => {
    setStrokes(page.id, strokes);
  }, [page.id, setStrokes]);

  const handleDimensionsChange = useCallback((width: number, height: number) => {
    setDimensions({ width, height });
  }, []);

  const isPC = window.innerWidth >= 1024;
  const availableWidth = window.innerWidth * (isPC ? 0.9 : 0.96);
  const availableHeight = isPC ? 2000 : window.innerHeight - 160; // Much larger on PC

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-32 sm:pb-40 sketched-bg pt-safe">
      <div className="relative bg-white shadow-xl rounded-[1.5rem] overflow-hidden m-1 sm:m-6 border border-gray-100 max-w-[98%] sm:max-w-none">
        <PDFRenderer
          pdfUrl={page.source}
          pageNumber={page.pageNumber}
          containerWidth={availableWidth}
          containerHeight={availableHeight}
          onDimensionsChange={handleDimensionsChange}
        />
        {page.allowWriting && (
          <CanvasOverlay
            pageId={page.id}
            mode="write"
            initialStrokes={savedStrokes}
            onStrokesChange={handleStrokesChange}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>

      {/* Practice indicator */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 bg-white border-2 border-slate-100 text-slate-800 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-tactile-blue animate-fade-in-up z-30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-saas-yellow animate-pulse" />
        PRACTICE PAGE
      </div>
    </div>
  );
};

export default PracticePage;

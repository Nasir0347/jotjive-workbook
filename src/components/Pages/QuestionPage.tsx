import { useCallback, useState } from 'react';
import { PDFRenderer } from '../PageRenderer/PDFRenderer';
import { CanvasOverlay } from '../Handwriting/CanvasOverlay';
import { PageProps, HandwritingStroke } from '../../types';
import { useSession } from '../../context/SessionContext';

export const QuestionPage: React.FC<PageProps> = ({ page }) => {
  const { setStrokes, getStrokes } = useSession();
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });

  const savedStrokes = getStrokes(page.id);

  const handleStrokesChange = useCallback((strokes: HandwritingStroke[]) => {
    setStrokes(page.id, strokes);
  }, [page.id, setStrokes]);

  const handleDimensionsChange = useCallback((width: number, height: number) => {
    setDimensions({ width, height });
  }, []);

  const availableWidth = window.innerWidth * 0.96;
  const availableHeight = window.innerHeight - 160;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pb-32 sm:pb-40 sketched-bg overflow-hidden pt-safe">
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

      {/* Question indicator */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 glass-panel text-slate-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm border border-gray-200 animate-fade-in-up z-30">
        <span className="opacity-50 mr-1.5">•</span>
        Question Page
      </div>
    </div>
  );
};

export default QuestionPage;

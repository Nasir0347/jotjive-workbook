import { useMemo, useState, useCallback } from 'react';
import { PDFRenderer } from '../PageRenderer/PDFRenderer';
import { CanvasOverlay } from '../Handwriting/CanvasOverlay';
import { PageProps, PageType } from '../../types';
import { useSession } from '../../context/SessionContext';

export const AnswerPage: React.FC<PageProps> = ({ page, allPages = [] }) => {
  const { getStrokes } = useSession();

  // Find the related question page (Q page that links to this A page)
  const relatedQuestion = useMemo(() => {
    return allPages.find(p =>
      p.type === PageType.Q && p.relatedPage === page.id
    );
  }, [allPages, page.id]);

  // Get the student's saved strokes from the question page
  const savedStrokes = useMemo(() => {
    if (!relatedQuestion) return [];
    return getStrokes(relatedQuestion.id);
  }, [relatedQuestion, getStrokes]);

  const hasAnswer = savedStrokes.length > 0;

  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 });

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
        {/* Redisplay student's handwriting */}
        <CanvasOverlay
          pageId={page.id}
          mode="redisplay"
          initialStrokes={savedStrokes}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>

      {/* Answer indicator */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 glass-panel text-slate-600 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm border border-gray-200 animate-fade-in-up z-30 flex items-center gap-2">
        <span className="opacity-50">•</span>
        <span>Answer Page</span>
        <span className="opacity-20">|</span>
        <span className={hasAnswer ? "text-[#22c55e]" : "text-amber-500"}>
          {hasAnswer ? (
            <span className="flex items-center gap-1">Complete <span className="xs:inline hidden">✅</span></span>
          ) : (
            <span className="flex items-center gap-1">No Data <span className="xs:inline hidden">⚠️</span></span>
          )}
        </span>
      </div>
    </div>
  );
};

export default AnswerPage;

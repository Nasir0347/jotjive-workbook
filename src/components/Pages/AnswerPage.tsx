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
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 bg-white border-2 border-slate-100 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-tactile-blue animate-fade-in-up z-30 flex items-center gap-3">
        <span
          className="w-3 h-3 rounded-full animate-pulse flex-shrink-0"
          style={{
            display: 'block',
            backgroundColor: hasAnswer ? '#22c55e' : '#ef4444'
          }}
        />
        <span className="text-slate-800">ANSWER PAGE</span>
        <span className="opacity-20 w-[1px] h-3 bg-slate-900 mx-1" />
        <span
          style={{ color: hasAnswer ? '#22c55e' : '#ef4444' }}
        >
          {hasAnswer ? 'COMPLETE' : 'NO DATA'}
        </span>
      </div>
    </div>
  );
};

export default AnswerPage;

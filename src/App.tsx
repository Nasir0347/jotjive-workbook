import { useState, useEffect, useLayoutEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { SessionProvider, useSession } from './context/SessionContext';
import {
  Workbook,
  WorkbookPage,
  PageType,
  DeviceType,
  HandwritingStroke
} from './types';
import { PDFRenderer } from './components/PageRenderer/PDFRenderer';
import { CanvasOverlay, CanvasOverlayRef } from './components/Handwriting/CanvasOverlay';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { InputSettingsModal } from './components/Handwriting/InputSettings';
import { LandscapeOnly } from './components/Layout/LandscapeOnly';
import { TabletOnly } from './components/Layout/TabletOnly';
import { WORKBOOK_CATALOG } from './config/workbookConfig';
import { FLASHCARD_CATALOG } from './config/flashcardConfig';
import { isSimpleMode } from './config/categoryDetector';
import * as pdfjsLib from 'pdfjs-dist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

// Lazy load route components for code splitting
const WorkbookSelector = lazy(() => import('./components/Pages/WorkbookSelector').then(m => ({ default: m.WorkbookSelector })));
const WrapperScreen = lazy(() => import('./components/Pages/WrapperScreen').then(m => ({ default: m.WrapperScreen })));
const CoverScreen = lazy(() => import('./components/Pages/CoverScreen').then(m => ({ default: m.CoverScreen })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// ============================================
// WORKBOOK PAGE BUILDER
// ============================================

// Helper function to get PDF page count
async function getPdfPageCount(pdfUrl: string): Promise<number> {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Error loading PDF:', error);
    return 34; // Fallback to 34 pages if error
  }
}

async function buildWorkbookConfig(id: string): Promise<Workbook | null> {
  const entry = WORKBOOK_CATALOG.find(e => e.id === id);
  if (!entry) {
    // Check if it's a flashcard
    const flashcard = FLASHCARD_CATALOG.all.find(f => f.id === id);
    if (!flashcard) return null;

    // Build flashcard as simple workbook (no TPQ logic)
    const pageCount = await getPdfPageCount(flashcard.pdf);
    const pages: WorkbookPage[] = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push({
        id: `PAGE-${i}`,
        type: PageType.EMPTY,
        pageNumber: i,
        source: flashcard.pdf,
        allowWriting: true
      });
    }

    return {
      id: flashcard.id,
      coverImage: flashcard.cover,
      config: {
        nativeLanguage: 'AEN',
        targetLanguage: 'AEN',
        deviceType: DeviceType.TABLET
      },
      pages
    };
  }

  const pdfSource = entry.pdf;
  const simpleMode = isSimpleMode(id);

  // Get actual page count from PDF
  const pageCount = await getPdfPageCount(pdfSource);

  // SIMPLE MODE: No page type detection, all pages are generic
  // Pages display as-is from PDF, no T/P/Q/A/G labels
  if (simpleMode) {
    const pages: WorkbookPage[] = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push({
        id: `PAGE-${i}`,
        type: PageType.EMPTY, // No detection in simple mode
        pageNumber: i,
        source: pdfSource,
        allowWriting: true
      });
    }

    return {
      id: entry.id,
      coverImage: entry.cover,
      config: {
        nativeLanguage: 'AEN',
        targetLanguage: 'AEN',
        deviceType: DeviceType.TABLET
      },
      pages
    };
  }

  // FULL MODE (JJ01-JJ06): Build pages based on actual PDF page count
  const pages: WorkbookPage[] = [{
    id: 'T-1',
    type: PageType.T,
    pageNumber: 1,
    source: pdfSource,
    allowWriting: true
  }];

  for (let i = 2; i <= pageCount; i++) {
    pages.push({
      id: `PAGE-${i}`,
      type: PageType.T, // Default, will be auto-detected
      pageNumber: i,
      source: pdfSource,
      allowWriting: true
    });
  }

  return {
    id: entry.id,
    coverImage: entry.cover,
    config: {
      nativeLanguage: 'AEN',
      targetLanguage: 'AEN',
      deviceType: DeviceType.TABLET
    },
    pages
  };
}

// ============================================
// GENERIC WORKBOOK PAGE
// ============================================

interface GenericWorkbookPageProps {
  page: WorkbookPage;
  onPageInfoDetected: (type: PageType, label: string) => void;
  canvasRef: React.RefObject<CanvasOverlayRef>;
}

const GenericWorkbookPage: React.FC<GenericWorkbookPageProps> = ({
  page,
  onPageInfoDetected,
  canvasRef
}) => {
  const { getStrokes, setStrokes, getPageImage, state } = useSession();

  // Measure real nav heights from the DOM
  const [navHeights, setNavHeights] = useState({ top: 64, bottom: 64 });

  useLayoutEffect(() => {
    const measure = () => {
      // Top nav is the first fixed element at top-0
      const topEl = document.querySelector<HTMLElement>('[class*="fixed top-0"]');
      // Bottom nav is the first fixed element at bottom-0
      const bottomEl = document.querySelector<HTMLElement>('[class*="fixed bottom-0"]');
      const top = topEl ? topEl.getBoundingClientRect().height : 64;
      const bottom = bottomEl ? bottomEl.getBoundingClientRect().height : 64;
      setNavHeights({ top, bottom });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Canvas dimensions (sized to match PDF aspect ratio inside available space)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleStrokesChange = useCallback((strokes: HandwritingStroke[]) => {
    setStrokes(page.id, strokes);
  }, [page.id, setStrokes]);

  // Recalculate canvas size whenever nav heights or window size changes
  const recalculate = useCallback((ratio: number | null, navTop: number, navBottom: number) => {
    const availableHeight = window.innerHeight - navTop - navBottom;
    const availableWidth = window.innerWidth;

    if (!ratio) {
      // No aspect ratio yet — use full available space as initial hint
      setDimensions({ width: availableWidth, height: availableHeight });
      return;
    }

    // Fit canvas to available space while preserving PDF aspect ratio
    let canvasHeight = availableHeight;
    let canvasWidth = canvasHeight / ratio;

    if (canvasWidth > availableWidth) {
      canvasWidth = availableWidth;
      canvasHeight = canvasWidth * ratio;
    }

    setDimensions({ width: Math.floor(canvasWidth), height: Math.floor(canvasHeight) });
  }, []);

  const pdfRatioRef = useRef<number | null>(null);

  // When PDF renders it reports its native pixel dimensions
  const handleDimensionsChange = useCallback((w: number, h: number) => {
    const ratio = h / w;
    pdfRatioRef.current = ratio;
    recalculate(ratio, navHeights.top, navHeights.bottom);
  }, [navHeights, recalculate]);

  // Recalculate on resize or nav height change
  useEffect(() => {
    recalculate(pdfRatioRef.current, navHeights.top, navHeights.bottom);
  }, [navHeights, recalculate]);

  // Initial hint — give PDF the full available area so it renders at max size
  useEffect(() => {
    recalculate(null, navHeights.top, navHeights.bottom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="chalkboard-hero"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: `${navHeights.top}px`,
        paddingBottom: `${navHeights.bottom}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div
          className="relative shadow-sm sm:shadow-md md:shadow-lg rounded-sm overflow-hidden border border-slate-800 bg-white"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px`, flexShrink: 0 }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PDFRenderer
              pdfUrl={page.source}
              pageNumber={page.pageNumber}
              containerHeight={dimensions.height}
              containerWidth={dimensions.width}
              onDimensionsChange={handleDimensionsChange}
              onPageInfoDetected={onPageInfoDetected}
            />
          </div>
          <CanvasOverlay
            ref={canvasRef}
            pageId={page.id}
            width={dimensions.width}
            height={dimensions.height}
            initialStrokes={getStrokes(page.id)}
            onStrokesChange={handleStrokesChange}
            mode={state.isEraserMode ? "erase" : "write"}
            backgroundImage={state.pageType === PageType.A ? getPageImage(page.id) : undefined}
          />
        </div>
      )}
    </div>
  );
};

// ============================================
// WORKBOOK VIEWER
// ============================================

function WorkbookViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<CanvasOverlayRef>(null);

  const {
    state,
    dispatch,
    clearStrokes,
    setPageInfo,
    setPageImage,
    toggleEraser
  } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showEraseBookModal, setShowEraseBookModal] = useState(false);
  const [workbookConfig, setWorkbookConfig] = useState<Workbook | null>(null);

  // Detect if current workbook is simple mode (define early for use in callbacks)
  const currentSimpleMode = id ? isSimpleMode(id) : false;

  // Check if it's a phone flashcard
  const isPhoneFlashcard = state.contentMode === 'flashcard-phone';
  const isTabletFlashcard = state.contentMode === 'flashcard-tablet';
  const isWorkbook = state.contentMode === 'workbook';

  const pages = workbookConfig?.pages ?? [];
  const currentPageIndex = state.currentPageIndex;
  const currentPage = pages[currentPageIndex];

  // Load workbook config when ID changes
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      buildWorkbookConfig(id).then(config => {
        setWorkbookConfig(config);
        setIsLoading(false);
      });
    }
  }, [id]);

  // Reset page index when workbook changes
  useEffect(() => {
    dispatch({ type: 'GO_TO_PAGE', payload: 0 });
  }, [id, dispatch]);

  const handlePageInfoDetected = useCallback((type: PageType, label: string) => {
    // For flashcard mode: always show "Page X"
    if (state.contentMode === 'flashcard-tablet' || state.contentMode === 'flashcard-phone') {
      setPageInfo(PageType.EMPTY, `Page ${currentPageIndex + 1}`);
    }
    // For simple mode: always show "Page X" without type labels
    else if (currentSimpleMode) {
      setPageInfo(PageType.EMPTY, `Page ${currentPageIndex + 1}`);
    } else {
      setPageInfo(type, label);
    }
  }, [setPageInfo, currentSimpleMode, currentPageIndex, state.contentMode]);

  const handleNext = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      setIsPageLoading(true);
      // Q→A image transfer only for FULL mode (not simple mode or flashcards)
      const isFlashcard = state.contentMode === 'flashcard-tablet' || state.contentMode === 'flashcard-phone';
      if (!currentSimpleMode && !isFlashcard && state.pageType === PageType.Q && canvasRef.current) {
        const image = canvasRef.current.toDataURL();
        const nextPageIndex = currentPageIndex + 1;
        const nextPage = pages[nextPageIndex];
        if (nextPage) {
          setPageImage(nextPage.id, image);
        }
      }
      dispatch({ type: 'GO_TO_NEXT' });
      setTimeout(() => setIsPageLoading(false), 300);
    }
  }, [currentPageIndex, pages, state.pageType, state.contentMode, dispatch, setPageImage, currentSimpleMode]);

  const handleBack = useCallback(() => {
    if (currentPageIndex > 0 && currentPage) {
      setIsPageLoading(true);
      // Q→A clearing logic only for FULL mode (not simple mode or flashcards)
      const isFlashcard = state.contentMode === 'flashcard-tablet' || state.contentMode === 'flashcard-phone';
      if (!currentSimpleMode && !isFlashcard && state.pageType === PageType.A) {
        clearStrokes(currentPage.id);
        const prevPageIndex = currentPageIndex - 1;
        const prevPage = pages[prevPageIndex];
        if (prevPage) {
          clearStrokes(prevPage.id);
          setPageImage(currentPage.id, '');
        }
      } else {
        clearStrokes(currentPage.id);
      }

      dispatch({ type: 'GO_TO_PREVIOUS' });
      setTimeout(() => setIsPageLoading(false), 300);
    }
  }, [currentPageIndex, pages, state.pageType, state.contentMode, clearStrokes, setPageImage, dispatch, currentPage, currentSimpleMode]);


  const handlePowerOff = useCallback(() => {
    // Clear all strokes before navigating away
    dispatch({ type: 'CLEAR_ALL_STROKES' });
    canvasRef.current?.clear();
    navigate('/');
  }, [dispatch, navigate]);

  const handleErasePage = useCallback(() => {
    toggleEraser();
  }, [toggleEraser]);

  const handleEraseBook = useCallback(() => {
    setShowEraseBookModal(true);
  }, []);

  const confirmEraseBook = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_STROKES' });
    canvasRef.current?.clear();
    setShowEraseBookModal(false);
  }, [dispatch]);

  if (id && !workbookConfig && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Workbook Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find a workbook with ID: {id}</p>
        <button
          onClick={() => navigate('/select')}
          className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-colors"
        >
          Back to Selector
        </button>
      </div>
    );
  }

  // Show loading while workbook config is being loaded
  if (isLoading || !workbookConfig || !currentPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const content = (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        onNext={handleNext}
        onBack={handleBack}
        onErasePage={handleErasePage}
        onEraseBook={handleEraseBook}
        onPower={handlePowerOff}
        onCheck={() => { }}
        onGoldenKey={() => { }}
        canGoNext={currentPageIndex < pages.length - 1}
        canGoBack={currentPageIndex > 0}
        currentPage={currentPageIndex + 1}
        totalPages={pages.length}
        pageType={state.pageType}
        activePageLabel={state.activePageLabel}
        isSimpleMode={currentSimpleMode || state.contentMode === 'flashcard-tablet' || state.contentMode === 'flashcard-phone'}
      />

      {currentPage && (
        <GenericWorkbookPage
          page={pages[currentPageIndex]}
          onPageInfoDetected={handlePageInfoDetected}
          canvasRef={canvasRef}
        />
      )}

      <InputSettingsModal />

      {/* Page Navigation Loading Spinner */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Erase Book Confirmation Modal */}
      {showEraseBookModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FontAwesomeIcon icon={faTrashCan} className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 sm:mb-3">Erase Entire Workbook?</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                This will permanently delete all your handwriting from every page in this workbook. This action cannot be undone.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowEraseBookModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-slate-200 text-slate-700 text-sm sm:text-base font-bold hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEraseBook}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/30"
                >
                  Yes, Erase All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Wrap with LandscapeOnly for phone flashcards
  if (isPhoneFlashcard) {
    return <LandscapeOnly>{content}</LandscapeOnly>;
  }

  // Wrap with TabletOnly for workbooks and tablet flashcards
  if (isWorkbook || isTabletFlashcard) {
    return <TabletOnly>{content}</TabletOnly>;
  }

  return content;
}

// ============================================
// ROOT COMPONENT
// ============================================

function App() {
  return (
    <SessionProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<WorkbookSelector />} />
          <Route path="/select" element={<WorkbookSelector />} />
          <Route path="/workbook/:id/wrapper" element={<WrapperScreen />} />
          <Route path="/workbook/:id/cover" element={<CoverScreen />} />
          <Route path="/workbook/:id/viewer" element={<WorkbookViewer />} />
        </Routes>
      </Suspense>
    </SessionProvider>
  );
}

export default App;

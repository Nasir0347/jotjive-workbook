import { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import {
  Workbook,
  WorkbookPage,
  PageType,
  DeviceType
} from './types';
import { CoverPage } from './components/Pages/CoverPage';
import { TeachingPage } from './components/Pages/TeachingPage';
import { PracticePage } from './components/Pages/PracticePage';
import { QuestionPage } from './components/Pages/QuestionPage';
import { AnswerPage } from './components/Pages/AnswerPage';
import { GamePage } from './components/Pages/GamePage';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { HandwritingToolbar } from './components/Handwriting/HandwritingToolbar';

// ============================================
// WORKBOOK CONFIGURATION (JJ05SS02)
// ============================================

const WORKBOOK_CONFIG: Workbook = {
  id: 'JJ05SS02',
  coverImage: '/workbooks/JJ05SS02/cover.png',
  config: {
    nativeLanguage: 'AEN',
    targetLanguage: 'AEN',
    deviceType: DeviceType.TABLET
  },
  pages: [
    {
      id: 'COVER',
      type: PageType.COVER,
      pageNumber: 0,
      source: '/workbooks/JJ05SS02/cover.png',
      allowWriting: false
    },
    {
      id: 'T-2',
      type: PageType.T,
      pageNumber: 2,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: true
    },
    {
      id: 'T-3',
      type: PageType.T,
      pageNumber: 3,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: true
    },
    {
      id: 'P-4',
      type: PageType.P,
      pageNumber: 4,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: true
    },
    {
      id: 'Q-5',
      type: PageType.Q,
      pageNumber: 5,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: true,
      relatedPage: 'A-6'
    },
    {
      id: 'A-6',
      type: PageType.A,
      pageNumber: 6,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: false
    },
    {
      id: 'G-7',
      type: PageType.G,
      pageNumber: 7,
      source: '/workbooks/JJ05SS02/05SS02.pdf',
      allowWriting: true
    }
  ]
};

// ============================================
// ENHANCED PAGE COMPONENTS WITH TOOLBAR
// ============================================

const EnhancedTeachingPage: React.FC<{ page: WorkbookPage }> = ({ page }) => {
  const { getStrokes, clearStrokes } = useSession();
  const savedStrokes = getStrokes(page.id);

  const handleClear = useCallback(() => {
    clearStrokes(page.id);
  }, [page.id, clearStrokes]);

  return (
    <>
      <HandwritingToolbar
        onClear={handleClear}
        strokeCount={savedStrokes.length}
      />
      <TeachingPage page={page} />
    </>
  );
};

const EnhancedQuestionPage: React.FC<{ page: WorkbookPage }> = ({ page }) => {
  const { getStrokes, clearStrokes } = useSession();
  const savedStrokes = getStrokes(page.id);

  const handleClear = useCallback(() => {
    clearStrokes(page.id);
  }, [page.id, clearStrokes]);

  return (
    <>
      <HandwritingToolbar
        onClear={handleClear}
        strokeCount={savedStrokes.length}
      />
      <QuestionPage page={page} />
    </>
  );
};

const EnhancedPracticePage: React.FC<{ page: WorkbookPage }> = ({ page }) => {
  const { getStrokes, clearStrokes } = useSession();
  const savedStrokes = getStrokes(page.id);

  const handleClear = useCallback(() => {
    clearStrokes(page.id);
  }, [page.id, clearStrokes]);

  return (
    <>
      <HandwritingToolbar
        onClear={handleClear}
        strokeCount={savedStrokes.length}
      />
      <PracticePage page={page} />
    </>
  );
};

const EnhancedGamePage: React.FC<{ page: WorkbookPage }> = ({ page }) => {
  const { getStrokes, clearStrokes } = useSession();
  const savedStrokes = getStrokes(page.id);

  const handleClear = useCallback(() => {
    clearStrokes(page.id);
  }, [page.id, clearStrokes]);

  return (
    <>
      <HandwritingToolbar
        onClear={handleClear}
        strokeCount={savedStrokes.length}
      />
      <GamePage page={page} />
    </>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

function WorkbookApp() {
  const {
    state,
    dispatch,
    clearStrokes,
    clearStrokesRange
  } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  const currentPageIndex = state.currentPageIndex;
  const pages = WORKBOOK_CONFIG.pages;
  const currentPage = pages[currentPageIndex];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      dispatch({ type: 'GO_TO_NEXT' });
    }
  }, [currentPageIndex, pages.length, dispatch]);

  const handleBack = useCallback(() => {
    if (currentPageIndex > 0) {
      const currentPage = pages[currentPageIndex];
      const targetIndex = currentPageIndex - 1;

      // Clear handwriting on current page
      clearStrokes(currentPage.id);

      // If going back from A to Q, also clear the Q page strokes
      if (currentPage.type === PageType.A) {
        const relatedQ = pages.find(p => p.relatedPage === currentPage.id);
        if (relatedQ) {
          clearStrokes(relatedQ.id);
        }
      }

      // If going back multiple pages, clear all intermediate
      if (currentPageIndex > targetIndex + 1) {
        clearStrokesRange(currentPageIndex - 1, targetIndex, pages);
      }

      dispatch({ type: 'GO_TO_PREVIOUS' });
    }
  }, [currentPageIndex, pages, clearStrokes, clearStrokesRange, dispatch]);

  const handleGoToCover = useCallback(() => {
    dispatch({ type: 'GO_TO_PAGE', payload: 0 });
  }, [dispatch]);

  const handleStart = useCallback(() => {
    dispatch({ type: 'GO_TO_NEXT' });
  }, [dispatch]);

  // Render current page
  const renderPage = useCallback((page: WorkbookPage) => {
    switch (page.type) {
      case PageType.COVER:
        return (
          <CoverPage
            coverImage={WORKBOOK_CONFIG.coverImage}
            title="Road to Revolution"
            onStart={handleStart}
          />
        );

      case PageType.T:
        return <EnhancedTeachingPage page={page} />;

      case PageType.P:
        return <EnhancedPracticePage page={page} />;

      case PageType.Q:
        return <EnhancedQuestionPage page={page} />;

      case PageType.A:
        return <AnswerPage page={page} allPages={pages} />;

      case PageType.G:
        return <EnhancedGamePage page={page} />;

      default:
        return (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">Unknown page type: {page.type}</p>
          </div>
        );
    }
  }, [handleStart, pages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workbook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      {renderPage(currentPage)}

      {/* Navigation - hidden on cover page */}
      {currentPage.type !== PageType.COVER && (
        <NavigationBar
          onNext={handleNext}
          onBack={handleBack}
          onGoToCover={handleGoToCover}
          canGoNext={currentPageIndex < pages.length - 1}
          canGoBack={currentPageIndex > 0}
          currentPage={currentPageIndex}
          totalPages={pages.length}
          pageType={currentPage.type}
        />
      )}
    </div>
  );
}

// ============================================
// ROOT COMPONENT WITH PROVIDERS
// ============================================

function App() {
  return (
    <SessionProvider>
      <WorkbookApp />
    </SessionProvider>
  );
}

export default App;

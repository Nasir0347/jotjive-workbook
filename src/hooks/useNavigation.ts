import { useCallback } from 'react';
import { useSession } from '../context/SessionContext';
import { WorkbookPage, PageType } from '../types';

interface UseNavigationProps {
  pages: WorkbookPage[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
}

export const useNavigation = ({
  pages,
  currentPageIndex,
  onPageChange
}: UseNavigationProps) => {
  const { clearStrokes } = useSession();

  const canGoNext = currentPageIndex < pages.length - 1;
  const canGoPrevious = currentPageIndex > 0;
  const currentPage = pages[currentPageIndex];

  const goToNext = useCallback(() => {
    if (!canGoNext) return;

    // Q → A: Strokes are already saved via onStrokesChange
    // They will be retrieved on the A page via getStrokes

    onPageChange(currentPageIndex + 1);
  }, [canGoNext, currentPageIndex, onPageChange]);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;

    // Clear handwriting on current page
    clearStrokes(currentPage.id);

    // If going back from A to Q, also clear the Q page strokes
    if (currentPage.type === PageType.A) {
      const relatedQ = pages.find(p => p.relatedPage === currentPage.id);
      if (relatedQ) {
        clearStrokes(relatedQ.id);
      }
    }

    onPageChange(currentPageIndex - 1);
  }, [canGoPrevious, currentPage, pages, clearStrokes, onPageChange]);

  const goToPage = useCallback((index: number) => {
    if (index >= 0 && index < pages.length) {
      onPageChange(index);
    }
  }, [pages.length, onPageChange]);

  return {
    canGoNext,
    canGoPrevious,
    currentPage,
    goToNext,
    goToPrevious,
    goToPage,
    isFirstPage: currentPageIndex === 0,
    isLastPage: currentPageIndex === pages.length - 1
  };
};

export default useNavigation;

import { useCallback } from 'react';
import { useSession } from '../context/SessionContext';
import { HandwritingStroke } from '../types';

export const useHandwriting = () => {
  const { 
    getStrokes, 
    setStrokes, 
    clearStrokes, 
    hasStrokes 
  } = useSession();

  const saveStrokes = useCallback((pageId: string, strokes: HandwritingStroke[]) => {
    setStrokes(pageId, strokes);
  }, [setStrokes]);

  const loadStrokes = useCallback((pageId: string): HandwritingStroke[] => {
    return getStrokes(pageId);
  }, [getStrokes]);

  const clearPageStrokes = useCallback((pageId: string) => {
    clearStrokes(pageId);
  }, [clearStrokes]);

  const checkHasStrokes = useCallback((pageId: string): boolean => {
    return hasStrokes(pageId);
  }, [hasStrokes]);

  return {
    saveStrokes,
    loadStrokes,
    clearPageStrokes,
    hasStrokes: checkHasStrokes
  };
};

export default useHandwriting;

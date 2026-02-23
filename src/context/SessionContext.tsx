import React, { createContext, useReducer, useContext, useCallback } from 'react';
import {
  SessionState,
  SessionAction,
  HandwritingStroke,
  WorkbookPage
} from '../types';

// ============================================
// INITIAL STATE
// ============================================

const initialState: SessionState = {
  currentPageIndex: 0,
  handwritingData: new Map(),
  navigationHistory: [],
  allowTouch: false
};

// ============================================
// REDUCER
// ============================================

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'GO_TO_NEXT':
      return {
        ...state,
        currentPageIndex: state.currentPageIndex + 1,
        navigationHistory: [...state.navigationHistory, state.currentPageIndex]
      };

    case 'GO_TO_PREVIOUS':
      return {
        ...state,
        currentPageIndex: Math.max(0, state.currentPageIndex - 1),
        navigationHistory: state.navigationHistory.slice(0, -1)
      };

    case 'GO_TO_PAGE':
      return {
        ...state,
        currentPageIndex: action.payload,
        navigationHistory: [...state.navigationHistory, state.currentPageIndex]
      };

    case 'SET_STROKES': {
      const newData = new Map(state.handwritingData);
      newData.set(action.payload.pageId, action.payload.strokes);
      return { ...state, handwritingData: newData };
    }

    case 'CLEAR_STROKES': {
      const newData = new Map(state.handwritingData);
      newData.delete(action.payload.pageId);
      return { ...state, handwritingData: newData };
    }

    case 'CLEAR_ALL_STROKES':
      return { ...state, handwritingData: new Map() };

    case 'CLEAR_STROKES_RANGE': {
      const newData = new Map(state.handwritingData);
      const { fromIndex, toIndex, pages } = action.payload;
      // Clear all pages in the range
      for (let i = fromIndex; i >= toIndex; i--) {
        const pageId = pages[i]?.id;
        if (pageId) {
          newData.delete(pageId);
        }
      }
      return { ...state, handwritingData: newData };
    }

    case 'TOGGLE_TOUCH':
      return { ...state, allowTouch: !state.allowTouch };

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface SessionContextType {
  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;
  getStrokes: (pageId: string) => HandwritingStroke[];
  setStrokes: (pageId: string, strokes: HandwritingStroke[]) => void;
  clearStrokes: (pageId: string) => void;
  clearStrokesRange: (fromIndex: number, toIndex: number, pages: WorkbookPage[]) => void;
  hasStrokes: (pageId: string) => boolean;
  toggleTouch: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

// ============================================
// PROVIDER
// ============================================

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const getStrokes = useCallback((pageId: string): HandwritingStroke[] => {
    return state.handwritingData.get(pageId) || [];
  }, [state.handwritingData]);

  const setStrokes = useCallback((pageId: string, strokes: HandwritingStroke[]) => {
    dispatch({ type: 'SET_STROKES', payload: { pageId, strokes } });
  }, []);

  const clearStrokes = useCallback((pageId: string) => {
    dispatch({ type: 'CLEAR_STROKES', payload: { pageId } });
  }, []);

  const clearStrokesRange = useCallback((fromIndex: number, toIndex: number, pages: WorkbookPage[]) => {
    dispatch({ type: 'CLEAR_STROKES_RANGE', payload: { fromIndex, toIndex, pages } });
  }, []);

  const hasStrokes = useCallback((pageId: string): boolean => {
    return state.handwritingData.has(pageId) && state.handwritingData.get(pageId)!.length > 0;
  }, [state.handwritingData]);

  const toggleTouch = useCallback(() => {
    dispatch({ type: 'TOGGLE_TOUCH' });
  }, []);

  return (
    <SessionContext.Provider value={{
      state,
      dispatch,
      getStrokes,
      setStrokes,
      clearStrokes,
      clearStrokesRange,
      hasStrokes,
      toggleTouch
    }}>
      {children}
    </SessionContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

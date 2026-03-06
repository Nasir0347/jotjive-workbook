import React, { createContext, useReducer, useContext, useCallback } from 'react';
import {
  SessionState,
  SessionAction,
  HandwritingStroke,
  PageType,
  ContentMode
} from '../types';

// ============================================
// INITIAL STATE
// ============================================

const initialState: SessionState = {
  currentPageIndex: 0,
  handwritingData: new Map(),
  allowTouch: false,
  pageType: PageType.EMPTY, // Default to EMPTY
  activePageLabel: '',
  originalPageLabel: '',
  handwritingImages: new Map(),
  isSettingsOpen: false,
  nativeLanguage: 'AEN', // Default to American English
  targetLanguage: 'AEN', // Default to American English
  isEraserMode: false, // Default to write mode
  contentMode: 'workbook' // Default to workbook mode
};

// ============================================
// REDUCER
// ============================================

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'GO_TO_NEXT':
      return {
        ...state,
        currentPageIndex: state.currentPageIndex + 1
      };

    case 'GO_TO_PREVIOUS':
      return {
        ...state,
        currentPageIndex: Math.max(0, state.currentPageIndex - 1)
      };

    case 'GO_TO_PAGE':
      return {
        ...state,
        currentPageIndex: action.payload
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

    case 'TOGGLE_TOUCH':
      return { ...state, allowTouch: !state.allowTouch };

    case 'SET_PAGE_INFO':
      return {
        ...state,
        pageType: action.payload.pageType,
        activePageLabel: action.payload.activePageLabel,
        originalPageLabel: action.payload.originalPageLabel
      };

    case 'SET_PAGE_IMAGE': {
      const newImages = new Map(state.handwritingImages);
      newImages.set(action.payload.pageId, action.payload.image);
      return { ...state, handwritingImages: newImages };
    }

    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };

    case 'SET_LANGUAGES':
      return {
        ...state,
        nativeLanguage: action.payload.nativeLanguage,
        targetLanguage: action.payload.targetLanguage
      };

    case 'TOGGLE_ERASER':
      return { ...state, isEraserMode: !state.isEraserMode };

    case 'SET_CONTENT_MODE':
      return { ...state, contentMode: action.payload };

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
  toggleTouch: () => void;
  setPageInfo: (pageType: PageType, activePageLabel: string) => void;
  setPageImage: (pageId: string, image: string) => void;
  getPageImage: (pageId: string) => string | undefined;
  toggleSettings: () => void;
  setLanguages: (nativeLanguage: string, targetLanguage: string) => void;
  toggleEraser: () => void;
  setContentMode: (mode: ContentMode) => void;
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

  const toggleTouch = useCallback(() => {
    dispatch({ type: 'TOGGLE_TOUCH' });
  }, []);

  const setPageInfo = useCallback((pageType: PageType, activePageLabel: string) => {
    // Convert page type to readable label for header
    let readableLabel = '';

    // Check if it's an empty page (no label detected)
    if (pageType === PageType.EMPTY || activePageLabel === 'EMPTY' || !activePageLabel) {
      readableLabel = 'EMPTY PAGE';
    } else {
      switch (pageType) {
        case PageType.T:
          readableLabel = 'TEACHING PAGE';
          break;
        case PageType.P:
          readableLabel = 'PRACTICE PAGE';
          break;
        case PageType.Q:
          readableLabel = 'QUESTION PAGE';
          break;
        case PageType.A:
          readableLabel = 'ANSWER PAGE';
          break;
        case PageType.G:
          readableLabel = 'GAME PAGE';
          break;
        default:
          readableLabel = 'EMPTY PAGE';
      }
    }

    dispatch({
      type: 'SET_PAGE_INFO',
      payload: {
        pageType,
        activePageLabel: readableLabel,
        originalPageLabel: activePageLabel === 'EMPTY' ? '...' : activePageLabel // Keep original like "T-1", "Q-3" or "..." for empty
      }
    });
  }, []);

  const setPageImage = useCallback((pageId: string, image: string) => {
    dispatch({ type: 'SET_PAGE_IMAGE', payload: { pageId, image } });
  }, []);

  const getPageImage = useCallback((pageId: string): string | undefined => {
    return state.handwritingImages.get(pageId);
  }, [state.handwritingImages]);

  const setLanguages = useCallback((nativeLanguage: string, targetLanguage: string) => {
    dispatch({ type: 'SET_LANGUAGES', payload: { nativeLanguage, targetLanguage } });
  }, []);

  const toggleEraser = useCallback(() => {
    dispatch({ type: 'TOGGLE_ERASER' });
  }, []);

  const setContentMode = useCallback((mode: ContentMode) => {
    dispatch({ type: 'SET_CONTENT_MODE', payload: mode });
  }, []);

  return (
    <SessionContext.Provider value={{
      state,
      dispatch,
      getStrokes,
      setStrokes,
      clearStrokes,
      toggleTouch,
      setPageInfo,
      setPageImage,
      getPageImage,
      toggleSettings: () => dispatch({ type: 'TOGGLE_SETTINGS' }),
      setLanguages,
      toggleEraser,
      setContentMode
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

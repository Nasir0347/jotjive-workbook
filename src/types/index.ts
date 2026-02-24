// ============================================
// JOTJIVE TYPE DEFINITIONS
// ============================================

export enum PageType {
  COVER = 'COVER',
  T = 'T',      // Teaching Page
  P = 'P',      // Practice Page  
  Q = 'Q',      // Question Page
  A = 'A',      // Answer Page
  G = 'G',      // Game Page
  FLASHCARD = 'FLASHCARD',  // Flashcard Front
  FLASHCARD_A = 'FLASHCARD_A' // Flashcard Back/Answer
}

export enum DeviceType {
  TABLET = 'TABLET',
  SMARTPHONE = 'SMARTPHONE'
}

export interface WorkbookConfig {
  nativeLanguage: string;
  targetLanguage: string;
  deviceType: DeviceType;
}

export interface WorkbookPage {
  id: string;
  type: PageType;
  pageNumber: number;
  source: string;
  allowWriting: boolean;
  relatedPage?: string;  // For Q→A linkage
}

export interface Workbook {
  id: string;
  coverImage: string;
  pages: WorkbookPage[];
  config: WorkbookConfig;
}

// ============================================
// HANDWRITING TYPES
// ============================================

export interface Point {
  x: number;
  y: number;
  pressure?: number; // Added for stylus support
}

export interface HandwritingStroke {
  points: Point[];
  timestamp: number;
  tool: 'stylus' | 'finger';
  pressure?: number;
}

// ============================================
// SESSION TYPES
// ============================================

export interface SessionState {
  currentPageIndex: number;
  handwritingData: Map<string, HandwritingStroke[]>;
  navigationHistory: number[];
  allowTouch: boolean;
}

export type SessionAction =
  | { type: 'GO_TO_NEXT' }
  | { type: 'GO_TO_PREVIOUS' }
  | { type: 'GO_TO_PAGE'; payload: number }
  | { type: 'SET_STROKES'; payload: { pageId: string; strokes: HandwritingStroke[] } }
  | { type: 'CLEAR_STROKES'; payload: { pageId: string } }
  | { type: 'CLEAR_ALL_STROKES' }
  | { type: 'CLEAR_STROKES_RANGE'; payload: { fromIndex: number; toIndex: number; pages: WorkbookPage[] } }
  | { type: 'TOGGLE_TOUCH' };

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface PDFRendererProps {
  pdfUrl: string;
  pageNumber?: number;
  scale?: number;
  containerWidth?: number;
  containerHeight?: number;
  onRenderComplete?: () => void;
  onDimensionsChange?: (width: number, height: number) => void;
  onError?: (error: Error) => void;
}

export interface CanvasOverlayProps {
  pageId: string;
  mode: 'write' | 'read' | 'redisplay';
  initialStrokes?: HandwritingStroke[];
  allowInput?: boolean;
  allowFinger?: boolean;
  onStrokesChange?: (strokes: HandwritingStroke[]) => void;
  width?: number;
  height?: number;
}

export interface NavigationBarProps {
  onNext?: () => void;
  onBack?: () => void;
  onGoToCover?: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  currentPage: number;
  totalPages: number;
  pageType?: PageType;
}

export interface PageProps {
  page: WorkbookPage;
  allPages?: WorkbookPage[];
}

// ============================================
// INPUT CONFIGURATION
// ============================================

export interface InputConfig {
  stylusOnly: boolean;
  allowFinger: boolean;
  pressureSensitive: boolean;
}

export const DEFAULT_INPUT_CONFIG: InputConfig = {
  stylusOnly: true,
  allowFinger: false,
  pressureSensitive: false
};

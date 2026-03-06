// ============================================
// JOTJIVE TYPE DEFINITIONS
// ============================================

export enum PageType {
  T = 'T',      // Teaching Page
  P = 'P',      // Practice Page
  Q = 'Q',      // Question Page
  A = 'A',      // Answer Page
  G = 'G',      // Game Page
  EMPTY = 'EMPTY' // Empty Page (no marker detected)
}

export enum DeviceType {
  TABLET = 'TABLET'
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

export type ContentMode = 'workbook' | 'flashcard-tablet' | 'flashcard-phone';

export interface SessionState {
  currentPageIndex: number;
  handwritingData: Map<string, HandwritingStroke[]>;
  allowTouch: boolean;
  pageType: PageType;
  activePageLabel: string;
  originalPageLabel: string;
  handwritingImages: Map<string, string>; // pageId -> base64
  isSettingsOpen: boolean;
  nativeLanguage: string; // NL - Native Language
  targetLanguage: string; // TL - Target Language
  isEraserMode: boolean; // Eraser mode toggle
  contentMode: ContentMode; // Content mode: workbook or flashcard
}

export type SessionAction =
  | { type: 'GO_TO_NEXT' }
  | { type: 'GO_TO_PREVIOUS' }
  | { type: 'GO_TO_PAGE'; payload: number }
  | { type: 'SET_STROKES'; payload: { pageId: string; strokes: HandwritingStroke[] } }
  | { type: 'CLEAR_STROKES'; payload: { pageId: string } }
  | { type: 'CLEAR_ALL_STROKES' }
  | { type: 'TOGGLE_TOUCH' }
  | { type: 'SET_PAGE_INFO'; payload: { pageType: PageType; activePageLabel: string; originalPageLabel: string } }
  | { type: 'SET_PAGE_IMAGE'; payload: { pageId: string; image: string } }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SET_LANGUAGES'; payload: { nativeLanguage: string; targetLanguage: string } }
  | { type: 'TOGGLE_ERASER' }
  | { type: 'SET_CONTENT_MODE'; payload: ContentMode };

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
  onPageInfoDetected?: (pageType: PageType, label: string) => void;
  onError?: (error: Error) => void;
}

export interface CanvasOverlayProps {
  pageId: string;
  mode: 'write' | 'read' | 'redisplay' | 'erase';
  initialStrokes?: HandwritingStroke[];
  allowInput?: boolean;
  onStrokesChange?: (strokes: HandwritingStroke[]) => void;
  width?: number;
  height?: number;
  backgroundImage?: string;
}

export interface NavigationBarProps {
  onNext?: () => void;
  onBack?: () => void;
  onGoToStart?: () => void;
  onErasePage?: () => void;
  onEraseBook?: () => void;
  onEmail?: (pageId: string) => void;
  onPower?: () => void;
  onTranslate?: (lang: string) => void;
  onCheck?: () => void;
  onGoldenKey?: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  currentPage: number;
  totalPages: number;
  pageType?: PageType;
  activePageLabel?: string;
  isSimpleMode?: boolean;
}

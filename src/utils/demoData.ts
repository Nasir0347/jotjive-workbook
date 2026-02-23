import { Workbook, PageType, DeviceType } from '../types';

/**
 * Generate a sample workbook for testing without PDF files
 */
export function generateSampleWorkbook(): Workbook {
  return {
    id: 'SAMPLE01',
    coverImage: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Sample+Workbook',
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
        source: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Cover',
        allowWriting: false
      },
      {
        id: 'T-1',
        type: PageType.T,
        pageNumber: 1,
        source: 'https://via.placeholder.com/800x1000/f3f4f6/000000?text=Teaching+Page+1',
        allowWriting: true
      },
      {
        id: 'T-2',
        type: PageType.T,
        pageNumber: 2,
        source: 'https://via.placeholder.com/800x1000/f3f4f6/000000?text=Teaching+Page+2',
        allowWriting: true
      },
      {
        id: 'P-1',
        type: PageType.P,
        pageNumber: 3,
        source: 'https://via.placeholder.com/800x1000/e0f2fe/000000?text=Practice+Page',
        allowWriting: true
      },
      {
        id: 'Q-1',
        type: PageType.Q,
        pageNumber: 4,
        source: 'https://via.placeholder.com/800x1000/fef3c7/000000?text=Question+Page',
        allowWriting: true,
        relatedPage: 'A-1'
      },
      {
        id: 'A-1',
        type: PageType.A,
        pageNumber: 5,
        source: 'https://via.placeholder.com/800x1000/dcfce7/000000?text=Answer+Page',
        allowWriting: false
      },
      {
        id: 'G-1',
        type: PageType.G,
        pageNumber: 6,
        source: 'https://via.placeholder.com/800x1000/f3e8ff/000000?text=Game+Page',
        allowWriting: true
      }
    ]
  };
}

/**
 * Demo stroke data for testing redisplay functionality
 */
export function generateDemoStrokes() {
  return {
    'Q-1': [
      {
        points: [
          { x: 100, y: 200 },
          { x: 105, y: 198 },
          { x: 110, y: 195 },
          { x: 115, y: 193 },
          { x: 120, y: 190 }
        ],
        timestamp: Date.now(),
        tool: 'stylus' as const
      },
      {
        points: [
          { x: 130, y: 200 },
          { x: 130, y: 195 },
          { x: 130, y: 190 },
          { x: 130, y: 185 },
          { x: 130, y: 180 }
        ],
        timestamp: Date.now() + 1000,
        tool: 'stylus' as const
      }
    ]
  };
}

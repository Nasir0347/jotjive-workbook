# JotJive Interactive Workbook Shell

A React + TypeScript application for interactive handwriting workbooks with PDF rendering, stylus input, and session-based navigation.

## Features

- 📄 **PDF Rendering** - Renders workbook pages using PDF.js
- ✏️ **Stylus Input** - Handwriting capture with stylus-first support
- 🔄 **Q→A Navigation** - Question pages link to answer pages with handwriting redisplay
- 🧹 **Auto-Clear** - Back navigation clears handwriting from backed-over pages
- 💾 **Session-Only Storage** - No database persistence (in-memory only)
- 📱 **Responsive Design** - Optimized for tablets and smartphones

## Quick Start

### 1. Install Dependencies

```bash
cd jotjive-workbook
npm install
```

### 2. Add PDF Files

Place the workbook PDF files in `public/workbooks/JJ05SS02/`:
- `cover.png` - Cover image
- `T-2.pdf` - Teaching page 2
- `T-3.pdf` - Teaching page 3
- `Q-5.pdf` - Question page 5
- `A-6.pdf` - Answer page 6

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
jotjive-workbook/
├── src/
│   ├── components/
│   │   ├── Handwriting/
│   │   │   └── CanvasOverlay.tsx    # Handwriting canvas
│   │   ├── Navigation/
│   │   │   └── NavigationBar.tsx    # Next/Back controls
│   │   ├── PageRenderer/
│   │   │   └── PDFRenderer.tsx      # PDF.js integration
│   │   └── Pages/
│   │       ├── CoverPage.tsx        # Workbook cover
│   │       ├── TeachingPage.tsx     # T pages
│   │       ├── QuestionPage.tsx     # Q pages
│   │       └── AnswerPage.tsx       # A pages (redisplay)
│   ├── context/
│   │   └── SessionContext.tsx       # State management
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   └── App.tsx                      # Main application
└── public/workbooks/JJ05SS02/       # Workbook assets
```

## Page Types

| Type | Code | Description | Writing | Answer Display |
|------|------|-------------|---------|----------------|
| Cover | COVER | Workbook cover | No | No |
| Teaching | T | Content presentation | Optional | No |
| Practice | P | Writing practice | Required | No |
| Question | Q | Student answers | Required | No |
| Answer | A | Self-check | No | Yes (redisplay) |
| Game | G | Activities | Required | No |

## Navigation Behavior

### Q → A Flow
1. Student writes answer on Q page
2. Clicks "Next" → advances to A page
3. A page shows PDF with student's handwriting overlaid
4. Handwriting is preserved during forward navigation

### Back Navigation
1. Student clicks "Back" on A page
2. Handwriting on A page is cleared
3. Handwriting on related Q page is cleared
4. Student returns to Q page with empty canvas

## Configuration

Edit `src/App.tsx` to modify the workbook configuration:

```typescript
const WORKBOOK_CONFIG: Workbook = {
  id: 'JJ05SS02',
  pages: [
    {
      id: 'Q-5',
      type: PageType.Q,
      relatedPage: 'A-6',  // Links to answer page
      // ...
    },
    {
      id: 'A-6',
      type: PageType.A,
      // ...
    }
  ]
};
```

## Input Modes

The CanvasOverlay supports three modes:

- **write** - Accepts stylus input, renders strokes
- **read** - No input, no display (static content)
- **redisplay** - No input, shows saved strokes (answer pages)

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

Requires Pointer Events API support for stylus input.

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## License

© 2026 USA Bilingual, LLC. All Rights Reserved.

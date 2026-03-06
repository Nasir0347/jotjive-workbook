# 📚 JotJive Workbook

> A modern, interactive digital workbook application for kids with handwriting support, built with React, TypeScript, and Vite.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://jotjive-workbook.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/Nasir0347/jotjive-workbook)
[![License](https://img.shields.io/badge/license-proprietary-red)](https://www.jotjive.com)

## 🌟 Features

### 📖 Comprehensive Content Library
- **200+ Workbooks** across Grades 1-6
  - Language Arts (LA)
  - Mathematics (MA)
  - Science (SC)
  - Social Studies (SS)
- **Simple Mode Workbooks**
  - PreK Activities (18 workbooks)
  - Kindergarten Reading (18 workbooks)
  - Life Skills (3 workbooks)
  - French Kindergarten (13 workbooks)
  - French Advanced (15 workbooks)
  - Special Education (18 workbooks)
- **Flashcards**
  - Tablet format (FCT)
  - Phone format (FCP)

### ✍️ Advanced Handwriting System
- **Canvas-based handwriting** with pressure sensitivity
- **Stylus support** with palm rejection
- **Touch input** for finger writing
- **Eraser mode** for corrections
- **Session persistence** - handwriting saved across navigation
- **Q→A transfer** - Question answers automatically appear on Answer pages

### 🎯 Smart Page Detection
- **Automatic page type recognition**
  - T (Teaching) - Content presentation
  - P (Practice) - Writing exercises
  - Q (Question) - Student answers
  - A (Answer) - Self-check with redisplay
  - G (Game) - Interactive activities
- **Simple mode** - No detection for PreK/K content
- **Dynamic page labels** - Shows current page type and number

### 📱 Device-Optimized Experience
- **Workbooks**: Tablet/Desktop only (≥768px)
  - Shows "Tablet Required" message on phones
- **Tablet Flashcards**: Tablet/Desktop only (≥768px)
- **Phone Flashcards**: Landscape mode required
  - Shows "Rotate Your Device" prompt in portrait
- **Fully responsive** design for all screen sizes

### 🌍 Multi-Language Support
- **90+ language flags** included
- **Native Language (NL)** selector
- **Target Language (TL)** selector
- **Language dropdown** in navigation bar
- Support for bilingual learning

### 🎨 Modern UI/UX
- **Landing Page** - Welcome screen
- **Workbook Selector** - Filter by mode, category, grade, subject
- **Wrapper Screen** - JJ BeeHive branding
- **Cover Screen** - Catalog info and description
- **Interactive Pages** - PDF rendering with handwriting overlay
- **Smooth animations** and transitions
- **Animated backgrounds** with gradient effects

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser (Chrome 90+, Safari 14+, Firefox 88+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Nasir0347/jotjive-workbook.git

# Navigate to project
cd jotjive-workbook

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
jotjive-workbook/
├── public/
│   ├── covers/              # Cover images organized by category
│   │   ├── LA/              # Language Arts covers
│   │   ├── MA/              # Math covers
│   │   ├── SC/              # Science covers
│   │   ├── SS/              # Social Studies covers
│   │   ├── A/               # PreK covers
│   │   ├── R/               # Kindergarten covers
│   │   ├── L/               # Life Skills covers
│   │   ├── FR/              # French K covers
│   │   ├── FA/              # French Advanced covers
│   │   ├── SEA/             # Special Ed covers
│   │   ├── FCT/             # Flashcard Tablet covers
│   │   └── FCP/             # Flashcard Phone covers
│   ├── workbooks/           # PDF workbooks by category
│   │   ├── LA/              # Language Arts PDFs
│   │   ├── MA/              # Math PDFs
│   │   ├── SC/              # Science PDFs
│   │   ├── SS/              # Social Studies PDFs
│   │   ├── A/               # PreK PDFs
│   │   ├── R/               # Kindergarten PDFs
│   │   ├── L/               # Life Skills PDFs
│   │   ├── FR/              # French K PDFs
│   │   ├── FA/              # French Advanced PDFs
│   │   └── SEA/             # Special Ed PDFs
│   ├── flashcards/          # Flashcard PDFs
│   │   ├── tablet/          # Tablet flashcards
│   │   └── phone/           # Phone flashcards
│   ├── flags/               # 90+ language flag images
│   ├── logo.png             # JotJive logo
│   └── school-doodles.png   # Background pattern
├── src/
│   ├── components/
│   │   ├── Handwriting/
│   │   │   ├── CanvasOverlay.tsx      # Main handwriting canvas
│   │   │   └── InputSettings.tsx      # Stylus/touch settings
│   │   ├── Navigation/
│   │   │   └── NavigationBar.tsx      # Top/bottom navigation
│   │   ├── PageRenderer/
│   │   │   └── PDFRenderer.tsx        # PDF.js integration
│   │   ├── Pages/
│   │   │   ├── LandingPage.tsx        # Welcome screen
│   │   │   ├── WorkbookSelector.tsx   # Content selector
│   │   │   ├── WrapperScreen.tsx      # Branding screen
│   │   │   ├── CoverScreen.tsx        # Cover display
│   │   │   ├── CoverPage.tsx          # Workbook cover
│   │   │   ├── CategoryBadge.tsx      # Category labels
│   │   │   └── PageLabel.tsx          # Page type labels
│   │   ├── Language/
│   │   │   ├── LanguageDropdown.tsx   # Language selector
│   │   │   └── LanguageSelector.tsx   # Language picker
│   │   └── Layout/
│   │       ├── LandscapeOnly.tsx      # Landscape mode enforcer
│   │       └── TabletOnly.tsx         # Tablet mode enforcer
│   ├── config/
│   │   ├── workbookConfig.ts          # Workbook catalog
│   │   ├── flashcardConfig.ts         # Flashcard catalog
│   │   ├── languageConfig.ts          # Language definitions
│   │   └── categoryDetector.ts        # Category detection
│   ├── context/
│   │   └── SessionContext.tsx         # Global state management
│   ├── types/
│   │   └── index.ts                   # TypeScript definitions
│   ├── utils/
│   │   └── coverGenerator.ts          # Placeholder cover generator
│   ├── App.tsx                        # Main application
│   └── main.tsx                       # Entry point
├── vercel.json                        # Vercel deployment config
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── tailwind.config.js                 # Tailwind CSS config
└── vite.config.ts                     # Vite config
```

## 🎮 Usage Guide

### Selecting Content

1. **Choose Mode**
   - Workbooks (Grades 1-6, PreK, K, etc.)
   - Flashcard Tablet
   - Flashcard Phone

2. **Filter Content** (for workbooks)
   - Category: All, PreK, Kindergarten, Life Skills, French, Special Ed, Grades 1-6
   - Grade: 1, 2, 3, 4, 5, 6
   - Subject: Language Arts, Math, Science, Social Studies

3. **Click to Open**
   - Select any workbook or flashcard to begin

### Navigation Flow

```
Landing Page → Selector → Wrapper → Cover → Workbook Pages
```

1. **Landing Page**: Welcome screen with branding
2. **Selector**: Choose your content with filters
3. **Wrapper**: "JJ BeeHive Digital Workbooks for Kids"
4. **Cover**: View catalog number and description
5. **Pages**: Interactive content with handwriting

### Handwriting Features

- **Write**: Use stylus or finger to write on pages
- **Erase Mode**: Toggle eraser to remove strokes
- **Erase Page**: Clear current page handwriting
- **Erase Book**: Clear all handwriting in workbook
- **Auto-save**: Handwriting persists across navigation
- **Q→A Transfer**: Question answers appear on Answer pages

### Navigation Controls

- **Next**: Advance to next page
- **Back**: Return to previous page (clears handwriting)
- **Home**: Return to selector
- **Power**: Exit to landing page
- **Settings**: Configure input preferences

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 5** - Build tool and dev server
- **React Router v7** - Client-side routing

### Styling
- **Tailwind CSS** - Utility-first CSS
- **Font Awesome** - Icon library
- **Custom animations** - Smooth transitions

### PDF & Canvas
- **PDF.js** - PDF rendering engine
- **Canvas API** - Handwriting capture
- **Pointer Events** - Stylus and touch input

### Deployment
- **Vercel** - Hosting and CI/CD
- **GitHub** - Version control

## 📦 Workbook Catalog

### Full Mode (Grades 1-6)
**Format**: `JJ{Grade}{Subject}{Volume}`

- **Grades**: 01, 02, 03, 04, 05, 06
- **Subjects**: LA, MA, SC, SS
- **Volumes**: 01, 02, 03
- **Example**: JJ05SS02 (Grade 5, Social Studies, Volume 2)
- **Total**: 72 workbooks (6 grades × 4 subjects × 3 volumes)

### Simple Mode
**Format**: `JJ{Category}-{Number}`

| Category | Code | Count | Example |
|----------|------|-------|---------|
| PreK | A | 18 | JJA-01 to JJA-18 |
| Kindergarten | R | 18 | JJR-01 to JJR-18 |
| Life Skills | L | 3 | JJL-01 to JJL-03 |
| French K | JJFR | 13 | JJFR-01 to JJFR-18 (with gaps) |
| French Advanced | JJFA | 15 | JJFA-01 to JJFA-15 |
| Special Ed | JJSEA | 18 | JJSEA-01 to JJSEA-18 |

**Total Simple Mode**: 85 workbooks

### Flashcards
- **Tablet**: JJ05SC02-FCT, JJ05SS01-FCT, JJ05SS03-FCT
- **Phone**: JJ05SS02-FCP

**Grand Total**: 200+ educational resources

## 🌐 Deployment

### Live Production
**URL**: https://jotjive-workbook.vercel.app

### Deploy Your Own

#### Option 1: Vercel (Recommended)
1. Fork the repository
2. Go to https://vercel.com/new
3. Import your forked repository
4. Vercel auto-detects Vite settings
5. Click "Deploy"

#### Option 2: Vercel CLI
```bash
npm install -g vercel
cd jotjive-workbook
vercel --prod
```

#### Option 3: Other Platforms
```bash
npm run build
# Deploy the 'dist' folder to any static host
```

### Environment Variables
No environment variables required - works out of the box!

## 📱 Device Requirements

### Minimum Requirements
- **Workbooks**: Tablet or Desktop (min 768px width)
- **Tablet Flashcards**: Tablet or Desktop (min 768px width)
- **Phone Flashcards**: Phone in landscape orientation

### Recommended
- **Tablet**: iPad or Android tablet (10"+)
- **Stylus**: Apple Pencil or compatible stylus
- **Browser**: Chrome 90+, Safari 14+, Firefox 88+

### Features by Device
| Feature | Phone | Tablet | Desktop |
|---------|-------|--------|---------|
| Workbooks | ❌ | ✅ | ✅ |
| Tablet Flashcards | ❌ | ✅ | ✅ |
| Phone Flashcards | ✅ (landscape) | ✅ | ✅ |
| Stylus Input | ✅ | ✅ | ✅ |
| Touch Input | ✅ | ✅ | ✅ |
| Palm Rejection | ✅ | ✅ | ✅ |

## 🔧 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production (skips TypeScript check)
npm run build

# Build with TypeScript check
npm run build:check

# Preview production build
npm run preview
```

### Adding New Workbooks

1. **Add PDF**: Place in `public/workbooks/{CATEGORY}/`
2. **Add Cover**: Place in `public/covers/{CATEGORY}/`
3. **Update Config**: Edit `src/config/workbookConfig.ts`

Example:
```typescript
// Add to WORKBOOK_CATALOG
{
  id: 'JJ07LA01',
  cover: '/covers/LA/JJ07LA01C.png',
  pdf: '/workbooks/LA/JJ07LA01.pdf'
}
```

### Adding New Languages

1. **Add Flag**: Place in `public/flags/`
2. **Update Config**: Edit `src/config/languageConfig.ts`

Example:
```typescript
{
  code: 'SPA',
  name: 'Spanish',
  flag: '/flags/spain.png'
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

© 2026 JotJive, LLC. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

## 🔗 Links

- **Live Demo**: https://jotjive-workbook.vercel.app
- **GitHub**: https://github.com/Nasir0347/jotjive-workbook
- **Website**: https://www.JotJive.com
- **Support**: Contact via JotJive website

## 📞 Support

For technical support or questions:
- Visit: https://www.JotJive.com
- Email: support@jotjive.com

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- PDF rendering powered by PDF.js
- Icons by Font Awesome
- Deployed on Vercel

---

**Built with ❤️ by the JotJive Team**

*Empowering kids through interactive digital learning*

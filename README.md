# JotJive Workbook

A modern, interactive digital workbook application for kids with handwriting support, built with React, TypeScript, and Vite.

## 🌟 Features

### 📚 Multiple Content Types
- **Workbooks**: Grades 1-6 with subjects (Language Arts, Math, Science, Social Studies)
- **Simple Mode**: PreK, Kindergarten, Life Skills, French, Special Education
- **Flashcards**: Tablet and Phone formats

### ✍️ Handwriting Support
- Canvas-based handwriting with stylus and touch support
- Palm rejection for natural writing experience
- Eraser mode for corrections
- Save handwriting across sessions

### 🎯 Smart Page Detection
- Automatic page type detection (Teaching, Practice, Question, Answer, Game)
- Question-to-Answer page image transfer
- Simple mode for non-graded content

### 📱 Device Optimization
- **Workbooks**: Tablet/Desktop only (768px+)
- **Tablet Flashcards**: Tablet/Desktop only
- **Phone Flashcards**: Landscape mode required
- Fully responsive design

### 🌍 Multi-Language Support
- 90+ language flags
- Native and target language selection
- Language dropdown in navigation

### 🎨 Modern UI/UX
- Wrapper screen with branding
- Cover screen with catalog info
- Animated backgrounds
- Smooth transitions and animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nasir0347/jotjive-workbook.git

# Navigate to project directory
cd jotjive-workbook

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
jotjive-workbook/
├── public/
│   ├── covers/          # Workbook cover images by category
│   │   ├── LA/          # Language Arts
│   │   ├── MA/          # Math
│   │   ├── SC/          # Science
│   │   ├── SS/          # Social Studies
│   │   ├── A/           # PreK
│   │   ├── R/           # Kindergarten
│   │   ├── L/           # Life Skills
│   │   ├── FR/          # French Kindergarten
│   │   ├── FA/          # French Advanced
│   │   ├── SEA/         # Special Education
│   │   ├── FCT/         # Flashcard Tablet
│   │   └── FCP/         # Flashcard Phone
│   ├── workbooks/       # PDF workbooks by category
│   ├── flashcards/      # Flashcard PDFs
│   │   ├── tablet/
│   │   └── phone/
│   └── flags/           # Language flag images
├── src/
│   ├── components/
│   │   ├── Handwriting/ # Canvas and handwriting tools
│   │   ├── Navigation/  # Navigation bar
│   │   ├── Pages/       # Page components
│   │   ├── Language/    # Language selector
│   │   └── Layout/      # Layout components
│   ├── config/          # Configuration files
│   ├── context/         # React context
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
└── vercel.json          # Vercel deployment config
```

## 🎮 Usage

### Selecting Content
1. Choose **Mode**: Workbooks, Flashcard Tablet, or Flashcard Phone
2. Filter by **Category**, **Grade**, and **Subject** (for workbooks)
3. Click on a workbook/flashcard to open

### Navigation Flow
1. **Selector** → Choose your content
2. **Wrapper** → Branding screen
3. **Cover** → View workbook details
4. **Pages** → Interactive content with handwriting

### Handwriting
- Use stylus or finger to write on pages
- Toggle eraser mode to erase strokes
- Erase single page or entire workbook
- Handwriting persists across page navigation

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **PDF Rendering**: PDF.js
- **Routing**: React Router v7
- **Icons**: Font Awesome
- **Deployment**: Vercel

## 📦 Workbook Catalog

### Full Mode (Grades 1-6)
- **Grades**: 1, 2, 3, 4, 5, 6
- **Subjects**: LA (Language Arts), MA (Math), SC (Science), SS (Social Studies)
- **Volumes**: 01, 02, 03
- **Format**: JJ{Grade}{Subject}{Volume} (e.g., JJ05SS02)

### Simple Mode
- **PreK (A)**: JJA-01 to JJA-18
- **Kindergarten (R)**: JJR-01 to JJR-18
- **Life Skills (L)**: JJL-01 to JJL-03
- **French K (JJFR)**: JJFR-01 to JJFR-18
- **French Advanced (JJFA)**: JJFA-01 to JJFA-15
- **Special Ed (JJSEA)**: JJSEA-01 to JJSEA-18

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

The app will be live at `https://your-project.vercel.app`

## 📱 Device Requirements

- **Workbooks**: Tablet or Desktop (min 768px width)
- **Tablet Flashcards**: Tablet or Desktop (min 768px width)
- **Phone Flashcards**: Phone in landscape mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

© 2026 JotJive, LLC. All rights reserved.

## 🔗 Links

- **Website**: [www.JotJive.com](https://www.JotJive.com)
- **Repository**: [github.com/Nasir0347/jotjive-workbook](https://github.com/Nasir0347/jotjive-workbook)

---

Built with ❤️ by the JotJive team

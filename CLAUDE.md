# JotJive Workbook - Claude Code Context

## Project Overview
A modern interactive digital workbook app for kids with handwriting support.
- **Repo**: https://github.com/Nasir0347/jotjive-workbook
- **Live Demo**: https://jotjive-workbook.vercel.app
- **Branch**: claude/general-session-0Pwpn

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v7
- PDF.js for workbook rendering
- FontAwesome icons

## Key Features
- 200+ Workbooks across Grades 1-6 (Language Arts, Math, Science, Social Studies)
- Simple Mode: PreK, Kindergarten, Life Skills, French, Special Education
- Flashcards (tablet + phone formats)
- Canvas-based handwriting with stylus/touch support, palm rejection
- Smart page type detection: T (Teaching), P (Practice), Q (Question), A (Answer), G (Game)
- Device-optimized: workbooks tablet/desktop only (≥768px)

## Dev Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
```

## Project Structure
- `src/` - Main source code
- `public/` - Static assets
- `docs/` - Documentation
- `scripts/` - Build/utility scripts

## Notes
- Use `/clear` or `/compact` if conversation gets too long
- Always develop on branch: `claude/general-session-0Pwpn`
- Deploy target: Vercel

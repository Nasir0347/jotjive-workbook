# JotJive Deployment Guide

## Development Setup

### 1. Quick Start

```bash
# Navigate to project
cd jotjive-workbook

# Run setup script
./setup.sh

# Or manually:
npm install
npm run dev
```

### 2. Adding Workbook Content

Place PDF files in `public/workbooks/JJ05SS02/`:

```
public/workbooks/JJ05SS02/
├── config.json      # Workbook configuration
├── cover.png        # Cover image
├── T-2.pdf         # Teaching page
├── T-3.pdf         # Teaching page
├── P-4.pdf         # Practice page
├── Q-5.pdf         # Question page
├── A-6.pdf         # Answer page
└── G-7.pdf         # Game page
```

### 3. Configuration

Edit `src/App.tsx` to modify page structure:

```typescript
const WORKBOOK_CONFIG: Workbook = {
  id: 'JJ05SS02',
  pages: [
    {
      id: 'Q-5',
      type: PageType.Q,
      relatedPage: 'A-6',  // Links to answer
      allowWriting: true
    },
    {
      id: 'A-6', 
      type: PageType.A,
      allowWriting: false
    }
  ]
};
```

## Building for Production

### Build

```bash
npm run build
```

Output goes to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment Options

### Option 1: Static Hosting (Recommended)

Deploy `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` to deploy
- **GitHub Pages**: Use `gh-pages` branch
- **AWS S3**: Sync `dist/` to S3 bucket
- **Firebase**: `firebase deploy`

### Option 2: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Option 3: Embedded in LMS

Build and embed as iframe:

```html
<iframe 
  src="https://your-domain.com/jotjive/"
  width="100%"
  height="800px"
  style="border: none;"
  allow="pointer-lock"
>
</iframe>
```

## Environment Variables

Create `.env` file for configuration:

```env
# API endpoint (for future database integration)
VITE_API_URL=https://api.example.com

# Workbook ID
VITE_WORKBOOK_ID=JJ05SS02

# Feature flags
VITE_ENABLE_STYLUS_ONLY=true
VITE_ENABLE_FINGER=false
```

## Performance Optimization

### PDF Loading

1. **Preload critical pages**:
```html
<link rel="preload" href="/workbooks/JJ05SS02/T-2.pdf" as="fetch">
```

2. **Optimize PDFs**: Compress PDFs before deployment

3. **Lazy loading**: Load pages on-demand (implemented)

### Canvas Performance

- Strokes are rendered incrementally
- Canvas is cleared on navigation
- No persistent storage (memory only)

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Chrome Android | 90+ | ✅ Full |

**Required APIs:**
- Pointer Events API (stylus support)
- Canvas 2D Context
- ES2020+ JavaScript

## Testing Checklist

Before deployment, verify:

- [ ] Cover page loads and displays
- [ ] Navigation Next/Back works
- [ ] PDF renders correctly
- [ ] Stylus input works (or finger fallback)
- [ ] Handwriting appears on canvas
- [ ] Clear button works
- [ ] Q→A navigation preserves writing
- [ ] A→Q back clears writing
- [ ] Progress bar updates
- [ ] Page indicators show correct type
- [ ] No console errors
- [ ] Mobile responsive

## Troubleshooting

### PDF Not Loading

1. Check file path in config
2. Verify CORS headers (if external)
3. Check PDF.js worker is loaded

### Stylus Not Working

1. Check `pointerType` in dev tools
2. Verify device supports Pointer Events
3. Check `allowFinger` setting

### Canvas Misaligned

1. Verify PDF and canvas dimensions match
2. Check CSS positioning
3. Ensure no transform scaling

## Security Considerations

- No user data is stored (session-only)
- No cookies or localStorage used
- PDFs should be from trusted sources
- Consider CSP headers:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline';
  connect-src 'self';
  img-src 'self' data: blob:;
```

## Support

For issues or questions:
- Technical Design: See `01-Technical-Design-Document.md`
- Component Architecture: See `02-Component-Architecture.md`
- Implementation Plan: See `03-Phase1-Implementation-Plan.md`

// ============================================
// COVER IMAGE GENERATOR
// ============================================
// Generates placeholder cover images for workbooks when actual cover is missing
// ============================================

interface CoverConfig {
  id: string;
  subject?: string;
  grade?: string;
  category?: string;
}

// Subject color schemes matching CategoryBadge
const SUBJECT_COLORS: Record<string, { from: string; to: string; text: string }> = {
  LA: { from: '#10b981', to: '#059669', text: '#ffffff' }, // Green
  MA: { from: '#f59e0b', to: '#d97706', text: '#ffffff' }, // Orange
  SC: { from: '#8b5cf6', to: '#7c3aed', text: '#ffffff' }, // Purple
  SS: { from: '#ef4444', to: '#dc2626', text: '#ffffff' }, // Red
  A: { from: '#ec4899', to: '#db2777', text: '#ffffff' }, // Pink (PreK)
  R: { from: '#06b6d4', to: '#0891b2', text: '#ffffff' }, // Cyan (Kindergarten)
  L: { from: '#14b8a6', to: '#0d9488', text: '#ffffff' }, // Teal (Life Skills)
  JJFR: { from: '#6366f1', to: '#4f46e5', text: '#ffffff' }, // Indigo (French K)
  JJFA: { from: '#8b5cf6', to: '#7c3aed', text: '#ffffff' }, // Purple (French Adv)
  JJSEA: { from: '#f97316', to: '#ea580c', text: '#ffffff' }, // Orange (Special Ed)
};

const SUBJECT_NAMES: Record<string, string> = {
  LA: 'Language Arts',
  MA: 'Math',
  SC: 'Science',
  SS: 'Social Studies',
  A: 'PreK Activities',
  R: 'Kindergarten',
  L: 'Life Skills',
  JJFR: 'French K',
  JJFA: 'French Advanced',
  JJSEA: 'Special Education',
};

/**
 * Generate SVG placeholder cover for a workbook
 */
export function generateCoverSVG(config: CoverConfig): string {
  const { id, subject, grade, category } = config;

  // Determine color scheme
  const colorKey = subject || category || 'LA';
  const colors = SUBJECT_COLORS[colorKey] || SUBJECT_COLORS.LA;
  const subjectName = SUBJECT_NAMES[colorKey] || colorKey;

  // Parse grade from ID if not provided
  const gradeMatch = id.match(/^JJ(\d{2})/);
  const gradeNum = grade || (gradeMatch ? gradeMatch[1] : '');
  const gradeText = gradeNum ? `Grade ${parseInt(gradeNum)}` : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
      <defs>
        <linearGradient id="grad-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.to};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="300" height="400" fill="url(#grad-${id})"/>

      <!-- Decorative pattern -->
      <circle cx="250" cy="50" r="80" fill="white" opacity="0.1"/>
      <circle cx="50" cy="350" r="60" fill="white" opacity="0.1"/>

      <!-- Content -->
      <text x="150" y="180" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${colors.text}" text-anchor="middle">
        ${id}
      </text>

      <text x="150" y="220" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="${colors.text}" text-anchor="middle" opacity="0.9">
        ${subjectName}
      </text>

      ${gradeText ? `
      <text x="150" y="250" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="${colors.text}" text-anchor="middle" opacity="0.8">
        ${gradeText}
      </text>
      ` : ''}

      <!-- Book icon -->
      <path d="M 130 280 L 130 320 L 170 320 L 170 280 Z M 135 285 L 135 315 L 165 315 L 165 285 Z M 150 290 L 150 310"
            stroke="${colors.text}" stroke-width="2" fill="none" opacity="0.6"/>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Parse workbook ID to extract subject and grade
 */
export function parseWorkbookId(id: string): { subject?: string; grade?: string; category?: string } {
  // Full mode: JJ05SC02 → Grade 05, Subject SC
  const fullMatch = id.match(/^JJ(\d{2})([A-Z]{2})(\d{2})$/);
  if (fullMatch) {
    return {
      grade: fullMatch[1],
      subject: fullMatch[2],
    };
  }

  // Simple mode: JJA-01, JJR-01, etc.
  const simpleMatch = id.match(/^(JJ[A-Z]+)-\d+$/);
  if (simpleMatch) {
    const prefix = simpleMatch[1];
    // Extract category code
    const categoryCode = prefix.replace('JJ', '');
    return {
      category: categoryCode.length <= 4 ? categoryCode : prefix,
    };
  }

  return {};
}

/**
 * Generate placeholder cover for a workbook ID
 */
export function generatePlaceholderCover(workbookId: string): string {
  const parsed = parseWorkbookId(workbookId);
  return generateCoverSVG({
    id: workbookId,
    ...parsed,
  });
}

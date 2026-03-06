// ============================================
// CATEGORY DETECTOR
// ============================================
// Detects workbook category and mode from workbook ID
// ============================================

export interface CategoryInfo {
  code: string;
  name: string;
  mode: 'FULL' | 'SIMPLE';
  grade?: string;
}

/**
 * Detects the category and mode for a workbook ID
 *
 * SIMPLE MODE categories:
 * - JJFR-* → French Kindergarten
 * - JJFA-* → French Advanced
 * - JJSEA-* → Special Education
 * - JJA-* → PreK
 * - JJR-* → Kindergarten
 * - JJL-* → Life Skills
 *
 * FULL MODE categories:
 * - JJ01* - JJ06* → Grades 1-6
 */
export function detectCategory(workbookId: string): CategoryInfo | null {
  if (!workbookId) return null;

  // SIMPLE MODE detection (check these FIRST)
  if (workbookId.startsWith('JJFR-')) {
    return { code: 'JJFR', name: 'French Kindergarten', mode: 'SIMPLE' };
  }
  if (workbookId.startsWith('JJFA-')) {
    return { code: 'JJFA', name: 'French Advanced', mode: 'SIMPLE' };
  }
  if (workbookId.startsWith('JJSEA-')) {
    return { code: 'JJSEA', name: 'Special Education', mode: 'SIMPLE' };
  }
  if (workbookId.startsWith('JJA-')) {
    return { code: 'A', name: 'PreK', mode: 'SIMPLE' };
  }
  if (workbookId.startsWith('JJR-')) {
    return { code: 'R', name: 'Kindergarten', mode: 'SIMPLE' };
  }
  if (workbookId.startsWith('JJL-')) {
    return { code: 'L', name: 'Life Skills', mode: 'SIMPLE' };
  }

  // FULL MODE detection (existing JJ01-JJ06 logic)
  const match = workbookId.match(/^JJ(0[1-6])/);
  if (match) {
    const gradeNum = parseInt(match[1]);
    return {
      code: match[1],
      name: `Grade ${gradeNum}`,
      mode: 'FULL',
      grade: match[1]
    };
  }

  return null;
}

/**
 * Checks if a workbook ID is simple mode
 */
export function isSimpleMode(workbookId: string): boolean {
  const category = detectCategory(workbookId);
  return category?.mode === 'SIMPLE';
}

/**
 * Checks if a workbook ID is full mode
 */
export function isFullMode(workbookId: string): boolean {
  const category = detectCategory(workbookId);
  return category?.mode === 'FULL';
}

/**
 * Get display name for category filter
 */
export function getCategoryDisplayName(code: string): string {
  switch (code) {
    case 'A': return 'PreK';
    case 'R': return 'Kindergarten';
    case 'L': return 'Life Skills';
    case 'JJFR': return 'French K';
    case 'JJFA': return 'French Advanced';
    case 'JJSEA': return 'Special Ed';
    default: return code;
  }
}

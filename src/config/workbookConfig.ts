// ============================================
// WORKBOOK CATALOG CONFIG
// ============================================
// Supports both FULL mode (Grades 1-6) and SIMPLE mode (PreK, K, Life Skills, etc.)
//
// FULL MODE: JJ01-JJ06 with LA, MA, SC, SS subjects, volumes 01-03
// SIMPLE MODE: A (PreK), R (Kindergarten), L (Life Skills), JJFR (French K), JJSEA (Special Ed)
// ============================================

export interface WorkbookEntry {
    id: string;
    cover: string;
    pdf: string;
}

// ============================================
// FULL MODE (Grades 1-6) - Existing logic unchanged
// ============================================
const grades = ['01', '02', '03', '04', '05', '06'];
const subjects = ['LA', 'MA', 'SC', 'SS'];
const volumes = ['01', '02', '03'];

const FULL_MODE_CATALOG: WorkbookEntry[] = grades.flatMap(grade =>
    subjects.flatMap(subject =>
        volumes.map(volume => {
            const id = `JJ${grade}${subject}${volume}`;
            return {
                id,
                cover: `/covers/${subject}/${id}C.png`,
                pdf: `/workbooks/${subject}/${id}.pdf`,
            };
        })
    )
);

// ============================================
// SIMPLE MODE (PreK, K, Life Skills, French K, Special Ed)
// ============================================
// Simple mode workbooks: no page type detection, pages display as-is
// Pattern: JJ{category}-{volume}.pdf
// ============================================

const SIMPLE_MODE_CATALOG: WorkbookEntry[] = [
    // PreK (A) - JJA-01 to JJA-18
    ...Array.from({ length: 18 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: `JJA-${num}`,
            cover: `/covers/A/JJA-${num}C.png`,
            pdf: `/workbooks/A/JJA-${num}.pdf`
        };
    }),
    // Kindergarten (R) - JJR-01 to JJR-18
    ...Array.from({ length: 18 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: `JJR-${num}`,
            cover: `/covers/R/JJR-${num}C.png`,
            pdf: `/workbooks/R/JJR-${num}.pdf`
        };
    }),
    // Life Skills (L) - JJL-01 to JJL-03
    ...Array.from({ length: 3 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: `JJL-${num}`,
            cover: `/covers/L/JJL-${num}C.png`,
            pdf: `/workbooks/L/JJL-${num}.pdf`
        };
    }),
    // French Kindergarten (JJFR) - JJFR-01 to JJFR-18 (with gaps)
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 16, 17, 18].map(i => {
        const num = String(i).padStart(2, '0');
        return {
            id: `JJFR-${num}`,
            cover: `/covers/FR/JJFR-${num}C.png`,
            pdf: `/workbooks/FR/JJFR-${num}.pdf`
        };
    }),
    // French Advanced (JJFA) - JJFA-01 to JJFA-15
    ...Array.from({ length: 15 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: `JJFA-${num}`,
            cover: `/covers/FA/JJFA-${num}C.png`,
            pdf: `/workbooks/FA/JJFA-${num}.pdf`
        };
    }),
    // Special Education (JJSEA) - JJSEA-01 to JJSEA-18
    ...Array.from({ length: 18 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return {
            id: `JJSEA-${num}`,
            cover: `/covers/SEA/JJSEA-${num}C.png`,
            pdf: `/workbooks/SEA/JJSEA-${num}.pdf`
        };
    })
];

// ============================================
// COMBINED CATALOG
// ============================================
export const WORKBOOK_CATALOG: WorkbookEntry[] = [
    ...FULL_MODE_CATALOG,
    ...SIMPLE_MODE_CATALOG
];

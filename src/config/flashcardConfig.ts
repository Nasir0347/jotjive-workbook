// ============================================
// FLASHCARD CATALOG CONFIG
// ============================================
// Flashcards are simple PDFs without TPQ logic
// Just display pages as-is with handwriting support
// ============================================

export interface FlashcardEntry {
    id: string;
    cover: string;
    pdf: string;
    mode: 'tablet' | 'phone';
}

// ============================================
// TABLET FLASHCARDS
// ============================================
const TABLET_FLASHCARDS: FlashcardEntry[] = [
    { id: 'JJ05SC02-FCT', cover: '/covers/FCT/JJ05SC02-FCT.png', pdf: '/flashcards/tablet/JJ05SC02-FCT.pdf', mode: 'tablet' },
    { id: 'JJ05SS01-FCT', cover: '/covers/FCT/JJ05SS01-FCT.png', pdf: '/flashcards/tablet/JJ05SS01-FCT.pdf', mode: 'tablet' },
    { id: 'JJ05SS03-FCT', cover: '/covers/FCT/JJ05SS03-FCT.png', pdf: '/flashcards/tablet/JJ05SS03-FCT.pdf', mode: 'tablet' },
];

// ============================================
// PHONE FLASHCARDS
// ============================================
const PHONE_FLASHCARDS: FlashcardEntry[] = [
    { id: 'JJ05SS02-FCP', cover: '/covers/FCP/JJ05SS02-FCP.png', pdf: '/flashcards/phone/JJ05SS02-FCP.pdf', mode: 'phone' },
];

// ============================================
// COMBINED CATALOG
// ============================================
export const FLASHCARD_CATALOG = {
    tablet: TABLET_FLASHCARDS,
    phone: PHONE_FLASHCARDS,
    all: [...TABLET_FLASHCARDS, ...PHONE_FLASHCARDS]
};

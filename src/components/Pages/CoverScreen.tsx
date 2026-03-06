import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WORKBOOK_CATALOG } from '../../config/workbookConfig';
import { FLASHCARD_CATALOG } from '../../config/flashcardConfig';
import { generatePlaceholderCover } from '../../utils/coverGenerator';

export const CoverScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [coverData, setCoverData] = useState<{ cover: string; catalogNumber: string; description: string } | null>(null);

    useEffect(() => {
        if (!id) return;

        // Find in workbook catalog
        const workbook = WORKBOOK_CATALOG.find(wb => wb.id === id);
        if (workbook) {
            setCoverData({
                cover: workbook.cover,
                catalogNumber: id,
                description: getWorkbookDescription(id)
            });
            return;
        }

        // Find in flashcard catalog
        const flashcard = FLASHCARD_CATALOG.all.find(fc => fc.id === id);
        if (flashcard) {
            setCoverData({
                cover: flashcard.cover,
                catalogNumber: id,
                description: getFlashcardDescription(id)
            });
        }
    }, [id]);

    const handleBack = () => {
        navigate(`/workbook/${id}/wrapper`);
    };

    const handleStart = () => {
        navigate(`/workbook/${id}/viewer`);
    };

    if (!coverData) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] chalkboard-hero font-sans relative overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-saas-blue/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-pink-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
                {/* Cover Card */}
                <div className="bg-white/95 backdrop-blur-lg border-2 border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl w-full animate-in zoom-in duration-700">
                    {/* Catalog Number Badge - Centered at top */}
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="bg-gradient-to-r from-saas-blue to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base md:text-lg tracking-wider shadow-lg">
                            {coverData.catalogNumber}
                        </div>
                    </div>

                    {/* Cover Image - Centered and Responsive */}
                    <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md md:max-w-lg mx-auto aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 mb-4 sm:mb-6 shadow-2xl ring-2 sm:ring-4 ring-white/50 transform hover:scale-[1.02] transition-transform duration-300">
                        <img
                            src={coverData.cover}
                            alt={`${coverData.catalogNumber} cover`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = generatePlaceholderCover(coverData.catalogNumber);
                            }}
                        />
                    </div>

                    {/* Description Box - Centered */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 shadow-inner">
                        <p className="text-slate-800 text-sm sm:text-base md:text-lg font-bold text-center leading-relaxed">
                            {coverData.description}
                        </p>
                    </div>

                    {/* Copyright - Centered */}
                    <div className="text-center text-slate-500 text-xs sm:text-sm font-semibold">
                        © {new Date().getFullYear()} JotJive. All rights reserved.
                    </div>
                </div>

                {/* Action Buttons - Centered below card */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full max-w-md mt-6 sm:mt-8 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '200ms' }}>
                    <button
                        onClick={handleBack}
                        className="w-full sm:flex-1 px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/95 text-slate-700 border-2 border-white/50 hover:bg-white hover:border-saas-blue hover:text-saas-blue hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg font-black tracking-widest uppercase active:scale-95 shadow-xl backdrop-blur-lg"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleStart}
                        className="w-full sm:flex-1 px-5 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-saas-blue to-blue-600 text-white border-2 border-saas-blue hover:from-blue-600 hover:to-saas-blue hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg font-black tracking-widest uppercase active:scale-95 shadow-2xl"
                    >
                        Start →
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function to get workbook description
function getWorkbookDescription(id: string): string {
    const subjectNames: Record<string, string> = {
        'LA': 'Language Arts',
        'MA': 'Mathematics',
        'SC': 'Science',
        'SS': 'Social Studies'
    };

    const categoryNames: Record<string, string> = {
        'A': 'PreK Activities',
        'R': 'Kindergarten Reading',
        'L': 'Life Skills',
        'JJFR': 'French Kindergarten',
        'JJFA': 'French Advanced',
        'JJSEA': 'Special Education'
    };

    // Parse grade-based workbooks (JJ01LA01)
    const gradeMatch = id.match(/^JJ(\d{2})([A-Z]{2})(\d{2})$/);
    if (gradeMatch) {
        const grade = parseInt(gradeMatch[1]);
        const subject = gradeMatch[2];
        const volume = parseInt(gradeMatch[3]);
        return `Grade ${grade} ${subjectNames[subject] || subject} - Volume ${volume}`;
    }

    // Parse simple mode workbooks (JJA-01, JJR-01, etc.)
    const simpleMatch = id.match(/^JJ([A-Z]+)-(\d{2})$/);
    if (simpleMatch) {
        const category = simpleMatch[1];
        const volume = parseInt(simpleMatch[2]);
        return `${categoryNames[category] || category} - Volume ${volume}`;
    }

    return `Interactive Digital Workbook - ${id}`;
}

// Helper function to get flashcard description
function getFlashcardDescription(id: string): string {
    if (id.includes('FCT')) {
        return `Flashcard Set for Tablet - ${id}`;
    }
    if (id.includes('FCP')) {
        return `Flashcard Set for Phone - ${id}`;
    }
    return `Flashcard Set - ${id}`;
}

export default CoverScreen;

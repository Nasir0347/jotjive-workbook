import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WORKBOOK_CATALOG } from '../../config/workbookConfig';
import { FLASHCARD_CATALOG } from '../../config/flashcardConfig';
import { detectCategory } from '../../config/categoryDetector';
import { CategoryBadge } from './CategoryBadge';
import { generatePlaceholderCover } from '../../utils/coverGenerator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faGraduationCap, faBook, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../../context/SessionContext';

export const WorkbookSelector: React.FC = () => {
    const navigate = useNavigate();
    const { setContentMode } = useSession();
    const [mode, setMode] = useState<'workbook' | 'flashcard-tablet' | 'flashcard-phone'>('workbook');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [gradeFilter, setGradeFilter] = useState<string>('all');
    const [subjectFilter, setSubjectFilter] = useState<string>('all');

    // Category filter options
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'PREK', label: 'PreK (Simple)' },
        { value: 'KINDERGARTEN', label: 'Kindergarten (Simple)' },
        { value: 'LIFE_SKILLS', label: 'Life Skills (Simple)' },
        { value: 'FRENCH_K', label: 'French K (Simple)' },
        { value: 'FRENCH_ADV', label: 'French Advanced (Simple)' },
        { value: 'SPECIAL_ED', label: 'Special Ed (Simple)' },
        { value: 'GRADES_1_6', label: 'Grades 1-6 (Full)' },
    ];

    // Filter workbooks based on selected filters
    const filteredWorkbooks = useMemo(() => {
        // For flashcard modes, return flashcard catalog
        if (mode === 'flashcard-tablet') {
            return FLASHCARD_CATALOG.tablet.map(fc => ({
                id: fc.id,
                cover: fc.cover,
                pdf: fc.pdf
            }));
        }
        if (mode === 'flashcard-phone') {
            return FLASHCARD_CATALOG.phone.map(fc => ({
                id: fc.id,
                cover: fc.cover,
                pdf: fc.pdf
            }));
        }

        // For workbook mode, use existing filter logic
        return WORKBOOK_CATALOG.filter(wb => {
            const category = detectCategory(wb.id);
            if (!category) return false;

            // Category filter
            let categoryMatch = true;
            if (categoryFilter === 'PREK') {
                categoryMatch = category.code === 'A';
            } else if (categoryFilter === 'KINDERGARTEN') {
                categoryMatch = category.code === 'R';
            } else if (categoryFilter === 'LIFE_SKILLS') {
                categoryMatch = category.code === 'L';
            } else if (categoryFilter === 'FRENCH_K') {
                categoryMatch = category.code === 'JJFR';
            } else if (categoryFilter === 'FRENCH_ADV') {
                categoryMatch = category.code === 'JJFA';
            } else if (categoryFilter === 'SPECIAL_ED') {
                categoryMatch = category.code === 'JJSEA';
            } else if (categoryFilter === 'GRADES_1_6') {
                categoryMatch = category.mode === 'FULL';
            }

            // Grade/Subject filters (only apply to FULL mode)
            if (category.mode === 'FULL') {
                const parsed = parseWorkbookId(wb.id);
                if (!parsed) return false;

                const gradeMatch = gradeFilter === 'all' || parsed.grade === gradeFilter;
                const subjectMatch = subjectFilter === 'all' || parsed.subject === subjectFilter;

                return categoryMatch && gradeMatch && subjectMatch;
            }

            // Simple mode: only category filter applies
            return categoryMatch;
        });
    }, [mode, categoryFilter, gradeFilter, subjectFilter]);

    const clearFilters = () => {
        setCategoryFilter('all');
        setGradeFilter('all');
        setSubjectFilter('all');
    };

    const handleItemClick = (id: string) => {
        setContentMode(mode);
        navigate(`/workbook/${id}/wrapper`);
    };

    return (
        <div className="min-h-[100dvh] chalkboard-hero font-sans relative overflow-x-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-saas-blue/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
                {/* Header */}
                <div className="mb-8 sm:mb-12 md:mb-16 text-center">
                    <img
                        src="/logo.png"
                        alt="JotJive Logo"
                        className="w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-2xl mx-auto mb-6 animate-in zoom-in duration-700"
                    />
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-lg animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '100ms' }}>
                        Choose Your Workbook
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base md:text-lg font-semibold animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '200ms' }}>
                        Select a workbook to start your learning journey
                    </p>
                </div>

                {/* Filter Section */}
                <div className="w-full max-w-6xl mb-8 sm:mb-10 md:mb-12 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '300ms' }}>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end justify-center bg-white/95 backdrop-blur-lg border-2 border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl">
                        {/* Mode Filter */}
                        <div className="flex-1 min-w-0">
                            <label className="block text-slate-700 text-xs sm:text-sm font-black mb-2 uppercase tracking-wider">
                                <FontAwesomeIcon icon={faRectangleList} className="mr-2" />
                                Mode
                            </label>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as any)}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-saas-blue focus:border-saas-blue transition-all cursor-pointer shadow-sm hover:border-saas-blue/50"
                            >
                                <option value="workbook">Workbooks</option>
                                <option value="flashcard-tablet">Flashcard Tablet</option>
                                <option value="flashcard-phone">Flashcard Phone</option>
                            </select>
                        </div>

                        {/* Category Filter - Only for workbooks */}
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${mode === 'workbook' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <label className="block text-slate-700 text-xs sm:text-sm font-black mb-2 uppercase tracking-wider">
                                <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                                Category
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                disabled={mode !== 'workbook'}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-saas-blue focus:border-saas-blue transition-all cursor-pointer shadow-sm hover:border-saas-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {categoryOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Grade Filter (only for Grades 1-6) */}
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${mode === 'workbook' && (categoryFilter === 'GRADES_1_6' || categoryFilter === 'all') ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <label className="block text-slate-700 text-xs sm:text-sm font-black mb-2 uppercase tracking-wider">
                                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                                Grade
                            </label>
                            <select
                                value={gradeFilter}
                                onChange={(e) => setGradeFilter(e.target.value)}
                                disabled={mode !== 'workbook' || (categoryFilter !== 'all' && categoryFilter !== 'GRADES_1_6')}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-saas-blue focus:border-saas-blue transition-all cursor-pointer shadow-sm hover:border-saas-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Grades</option>
                                <option value="01">Grade 1</option>
                                <option value="02">Grade 2</option>
                                <option value="03">Grade 3</option>
                                <option value="04">Grade 4</option>
                                <option value="05">Grade 5</option>
                                <option value="06">Grade 6</option>
                            </select>
                        </div>

                        {/* Subject Filter (only for Grades 1-6) */}
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${mode === 'workbook' && (categoryFilter === 'GRADES_1_6' || categoryFilter === 'all') ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <label className="block text-slate-700 text-xs sm:text-sm font-black mb-2 uppercase tracking-wider">
                                <FontAwesomeIcon icon={faBook} className="mr-2" />
                                Subject
                            </label>
                            <select
                                value={subjectFilter}
                                onChange={(e) => setSubjectFilter(e.target.value)}
                                disabled={mode !== 'workbook' || (categoryFilter !== 'all' && categoryFilter !== 'GRADES_1_6')}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-saas-blue focus:border-saas-blue transition-all cursor-pointer shadow-sm hover:border-saas-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="all">All Subjects</option>
                                <option value="LA">Language Arts</option>
                                <option value="MA">Math</option>
                                <option value="SC">Science</option>
                                <option value="SS">Social Studies</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="sm:flex-shrink-0">
                            <label className="hidden sm:block text-transparent text-xs sm:text-sm font-black mb-2 uppercase tracking-wider select-none">.</label>
                            <button
                                onClick={clearFilters}
                                disabled={categoryFilter === 'all' && gradeFilter === 'all' && subjectFilter === 'all'}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm sm:text-base hover:bg-slate-50 hover:border-red-400 hover:text-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                            >
                                ✕ Clear
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-center mt-4 sm:mt-5">
                        <div className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border-2 border-white/50">
                            <span className="text-slate-800 text-sm sm:text-base font-black">
                                {filteredWorkbooks.length} {mode === 'workbook' ? (filteredWorkbooks.length === 1 ? 'Workbook' : 'Workbooks') : (filteredWorkbooks.length === 1 ? 'Flashcard' : 'Flashcards')} Found
                            </span>
                        </div>
                    </div>
                </div>

                {/* Workbook Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-6xl">
                    {filteredWorkbooks.map((wb) => {
                        const category = mode === 'workbook' ? detectCategory(wb.id) : null;
                        return (
                            <button
                                key={wb.id}
                                onClick={() => handleItemClick(wb.id)}
                                className="group flex flex-col items-center bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 hover:bg-white hover:border-saas-blue/50 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                {/* Cover Image */}
                                <div className="w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 mb-4 shadow-xl group-hover:shadow-2xl transition-shadow ring-2 ring-slate-200 group-hover:ring-saas-blue">
                                    <img
                                        src={wb.cover}
                                        alt={`${wb.id} cover`}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = generatePlaceholderCover(wb.id);
                                        }}
                                    />
                                </div>

                                {/* Category Badge - Only for workbooks */}
                                {category && mode === 'workbook' && (
                                    <div className="mb-2">
                                        <CategoryBadge workbookId={wb.id} size="sm" />
                                    </div>
                                )}

                                {/* Workbook ID Label */}
                                <span className="text-slate-900 text-sm sm:text-base md:text-lg font-black tracking-wider uppercase mb-1">
                                    {wb.id}
                                </span>

                                {/* Subject Name */}
                                {mode === 'workbook' && (() => {
                                    const parsed = parseWorkbookId(wb.id);
                                    if (parsed) {
                                        const subjectNames: Record<string, string> = {
                                            'LA': 'Language Arts',
                                            'MA': 'Math',
                                            'SC': 'Science',
                                            'SS': 'Social Studies'
                                        };
                                        return (
                                            <span className="text-slate-600 text-xs sm:text-sm font-semibold">
                                                {subjectNames[parsed.subject] || parsed.subject}
                                            </span>
                                        );
                                    }
                                    // For simple mode workbooks, show category name
                                    if (category) {
                                        const simpleModeNames: Record<string, string> = {
                                            'A': 'PreK Activities',
                                            'R': 'Kindergarten Reading',
                                            'L': 'Life Skills',
                                            'JJFR': 'French Kindergarten',
                                            'JJFA': 'French Advanced',
                                            'JJSEA': 'Special Education'
                                        };
                                        return (
                                            <span className="text-slate-600 text-xs sm:text-sm font-semibold">
                                                {simpleModeNames[category.code] || category.name}
                                            </span>
                                        );
                                    }
                                    return null;
                                })()}

                                {/* Flashcard label */}
                                {mode !== 'workbook' && (
                                    <span className="text-slate-600 text-xs sm:text-sm font-semibold">
                                        {mode === 'flashcard-tablet' ? 'Tablet Flashcard' : 'Phone Flashcard'}
                                    </span>
                                )}

                                {/* Start Button - appears on hover */}
                                <div className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="px-4 py-2 rounded-lg bg-saas-blue text-white text-xs sm:text-sm font-bold shadow-lg">
                                        {mode === 'workbook' ? 'Open Workbook →' : 'Open Flashcard →'}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Parse workbook ID: JJ05SS02 → { grade: '05', subject: 'SS', number: '02' }
const parseWorkbookId = (id: string) => {
    const match = id.match(/^JJ(\d{2})([A-Z]{2})(\d{2})$/);
    if (!match) return null;
    return {
        grade: match[1],
        subject: match[2],
        number: match[3]
    };
};

export default WorkbookSelector;

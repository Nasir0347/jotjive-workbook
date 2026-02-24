import { NavigationBarProps, PageType } from '../../types';

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onNext,
  onBack,
  onGoToCover, // Added onGoToCover prop
  canGoNext,
  canGoBack,
  currentPage,
  totalPages,
  pageType
}) => {
  const getPageTypeLabel = (type?: PageType) => {
    switch (type) {
      case PageType.T: return 'TEACHING';
      case PageType.P: return 'PRACTICE';
      case PageType.Q: return 'QUESTION';
      case PageType.A: return 'ANSWER';
      case PageType.G: return 'GAME';
      case PageType.COVER: return 'COVER';
      default: return '';
    }
  };

  const buttonBase = "flex items-center gap-2 px-6 py-2.5 rounded-full font-extrabold uppercase tracking-widest transition-all duration-200 text-[10px] sm:text-[11px] active:scale-95 active:shadow-none active:translate-y-[2px]";

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-200 z-50 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
      {/* Progress Line */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-saas-blue transition-all duration-700 ease-out shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className={`
            ${buttonBase}
            px-4 sm:px-6 py-2 sm:py-2.5
            ${canGoBack
              ? 'bg-white text-slate-800 border-2 border-slate-100 hover:bg-slate-50 shadow-tactile-blue'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none border-transparent'
            }
          `}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-saas-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-black">Back</span>
        </button>

        {/* Page Indicator & Home */}
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => onGoToCover && onGoToCover()}
            title="Go to Cover"
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-saas-blue"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          <div className="flex flex-col items-center group">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter drop-shadow-sm">
                {currentPage + 1}
              </span>
              <span className="text-slate-300 font-bold text-xs sm:text-sm">/</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                {totalPages}
              </span>
            </div>
            {pageType && (
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.2em] group-hover:text-saas-blue transition-colors">
                {getPageTypeLabel(pageType)}
              </span>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            ${buttonBase}
            px-4 sm:px-6 py-2.5
            ${canGoNext
              ? 'bg-white text-slate-800 border-2 border-slate-200 ring-4 ring-slate-100 shadow-tactile-blue hover:bg-slate-50'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }
          `}
        >
          <span className="text-[11px] sm:text-[12px] font-black tracking-widest text-slate-800">
            {canGoNext ? 'NEXT' : 'FINISH'}
          </span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-saas-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;

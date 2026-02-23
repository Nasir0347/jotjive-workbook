import { NavigationBarProps, PageType } from '../../types';

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onNext,
  onBack,
  canGoNext,
  canGoBack,
  currentPage,
  totalPages,
  pageType
}) => {
  const getPageTypeLabel = (type?: PageType) => {
    switch (type) {
      case PageType.T: return 'Tracing';
      case PageType.P: return 'Practice';
      case PageType.Q: return 'Quest';
      case PageType.A: return 'Answer';
      case PageType.G: return 'Game';
      case PageType.COVER: return 'Cover';
      default: return '';
    }
  };

  const buttonBase = "flex items-center gap-2 px-6 py-2.5 rounded-full font-black uppercase tracking-tight transition-all duration-200 text-[11px] active:scale-95 active:shadow-none active:translate-y-[2px]";

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-200 z-50 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
      {/* Progress Line */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-oer-blue transition-all duration-700 ease-out shadow-[0_0_12px_rgba(56,189,248,0.6)]"
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
              ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-tactile'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none border-transparent'
            }
          `}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Page Indicator */}
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
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] group-hover:text-oer-blue transition-colors">
              {getPageTypeLabel(pageType)}
            </span>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            ${buttonBase}
            px-4 sm:px-6 py-2 sm:py-2.5
            ${canGoNext
              ? 'bg-oer-blue text-slate-900 shadow-tactile hover:brightness-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }
          `}
        >
          <span className="text-[10px] sm:text-[11px]">
            {canGoNext ? 'Next' : 'Finish'}
          </span>
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;

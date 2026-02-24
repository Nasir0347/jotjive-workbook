import { useState } from 'react';
import { useSession } from '../../context/SessionContext';

interface HandwritingToolbarProps {
  onClear: () => void;
  strokeCount?: number;
}

export const HandwritingToolbar: React.FC<HandwritingToolbarProps> = ({
  onClear,
  strokeCount = 0
}) => {
  const { state, toggleTouch } = useSession();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClear = () => {
    if (strokeCount === 0) return;

    if (strokeCount > 5 && !showConfirmClear) {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 3000);
      return;
    }

    onClear();
    setShowConfirmClear(false);
  };

  const buttonBaseClass = "flex items-center gap-3 px-5 py-3 rounded-full shadow-tactile hover:shadow-lg transition-all font-extrabold text-[10px] uppercase tracking-widest border border-gray-100 bg-white text-slate-800 active:scale-95 active:shadow-none active:translate-y-[2px]";

  return (
    <div className="fixed bottom-24 left-6 md:top-8 md:left-8 flex flex-row md:flex-col gap-3 sm:gap-4 z-40 no-select">
      {/* Input Method Toggle */}
      <button
        onClick={toggleTouch}
        className={`
          ${buttonBaseClass}
          px-3 py-2 sm:px-5 sm:py-3
          ${state.allowTouch
            ? 'bg-saas-blue text-white border-saas-blue shadow-tactile-blue ring-4 ring-saas-blue/10'
            : 'bg-white hover:bg-slate-50 text-slate-800 shadow-tactile-blue'
          }
        `}
        title={state.allowTouch ? "Touch/Mouse enabled" : "Stylus only (Touch disabled)"}
      >
        <span className="text-lg sm:text-xl">{state.allowTouch ? '🖱️' : '✍️'}</span>
        <span className="hidden xs:inline">
          {state.allowTouch ? 'Touch' : 'Pen'}
        </span>
      </button>

      {/* Clear Button */}
      <button
        onClick={handleClear}
        disabled={strokeCount === 0}
        className={`
          ${buttonBaseClass}
          px-3 py-2 sm:px-5 sm:py-3
          ${strokeCount === 0
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-60 shadow-none'
            : showConfirmClear
              ? 'bg-saas-red text-white border-saas-red shadow-tactile-blue ring-4 ring-saas-red/10'
              : 'bg-white hover:bg-slate-50 shadow-tactile-blue'
          }
        `}
        title="Clear canvas"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="hidden xs:inline">
          {showConfirmClear ? 'Sure?' : 'Clear'}
        </span>
      </button>

      {/* Stroke Counter Pill */}
      {strokeCount > 0 && (
        <div className="bg-slate-800/90 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] self-center animate-fade-in-up border border-white/10 flex items-center justify-center shadow-tactile-blue/20">
          {strokeCount}
          <span className="hidden xs:inline ml-1">PT{strokeCount !== 1 ? 'S' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default HandwritingToolbar;

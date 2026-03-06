import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimes, faPen, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../../context/SessionContext';

/**
 * Settings Button - Triggers the global settings modal
 * Designed for use within the NavigationBar
 */
export const InputSettingsButton: React.FC<{ className?: string }> = ({ className }) => {
  const { toggleSettings } = useSession();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSettings();
  };

  return (
    <button
      onClick={handleClick}
      onTouchEnd={handleClick}
      className="group relative flex items-center justify-center transition-all active:scale-95 z-[70]"
    >
      <FontAwesomeIcon icon={faCog} className="text-slate-500 text-base sm:text-lg group-hover:text-saas-blue transition-colors" />
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-lg">
        Input Settings
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-slate-900"></span>
      </span>
    </button>
  );
};

/**
 * Settings Modal - Controlled by global session state
 * Designed to be rendered at the root of the app for perfect centering
 */
export const InputSettingsModal: React.FC = () => {
  const { state, toggleTouch, toggleSettings } = useSession();

  if (!state.isSettingsOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in"
      onClick={toggleSettings}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl max-w-md w-full p-6 sm:p-8 md:p-10 animate-fade-in-up m-auto relative border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Input Settings</h2>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">Configure your Workspace</p>
          </div>
          <button
            onClick={toggleSettings}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-slate-100"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-4 sm:space-y-5">
          {/* Stylus Setting (Read only - explaining auto-detection) */}
          <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] bg-slate-50 border border-slate-100 group transition-all">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-saas-blue/10 flex items-center justify-center text-saas-blue shadow-sm">
                <FontAwesomeIcon icon={faPen} className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm sm:text-base tracking-tight leading-none">Stylus Pen</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-1.5 sm:mt-2 uppercase tracking-tight">Write with stylus</p>
              </div>
            </div>
            <div className="w-11 h-6 sm:w-12 sm:h-6 bg-saas-blue rounded-full relative shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>

          {/* Touch Setting (Interactive) */}
          <div
            onClick={toggleTouch}
            className={`flex items-center justify-between p-4 sm:p-5 rounded-xl sm:rounded-[1.5rem] border transition-all cursor-pointer group active:scale-[0.98] ${state.allowTouch
              ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/5'
              : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
              }`}
          >
            <div className="flex items-center gap-3 sm:gap-5">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-sm ${state.allowTouch ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'
                }`}>
                <FontAwesomeIcon icon={faHandPointer} className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm sm:text-base tracking-tight leading-none">Touch Input</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-1.5 sm:mt-2 uppercase tracking-tight">Write with finger/mouse</p>
              </div>
            </div>

            <div className={`w-11 h-6 sm:w-14 sm:h-7 rounded-full relative transition-colors shadow-inner ${state.allowTouch ? 'bg-amber-500' : 'bg-slate-200'
              }`}>
              <div className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-all duration-300 ${state.allowTouch ? 'right-1' : 'left-1'
                }`} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={toggleSettings}
          className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-saas-blue hover:shadow-xl hover:shadow-saas-blue/20 transition-all active:scale-95 border-b-4 border-black/20"
        >
          Save & Close
        </button>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
            Pad Version 2.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputSettingsButton;

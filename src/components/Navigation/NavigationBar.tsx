import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faKey,
  faCheck,
  faEnvelope,
  faEraser,
  faTrashCan,
  faPowerOff,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import { NavigationBarProps } from '../../types';
import { InputSettingsButton } from '../Handwriting/InputSettings';
import { useSession } from '../../context/SessionContext';
import { PageLabel } from '../Pages/PageLabel';
import { LanguageDropdown } from '../Language/LanguageDropdown';

// Tooltip wrapper component
const TooltipButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, disabled, tooltip, children, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group relative ${className}`}
  >
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-lg">
      {tooltip}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></span>
    </span>
  </button>
);

export const NavigationBar: React.FC<NavigationBarProps & { isSimpleMode?: boolean }> = ({
  onNext,
  onBack,
  onErasePage,
  onEraseBook,
  onEmail,
  onPower,
  onGoldenKey,
  onCheck,
  canGoNext,
  canGoBack,
  currentPage,
  totalPages,
  isSimpleMode = false
}) => {
  // Get original page label and page type from session state
  const { state, setLanguages } = useSession();
  // Premium button style - smaller on mobile
  const premiumCircleClass = "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-saas-blue flex items-center justify-center shadow-lg shadow-saas-blue/30 group-hover:brightness-110 active:scale-95 transition-all text-white";
  const premiumSecondaryCircleClass = "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-saas-blue/20 bg-white flex items-center justify-center text-saas-blue hover:bg-saas-blue/5 active:scale-95 transition-all shadow-sm";
  const topIconClass = "flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-white border border-slate-100 shadow-sm text-saas-blue hover:bg-saas-blue hover:text-white transition-all active:scale-95 text-[10px] sm:text-xs md:text-sm";

  // Icon only circle style for secondary actions
  const actionCircleClass = "w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-saas-blue hover:text-saas-blue active:scale-95 transition-all shadow-sm group-hover:shadow-md";

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <div className="fixed top-0 left-0 right-0 glass-panel border-b border-gray-200 z-50 h-12 sm:h-14 md:h-16 flex items-center shadow-sm overflow-visible">
        <div className="max-w-7xl mx-auto w-full px-1.5 sm:px-2 md:px-4 flex items-center justify-between">
          {/* Left: Settings & Flag/Audio */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 relative z-[60]">
            <InputSettingsButton className={topIconClass} />
            <div className="h-3 sm:h-4 w-px bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />
            <LanguageDropdown
              selectedLanguage={state.nativeLanguage}
              onLanguageChange={(code) => setLanguages(code, state.targetLanguage)}
              label="NL"
              className=""
            />
          </div>

          {/* Center: Page Type Label (hidden in simple mode) */}
          <div className="flex-1 flex justify-center">
            {!isSimpleMode && state.pageType && <PageLabel type={state.pageType} />}
          </div>

          {/* Right: Language TL Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 flex-1 relative z-[60]">
            <LanguageDropdown
              selectedLanguage={state.targetLanguage}
              onLanguageChange={(code) => setLanguages(state.nativeLanguage, code)}
              label="TL"
              className=""
            />
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] h-12 sm:h-14 md:h-16 flex flex-col">
        {/* Progress bar */}
        <div className="h-0.5 sm:h-0.5 md:h-1 w-full bg-slate-100 overflow-hidden flex-shrink-0">
          <div
            className="h-full bg-saas-blue transition-all duration-700 ease-out shadow-[0_0_8px_rgba(14,165,233,0.5)]"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>

        {/* Mobile Layout (< 640px) - Compact single row */}
        <div className="sm:hidden px-1 flex-1 grid grid-cols-12 gap-1 items-center">
          {/* Left: Erase buttons - col-3 */}
          <div className="col-span-3 flex items-center gap-1 justify-start">
            <TooltipButton onClick={onErasePage} tooltip={state.isEraserMode ? "Switch to Pen" : "Eraser Tool"} className="flex items-center justify-center">
              <div className={`w-6 h-6 rounded-full border-2 ${state.isEraserMode ? 'border-blue-500 bg-blue-100' : 'border-red-100 bg-white'} flex items-center justify-center ${state.isEraserMode ? 'text-blue-600' : 'text-red-500'} hover:border-red-400 active:scale-95 transition-all shadow-sm`}>
                <FontAwesomeIcon icon={state.isEraserMode ? faPen : faEraser} className="text-[8px]" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onEraseBook} tooltip="Clear Workbook" className="flex items-center justify-center">
              <div className={`w-6 h-6 rounded-full border-2 border-red-100 bg-white flex items-center justify-center text-red-600 hover:border-red-600 active:scale-95 transition-all shadow-sm`}>
                <FontAwesomeIcon icon={faTrashCan} className="text-[8px]" />
              </div>
            </TooltipButton>
          </div>

          {/* Center: Navigation - col-6 */}
          <div className="col-span-6 flex items-center gap-1.5 justify-center">
            <TooltipButton
              onClick={onBack}
              disabled={!canGoBack}
              tooltip="Previous Page"
              className={`flex items-center justify-center transition-all ${canGoBack ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-7 h-7 rounded-full bg-saas-blue flex items-center justify-center shadow-md shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowLeft} className="text-[9px]" />
              </div>
            </TooltipButton>

            <div className="flex flex-col items-center px-1 min-w-[45px]">
              <div className="text-[7px] font-black text-saas-blue tracking-tight leading-none">
                {currentPage}/{totalPages}
              </div>
              <div className="text-[8px] font-black text-slate-800 tracking-tight leading-none uppercase max-w-[45px] truncate">
                {state.originalPageLabel || '...'}
              </div>
            </div>

            <TooltipButton
              onClick={onNext}
              disabled={!canGoNext}
              tooltip="Next Page"
              className={`flex items-center justify-center transition-all ${canGoNext ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-7 h-7 rounded-full bg-saas-blue flex items-center justify-center shadow-md shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
              </div>
            </TooltipButton>
          </div>

          {/* Right: Power button - col-3 */}
          <div className="col-span-3 flex items-center justify-end">
            <TooltipButton onClick={onPower} tooltip="Close Workbook" className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md shadow-black/20 hover:bg-black active:scale-95 transition-all">
                <FontAwesomeIcon icon={faPowerOff} className="text-[9px]" />
              </div>
            </TooltipButton>
          </div>
        </div>

        {/* Tablet Layout (640px - 768px) - More buttons visible */}
        <div className="hidden sm:flex md:hidden px-2 flex-1 grid grid-cols-12 gap-1.5 items-center">
          {/* Left: Tools - col-3 */}
          <div className="col-span-3 flex items-center gap-1.5 justify-start">
            <TooltipButton onClick={onGoldenKey} tooltip="Golden Key" className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-saas-blue/20 bg-white flex items-center justify-center text-saas-blue hover:bg-saas-blue/5 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faKey} className="text-[9px]" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onCheck} tooltip="Check Answers" className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-saas-blue/20 bg-white flex items-center justify-center text-saas-blue hover:bg-saas-blue/5 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
              </div>
            </TooltipButton>
          </div>

          {/* Center: Navigation - col-6 */}
          <div className="col-span-6 flex items-center gap-2.5 justify-center">
            <TooltipButton
              onClick={onBack}
              disabled={!canGoBack}
              tooltip="Previous Page"
              className={`flex items-center justify-center transition-all ${canGoBack ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-8 h-8 rounded-full bg-saas-blue flex items-center justify-center shadow-lg shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              </div>
            </TooltipButton>

            <div className="flex flex-col items-center min-w-[55px]">
              <div className="text-[8px] font-black text-saas-blue tracking-tight leading-none">
                {currentPage}/{totalPages}
              </div>
              <div className="text-[9px] font-black text-slate-800 tracking-tight leading-none uppercase max-w-[70px] truncate">
                {state.originalPageLabel || '...'}
              </div>
            </div>

            <TooltipButton
              onClick={onNext}
              disabled={!canGoNext}
              tooltip="Next Page"
              className={`flex items-center justify-center transition-all ${canGoNext ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-8 h-8 rounded-full bg-saas-blue flex items-center justify-center shadow-lg shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </div>
            </TooltipButton>
          </div>

          {/* Right: System - col-3 */}
          <div className="col-span-3 flex items-center gap-1.5 justify-end">
            <TooltipButton onClick={onErasePage} tooltip={state.isEraserMode ? "Switch to Pen" : "Eraser Tool"} className="flex items-center justify-center">
              <div className={`w-7 h-7 rounded-full border-2 ${state.isEraserMode ? 'border-blue-500 bg-blue-100' : 'border-red-100 bg-white'} flex items-center justify-center ${state.isEraserMode ? 'text-blue-600' : 'text-red-500'} hover:border-red-400 active:scale-95 transition-all shadow-sm`}>
                <FontAwesomeIcon icon={state.isEraserMode ? faPen : faEraser} className="text-[9px]" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onEraseBook} tooltip="Clear Workbook" className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-red-100 bg-white flex items-center justify-center text-red-600 hover:border-red-600 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faTrashCan} className="text-[9px]" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onPower} tooltip="Close Workbook" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-black/20 hover:bg-black active:scale-95 transition-all">
                <FontAwesomeIcon icon={faPowerOff} className="text-xs" />
              </div>
            </TooltipButton>
          </div>
        </div>

        {/* Desktop Layout (>= 768px) - Original full layout */}
        <div className="hidden md:flex px-4 flex-1 items-center justify-between">
          {/* Left: Tools */}
          <div className="flex items-center gap-3">
            <TooltipButton onClick={onGoldenKey} tooltip="Golden Key" className="flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-saas-blue/20 bg-white flex items-center justify-center text-saas-blue hover:bg-saas-blue/5 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faKey} className="text-sm" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onCheck} tooltip="Check Answers" className="flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-saas-blue/20 bg-white flex items-center justify-center text-saas-blue hover:bg-saas-blue/5 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faCheck} className="text-sm" />
              </div>
            </TooltipButton>

            <TooltipButton onClick={() => onEmail?.(currentPage.toString())} tooltip="Share via Email" className="flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-saas-blue hover:text-saas-blue active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
              </div>
            </TooltipButton>
          </div>

          {/* CENTER GROUP: Core Navigation + Page Indicator */}
          <div className="flex items-center gap-8 flex-1 justify-center border-x border-slate-100 px-6">
            <TooltipButton
              onClick={onBack}
              disabled={!canGoBack}
              tooltip="Previous Page"
              className={`flex items-center justify-center transition-all ${canGoBack ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-10 h-10 rounded-full bg-saas-blue flex items-center justify-center shadow-lg shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </TooltipButton>

            {/* Page info & indicator */}
            <div className="flex flex-col items-center">
              <div className="text-[9px] font-black text-saas-blue tracking-[0.2em] leading-none">
                {currentPage} / {totalPages}
              </div>
              <div className="text-[12px] font-black text-slate-800 tracking-tight leading-none uppercase">
                {state.originalPageLabel || '...'}
              </div>
            </div>

            <TooltipButton
              onClick={onNext}
              disabled={!canGoNext}
              tooltip="Next Page"
              className={`flex items-center justify-center transition-all ${canGoNext ? '' : 'opacity-20 cursor-not-allowed'}`}
            >
              <div className="w-10 h-10 rounded-full bg-saas-blue flex items-center justify-center shadow-lg shadow-saas-blue/30 text-white active:scale-95 transition-all">
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </TooltipButton>
          </div>

          {/* Action Group 2: System */}
          <div className="flex items-center gap-3">
            <TooltipButton onClick={onErasePage} tooltip={state.isEraserMode ? "Switch to Pen" : "Eraser Tool"} className="flex items-center justify-center">
              <div className={`w-9 h-9 rounded-full border-2 ${state.isEraserMode ? 'border-blue-500 bg-blue-100' : 'border-red-50'} flex items-center justify-center ${state.isEraserMode ? 'text-blue-600' : 'text-slate-500'} hover:border-red-400 ${state.isEraserMode ? '' : 'hover:text-red-500'} active:scale-95 transition-all shadow-sm`}>
                <FontAwesomeIcon icon={state.isEraserMode ? faPen : faEraser} />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onEraseBook} tooltip="Clear Workbook" className="flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-red-50 bg-white flex items-center justify-center text-slate-500 hover:border-red-600 hover:text-red-700 active:scale-95 transition-all shadow-sm">
                <FontAwesomeIcon icon={faTrashCan} />
              </div>
            </TooltipButton>

            <TooltipButton onClick={onPower} tooltip="Close Workbook" className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-black/20 hover:bg-black active:scale-95 transition-all">
                <FontAwesomeIcon icon={faPowerOff} />
              </div>
            </TooltipButton>
          </div>
        </div>
      </div>
    </>
  );
};

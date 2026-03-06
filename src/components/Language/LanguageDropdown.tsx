import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LANGUAGES, getLanguageByCode } from '../../config/languageConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface LanguageDropdownProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  label: 'NL' | 'TL';
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  selectedLanguage,
  onLanguageChange,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentLang = getLanguageByCode(selectedLanguage);

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  const tooltipText = label === 'NL' ? 'Native Language' : 'Target Language';

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const getPanelPosition = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 640;

    if (!isDesktop) {
      // Mobile: full-width strip that drops just below the nav bar
      return { top: rect.bottom + 4, left: 0, right: 0 };
    }

    if (label === 'NL') {
      return { top: rect.bottom + 8, left: Math.max(8, rect.left) };
    } else {
      return { top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) };
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className="group relative flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-white border border-slate-100 shadow-sm text-saas-blue hover:bg-saas-blue hover:text-white transition-all active:scale-95 z-[70]"
      >
        <img
          src={currentLang?.flagIcon}
          alt={currentLang?.englishName}
          className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-sm object-cover flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">🌐</text></svg>';
          }}
        />
        <FontAwesomeIcon icon={faVolumeUp} className="text-[8px] sm:text-[10px] md:text-xs" />
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[6px] sm:text-[8px] md:text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />

        {/* Tooltip - appears below */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100] shadow-lg">
          {tooltipText}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-4 border-transparent border-b-slate-900"></span>
        </span>
      </button>

      {/* Dropdown rendered via Portal to escape stacking contexts */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99998,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div
            style={{
              position: 'fixed',
              zIndex: 99999,
              ...getPanelPosition(),
            }}
            className={[
              'bg-white border-2 border-slate-200 shadow-2xl overflow-hidden',
              window.innerWidth < 640
                ? 'rounded-b-2xl w-full max-h-[70vh]'
                : 'rounded-2xl w-80 md:w-96 max-h-[28rem]'
            ].join(' ')}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-800">
                {label === 'NL' ? '🌍 Native Language' : '🎯 Target Language'}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm font-bold text-slate-500 hover:text-slate-700 sm:hidden"
              >
                ✕
              </button>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto max-h-[calc(75vh-4rem)] sm:max-h-[24rem] p-3">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`
                      w-full flex flex-col sm:flex-row items-center
                      gap-2 sm:gap-3 px-3 py-3 sm:py-2.5
                      rounded-xl sm:rounded-lg
                      hover:bg-blue-50 active:bg-blue-100
                      transition-all text-center sm:text-left
                      ${selectedLanguage === lang.code ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-slate-50 sm:bg-transparent'}
                    `}
                  >
                    <img
                      src={lang.flagIcon}
                      alt={lang.englishName}
                      className="w-10 h-10 sm:w-7 sm:h-7 rounded-md sm:rounded-sm object-cover flex-shrink-0 shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">🌐</text></svg>';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {lang.englishName}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                        {lang.nativeName}
                      </div>
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {lang.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default LanguageDropdown;

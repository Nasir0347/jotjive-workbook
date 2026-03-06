import React from 'react';
import { LANGUAGES } from '../../config/languageConfig';
import { useSession } from '../../context/SessionContext';

export const LanguageSelector: React.FC = () => {
  const { state, setLanguages } = useSession();

  const handleNativeLanguageChange = (code: string) => {
    setLanguages(code, state.targetLanguage);
  };

  const handleTargetLanguageChange = (code: string) => {
    setLanguages(state.nativeLanguage, code);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
          {/* Native Language (NL) */}
          <div className="flex-1 max-w-xs">
            <label className="block text-slate-700 text-xs font-bold mb-1.5 uppercase tracking-wider">
              Native Language (NL)
            </label>
            <select
              value={state.nativeLanguage}
              onChange={(e) => handleNativeLanguageChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-300 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.englishName} ({lang.code})
                </option>
              ))}
            </select>
          </div>

          {/* Arrow Icon */}
          <div className="hidden sm:flex items-end pb-2">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Target Language (TL) */}
          <div className="flex-1 max-w-xs">
            <label className="block text-slate-700 text-xs font-bold mb-1.5 uppercase tracking-wider">
              Target Language (TL)
            </label>
            <select
              value={state.targetLanguage}
              onChange={(e) => handleTargetLanguageChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-300 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.englishName} ({lang.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;

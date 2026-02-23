import React from 'react';

interface CoverPageProps {
  coverImage: string;
  title: string;
  onStart: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  onStart
}) => {

  return (
    <div className="flex flex-col min-h-screen chalkboard-hero font-serif overflow-hidden relative">
      {/* Dynamic Background Element */}
      <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none"></div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 z-10 w-full">
        <div className="max-w-4xl w-full">
          {/* Centered Ultra-Minimalist Panel */}
          <div className="bg-white/10 backdrop-blur-3xl rounded-[3rem] sm:rounded-[5rem] px-6 py-12 sm:px-12 sm:py-24 border border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative group overflow-hidden flex flex-col items-center text-center mx-auto">
            {/* Inner glow effect */}
            <div className="absolute -inset-24 bg-oer-blue/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 space-y-10 sm:space-y-16 w-full">
              {/* Logo & Title Section */}
              <div className="flex flex-col items-center gap-4 sm:gap-8 animate-fade-in-up">
                <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/30 p-3 sm:p-5 transform rotate-3 hover:rotate-0 transition-all duration-700">
                  <span className="text-5xl sm:text-8xl drop-shadow-md">🗒️</span>
                </div>
                <h1 className="text-6xl sm:text-9xl font-black tracking-tighter text-[#38bdf8] flex items-baseline leading-none drop-shadow-2xl">
                  Jot<span className="text-[#fbbf24]">Jive</span>
                </h1>
              </div>

              {/* Main CTA */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={onStart}
                  className="pill-button bg-oer-red text-white border-[4px] sm:border-[8px] border-white/40 ring-4 sm:ring-8 ring-oer-red/10 px-10 py-4 sm:px-20 sm:py-8 transform scale-110 sm:scale-125 hover:scale-120 sm:hover:scale-135 transition-all duration-500 shadow-2xl active:scale-105 sm:active:scale-110 flex items-center justify-center gap-2 mx-auto"
                >
                  <span className="text-xl sm:text-3xl animate-pulse">✨</span>
                  <span className="text-lg sm:text-2xl font-black tracking-tight whitespace-nowrap">Start Learning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Copyright */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap">
        © 2026 JotJive, LLC • Patents Pending
      </div>
    </div>
  );
};

export default CoverPage;

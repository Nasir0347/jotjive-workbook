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
    <div className="flex flex-col min-h-screen chalkboard-hero font-sans overflow-hidden relative">
      {/* Dynamic Background Element */}
      <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none"></div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 z-10 w-full">
        <div className="max-w-3xl w-full">
          {/* Centered Patterned Panel */}
          <div
            className="bg-white rounded-[2.5rem] sm:rounded-[4rem] px-4 py-10 sm:px-12 sm:py-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group overflow-hidden flex flex-col items-center text-center mx-auto border-[4px] border-[#E1EAF4]"
          >
            {/* Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply"
              style={{ backgroundImage: "url('/school-doodles.png')", backgroundSize: '300px', backgroundPosition: 'center', backgroundRepeat: 'repeat' }}
            ></div>

            {/* Inner glow effect */}
            <div className="absolute -inset-24 bg-saas-blue/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8 sm:space-y-12 w-full">
              {/* Logo Section */}
              <div className="flex flex-col items-center animate-fade-in-up w-full">
                <svg viewBox="0 0 850 250" className="w-full max-w-[360px] sm:max-w-[550px] h-auto object-contain drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Inter:wght@600;700&family=Nunito:wght@800&family=Varela+Round&display=swap');
                      
                      .script-text { font-family: 'Dancing Script', cursive; font-size: 34px; fill: #48689A; letter-spacing: 0.5px; }
                      .sm-text-yellow { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: bold; fill: #F4A631; }
                      .tm-text-blue { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: bold; fill: #48689A; }
                      
                      .title-jot { font-family: 'Varela Round', 'Nunito', sans-serif; font-weight: 800; font-size: 115px; fill: #2B78BE; letter-spacing: -1px; }
                      .title-jive { font-family: 'Varela Round', 'Nunito', sans-serif; font-weight: 800; font-size: 115px; fill: #EFB321; letter-spacing: -1px; }
                      
                      .bottom-text { font-family: 'Inter', sans-serif; font-size: 21px; font-weight: 700; fill: #27568A; letter-spacing: 0px; }
                    `}} />

                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F9C340" />
                      <stop offset="100%" stopColor="#F2A021" />
                    </linearGradient>

                    <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#64ACDE" />
                      <stop offset="100%" stopColor="#3585C7" />
                    </linearGradient>

                    <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  <path d="M 150 20 L 260 50 L 260 145 C 260 200 205 235 150 245 C 75 230 40 190 40 145 L 40 50 Z"
                    fill="none"
                    stroke="url(#shieldGrad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round" />

                  <g transform="translate(15, 30) rotate(-4) scale(1.15)" filter="url(#drop-shadow)">
                    <rect x="25" y="10" width="105" height="150" rx="12" fill="url(#tabletGrad)" />
                    <rect x="26" y="11" width="103" height="148" rx="11" fill="none" stroke="#A7D4F2" strokeWidth="2" />
                    <rect x="33" y="22" width="89" height="120" rx="4" fill="#F8FBFF" />
                    <line x1="42" y1="40" x2="110" y2="40" stroke="#C4DDF2" strokeWidth="3" strokeLinecap="round" />
                    <line x1="42" y1="55" x2="95" y2="55" stroke="#C4DDF2" strokeWidth="3" strokeLinecap="round" />
                    <line x1="42" y1="70" x2="110" y2="70" stroke="#E1EAF4" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  <g transform="translate(100, 115) rotate(-25) scale(1.2)" filter="url(#drop-shadow)">
                    <polygon points="12,-5 25,-2 -5,10" fill="#EBC39A" />
                    <polygon points="-5,10 0,6 3,11" fill="#F4B030" />
                    <rect x="15" y="-12" width="70" height="14" rx="2" fill="#F4B030" transform="rotate(7 15 -12)" />

                    <path d="M 25 -5 C 25 -25 55 -30 65 -5 Q 70 10 55 20 C 45 28 25 30 25 -5 Z" fill="#FAD1A4" />
                    <path d="M 28 5 C 10 3 15 -10 35 -15 Q 45 -15 50 -5 Q 45 10 28 5 Z" fill="#F4C28B" />
                  </g>

                  <g transform="translate(290, 48)">
                    <text x="-5" y="0" className="script-text">Read. Write. Hear. Speak. Learn!</text>
                    <text x="365" y="-15" className="sm-text-yellow">SM</text>

                    <text x="-10" y="110" className="title-jot">Jot</text>
                    <text x="165" y="110" className="title-jive">Jive</text>
                    <text x="390" y="40" className="tm-text-blue">TM</text>

                    <text x="-5" y="160" className="bottom-text">Multilingual Learning Re-Imagined</text>
                    <text x="395" y="145" className="sm-text-yellow">SM</text>
                  </g>
                </svg>
              </div>

              {/* Main CTA */}
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={onStart}
                  className="rounded-[2rem] sm:rounded-[2.5rem] bg-[#2B78BE] text-white border-[4px] sm:border-[5px] border-[#22639E] px-6 py-2.5 sm:px-16 sm:py-4 hover:bg-[#22639E] hover:border-[#1C5082] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mx-auto shadow-xl active:scale-95 mt-2 w-auto max-w-full"
                >
                  <span className="text-lg sm:text-2xl text-white animate-pulse relative top-[-1px]">✦</span>
                  <span className="text-[13px] xs:text-base sm:text-2xl font-black tracking-[0.05em] sm:tracking-[0.15em] uppercase whitespace-nowrap">START LEARNING</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Copyright */}
      <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-[90%] sm:w-full text-center">
        <div className="text-white/50 text-xs sm:text-base font-medium tracking-wide">
          <a href="https://www.JotJive.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            www.JotJive.com
          </a>
        </div>
        <div className="text-white/20 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.4em] whitespace-nowrap mt-1">
          © Copyright 2026 JotJive, LLC
        </div>
        <div className="text-white/20 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.4em] whitespace-nowrap">
          Patent Pending – All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default CoverPage;

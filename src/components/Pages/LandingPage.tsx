import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-[100dvh] chalkboard-hero font-sans overflow-hidden relative">
            {/* Dynamic Background Element */}
            <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none"></div>

            <main className="flex-grow flex flex-col items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 z-10 w-full my-auto">
                <div className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[700px] lg:max-w-[800px] my-6 sm:my-8 md:my-12">
                    {/* Centered Patterned Panel */}
                    <div
                        className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[3rem] px-3 xs:px-5 sm:px-8 md:px-8 py-5 sm:py-6 md:py-6 lg:py-4 shadow-[0_15px_40px_rgba(0,0,0,0.4)] relative group overflow-hidden flex flex-col items-center text-center mx-auto border-[3px] sm:border-[4px] border-[#E1EAF4]"
                    >
                        {/* Pattern Overlay */}
                        <div
                            className="absolute inset-0 opacity-60 pointer-events-none mix-blend-multiply"
                            style={{ backgroundImage: "url('/school-doodles.png')", backgroundSize: '300px', backgroundPosition: 'center', backgroundRepeat: 'repeat' }}
                        ></div>

                        {/* Inner glow effect */}
                        <div className="absolute -inset-24 bg-saas-blue/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>

                        <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-5 lg:space-y-4 w-full">
                            {/* Logo Section */}
                            <div className="flex flex-col items-center animate-fade-in-up w-full px-2">
                                <img
                                    src="/logo.png"
                                    alt="JotJive Logo"
                                    className="w-full max-w-[260px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[450px] h-auto object-contain drop-shadow-xl"
                                />
                            </div>

                            {/* Title */}
                            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <h1 className="text-[15px] xs:text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-700 tracking-wide leading-tight">
                                    JJ BeeHive Digital Workbooks for kids
                                </h1>
                            </div>

                            {/* Main CTA */}
                            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <button
                                    onClick={() => navigate('/select')}
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

export default LandingPage;

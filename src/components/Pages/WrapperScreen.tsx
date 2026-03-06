import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const WrapperScreen: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleBack = () => {
        navigate('/select');
    };

    const handleStart = () => {
        navigate(`/workbook/${id}/cover`);
    };

    return (
        <div className="min-h-[100dvh] chalkboard-hero font-sans relative overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-saas-blue/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-pink-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center px-3 sm:px-4 md:px-6">
                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="JotJive Logo"
                    className="w-48 xs:w-56 sm:w-72 md:w-80 lg:w-96 h-auto object-contain drop-shadow-2xl mb-6 sm:mb-8 animate-in zoom-in duration-700"
                />

                {/* Title */}
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3 sm:mb-4 drop-shadow-lg animate-in slide-in-from-bottom duration-700 px-2" style={{ animationDelay: '100ms' }}>
                    JJ BeeHive
                </h1>
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-8 sm:mb-10 md:mb-12 drop-shadow-lg animate-in slide-in-from-bottom duration-700 px-2" style={{ animationDelay: '200ms' }}>
                    Digital Workbooks for Kids
                </h2>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full max-w-md animate-in slide-in-from-bottom duration-700 px-2" style={{ animationDelay: '300ms' }}>
                    <button
                        onClick={handleBack}
                        className="w-full sm:flex-1 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-white/95 text-slate-700 border-2 border-white/50 hover:bg-white hover:border-saas-blue hover:text-saas-blue hover:scale-105 transition-all duration-300 text-base sm:text-lg md:text-xl font-black tracking-widest uppercase active:scale-95 shadow-xl backdrop-blur-lg"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleStart}
                        className="w-full sm:flex-1 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl bg-saas-blue text-white border-2 border-saas-blue hover:bg-saas-blue/90 hover:scale-105 transition-all duration-300 text-base sm:text-lg md:text-xl font-black tracking-widest uppercase active:scale-95 shadow-2xl"
                    >
                        Start →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WrapperScreen;

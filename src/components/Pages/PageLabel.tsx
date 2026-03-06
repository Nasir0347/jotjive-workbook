import React from 'react';
import { PageType } from '../../types';

interface PageLabelProps {
    type: PageType;
}

export const PageLabel: React.FC<PageLabelProps> = ({ type }) => {
    const getLabel = () => {
        switch (type) {
            case PageType.T: return 'TEACHING PAGE';
            case PageType.P: return 'PRACTICE PAGE';
            case PageType.Q: return 'QUESTION PAGE';
            case PageType.A: return 'ANSWER PAGE';
            case PageType.G: return 'GAME PAGE';
            case PageType.EMPTY: return 'EMPTY PAGE';
            default: return 'EMPTY PAGE';
        }
    };

    const getColors = () => {
        switch (type) {
            case PageType.T: return 'bg-blue-500 text-white shadow-blue-200';
            case PageType.P: return 'bg-yellow-500 text-white shadow-yellow-200';
            case PageType.Q: return 'bg-green-500 text-white shadow-green-200';
            case PageType.A: return 'bg-purple-500 text-white shadow-purple-200';
            case PageType.G: return 'bg-pink-500 text-white shadow-pink-200';
            case PageType.EMPTY: return 'bg-gray-400 text-white shadow-gray-200';
            default: return 'bg-gray-400 text-white shadow-gray-200';
        }
    };

    const label = getLabel();

    return (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`
                px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-2 rounded-full ${getColors()}
                font-black tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[10px] sm:text-[11px] md:text-[12px]
                shadow-lg border-b-4 border-black/10
            `}>
                {label}
            </div>
            <div className="h-1 w-8 sm:w-10 md:w-12 bg-black/5 rounded-full mt-1 blur-[1px]" />
        </div>
    );
};

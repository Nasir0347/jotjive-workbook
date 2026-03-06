import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

interface LandscapeOnlyProps {
    children: React.ReactNode;
}

export const LandscapeOnly: React.FC<LandscapeOnlyProps> = ({ children }) => {
    const [isLandscape, setIsLandscape] = React.useState(
        window.innerWidth > window.innerHeight
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If in landscape mode, show content
    if (isLandscape) {
        return <>{children}</>;
    }

    // If in portrait mode, show rotation prompt
    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-saas-blue to-blue-700 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-md">
                <div className="mb-8 animate-bounce">
                    <FontAwesomeIcon icon={faRotate} className="text-8xl" />
                </div>
                <h2 className="text-3xl font-black mb-4">Rotate Your Device</h2>
                <p className="text-xl font-semibold opacity-90">
                    Please rotate your phone to landscape mode to use flashcards
                </p>
            </div>
        </div>
    );
};

export default LandscapeOnly;

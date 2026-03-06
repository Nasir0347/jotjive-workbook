import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTabletScreenButton, faRotate } from '@fortawesome/free-solid-svg-icons';

interface TabletOnlyProps {
    children: React.ReactNode;
}

export const TabletOnly: React.FC<TabletOnlyProps> = ({ children }) => {
    const [isTabletOrDesktop, setIsTabletOrDesktop] = React.useState(
        window.innerWidth >= 768 // 768px is typical tablet breakpoint
    );

    const [isPortrait, setIsPortrait] = React.useState(
        window.innerHeight > window.innerWidth
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsTabletOrDesktop(window.innerWidth >= 768);
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If on phone (< 768px), show "Tablet Required" message
    if (!isTabletOrDesktop) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-saas-blue to-blue-700 flex items-center justify-center p-6">
                <div className="text-center text-white max-w-md">
                    <div className="mb-8">
                        <FontAwesomeIcon icon={faTabletScreenButton} className="text-8xl" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Tablet Required</h2>
                    <p className="text-xl font-semibold opacity-90 mb-6">
                        This workbook is designed for tablets and desktop devices.
                    </p>
                    <p className="text-lg font-medium opacity-80">
                        Please use a tablet or computer to access this content.
                    </p>
                </div>
            </div>
        );
    }

    // If on tablet/desktop but in landscape mode, show "Rotate to Portrait" message
    if (isTabletOrDesktop && !isPortrait) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-saas-blue to-blue-700 flex items-center justify-center p-6">
                <div className="text-center text-white max-w-md">
                    <div className="mb-8">
                        <FontAwesomeIcon icon={faRotate} className="text-8xl animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Rotate Your Device</h2>
                    <p className="text-xl font-semibold opacity-90 mb-6">
                        Please rotate your tablet to portrait mode to use this workbook.
                    </p>
                    <p className="text-lg font-medium opacity-80">
                        Portrait orientation provides the best experience.
                    </p>
                </div>
            </div>
        );
    }

    // Tablet in portrait mode - show content
    return <>{children}</>;
};

export default TabletOnly;

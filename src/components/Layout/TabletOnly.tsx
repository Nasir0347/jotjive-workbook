import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTabletScreenButton } from '@fortawesome/free-solid-svg-icons';

interface TabletOnlyProps {
    children: React.ReactNode;
}

export const TabletOnly: React.FC<TabletOnlyProps> = ({ children }) => {
    const [isTabletOrDesktop, setIsTabletOrDesktop] = React.useState(
        window.innerWidth >= 768 // 768px is typical tablet breakpoint
    );

    React.useEffect(() => {
        const handleResize = () => {
            setIsTabletOrDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If on tablet or desktop, show content
    if (isTabletOrDesktop) {
        return <>{children}</>;
    }

    // If on phone, show message
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
};

export default TabletOnly;

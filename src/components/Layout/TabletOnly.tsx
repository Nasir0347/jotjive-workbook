import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTabletScreenButton, faRotate } from '@fortawesome/free-solid-svg-icons';

interface TabletOnlyProps {
    children: React.ReactNode;
}

export const TabletOnly: React.FC<TabletOnlyProps> = ({ children }) => {
    const [deviceInfo, setDeviceInfo] = React.useState(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isPortrait = height > width;

        // Detect device type based on screen size
        // Desktop: width >= 1280px OR height >= 1280px (large screens)
        // Tablet: 768px <= width < 1280px AND height < 1280px
        // Phone: width < 768px
        const isDesktop = width >= 1280 || height >= 1280;
        const isPhone = width < 768 && height < 768;
        const isTablet = !isDesktop && !isPhone;

        return { isDesktop, isTablet, isPhone, isPortrait };
    });

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isPortrait = height > width;

            const isDesktop = width >= 1280 || height >= 1280;
            const isPhone = width < 768 && height < 768;
            const isTablet = !isDesktop && !isPhone;

            setDeviceInfo({ isDesktop, isTablet, isPhone, isPortrait });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If on phone, show "Tablet Required" message
    if (deviceInfo.isPhone) {
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

    // If on desktop, allow any orientation
    if (deviceInfo.isDesktop) {
        return <>{children}</>;
    }

    // If on tablet and in landscape mode, show "Rotate to Portrait" message
    if (deviceInfo.isTablet && !deviceInfo.isPortrait) {
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

    // Tablet in portrait mode OR desktop - show content
    return <>{children}</>;
};

export default TabletOnly;

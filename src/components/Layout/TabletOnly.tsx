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

        // Simple and reliable detection:
        // Phone: smallest dimension < 768px
        // Desktop: largest dimension >= 1280px
        // Tablet: everything in between
        const minDimension = Math.min(width, height);
        const maxDimension = Math.max(width, height);

        const isPhone = minDimension < 768;
        const isDesktop = maxDimension >= 1280;
        const isTablet = !isPhone && !isDesktop;

        console.log('Device Detection:', { width, height, minDimension, maxDimension, isPhone, isTablet, isDesktop, isPortrait });

        return { isPhone, isTablet, isDesktop, isPortrait };
    });

    React.useEffect(() => {
        const handleOrientationChange = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isPortrait = height > width;

            const minDimension = Math.min(width, height);
            const maxDimension = Math.max(width, height);

            const isPhone = minDimension < 768;
            const isDesktop = maxDimension >= 1280;
            const isTablet = !isPhone && !isDesktop;

            console.log('Orientation Changed:', { width, height, minDimension, maxDimension, isPhone, isTablet, isDesktop, isPortrait });

            setDeviceInfo({ isPhone, isTablet, isDesktop, isPortrait });
        };

        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('orientationchange', handleOrientationChange);

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    console.log('Current Device Info:', deviceInfo);

    // If on phone OR desktop, show "Tablet Required" message
    if (deviceInfo.isPhone || deviceInfo.isDesktop) {
        console.log('Showing: Tablet Required (Phone or Desktop detected)');
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-saas-blue to-blue-700 flex items-center justify-center p-6">
                <div className="text-center text-white max-w-md">
                    <div className="mb-8">
                        <FontAwesomeIcon icon={faTabletScreenButton} className="text-8xl" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Tablet Required</h2>
                    <p className="text-xl font-semibold opacity-90 mb-6">
                        This workbook is designed for tablets Only.
                    </p>
                    <p className="text-lg font-medium opacity-80">
                        Please use a tablet Portrait mode to access this content.
                    </p>
                </div>
            </div>
        );
    }

    // If on tablet and in landscape mode, show "Rotate to Portrait" message
    if (deviceInfo.isTablet && !deviceInfo.isPortrait) {
        console.log('Showing: Rotate Message (Tablet in landscape)');
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
    console.log('Showing: Content (Tablet in portrait)');
    return <>{children}</>;
};

export default TabletOnly;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTabletScreenButton, faRotate } from '@fortawesome/free-solid-svg-icons';

interface TabletOnlyProps {
    children: React.ReactNode;
}

// Detect if device is a real tablet or phone using User Agent
const detectDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const maxDimension = Math.max(width, height);
    const minDimension = Math.min(width, height);

    // Check if it's a mobile device (phone or tablet)
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua);

    // Check if it's specifically a tablet
    const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(ua);

    // Check if it's a phone
    const isPhoneUA = /iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua);

    // Desktop detection: Large screen AND not a mobile device
    const isDesktop = !isMobileDevice || maxDimension >= 1280;

    // Phone detection: Small screen OR phone user agent
    const isPhone = isPhoneUA || (minDimension < 768 && isMobileDevice);

    // Tablet detection: Tablet UA OR (medium screen AND mobile device AND not phone)
    const isTablet = (isTabletUA || (minDimension >= 768 && minDimension < 1280 && isMobileDevice)) && !isPhone && !isDesktop;

    return { isDesktop, isTablet, isPhone };
};

export const TabletOnly: React.FC<TabletOnlyProps> = ({ children }) => {
    const [deviceInfo, setDeviceInfo] = React.useState(() => {
        const { isDesktop, isTablet, isPhone } = detectDeviceType();
        const isPortrait = window.innerHeight > window.innerWidth;
        return { isDesktop, isTablet, isPhone, isPortrait };
    });

    React.useEffect(() => {
        const handleResize = () => {
            const { isDesktop, isTablet, isPhone } = detectDeviceType();
            const isPortrait = window.innerHeight > window.innerWidth;
            setDeviceInfo({ isDesktop, isTablet, isPhone, isPortrait });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
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

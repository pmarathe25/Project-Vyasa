import { useState, useEffect } from 'react';

export function getWindowWidth() {
    if (typeof window === "undefined") {
        return 0;
    }

    return (window.innerWidth);
}

// Whether we are likely on a mobile device
export default function useIsMobile() {
    const [width, setWidth] = useState(getWindowWidth());

    useEffect(() => {
        function handleResize() {
            setWidth(getWindowWidth());
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width <= 768;
}
import { useState, useEffect } from 'react';

function getWindowWidth() {
    return (window ? window.innerWidth : 0);
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
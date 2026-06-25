import { useState, useEffect } from 'react';

export function getWindowWidth(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  return window.innerWidth;
}

// Whether we are likely on a mobile device
export default function useIsMobile(): boolean {
  const [width, setWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize(): void {
      setWidth(getWindowWidth());
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width <= 768;
}
import * as React from 'react';
import { Navbar } from 'react-bootstrap';
import { clamp } from '../util/util';

export const NAVBAR_HEIGHT = 70;

interface AutohidingNavbarProps {
  variant?: 'light' | 'dark';
  allowHide?: boolean;
  children: React.ReactNode;
}

const AutohidingNavbar = ({ variant, allowHide = true, children }: AutohidingNavbarProps) => {
  const [previousYOffset, setPreviousYOffset] = React.useState(
    typeof window === 'undefined' ? 0 : window.pageYOffset
  );

  const [scrollLocation, setScrollLocation] = React.useState(0);
  const [navExpanded, setNavExpanded] = React.useState(false);
  const forceVisible = !allowHide || navExpanded;

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onScroll = () => {
      const delta = previousYOffset - window.pageYOffset;
      if (!forceVisible) {
        setScrollLocation(clamp(scrollLocation + delta, -NAVBAR_HEIGHT, 0));
      }
      setPreviousYOffset(window.pageYOffset);
    };

    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [previousYOffset, scrollLocation, forceVisible]);

  return (
    <Navbar
      variant={variant}
      sticky="top"
      expand="md"
      style={{
        boxShadow: '0px 1px 1px var(--shadow-color)',
        backgroundColor: 'var(--navbar-background)',
        top: forceVisible ? 0 : scrollLocation,
        position: 'fixed',
        width: '100%',
        zIndex: 2,
        padding: 0,
      }}
      onToggle={(expanded) => {
        setNavExpanded(expanded);
        setScrollLocation(0);
      }}
    >
      {children}
    </Navbar>
  );
};

export default AutohidingNavbar;
import * as React from 'react'
import { Navbar } from 'react-bootstrap'
import useIsMobile from '../util/responsiveness'

const AutohidingNavbar = (props) => {
    const isMobile = useIsMobile()

    // Previous and current page offsets, to detect scrolling direction
    const [offset, setOffset] = React.useState([0, 0]);

    // Always show navbar when at the top of the page.
    // Otherwise, hide navbar when scrolling down, and show it when we scroll up by more than a certain threshold.
    // If we do not threshold, the navbar will constantly pop in and out due to scrolling noise.
    const navbarSlideOffStyle = { top: -300, transition: "all .5s ease" };
    const navbarSlideOnStyle = { top: 0, transition: "all .5s ease" };
    const [navbarStyle, setNavbarStyle] = React.useState(navbarSlideOnStyle);
    // Used for scrolling up/down thresholding logic
    const [scrollUpTotal, setScrollUpTotal] = React.useState(0);
    const [scrollDownTotal, setScrollDownTotal] = React.useState(0);

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const onScroll = () => {
            setOffset([offset[1], window.pageYOffset]);

            if (window.pageYOffset < (isMobile ? 25 : 60)) {
                setNavbarStyle(navbarSlideOnStyle);
                return;
            }

            const delta = window.pageYOffset - offset[1];
            if (delta > 0) {
                setScrollDownTotal(scrollDownTotal + delta);
                // In expanded mode, we do not want the navbar to go away!
                if (scrollDownTotal > 50 && !props.isExpanded) {
                    setNavbarStyle(navbarSlideOffStyle);
                }
                setScrollUpTotal(0);
            }
            else {
                setScrollUpTotal(scrollUpTotal + delta);
                if (scrollUpTotal < -5) {
                    setNavbarStyle(navbarSlideOnStyle);
                }
                setScrollDownTotal(0);
            }
        };

        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });

    // Navbar is not collapsible on non-mobile, so it's never considered "expanded"
    return (
        <Navbar bg="dark" variant="dark" sticky="top" expand="md"
            style={{ minHeight: "70px", marginBottom: "20px", ...navbarStyle }}
            onToggle={(expanded) => {
                props.setIsExpanded(isMobile ? expanded : false);
            }}
        >
            {props.children}
        </Navbar >
    )
}

export default AutohidingNavbar;
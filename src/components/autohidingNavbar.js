import * as React from 'react'
import { Navbar } from 'react-bootstrap'
import useIsMobile from '../util/responsiveness'

const AutohidingNavbar = (props) => {
    const isMobile = useIsMobile()

    // Previous and current page offsets, to detect scrolling direction
    const [offset, setOffset] = React.useState([0, 0]);

    // Always show navbar when at the top of the page.
    // Otherwise, hide navbar when scrolling down, and show it when we scroll up by more than a certain threshold.
    // If we do not threshold the upwards scrolling, the navbar will constantly pop in and out due to scrolling noise.
    const navbarSlideOffStyle = { top: -300, transition: "all .5s ease" };
    const navbarSlideOnStyle = { top: 0, transition: "all .5s ease" };
    const [navbarStyle, setNavbarStyle] = React.useState(navbarSlideOnStyle);
    // Used for scrolling up thresholding logic
    const [scrollUpTotal, setScrollUpTotal] = React.useState(0);

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
                if (delta > 2) {
                    setScrollUpTotal(0);
                }
                setNavbarStyle(navbarSlideOffStyle);
            }
            else {
                setScrollUpTotal(scrollUpTotal + delta);
                if (scrollUpTotal < -2) {
                    setNavbarStyle(navbarSlideOnStyle);
                }
            }
        };
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    });

    return (
        <Navbar bg="dark" variant="dark" sticky="top" expand="md" collapseOnSelect
            style={{ minHeight: "70px", marginBottom: "20px", ...navbarStyle }}
            onToggle={(expanded) => { props.setIsExpanded(expanded) }}
        >
            {props.children}
        </Navbar >
    )
}

export default AutohidingNavbar;
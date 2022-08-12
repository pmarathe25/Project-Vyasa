import * as React from 'react';
import { Navbar } from 'react-bootstrap';
import useIsMobile from '../util/responsiveness';
import { clamp } from '../util/util';


export const NAVBAR_HEIGHT = 60;


const AutohidingNavbar = (props) => {
    const [previousYOffset, setPreviousYOffset] = React.useState(window.pageYOffset ?? 0);

    const [scrollLocation, setScrollLocation] = React.useState(0);

    // Don't hide the navbar when it's expanded on mobile
    const [navExpanded, setNavExpanded] = React.useState(false);
    const forceVisible = (!props.allowHide || navExpanded);

    React.useEffect(
        () => {
            if (typeof window === "undefined") {
                return;
            }

            const onScroll = () => {
                const delta = (previousYOffset - window.pageYOffset);
                setScrollLocation(clamp(scrollLocation + delta, -NAVBAR_HEIGHT, 0));
                setPreviousYOffset(window.pageYOffset);
            };

            window.removeEventListener('scroll', onScroll);
            window.addEventListener('scroll', onScroll, { passive: true });
            return () => window.removeEventListener('scroll', onScroll);
        },
        [previousYOffset, scrollLocation, forceVisible]
    );

    return (
        <Navbar variant={props.variant} sticky="top" expand="md"
            style={{
                boxShadow: "0px 1px 1px var(--shadow-color)",
                backgroundColor: "var(--navbar-background)",
                top: forceVisible ? 0 : scrollLocation,
                // Make the navbar appear as an overlay
                position: "fixed",
                width: "100%",
                zIndex: 2,
            }}
            // Navbar is never expandable on desktop
            onToggle={(expanded) => {
                setNavExpanded(expanded);
                setScrollLocation(0);
            }}
        >
            {props.children}
        </Navbar >
    )
}

export default AutohidingNavbar;
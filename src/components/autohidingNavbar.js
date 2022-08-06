import * as React from 'react'
import { Navbar } from 'react-bootstrap'
import useIsMobile from '../util/responsiveness'

function clamp(num, min, max) {
    return Math.max(Math.min(num, max), min)
}

const AutohidingNavbar = (props) => {
    const isMobile = useIsMobile()

    const [previousYOffset, setPreviousYOffset] = React.useState(0);

    // Always show navbar when at the top of the page.
    // Otherwise, hide navbar when scrolling down, and show it when we scroll up by more than a certain threshold.
    // If we do not threshold, the navbar will constantly pop in and out due to scrolling noise.
    const [forceVisible, setForceVisible] = React.useState(true);

    const [scrollLocation, setScrollLocation] = React.useState(0);

    React.useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const onScroll = () => {
            const NAVBAR_HEIGHT = 60;

            // Don't hide when it navbar is expanded.
            if (!props.allowCollapse || props.isExpanded) {
                setForceVisible(true);
                return;
            }
            else {
                setForceVisible(false);
            }

            // Use a multiplier to make the navbar disappear more slowly on desktop
            const delta = (previousYOffset - window.pageYOffset) * (isMobile ? 1 : 0.5);
            setScrollLocation(clamp(scrollLocation + delta, -NAVBAR_HEIGHT, 0));
            setPreviousYOffset(window.pageYOffset);
        };

        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    },
        [previousYOffset, scrollLocation,
            isMobile, props.isExpanded, props.allowCollapse]
    );

    return (
        <Navbar variant={props.variant} sticky="top" expand="md"
            style={{
                marginBottom: "30px",
                boxShadow: "0px 1px 1px var(--shadow-color)",
                backgroundColor: "var(--navbar-background)",
                top: forceVisible ? 0 : scrollLocation,
            }}
            // Navbar is never expandable on desktop
            onToggle={(expanded) => {
                props.setIsExpanded(isMobile ? expanded : false);
            }}
        >
            {props.children}
        </Navbar >
    )
}

export default AutohidingNavbar;
import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import useIsMobile from '../util/responsiveness'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import NavMenu from './navMenu'
import { SettingsContext, SettingsPanel } from './settingsPanel'
import SiteHelmet from './siteHelmet'

// Swaps the order of two components on mobile displays
const FlipOnMobile = ({ first, second }) => {
    const isMobile = useIsMobile();

    return (
        isMobile ?
            <>
                {second}
                {first}
            </>

            :
            <>
                {first}
                {second}
            </>

    );
}

const Layout = ({
    location, pageTitle, children,
    maxWidth = "var(--medium-content-width)",
    showTranslitButton = false,
    showTranslationButton = false,
    showCurrentPageInBreadcrumbs = true,
}) => {
    const data = useStaticQuery(graphql`
        query {
        site {
            siteMetadata {
            title
            }
        }
    }`)

    const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);

    const { useDarkMode } = React.useContext(SettingsContext);
    const variant = useDarkMode ? "dark" : "light";

    return (
        <div style={{
            fontFamily: "-apple-system, 'BlinkMacSystemFont', 'Oxygen', 'Cantarell', 'Segoe UI', 'Roboto', 'Open Sans', 'Helvetica Neue', 'Ubuntu', 'DejaVu Sans', sans-serif",
            paddingBottom: "500px",
            backgroundColor: "var(--background)",
            height: "100%",
        }}>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <SiteHelmet location={location} title={pageTitle} />
            <AutohidingNavbar
                allowCollapse={!showSettingsPanel}
                variant={variant}
            >
                <Container style={{
                    maxWidth: "var(--navbar-width)",
                }}>
                    <Navbar.Brand as={Link} to="/" >
                        Project Vyasa
                    </Navbar.Brand>

                    <FlipOnMobile
                        first={
                            <>
                                <Navbar.Toggle aria-controls="responsive-navbar-nav"
                                    style={{ border: "none", marginLeft: "auto" }}
                                />
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <NavMenu />
                                </Navbar.Collapse>
                            </>
                        }
                        second={
                            <SettingsPanel
                                show={showSettingsPanel} setShow={setShowSettingsPanel}
                                variant={variant}
                                showTranslitButton={showTranslitButton}
                                showTranslationButton={showTranslationButton}
                            />
                        }
                    />

                </Container>
            </AutohidingNavbar>
            <Container style={{
                maxWidth: maxWidth,
            }}>
                <ResponsiveBreadcrumbs location={location} showCurrentPage={showCurrentPageInBreadcrumbs} />
                {children}
            </Container>
        </div >
    )
}

export default Layout;
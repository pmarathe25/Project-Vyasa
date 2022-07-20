import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container } from './layout.module.css'
import NavMenu from './navMenu'
import { SettingsContext, SettingsPanel } from './settingsPanel'
import SiteHelmet from './siteHelmet'

const Layout = ({
    location, pageTitle, children,
    maxWidth = "var(--small-content-width)",
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

    const [navExpanded, setNavExpanded] = React.useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);

    const { useDarkMode } = React.useContext(SettingsContext);
    const variant = useDarkMode ? "dark" : "light";

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <SiteHelmet location={location} title={pageTitle} />
            <AutohidingNavbar
                isExpanded={navExpanded} setIsExpanded={setNavExpanded}
                allowCollapse={!showSettingsPanel}
                variant={variant}
            >
                <Container style={{
                    maxWidth: "var(--navbar-width)",
                }}>
                    <Link to="/" className={brandLink}>
                        Project Vyasa
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <NavMenu navExpanded={navExpanded} useClass="top-bar-links" />
                    </Navbar.Collapse>

                    <SettingsPanel
                        show={showSettingsPanel} setShow={setShowSettingsPanel}
                        variant={variant}
                        showTranslitButton={showTranslitButton}
                        showTranslationButton={showTranslationButton}
                    />

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
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
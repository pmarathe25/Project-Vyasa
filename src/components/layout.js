import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container } from './layout.module.css'
import NavMenu from './navMenu'
import { SettingsContext } from './settingsPanel'
import SiteHelmet from './siteHelmet'
import { ThemeToggle } from './themeToggle'
import { TranslationToggle } from './translationToggle'
import { TransliterationModeSelect } from './transliterationModeSelect'


const Layout = ({
    location, pageTitle, children,
    maxWidth = "var(--centered-content-width)",
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

    const { useDarkMode } = React.useContext(SettingsContext);

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <SiteHelmet location={location} title={pageTitle} />
            <AutohidingNavbar isExpanded={navExpanded} setIsExpanded={setNavExpanded} variant={useDarkMode ? "dark" : "light"}>
                <Container style={{
                    maxWidth: "var(--centered-content-width)",
                }}>
                    <Link to="/" className={brandLink}>
                        Project Vyasa
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <NavMenu navExpanded={navExpanded} useClass="top-bar-links" />
                        {showTranslitButton ? <TransliterationModeSelect navExpanded={navExpanded} /> : <></>}
                    </Navbar.Collapse>

                    {showTranslationButton ? <TranslationToggle navExpanded={navExpanded} /> : <></>}

                    <ThemeToggle />
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
import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container } from './layout.module.css'
import NavMenu from './navMenu'
import Seo from './seo'
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

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <Seo location={location} title={pageTitle} />
            <AutohidingNavbar isExpanded={navExpanded} setIsExpanded={setNavExpanded}>
                <Container style={{
                    maxWidth: "var(--centered-content-width)",
                    paddingLeft: "5px", paddingRight: "5px"
                }}>
                    <Link to="/" className={brandLink}>
                        Project Vyasa
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <NavMenu navExpanded={navExpanded} useClass="top-bar-links" />
                        {showTranslitButton ? <TransliterationModeSelect navExpanded={navExpanded} /> : <></>}
                    </Navbar.Collapse>

                    {showTranslationButton ? <TranslationToggle navExpanded={navExpanded} /> : <></>}

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </Container>
            </AutohidingNavbar>
            <Container style={{
                maxWidth: maxWidth,
                paddingLeft: "5px", paddingRight: "5px"
            }}>
                <ResponsiveBreadcrumbs location={location} showCurrentPage={showCurrentPageInBreadcrumbs} />
                {children}
            </Container>
        </div >
    )
}

export default Layout;
import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container } from './layout.module.css'
import Seo from './seo'
import { TranslationToggle } from './translationToggle'
import { TransliterationModeSelect } from './transliterationModeSelect'
import NavMenu from './navMenu'

const Layout = ({ location, pageTitle, children, maxWidth = "var(--centered-content-width)", showTextSettings = false }) => {
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
                <Container style={{ maxWidth: "var(--centered-content-width)" }}>
                    <Link to="/" className={brandLink}>
                        Project Vyasa
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <NavMenu navExpanded={navExpanded} useClass="top-bar-links" />
                        {showTextSettings ? <TransliterationModeSelect navExpanded={navExpanded} /> : <></>}
                    </Navbar.Collapse>

                    {showTextSettings ? <TranslationToggle navExpanded={navExpanded} /> : <></>}

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </Container>
            </AutohidingNavbar>
            <Container style={{ maxWidth: maxWidth }}>
                <ResponsiveBreadcrumbs location={location} />
                {children}
            </Container>
        </div >
    )
}

export default Layout;
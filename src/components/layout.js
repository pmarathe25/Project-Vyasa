import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { toUrl } from '../util/util'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container, navLink } from './layout.module.css'
import Seo from './seo'
import { TransliterationModeSelect } from './translitModeSelect'

const TopBarNavItem = (props) => {
    return (
        <Nav.Item
            style={{
                paddingBottom: props.navExpanded ? "10px" : 0,
                height: "fit-content",
                marginTop: "auto", marginBottom: "auto"
            }}
            key={props.keyName}
        >
            {props.children}
        </Nav.Item>
    );
}

const Layout = ({ location, pageTitle, children }) => {
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
                <Container>
                    <Link to="/" className={brandLink}>
                        Project Vyasa
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="top-bar-links">
                            <TopBarNavItem navExpanded={navExpanded} keyName="dictionary">
                                <Link to={toUrl("/dictionary")} className={navLink}>
                                    Dictionary
                                </Link>
                            </TopBarNavItem>
                            <TopBarNavItem navExpanded={navExpanded} keyName="about">
                                <Link to={toUrl("/about")} className={navLink}>
                                    About
                                </Link>
                            </TopBarNavItem>
                            <TopBarNavItem navExpanded={navExpanded} keyName="issues">
                                <Link to={toUrl("/issues")} className={navLink}>
                                    Issues?
                                </Link>
                            </TopBarNavItem>
                            <TopBarNavItem navExpanded={navExpanded} keyName="github" >
                                <a
                                    href="https://github.com/pmarathe25/Project-Vyasa"
                                    style={{ marginLeft: "12px" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <GoMarkGithub size={30} />
                                </a>
                            </TopBarNavItem>
                        </Nav>
                    </Navbar.Collapse>

                    <TransliterationModeSelect navExpanded={navExpanded} />

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </Container>
            </AutohidingNavbar>
            <Container>
                <ResponsiveBreadcrumbs location={location} />
                {children}
            </Container>
        </div >
    )
}

export default Layout;
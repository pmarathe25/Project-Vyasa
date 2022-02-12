import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { toUrl } from '../util/util'
import AllVersesMenu from './allVersesMenu'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container, content } from './layout.module.css'
import Seo from './seo'
import { useTransliterate } from './transliterationHook'
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

    const linkStyle = {
        width: "fit-content",
        marginTop: "auto", marginBottom: "auto",
        paddingLeft: 0, paddingRight: "20px"
    };

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title}</title>
            <Seo location={location} title={pageTitle} />
            <AutohidingNavbar setIsExpanded={setNavExpanded}>
                <Container style={{ justifyContent: "space-around" }}>
                    <Link to="/" className={brandLink} style={{ width: "fit-content", minWidth: "170px", margin: 0, padding: 0 }}>
                        Project {useTransliterate("vyaasa")}
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="top-bar-links">
                            <TopBarNavItem navExpanded={navExpanded} keyName="about">
                                <Link to={toUrl("/about")} style={linkStyle}>

                                    About
                                </Link>
                            </TopBarNavItem>
                            <TopBarNavItem navExpanded={navExpanded} keyName="github">
                                <a href="https://github.com/pmarathe25/Project-Vyasa">
                                    <GoMarkGithub size={35} />
                                </a>
                            </TopBarNavItem>
                        </Nav>
                        <TransliterationModeSelect navExpanded={navExpanded} />
                    </Navbar.Collapse>

                    <AllVersesMenu location={location} />

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </Container>
            </AutohidingNavbar>
            <main className={content}>
                <ResponsiveBreadcrumbs location={location} />
                {children}
            </main>
        </div >
    )
}

export default Layout
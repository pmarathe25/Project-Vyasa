import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Col, Container, Nav, Navbar } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import { toUrl } from '../util/util'
import AllVersesMenu from './allVersesMenu'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container, content } from './layout.module.css'
import Seo from './seo'
import { useTransliterate } from './transliterationHook'
import { TransliterationModeSelect } from './translitModeSelect'

const TopBarNavLink = (props) => {
    const linkStyle = {
        width: "fit-content",
        marginTop: "auto", marginBottom: "auto",
        paddingLeft: 0, paddingRight: "20px"
    };

    return (
        <Nav.Item
            style={{
                paddingBottom: props.navExpanded ? "10px" : 0,
                height: "fit-content",
                marginTop: "auto", marginBottom: "auto"
            }}
        >
            <Link to={props.to} style={linkStyle}>
                {props.children}
            </Link>
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
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <Seo location={location} title={pageTitle} />
            <AutohidingNavbar setIsExpanded={setNavExpanded}>
                <Container style={{ justifyContent: "space-around" }}>
                    <Link to="/" className={brandLink} style={{ width: "fit-content", minWidth: "170px", margin: 0, padding: 0 }}>
                        Project {useTransliterate("vyaasa")}
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav
                            className="top-bar-links"
                            style={{ width: "80%", display: "flex", margin: navExpanded ? "auto" : 0 }}
                        >
                            <Container>
                                <Col style={{ display: "flex" }}>
                                    <TopBarNavLink to={toUrl("/about")} navExpanded={navExpanded}>
                                        About
                                    </TopBarNavLink>
                                    <TopBarNavLink to={"https://github.com/pmarathe25/Project-Vyasa"} navExpanded={navExpanded}>
                                        <GoMarkGithub size={30} />
                                    </TopBarNavLink>
                                    <TransliterationModeSelect navExpanded={navExpanded} />
                                </Col>
                            </Container>
                        </Nav>
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
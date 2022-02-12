import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { GoMarkGithub } from "react-icons/go"
import useIsMobile from '../util/responsiveness'
import { toUrl } from '../util/util'
import AllVersesMenu from './allVersesMenu'
import AutohidingNavbar from './autohidingNavbar'
import ResponsiveBreadcrumbs from './breadcrumbs'
import { brandLink, container, content } from './layout.module.css'
import Seo from './seo'
import { useTransliterate } from './transliterationHook'
import { TransliterationModeSelect } from './translitModeSelect'

const CustomNavItem = (props) => {
    const isMobile = useIsMobile()

    return (
        <Nav.Item style={{ paddingBottom: isMobile ? "10px" : 0, height: "fit-content", margin: "auto" }}>
            {props.children}
        </Nav.Item>
    );
}

const TopBarNavLink = (props) => {
    const linkStyle = {
        width: "fit-content",
        marginTop: "auto", marginBottom: "auto",
        paddingLeft: 0, paddingRight: "20px"
    };

    return (
        <CustomNavItem>
            <Link to={props.to} style={linkStyle}>
                {props.children}
            </Link>
        </CustomNavItem>
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

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <Seo location={location} title={pageTitle} />
            <AutohidingNavbar>
                <Container style={{ justifyContent: "space-around" }}>
                    <Link to="/" className={brandLink} style={{ width: "fit-content", minWidth: "170px", margin: 0, padding: 0 }}>
                        Project {useTransliterate("vyaasa")}
                    </Link>

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="top-bar-links">
                            <TopBarNavLink to={toUrl("/about")}>
                                About
                            </TopBarNavLink>
                            <TopBarNavLink to={"https://github.com/pmarathe25/Project-Vyasa"}>
                                <GoMarkGithub size={30} /> GitHub
                            </TopBarNavLink>
                            <CustomNavItem>
                                <TransliterationModeSelect />
                            </CustomNavItem>
                            <CustomNavItem>
                            </CustomNavItem>
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
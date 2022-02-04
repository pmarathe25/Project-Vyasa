import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Breadcrumb, Container, Navbar, Offcanvas } from 'react-bootstrap'
import { titleCaseFromUrl } from '../util/util'
import {
    container, content, navLinkItem, navSideBar, navSideBarToggle
} from './layout.module.css'
import { SideBar } from './sidebar'
import { useTransliterate } from './transliterationHook'
import { TransliterationModeSelect } from './translitModeSelect'

const Layout = ({ location, pageTitle, children }) => {
    const data = useStaticQuery(graphql`
        query {
        site {
            siteMetadata {
            title
            }
        }
        }`)


    let breadcrumbStyle = {
        fontSize: "18px"
    };
    let breadcrumbs = [
        <Breadcrumb.Item style={breadcrumbStyle}>
            <Link to="/" >
                Home
            </Link>
        </Breadcrumb.Item>
    ];
    let curPath = "/";
    for (let pathElement of location.pathname.split("/").slice(1)) {
        curPath += pathElement;
        breadcrumbs.push(
            <Breadcrumb.Item style={breadcrumbStyle}>
                <Link to={curPath} >
                    {titleCaseFromUrl(pathElement)}
                </Link>
            </Breadcrumb.Item>
        );
        curPath += "/";
    }

    const [sideBarExpanded, setSideBarExpanded] = React.useState(false);

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <Navbar bg="dark" variant="dark" fixed="top" expand={false}>
                <Container>
                    <Navbar.Brand style={{ margin: 0 }}>
                        <Link to="/" className={navLinkItem}>
                            Project {useTransliterate("vyaasa")}
                        </Link>
                    </Navbar.Brand>
                    <TransliterationModeSelect />
                    <Navbar.Toggle
                        aria-controls="offcanvasNavbar"
                        className={navSideBarToggle}
                        onClick={() => setSideBarExpanded(true)}
                        style={{ width: "10%", minWidth: "80px" }}
                    >
                        <p style={{ fontVariant: "small-caps", fontSize: "18px" }}>
                            All Verses
                        </p>
                    </Navbar.Toggle>

                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        variant="dark"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="end"
                        scroll={true}
                        show={sideBarExpanded}
                        onHide={() => setSideBarExpanded(false)}
                    >
                        <Offcanvas.Header closeButton className={navSideBar} onClick={() => setSideBarExpanded(false)} />
                        <Offcanvas.Body variant="dark" className={navSideBar}>
                            <SideBar location={location} setSideBarExpanded={setSideBarExpanded}></SideBar>
                        </Offcanvas.Body >
                    </Navbar.Offcanvas >
                </Container>
            </Navbar>
            <main className={content}>
                <Breadcrumb>
                    {breadcrumbs}
                </Breadcrumb>
                {children}
            </main>
        </div >
    )
}

export default Layout
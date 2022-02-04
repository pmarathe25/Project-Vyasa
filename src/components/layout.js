import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Breadcrumb, BreadcrumbItem, Container, Navbar, Offcanvas } from 'react-bootstrap'
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

    let breadcrumbs = [
        <BreadcrumbItem>
            <Link to="/">
                Home
            </Link>
        </BreadcrumbItem>
    ];
    let curPath = "/";
    for (let pathElement of location.pathname.split("/").slice(1)) {
        curPath += pathElement;
        breadcrumbs.push(
            <BreadcrumbItem>
                <Link to={curPath}>
                    {titleCaseFromUrl(pathElement)}
                </Link>
            </BreadcrumbItem>
        );
        curPath += "/";
    }

    const [sideBarExpanded, setSideBarExpanded] = React.useState(false);

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <Navbar bg="dark" variant="dark" fixed="top" expand={false}>
                <Container>
                    <Navbar.Brand>
                        <Link to="/" className={navLinkItem}>
                            Project {useTransliterate("vyaasa")}
                        </Link>
                    </Navbar.Brand>
                    <TransliterationModeSelect />
                    <Navbar.Toggle aria-controls="offcanvasNavbar" className={navSideBarToggle} onClick={() => setSideBarExpanded(true)}>
                        <p style={{ fontVariant: "small-caps" }}>
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
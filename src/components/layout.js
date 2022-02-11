import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Breadcrumb, Container, Navbar, Offcanvas, Row } from 'react-bootstrap'
import { toUrl, titleCaseFromUrl } from '../util/util'
import {
    container, content, brandLink, navSideBar, navSideBarToggle
} from './layout.module.css'
import { SideBar } from './sidebar'
import { useTransliterate } from './transliterationHook'
import { TransliterationModeSelect } from './translitModeSelect'
import useIsMobile from '../util/responsiveness'
import AutohidingNavbar from './autohidingNavbar'

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
        <Breadcrumb.Item key="/" linkProps={{ "to": "/" }} linkAs={Link} style={breadcrumbStyle}>
            Home
        </Breadcrumb.Item>
    ];
    let curPath = "/";
    for (let pathElement of location.pathname.split("/").slice(1)) {
        curPath += pathElement;
        breadcrumbs.push(
            <Breadcrumb.Item key={"nested" + curPath} linkProps={{ "to": curPath }} linkAs={Link} style={breadcrumbStyle}>
                {titleCaseFromUrl(pathElement)}
            </Breadcrumb.Item>
        );
        curPath += "/";
    }

    const [sideBarExpanded, setSideBarExpanded] = React.useState(false);
    const isMobile = useIsMobile()


    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <AutohidingNavbar>
                <Container style={{ justifyContent: "space-around" }}>
                    <Row style={{ display: "flex" }}>
                        <Link to="/" className={brandLink} style={{ width: "fit-content", minWidth: "170px", margin: 0, padding: 0 }}>
                            Project {useTransliterate("vyaasa")}
                        </Link>
                        <Link to={toUrl("/about")} style={{ width: "fit-content", margin: "auto" }}>
                            About
                        </Link>
                    </Row>
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
            </AutohidingNavbar>
            <main className={content}>
                {
                    (isMobile) ?
                        <></>
                        :
                        <Breadcrumb>
                            {breadcrumbs}
                        </Breadcrumb>
                }
                <div style={{ paddingBottom: (isMobile ? "30px" : "5px") }} />
                {children}
            </main>
        </div >
    )
}

export default Layout
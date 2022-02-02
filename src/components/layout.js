import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Breadcrumb, BreadcrumbItem, Container, Navbar, Offcanvas } from 'react-bootstrap'
import { titleCaseFromUrl } from '../util/util'
import {
    container, content, navLinkItem
} from './layout.module.css'
import { SideBar } from './sidebar'
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

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <Navbar bg="dark" variant="dark" fixed="top" expand={false}>
                <Container>
                    <Navbar.Brand>
                        <Link to="/" className={navLinkItem}>
                            Project Vyasa
                        </Link>
                    </Navbar.Brand>
                    <TransliterationModeSelect />
                    <Navbar.Toggle aria-controls="offcanvasNavbar" />

                    <Navbar.Offcanvas
                        id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" placement="end" backdrop={false} scroll={true}>
                        <Offcanvas.Header closeButton>
                        </Offcanvas.Header >
                        <Offcanvas.Body>
                            <SideBar location={location}></SideBar>
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
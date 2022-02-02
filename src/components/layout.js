import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Container, Navbar, Offcanvas } from 'react-bootstrap'
import {
    container, content, heading, navLinkItem
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
                <h1 className={heading}>{pageTitle}</h1>
                {children}
            </main>
        </div >
    )
}

export default Layout
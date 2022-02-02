import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import {
    container, content, heading, navLinkItem, topBar
} from './layout.module.css'
import { TransliterationModeSelect } from './translitModeSelect'
import { SideBar } from './sidebar'
import { Navbar, Container } from 'react-bootstrap'


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
                    <SideBar location={location}></SideBar>
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
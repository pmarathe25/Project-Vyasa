import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import {
    container, content, heading, navLinkItem, topBar
} from './layout.module.css'
import { TransliterationModeSelect } from './translitModeSelect'
import { SideBar } from './sidebar'


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
            <header>
                <nav className={topBar}>
                    <Link to="/" className={navLinkItem}>
                        Project Vyasa
                    </Link>
                    <TransliterationModeSelect />
                </nav>
            </header>
            <SideBar location={location}></SideBar>
            <main className={content}>
                <h1 className={heading}>{pageTitle}</h1>
                {children}
            </main>
        </div >
    )
}

export default Layout
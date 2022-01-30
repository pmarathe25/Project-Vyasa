import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import {
    container,
    heading, navLinkItem, navLinks, navLinkText, siteTitle
} from './layout.module.css'
import { TransliterationModeSelect } from './translitModeSelect'

const Layout = ({ pageTitle, children }) => {
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
            <header className={siteTitle}>{data.site.siteMetadata.title}</header>
            <TransliterationModeSelect />
            <nav>
                <ul className={navLinks}>
                    <li className={navLinkItem} key="/">
                        <Link to="/" className={navLinkText}>
                            Home
                        </Link>
                    </li>
                </ul>
            </nav>
            <main>
                <h1 className={heading}>{pageTitle}</h1>
                {children}
            </main>
        </div >
    )
}

export default Layout
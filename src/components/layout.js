import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import {
    container,
    heading, navLinkItem, navLinks, navLinkText, siteTitle
} from './layout.module.css'
import { TranslitModeContext } from './translitModeContext'


const TransliterationModeSelect = () => {
    // 0: Devanagari, 1: IAST
    return (
        <TranslitModeContext.Consumer>
            {({ mode, setMode }) =>
                <div>
                    <button onClick={() => { setMode(0) }} style={{ opacity: mode === 0 ? 1.0 : 0.6 }}>
                        Devanagari
                    </button>
                    <button onClick={() => { setMode(1) }} style={{ opacity: mode === 1 ? 1.0 : 0.6 }}>
                        IAST
                    </button>
                </div >
            }
        </TranslitModeContext.Consumer>
    )
}



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
                    <li className={navLinkItem}>
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
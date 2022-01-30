import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import {
    container,
    heading, navLinkItem, navLinks, navLinkText, siteTitle
} from './layout.module.css'


const TransliterationModeSelect = ({ value, setValue }) => {
    return (
        <div>
            <button onClick={() => { setValue(0) }} style={{ opacity: value === 0 ? 1.0 : 0.6 }}>
                Devanagari
            </button>
            <button onClick={() => { setValue(1) }} style={{ opacity: value === 1 ? 1.0 : 0.6 }}>
                IAST
            </button>
        </div >
    )
}

export const TranslitModeContext = React.createContext(0);


const Layout = ({ pageTitle, children }) => {
    const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }`)

    // 0: Devanagari, 1: IAST
    const [translitMode, setTranslitMode] = React.useState(0);

    return (
        <div className={container}>
            <title>{pageTitle} | {data.site.siteMetadata.title} </title>
            <header className={siteTitle}>{data.site.siteMetadata.title}</header>
            <TransliterationModeSelect value={translitMode} setValue={setTranslitMode} />
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
                <TranslitModeContext.Provider value={translitMode}>
                    {children}
                </TranslitModeContext.Provider>
            </main>
        </div >
    )
}

export default Layout
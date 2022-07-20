import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import { Helmet } from "react-helmet"
import useIsMobile from "../util/responsiveness"
import { SettingsContext } from './settingsPanel'

const SiteHelmet = ({ location, title, description }) => {
    const { site } = useStaticQuery(query)
    const isMobile = useIsMobile();

    const {
        defaultTitle,
        titleTemplate,
        defaultDescription,
        siteUrl,
    } = site.siteMetadata;

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        url: `${siteUrl}${location.pathname}`,
    }

    const { useDarkMode, translitMode } = React.useContext(SettingsContext);
    const theme = useDarkMode ? "dark" : "light";

    return (
        <Helmet title={seo.title} titleTemplate={titleTemplate} htmlAttributes={{
            lang: "en",
            "data-theme": theme,
            "data-font-size": (isMobile ? "mobile" : "desktop") + "-" + translitMode,
        }}>
            <meta name="description" content={seo.description} />
            {seo.url && <meta property="og:url" content={seo.url} />}
            {seo.title && <meta property="og:title" content={seo.title} />}
            {
                seo.description && (
                    <meta property="og:description" content={seo.description} />
                )
            }
        </Helmet >
    )
}

export default SiteHelmet;

const query = graphql`
query {
    site {
        siteMetadata {
            defaultTitle: title
            titleTemplate
            defaultDescription: description
            siteUrl: url
        }
    }
}
`
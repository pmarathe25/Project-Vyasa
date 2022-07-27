import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../../components/layout'
import { SettingsContext } from '../../../components/settingsPanel'
import { useTransliterate } from '../../../components/transliterationHook'
import Verse from '../../../components/verse'

const SectionTitle = ({ data }) => {
    const tranlistSection = useTransliterate(data.textJson.section);

    return (
        <h2 style={{ marginBottom: "5px" }}>{tranlistSection}</h2>
    );
}

const SectionSubtitle = ({ data }) => {
    const tranlistSectionName = useTransliterate(data.textJson.sectionName);

    return (
        <h5 style={{ color: "var(--text-tertiary)", marginBottom: "5px" }}>{tranlistSectionName}</h5>
    );
}

const Section = ({ location, data }) => {
    const { showTranslation, } = React.useContext(SettingsContext);

    return (
        <Layout
            location={location} pageTitle={data.textJson.section}
            maxWidth={showTranslation ? "var(--max-content-width)" : "var(--small-content-width)"}
            showTranslitButton={true}
            showTranslationButton={true}
        >
            <SectionTitle data={data} />
            <SectionSubtitle data={data} />
            < p style={{ textAlign: "center", color: "var(--text-alternate)", fontSize: "var(--tertiary-font-size", marginBottom: "30px" }}>
                Click or tap on Sanskrit text to see word-level analysis
            </p >
            {
                data.textJson.verses.map((node, index) =>
                    <Verse
                        key={index}
                        text={node.text}
                        wordByWord={node.wordByWord} translation={node.translation}
                    />
                )
            }
        </Layout >
    )
}

export const query = graphql`
query ($id: String) {
    textJson(id: {eq: $id}) {
        id
        section
        sectionName
        verses {
            text
            wordByWord
            translation
        }
    }
  }
`

export default Section;
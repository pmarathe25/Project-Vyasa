import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../../components/layout'
import { SettingsContext } from '../../../components/settingsPanel'
import { useTransliterate } from '../../../components/transliterationHook'
import Verse from '../../../components/verse'

const Section = ({ location, data }) => {
    const { showTranslation, } = React.useContext(SettingsContext);
    const tranlistSection = useTransliterate(data.textJson.section);

    return (
        <Layout
            location={location} pageTitle={data.textJson.section}
            maxWidth={showTranslation ? "var(--max-content-width)" : "var(--centered-verse-content-width)"}
            showTranslitButton={true}
            showTranslationButton={true}
        >
            < p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "14.75px", marginBottom: "10px" }}>
                Click or tap on verses to see word-level analysis.
            </p >
            <h2>{tranlistSection}</h2>
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
        verses {
            text
            wordByWord
            translation
        }
    }
  }
`

export default Section;
import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../../components/layout'
import { SettingsContext } from '../../../components/settingsContext'
import Verse from '../../../components/verse'

const Section = ({ location, data }) => {
    const { showTranslation, } = React.useContext(SettingsContext);

    return (
        <Layout
            location={location} pageTitle={data.textJson.section}
            maxWidth={showTranslation ? "var(--max-content-width)" : "var(--centered-content-width)"}
            showTranslitButton={true}
            showTranslationButton={true}
        >
            < p style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "14.75px" }}>
                Click or tap on verses to see word-level analysis.
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
        verses {
            text
            wordByWord
            translation
        }
    }
  }
`

export default Section;
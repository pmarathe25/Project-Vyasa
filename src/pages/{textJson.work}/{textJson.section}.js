import { graphql } from 'gatsby'
import * as React from 'react'
import { Container } from 'react-bootstrap'
import Layout from '../../components/layout'
import { SettingsContext } from '../../components/settingsContext'
import Verse from '../../components/verse'

const Section = ({ location, data }) => {
    const { showTranslation, } = React.useContext(SettingsContext);

    return (
        <Layout location={location} pageTitle={data.textJson.section}>
            <p style={{ textAlign: "center", color: "var(--text-dark-gray-color)" }}>
                Click or tap on verses to see a detailed breakdown.
            </p>

            <Container
                style={{
                    marginLeft: "auto", marginRight: "auto",
                    maxWidth: showTranslation ? "inherit" : "var(--inner-content-max-width)",
                    padding: "0px"
                }}
            >
                {
                    data.textJson.verses.map((node, index) =>
                        <Verse
                            key={index}
                            text={node.text}
                            wordByWord={node.wordByWord} translation={node.translation}
                        />
                    )
                }
            </Container>
        </Layout>
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
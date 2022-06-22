import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../components/layout'
import Verse from '../../components/verse'

const Chapter = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle={data.textJson.chapter}>
            <p style={{ textAlign: "center", paddingBottom: "10px", color: "var(--text-dark-gray-color)" }}>
                Click on verses to see a detailed breakdown
            </p>
            {
                data.textJson.verses.map(node =>
                    <Verse
                        key={node.num}
                        num={node.num} text={node.text}
                        wordByWord={node.wordByWord} translation={node.translation}
                    />
                )
            }
        </Layout>
    )
}

export const query = graphql`
query ($id: String) {
    textJson(id: {eq: $id}) {
        id
        chapter
        verses {
            num
            text
            wordByWord
            translation
        }
    }
  }
`

export default Chapter;
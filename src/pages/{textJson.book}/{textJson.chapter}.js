import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../components/layout'
import Verse from '../../components/verse'

const Chapter = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle={data.textJson.chapter}>
            {
                data.textJson.verses.map((node, index) =>
                    <div style={{ paddingBottom: "20px" }}>
                        <Verse num={index} text={node.text} wordByWord={node.wordByWord} translation={node.translation} />
                    </div>
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
            text
            wordByWord
            translation
        }
    }
  }  
`

export default Chapter;
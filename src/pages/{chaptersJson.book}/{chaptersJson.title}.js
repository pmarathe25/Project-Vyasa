import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../../components/layout'
import Verse from '../../components/verse'

const Chapter = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle={data.chaptersJson.title}>
            {
                data.chaptersJson.verses.map(node =>
                    <Verse text={node.text} wordByWord={node.wordByWord} />
                )
            }
        </Layout>
    )
}

export const query = graphql`
query ($id: String) {
    chaptersJson(id: {eq: $id}) {
        id
        title
        verses {
            text
            wordByWord
        }
    }
  }  
`

export default Chapter;
import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import ChapterPage from './chapter'


const IndexPage = ({ data }) => {
    return (
        <Layout pageTitle="Project Vyasa">
            {
                data.allContentJson.nodes.map(node => (
                    <ChapterPage verses={node.verses}></ChapterPage>
                ))
            }
        </Layout >
    )
}


export const query = graphql`
query {
    allContentJson {
        nodes {
            verses {
                word_by_word
                text
            }
            title
            id
        }
    }
}
`

export default IndexPage
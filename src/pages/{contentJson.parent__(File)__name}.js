import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import { transliterate } from '../util/transliterator'


const Verse = ({ text, word_by_word }) => {
    const trie = require("../../build/devanagari_trie.json");

    return (
        <p>
            {transliterate(text, trie)}
        </p>
    )
}

const BlogPost = ({ data }) => {
    return (
        <Layout pageTitle={data.contentJson.title}>
            {
                data.contentJson.verses.map(node =>
                    <Verse text={node.text} word_by_word={node.word_by_word} />
                )
            }
        </Layout>
    )
}

export const query = graphql`
query ($id: String) {
    contentJson(id: {eq: $id}) {
        id
        title
        verses {
            text
            word_by_word
        }
    }
  }  
`

export default BlogPost;
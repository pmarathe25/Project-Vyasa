import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'


const BlogPost = ({ data }) => {
  return (
    <Layout pageTitle={data.contentJson.title}>
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
import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const ChapterIndex = ({ data, pageContext }) => {
    return (
        <Layout pageTitle={pageContext.book}>
            {
                data.allChaptersJson.nodes.map(node => (
                    <Link to={toUrl(`${node.title}`)}>
                        {node.title}
                    </Link>
                ))
            }
        </Layout >
    )
}

export const query = graphql`
query ($book: String) {
    allChaptersJson(filter: {book: {eq: $book}}) {
      nodes {
        title
      }
    }
  }
`


export default ChapterIndex
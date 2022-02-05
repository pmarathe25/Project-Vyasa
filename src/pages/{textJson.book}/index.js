import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const ChapterLink = ({ chapter }) => {
    return (
        <Link to={toUrl(chapter)} style={{ textDecoration: "none" }}>
            <ListGroup.Item variant="dark" eventKey={chapter}>
                <p style={{ fontSize: "20px" }}>
                    {chapter}
                </p>
            </ListGroup.Item>
        </Link>
    )
}

const ChapterIndex = ({ location, data, pageContext }) => {
    return (
        <Layout location={location} pageTitle={pageContext.book}>
            <ListGroup>
                {
                    data.allTextJson.nodes.map(node => (
                        <ChapterLink chapter={node.chapter} />
                    ))
                }
            </ListGroup>
        </Layout >
    )
}

export const query = graphql`
query ($book: String) {
    allTextJson(filter: {book: {eq: $book}}) {
      nodes {
        chapter
      }
    }
  }
`

export default ChapterIndex
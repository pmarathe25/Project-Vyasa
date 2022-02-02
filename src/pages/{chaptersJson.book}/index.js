import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const ChapterIndex = ({ location, data, pageContext }) => {
    return (
        <Layout location={location} pageTitle={pageContext.book}>
            <ListGroup>
                {
                    data.allChaptersJson.nodes.map(node => (
                        <Link to={toUrl(`${node.title}`)}>
                            <ListGroupItem variant="dark" eventKey={node.title}>
                                <p>{node.title}</p>
                            </ListGroupItem>
                        </Link>
                    ))
                }
            </ListGroup>
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
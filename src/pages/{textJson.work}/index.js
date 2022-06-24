import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const BookLink = ({ book }) => {
    return (
        <Link to={toUrl(book)} style={{ textDecoration: "none" }}>
            <ListGroup.Item variant="dark" eventKey={book}>
                <p style={{ fontSize: "17px" }}>
                    {book}
                </p>
            </ListGroup.Item>
        </Link>
    )
}

const BookIndex = ({ location, data, pageContext }) => {
    return (
        <Layout location={location} pageTitle={pageContext.work}>
            <ListGroup style={{
                maxWidth: "var(--content-max-width)",
                marginRight: "auto", marginLeft: "auto",
                borderRadius: "7px",
            }}>
                {
                    data.allTextJson.nodes.map(node => (
                        <BookLink key={node.book} book={node.book} />
                    ))
                }
            </ListGroup>
        </Layout >
    )
}

export const query = graphql`
query ($work: String) {
    allTextJson(filter: {work: {eq: $work}}) {
      nodes {
        book
      }
    }
  }
`

export default BookIndex
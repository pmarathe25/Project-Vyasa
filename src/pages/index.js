import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../components/layout'
import toUrl from '../util/util'

const BookLink = ({ book }) => {
    return (
        <Link to={toUrl(book)} style={{ textDecoration: "none" }}>
            <ListGroup.Item variant="dark" eventKey={book}>
                <p style={{ fontSize: "20px" }}>
                    {book}
                </p>
            </ListGroup.Item>
        </Link>
    )
}

const Index = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle="Project Vyasa">
            <ListGroup>
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
query {
    allTextJson {
        nodes {
            book
            id
        }
    }
}
`

export default Index
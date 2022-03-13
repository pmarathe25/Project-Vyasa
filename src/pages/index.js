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
            <p style={{ width: "65%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: "25px" }}>
                Welcome to Project Vyasa!
            </p>
            <br />
            <p style={{ marginBottom: "40px", width: "80%", marginLeft: "auto", marginRight: "auto", fontSize: "18px", whiteSpace: "pre-wrap" }}>
                If this is your first time here, you may want to check out
                the <Link to={toUrl("/about")}>About</Link> page.
                Otherwise, click one of the rows below or use the <b>All Verses</b> button in the top-right
                to get started!
            </p>
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
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
            <p style={{ marginBottom: "40px", width: "65%", marginLeft: "auto", marginRight: "auto", fontSize: "18px", whiteSpace: "pre-wrap" }}>
                The goal of this project is to provide a high-quality Sanskrit-English reader
                for the Mahabharata in a modern web interface. That includes literal word-by-word
                translations as well as grammatical analysis. Finally, an overall translation of
                each verse is provided to tie it all together.
                <br />
                <br />
                It is <b>not</b> the aim of this project to provide anything more than a
                literally correct translation; that is, the included translations do not
                consider the broader cultural, historical, and philosophical context of the text.
                <br />
                <br />
                If this is your first time here, you may want to check out
                the <Link to={toUrl("/how_to_use")}>How To Use</Link> page.
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
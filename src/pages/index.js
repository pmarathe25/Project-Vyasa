import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import Layout from '../components/layout'
import toUrl from '../util/util'

const Index = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle="Project Vyasa">
            <ListGroup>
                {
                    data.allChaptersJson.nodes.map(node => (
                        <Link to={toUrl(node.book)}>
                            <ListGroupItem variant="dark" eventKey={node.book}>
                                <p>{node.book}</p>
                            </ListGroupItem>
                        </Link>
                    ))
                }
            </ListGroup>
        </Layout >
    )
}


export const query = graphql`
query {
    allChaptersJson {
        nodes {
            title
            book
            id
        }
    }
}
`

export default Index
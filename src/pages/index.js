import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import toUrl from '../util/util'

const Index = ({ data }) => {
    return (
        <Layout pageTitle="Project Vyasa">
            <ol>
                {
                    data.allChaptersJson.nodes.map(node => (
                        <li key={node.book}>
                            <Link to={toUrl(`${node.book}/`)}>
                                {node.book}
                            </Link>
                        </li>
                    ))
                }
            </ol>
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
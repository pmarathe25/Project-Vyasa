import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import toUrl from '../util/util'

const IndexPage = ({ data }) => {
    return (
        <Layout pageTitle="Project Vyasa">
            {
                data.allChaptersJson.nodes.map(node => (
                    <Link to={toUrl(`${node.book}/${node.parent.name}`)}>
                        {node.title}
                    </Link>
                ))
            }
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
            parent {
                ... on File {
                  id
                  name
                }
              }
        }
    }
}
`

export default IndexPage
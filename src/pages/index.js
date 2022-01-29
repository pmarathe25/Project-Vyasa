import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'


const IndexPage = ({ data }) => {
    return (
        <Layout pageTitle="Project Vyasa">
            {
                data.allContentJson.nodes.map(node => (
                    <Link to={`/${node.parent.name}`}>
                        {node.title}
                    </Link>
                ))
            }
        </Layout >
    )
}


export const query = graphql`
query {
    allContentJson {
        nodes {
            title
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
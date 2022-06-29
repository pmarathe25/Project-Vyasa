import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { Row } from 'react-bootstrap'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const WorkLink = ({ work }) => {
    return (
        <Row style={{ margin: "0px", padding: "0px" }}>
            <Link to={toUrl(work)} style={{ fontSize: "20px", padding: "0px", margin: "0px" }}>
                {work}
            </Link>
        </Row>
    )
}

const Texts = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle="Texts">
            <h2>Texts</h2>
            {
                data.allTextJson.group.map(group => (
                    <WorkLink key={group.nodes[0].work} work={group.nodes[0].work} />
                ))
            }
        </Layout >)

}


export const query = graphql`
{
    allTextJson {
      group(field: work) {
        nodes {
              work
        }
      }
    }
  }
`

export default Texts;
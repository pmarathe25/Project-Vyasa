import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../../components/layout'
import toUrl from '../../util/util'

const SectionLink = ({ section }) => {
    return (
        <Link to={toUrl(section)} style={{ textDecoration: "none" }}>
            <ListGroup.Item variant="dark" eventKey={section}>
                <p style={{ fontSize: "17px" }}>
                    {section}
                </p>
            </ListGroup.Item>
        </Link>
    )
}

const SectionIndex = ({ location, data, pageContext }) => {
    return (
        <Layout location={location} pageTitle={pageContext.work}>
            <ListGroup style={{
                maxWidth: "var(--content-max-width)",
                marginRight: "auto", marginLeft: "auto",
                borderRadius: "7px",
            }}>
                {
                    data.allTextJson.nodes.map(node => (
                        <SectionLink key={node.section} section={node.section} />
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
        section
      }
    }
  }
`

export default SectionIndex
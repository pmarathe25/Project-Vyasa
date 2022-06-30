import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import Layout from '../../../components/layout'

const SectionLink = ({ section, to }) => {
    return (
        <Col>
            <Link to={to} style={{ fontSize: "20px" }}>
                {section}
            </Link>
        </Col>
    )
}

const SectionIndex = ({ location, data, pageContext }) => {
    // Sections are split up into groups. Each group gets its own row.
    let rows = [];
    for (let index in data.allTextJson.group) {
        const group = data.allTextJson.group[index];
        rows.push(
            <Row key={index} sm="auto">
                {
                    group.nodes.map(node =>
                        <SectionLink key={node.section} section={node.section} to={node.sectionPath} />
                    )
                }
            </Row>
        );
    }


    return (
        <Layout location={location} pageTitle={pageContext.work}>
            <h2>{pageContext.work}</h2>
            {rows}
        </Layout >
    )
}

export const query = graphql`
query ($work: String) {
    allTextJson(filter: {work: {eq: $work}}) {
      group(field: group) {
        nodes {
              section
              sectionPath: gatsbyPath(filePath: "/texts/{textJson.work}/{textJson.section}")
        }
      }
    }
  }
`

export default SectionIndex
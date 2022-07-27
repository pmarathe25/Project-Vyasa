import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import Layout from '../../../components/layout'
import { useTransliterate } from '../../../components/transliterationHook'

const SectionLink = ({ section, to }) => {
    const translitSection = useTransliterate(section);

    return (
        <Col>
            <Link to={to} style={{ fontSize: "var(--sanskrit-large-font-size)" }}>
                {translitSection}
            </Link>
        </Col>
    )
}

const SectionIndex = ({ location, data, pageContext }) => {
    const translitWork = useTransliterate(data.allTextJson.group[0].nodes[0].workSanskritName);

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
        <Layout location={location} pageTitle={pageContext.work}
            showTranslitButton={true}
            maxWidth="var(--small-content-width)"
        >
            <h2>{translitWork}</h2>
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
                workSanskritName
            }
        }
    }
}
`

export default SectionIndex
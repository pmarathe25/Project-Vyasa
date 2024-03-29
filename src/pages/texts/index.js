import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { Row } from 'react-bootstrap'
import Layout from '../../components/layout'
import { useTransliterate } from '../../components/transliterationHook'

const WorkLink = ({ workSanskritName, to }) => {
    const translitWorkSanskritName = useTransliterate(workSanskritName);

    return (
        <Link to={to} style={{
            fontSize: "var(--sanskrit-extra-large-font-size)",
            padding: "0px", margin: "0px"
        }}>
            {translitWorkSanskritName}
        </Link>
    )
}

const Texts = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle="Texts"
            showTranslitButton={true}
            maxWidth="var(--small-content-width)"
        >
            <h2>Texts</h2>
            {
                data.allTextJson.group.map(group => (
                    <Row key={group.nodes[0].work}
                        style={{ margin: "0px", padding: "0px", width: "fit-content" }}
                    >
                        <WorkLink
                            workSanskritName={group.nodes[0].workSanskritName}
                            to={group.nodes[0].workPath}
                        />
                    </Row>
                ))
            }
        </Layout >)

}


export const query = graphql`{
    allTextJson {
        group(field: work) {
            nodes {
              work
              workSanskritName
              workPath: gatsbyPath(filePath: "/texts/{textJson.work}")
            }
        }
    }
}
`

export default Texts;
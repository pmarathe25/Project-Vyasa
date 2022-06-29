import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { Container, Row } from 'react-bootstrap'
import Layout from '../components/layout'
import toUrl from '../util/util'

const WorkLink = ({ work }) => {
    return (
        <Row>
            <Link to={toUrl(work)} style={{ fontSize: "20px" }}>
                {work}
            </Link>
        </Row>
    )
}

const Index = ({ location, data }) => {
    return (
        <Layout location={location} pageTitle="Project Vyasa">
            <p style={{ width: "65%", textAlign: "center", marginLeft: "auto", marginRight: "auto", fontSize: "25px" }}>
                Welcome to Project Vyasa!
            </p>
            <br />
            <p style={{ marginBottom: "40px", width: "80%", marginLeft: "auto", marginRight: "auto", fontSize: "18px", whiteSpace: "pre-wrap" }}>
                If this is your first time here, you may want to check out
                the <Link to={toUrl("/about")}>About</Link> page.
                Otherwise, click on one of the works below to get started.
            </p>
            <Container style={{
                maxWidth: "var(--inner-content-max-width)",
                marginRight: "auto", marginLeft: "auto",
                borderRadius: "7px",
            }}>
                {
                    data.allTextJson.group.map(group => (
                        <WorkLink key={group.nodes[0].work} work={group.nodes[0].work} />
                    ))
                }
            </Container>
        </Layout >
    )
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

export default Index
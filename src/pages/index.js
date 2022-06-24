import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../components/layout'
import toUrl from '../util/util'

const WorkLink = ({ work }) => {
    return (
        <Link to={toUrl(work)} style={{ textDecoration: "none" }}>
            <ListGroup.Item variant="dark" eventKey={work}>
                <p style={{ fontSize: "17px" }}>
                    {work}
                </p>
            </ListGroup.Item>
        </Link>
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
            <ListGroup style={{
                maxWidth: "var(--content-max-width)",
                marginRight: "auto", marginLeft: "auto",
                borderRadius: "7px",
            }}>
                {
                    data.allTextJson.nodes.map(node => (
                        <WorkLink key={node.work} work={node.work} />
                    ))
                }
            </ListGroup>
        </Layout >
    )
}


export const query = graphql`
query {
    allTextJson {
        nodes {
            work
            id
        }
    }
}
`

export default Index
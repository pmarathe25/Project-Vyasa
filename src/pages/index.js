import { Link } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import toUrl from '../util/util'
import NavMenu from '../components/navMenu'

const Index = ({ location }) => {
    return (
        <Layout location={location} pageTitle="Project Vyasa">
            <h2>Project Vyasa</h2>
            <br />
            <NavMenu navExpanded={true} useClass="justify-content-center" />
            <p style={{
                marginBottom: "40px",
                marginLeft: "auto", marginRight: "auto",
                fontSize: "18px",
                whiteSpace: "pre-wrap"
            }}>
                The goal of this project is to create a high quality Sanskrit-English reader.
                <br />
                If this is your first time here, you may want to check out
                the <Link to={toUrl("/about")}>About</Link> page.
                <br />
                Otherwise, see the <Link to={toUrl("/texts")}>Texts</Link> page to get started.
            </p>
        </Layout >
    )
}



export default Index
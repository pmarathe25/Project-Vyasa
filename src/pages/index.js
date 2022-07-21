import { Link } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import toUrl from '../util/util'

const Index = ({ location }) => {
    return (
        <Layout location={location} pageTitle="Project Vyasa">
            <h2>Project Vyasa</h2>
            <p style={{
                marginTop: "10px",
                whiteSpace: "pre-wrap"
            }}>
                Project Vyasa's goal is to create a high quality Sanskrit-English reader for various texts.
                If this is your first time here, you may want to check out
                the <Link to={toUrl("/about")}>About</Link> page.
                Otherwise, see the <Link to={toUrl("/texts")}>Texts</Link> page to get started.
            </p>
        </Layout >
    )
}



export default Index
import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../components/layout'
import { useTransliterate } from '../components/transliterationHook'
import toUrl from '../util/util'

const HowToUse = ({ location }) => {
    return (
        <Layout location={location} pageTitle={"How To Use This Site"}>

        </Layout>
    )

}

export default HowToUse;
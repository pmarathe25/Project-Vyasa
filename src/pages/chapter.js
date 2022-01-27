import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'

const ChapterPage = ({ verses }) => {
    return (
        <Layout pageTitle="Chapters">
            <div>
                {
                    verses.map(node => (
                        node.text
                    ))
                }
            </div>
        </Layout>
    )
}


export default ChapterPage
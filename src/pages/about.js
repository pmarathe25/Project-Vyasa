import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { ListGroup } from 'react-bootstrap'
import Layout from '../components/layout'
import { useTransliterate } from '../components/transliterationHook'
import toUrl from '../util/util'
import { StaticImage } from 'gatsby-plugin-image'

const About = ({ location }) => {
    const headerStyle = {
        width: "80%",
        margin: "auto"
    }

    const textStyle = {
        marginBottom: "10px",
        marginTop: "10px",
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "18px",
        whiteSpace: "pre-wrap"
    };

    return (
        <Layout location={location} pageTitle={"About"}>
            <h2 style={headerStyle}>About Project Vyasa</h2>
            <p style={textStyle}>
                The goal of this project is to provide a high-quality Sanskrit-English reader
                for the Mahabharata in a modern web interface. That includes literal word-by-word
                translations as well as grammatical analysis. Finally, a full translation of
                each verse is provided to tie everything together.
                <br />
                <br />
                It is <b>not</b> the aim to provide anything more than a
                literally correct translation; that is, the included translations do not
                consider the broader cultural, historical, and philosophical context of the text.
                <br />
                <br />
            </p>
            <h2 style={headerStyle}>How To Use This Site</h2>
            <p style={textStyle}>
                To navigate this site, you can either use the <b>All Verses</b> button in the top-right
                corner or use the links provided on <Link to="/">the home page</Link>.
                <br />
                <br />
                Each verse is provided in 3 different forms:
            </p>
            <ol style={textStyle}>
                <li key="originalText">
                    The original Sanskrit text, in your choice of Devanagari or IAST
                    (use the button at the top of the page to toggle between them).
                </li>
                <li key="wordByWord">
                    The Sanskrit text with <em>sandhi</em> undone, annotated with word-by-word
                    English translations.
                </li>
                <li key="fullTranslation">
                    A full English translation that is as literal as possible.
                </li>
            </ol>
            <p style={textStyle}>
                In addition to these, you can hover over each word in the word-by-word translation
                to get more information on the root of the word and its grammatical form.

            </p>
            <p style={textStyle}>
                Example screenshots of what the site looks like in a desktop browser have been provided below.
            </p>
            <div style={textStyle}>

                <h3>Examples</h3>
                <h4>Original Verse Text</h4>
                <StaticImage src='../images/example_verse_text.png' alt="Verse Text" />
                <h4>Word By Word And Complete Translation</h4>
                <StaticImage src='../images/example_word_by_word.png' alt="Word By Word Translation" />
                <h4>Pop-out With Grammatical Information</h4>
                <div style={{ textAlign: "center" }}>
                    <StaticImage src='../images/example_pop_out.png' alt="Grammatical Information Pop-out" />
                </div>
            </div>
        </Layout >
    )

}

export default About;
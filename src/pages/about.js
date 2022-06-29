import * as React from 'react'
import Layout from '../components/layout'

const About = ({ location }) => {
    const textStyle = {
        marginBottom: "30px",
        marginTop: "10px",
        fontSize: "18px",
        whiteSpace: "pre-wrap"
    };

    return (
        <Layout location={location} pageTitle={"About"}>
            <h2>About Project Vyasa</h2>
            <p style={textStyle}>
                The goal of this project is to provide a high-quality Sanskrit-English reader
                for various Sanskrit texts in a modern web interface. That includes literal word-by-word
                translations, word-level grammatical analysis, as well as a complete translation for
                each verse.
                <br />
                <br />
                It is <b>not</b> the aim to provide anything more than a
                literally correct translation; that is, the included translations do not
                consider the broader cultural, historical, and philosophical context of the texts.
            </p>
            <h2>Contributing</h2>
            <p style={textStyle}>
                If you'd like to help with this project, there are several ways to do so.
                See the <a
                    href="https://github.com/pmarathe25/Project-Vyasa/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noreferrer"
                >
                    CONTRIBUTING.md</a> file on the GitHub repository for more details.
            </p>
        </Layout >
    )

}

export default About;
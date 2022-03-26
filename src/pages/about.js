import * as React from 'react'
import Layout from '../components/layout'

const About = ({ location }) => {
    const headerStyle = {
        width: "80%",
        margin: "auto",
        color: "white"
    }

    const textStyle = {
        marginBottom: "30px",
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
                translations, word-level grammatical analysis, as well as a complete translation for
                each verse.
                <br />
                <br />
                It is <b>not</b> the aim to provide anything more than a
                literally correct translation; that is, the included translations do not
                consider the broader cultural, historical, and philosophical context of the text.
            </p>
            <h2 style={headerStyle}>Contributing</h2>
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
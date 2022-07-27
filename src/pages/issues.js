import * as React from 'react'
import Layout from '../components/layout'

const Issues = ({ location }) => {
    const textStyle = {
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto",
    };

    return (
        <Layout location={location} pageTitle={"Issues?"}>
            <h2 style={{ textAlign: "left" }}>Experiencing Issues or Want to Leave Feedback?</h2>
            <p style={textStyle}>
                If you encounter any issues on this website or inaccuracies in the content,
                or you want to request a new feature, don't hesitate
                to <a
                    href="https://github.com/pmarathe25/Project-Vyasa/issues/new/choose"
                    target="_blank"
                    rel="noreferrer"
                >
                    file a GitHub issue
                </a>
                .
            </p>
            <p style={textStyle}>
                For any bugs you experience on the website, leave as much detail as
                you can on what triggers the bug and how to reproduce it.
                For content inaccuracies, specify where the error is (a link to the page
                is ideal) and, if possible, what correction needs to be made.
            </p>
        </Layout >
    );

}


export default Issues;

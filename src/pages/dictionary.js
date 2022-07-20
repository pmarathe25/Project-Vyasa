import * as React from 'react';
import SectionLinksBar from "../components/dictionarySectionLinksBar";
import Layout from '../components/layout';

const Dictionary = ({ location }) => {
    return (
        <Layout
            location={location} pageTitle="Dictionary"
            maxWidth="var(--max-content-width)"
        >
            <SectionLinksBar />
            <p style={{ textAlign: "center" }}>
                Use one of the section links above to navigate to the page of interest.
            </p>
        </Layout >
    );
}

export default Dictionary;

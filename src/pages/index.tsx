import { Link } from 'gatsby';
import * as React from 'react';
import Layout from '../components/layout';
import NavMenu from '../components/navMenu';
import useIsMobile from '../util/responsiveness';
import { toUrl } from '../util/util';

interface IndexProps {
  location: { pathname: string };
}

const Index = ({ location }: IndexProps) => {
  const isMobile = useIsMobile();

  return (
    <Layout location={location} pageTitle="Project Vyasa">
      <h2>Project Vyasa</h2>
      {isMobile ? <NavMenu useClass="justify-content-center" /> : null}
      <p style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
        Project Vyasa&#39;s goal is to create a high quality Sanskrit-English reader for various texts.
        If this is your first time here, you may want to check out
        the <Link to={toUrl('/about')}>About</Link> page.
      </p>
    </Layout>
  );
};

export default Index;
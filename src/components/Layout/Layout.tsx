import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import 'styles/global.scss';

import NavBar from 'components/NavBar/NavBar';

interface Props {
    pageTitle: string;
    pageClass: string;
}

const Layout: React.FC<Props> = ({ pageTitle, pageClass, children }) => {
    const { site } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        siteUrl
                    }
                }
            }
        `,
    );

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{ pageTitle }</title>
                <link rel="canonical" href={site.siteMetadata.siteUrl} />
            </Helmet>
            <NavBar />
            <main className={`c-layout ${pageClass}`}>
                { children }
            </main>
        </>
    );
}

export default Layout;
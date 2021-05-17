import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import 'styles/global.css';

import NavBar from 'components/NavBar/NavBar';
import Footer from 'components/Footer/Footer';

interface Props {
    pageTitle: string;
    pageClass: string;
    style?: React.CSSProperties;
    padTop?: boolean;
}

const Layout: React.FC<Props> = ({ pageTitle, pageClass, padTop = false, children, style }) => {
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
    )

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{ pageTitle }</title>
                <link rel="canonical" href={site.siteMetadata.siteUrl} />
            </Helmet>
            <NavBar />
            <main className={`${pageClass}`} style={{paddingTop: padTop ? '87px' : 0}}>
                { children }
            </main>
            <Footer />
        </>
    );
}

export default Layout;
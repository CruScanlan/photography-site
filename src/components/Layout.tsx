import * as React from 'react';
import Head from 'next/head';

import NavBar, { INavbarScrollAnimation } from 'components/NavBar';
import Cart from 'components/Cart';
import Footer from 'components/Footer';

interface Props {
    pageTitle: string;
    pageClass: string;
    style?: React.CSSProperties;
    padTop?: boolean;
    navbarScrollAnimation?: INavbarScrollAnimation;
    fullPage?: boolean; //No navbar or footer
    pageDescription?: string;
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ pageTitle, pageClass, padTop = false, navbarScrollAnimation, fullPage = false, children, style, pageDescription }) => {
    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta charSet="utf-8" />
                <link rel="canonical" href="https://google.com" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta httpEquiv="content-language" content="en" />
                <meta name="description" content={pageDescription} />
            </Head>
            {
                !fullPage && <NavBar navbarScrollAnimation={navbarScrollAnimation} />
            }
            <Cart />
            <main className={`${pageClass} z-10`} style={{paddingTop: padTop ? '87px' : 0}}>
                { children }
            </main>
            {
                !fullPage && <Footer />
            }
        </>
    );
}

export default Layout;
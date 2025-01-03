import * as React from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

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
    ogImage?: string; // URL for the Open Graph image
    ogUrl?: string; // Current page URL
}

const Layout: React.FC<Props> = ({ 
    pageTitle, 
    pageClass, 
    padTop = false, 
    navbarScrollAnimation, 
    fullPage = false, 
    children, 
    style, 
    pageDescription,
    ogImage = '/Eternal Growth 2022 - 2048px.jpg', // Add a default OG image
    ogUrl = 'https://cruscanlan.com' // Replace with your default domain
}) => {
    ogImage = `${ogImage}?w=1080&q=95`;

    if(ogImage.includes('images.ctfassets.net')) {
        ogImage = `https:${ogImage}`;
    } else {
        ogImage = `https://cruscanlan.com${ogImage}`;
    }

    return (
        <>
            <NextSeo
                title={pageTitle}
                description={pageDescription}
                canonical={ogUrl}
                openGraph={{
                    url: ogUrl,
                    title: pageTitle,
                    description: pageDescription,
                    images: [{ url: ogImage }],
                }}
            />
            <Head>
                <meta charSet="utf-8" />
                <link rel="canonical" href={ogUrl} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta httpEquiv="content-language" content="en" />
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
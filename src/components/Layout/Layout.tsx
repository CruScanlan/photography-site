import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { CartProvider } from 'use-shopping-cart/react';

import 'styles/global.css';

import NavBar, { INavbarScrollAnimation } from 'components/NavBar/NavBar';
import Footer from 'components/Footer/Footer';

interface Props {
    pageTitle: string;
    pageClass: string;
    style?: React.CSSProperties;
    padTop?: boolean;
    navbarScrollAnimation?: INavbarScrollAnimation;
    fullPage?: boolean; //No navbar or footer
}

const Layout: React.FC<Props> = ({ pageTitle, pageClass, padTop = false, navbarScrollAnimation, fullPage = false, children, style }) => {
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
        `
    )

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{ pageTitle }</title>
                <link rel="canonical" href={site.siteMetadata.siteUrl} />
            </Helmet>
            {
                !fullPage && <NavBar navbarScrollAnimation={navbarScrollAnimation} />
            }
            <CartProvider
                mode="payment"
                cartMode="client-only"
                stripe={process.env.STRIPE_KEY || ''}
                successUrl="stripe.com"
                cancelUrl="google.com"
                currency="AUD"
                allowedCountries={['AU']}
                billingAddressCollection={true}
            >
                <main className={`${pageClass} z-10`} style={{paddingTop: padTop ? '87px' : 0}}>
                    { children }
                </main>
            </CartProvider>    
            {
                !fullPage && <Footer />
            }
        </>
    );
}

export default Layout;
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { CartProvider } from 'use-shopping-cart/react';

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
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{ pageTitle }</title>
                <link rel="canonical" href="https://google.com" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta http-equiv="content-language" content="en"></meta>
            </Helmet>
            {
                !fullPage && <NavBar navbarScrollAnimation={navbarScrollAnimation} />
            }
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

/* 
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
                
            </CartProvider>  */
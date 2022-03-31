import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from 'store/store';
import { CartProvider } from 'use-shopping-cart';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleRight, faChevronRight, faChevronLeft, faTimes, faBars, faChevronDown, faCartArrowDown, faCircleCheck, faTruckFast, faShield, faPaintBrush, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

import { useRouter } from 'next/router'
import Script from 'next/script';
import * as gtag from 'utils/gtag';

config.autoAddCss = false;
import 'styles/global.css';

library.add(
    faArrowCircleRight, 
    faChevronRight,
    faChevronLeft,
    faChevronDown,
    faTimes,
    faBars,
    faInstagram,
    faFacebook,
    faCartArrowDown,
    faPaintBrush,
    faCircleCheck,
    faTruckFast,
    faShield,
    faShoppingCart,
    faTrash
);

const MyApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url);
        }
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        }
    }, [router.events])

    return (
        <Provider store={store}>
            <CartProvider
                cartMode="checkout-session"
                stripe={process.env.NEXT_PUBLIC_STRIPE_KEY_PUBLISHABLE || ''}
                currency="AUD"
            >
                <Script 
                    strategy="worker"
                    src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
                />
                <script
                    type="text/partytown"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            window.gtag = function gtag(){window.dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', '${gtag.GA_TRACKING_ID}', { 
                                page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
                <Component {...pageProps} />
            </CartProvider>
        </Provider>
    );
}

export default MyApp;
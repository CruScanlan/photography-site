import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import store, { persistor } from 'store/store';
import { PersistGate } from 'redux-persist/integration/react'
import { CartProvider } from 'use-shopping-cart';
import { SpeedInsights } from "@vercel/speed-insights/next"

import "@fortawesome/fontawesome-svg-core/styles.css";
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleRight, faChevronRight, faChevronLeft, faTimes, faBars, faChevronDown, faCartArrowDown, faCircleCheck, faTruckFast, faShield, faPaintBrush, faShoppingCart, faTrash, faMasksTheater } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faMastodon } from '@fortawesome/free-brands-svg-icons';

import Script from 'next/script';
import { GA_TRACKING_ID } from 'utils/analytics';

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
    faMastodon,
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
    return ( //@ts-ignore
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <CartProvider
                    cartMode="checkout-session"
                    stripe={process.env.NEXT_PUBLIC_STRIPE_KEY_PUBLISHABLE || ''}
                    currency="AUD"
                >
                    <Script 
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){window.dataLayer.push(arguments);}
                                gtag('js', new Date());

                                gtag('config', '${GA_TRACKING_ID}', { 
                                    page_path: window.location.pathname,
                                });
                            `,
                        }}
                    />
                    <SpeedInsights />
                    <Component {...pageProps} />
                </CartProvider>
            </PersistGate>
        </ReduxProvider>
    );
}

export default MyApp;
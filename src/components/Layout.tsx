import * as React from 'react';
import { Helmet } from 'react-helmet';
import Script from 'next/script';

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

                <Script 
                    strategy="worker"
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />
                <script
                    data-partytown-config
                    dangerouslySetInnerHTML={{
                    __html: `
                        partytown = {
                            lib: "/_next/static/~partytown/",
                            forward: ["gtag"]           
                        };
                        `,
                    }}
                />
                <script
                    type="text/partytown"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            window.gtag = function gtag(){window.dataLayer.push(arguments);}
                            gtag('js', new Date());

                            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', { 
                                page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </Helmet>
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
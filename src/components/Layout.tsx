import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Partytown } from '@builder.io/partytown/react';

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

                <Partytown />
                <script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} type="text/partytown" />
                <script type="text/partytown">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                            page_path: window.location.pathname,
                        });
                    `}
                </script>
                <Partytown debug={true} />
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
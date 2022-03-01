import type { AppProps } from 'next/app';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleRight, faChevronRight, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;

import 'styles/global.css';

library.add(
    faArrowCircleRight, 
    faChevronRight,
    faChevronLeft,
    faTimes,
    faInstagram,
    faFacebook
);

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp;
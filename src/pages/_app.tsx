import type { AppProps } from 'next/app';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleRight, faChevronRight, faChevronLeft, faTimes, faBars, faChevronDown, faCartArrowDown, faCircleCheck, faTruckFast, faShield, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

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
);

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp;
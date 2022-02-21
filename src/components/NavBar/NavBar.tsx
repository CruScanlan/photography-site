import * as React from "react";
import Link from 'next/link';
import Image from 'next/image';
import NavLink from 'components/NavLink/NavLink';
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import ColorScale from 'color-scales';

import numberMap from 'utils/numberMap';
import useWindowSize from 'hooks/useWindowSize';

export interface INavbarScrollAnimation {
    enabled: boolean;
    startPositonRelative?: number;
    endPositionRelative?: number;
    startPositionAbsolute?: number;
    endPositionAbsolute?: number;
};

interface Props {
    navbarScrollAnimation?: INavbarScrollAnimation;
};

const defaultOptions: Props['navbarScrollAnimation'] = {
    enabled: false,
    startPositonRelative: 0.3,
    endPositionRelative: 0.5,
    startPositionAbsolute: 50,
    endPositionAbsolute: 200
}

//const colorScale = new ColorScale(0, 100, ['#111827', '#ffffff']);

const NavBar: React.FC<Props> = ({ navbarScrollAnimation }) => {
    if(!navbarScrollAnimation || navbarScrollAnimation.enabled) { //Make sure it has all properties
        navbarScrollAnimation = {...defaultOptions, ...navbarScrollAnimation};
    }

    const scrollPosition = useScrollPosition(60);
    const { height: windowHeight } = useWindowSize();
    let style: React.CSSProperties = {};
    let shadow = '';

    if(navbarScrollAnimation.enabled && navbarScrollAnimation.startPositonRelative && navbarScrollAnimation.endPositionRelative && navbarScrollAnimation.startPositionAbsolute && navbarScrollAnimation.endPositionAbsolute ) { //All defined
        let opacity: number;
    
        if(windowHeight) {
            const [startHeight, endHeight] = [windowHeight*navbarScrollAnimation.startPositonRelative, windowHeight*navbarScrollAnimation.endPositionRelative]
            opacity = scrollPosition < startHeight ? 0 : scrollPosition <  endHeight ? numberMap(scrollPosition, startHeight, endHeight, 0, 1) : 1;
        }
        else opacity = scrollPosition < navbarScrollAnimation.startPositionAbsolute ? 0 : scrollPosition < navbarScrollAnimation.endPositionAbsolute ? numberMap(scrollPosition, navbarScrollAnimation.startPositionAbsolute, navbarScrollAnimation.endPositionAbsolute, 0, 1) : 1;

        const padding1 = 50*(1-opacity);
        const padding2 = 25*(1-opacity);

        //const newColor = colorScale.getColor(opacity*100);
        //color: `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})

        style = {
            backgroundColor: `rgba(23, 23, 23, ${opacity})`, 
            paddingTop: padding1, 
            paddingLeft: padding1, 
            paddingRight: padding1, 
            paddingBottom: padding2
        };
        shadow = opacity === 1 ? 'shadow-lg' : '';
    }

    //<StaticImage placeholder="none" loading="eager" height={60} src="../../images/logo.png" alt="Logo"/>
    return (
        <nav style={style} className={`${shadow} bg-darkPrimary text-lightPrimary text-center flex justify-between fixed top-0 container overflow-hidden min-w-full z-50`}>
            <Link href="/">
                <a className="c-navbar__logo h-[64px] relative">
                    <Image
                        src="/logo.png"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                    />
                </a>
            </Link>
            <ul className="text-lg list-none mt-5 p-0 flex items-center justify-center mr-5">
                <li className="c-navbar__link">
                    <NavLink href="/" activeClassName="underline"><a>Home</a></NavLink>
                </li>
                <li className="c-navbar__link">
                    <NavLink href="/about" activeClassName="underline "><a>About</a></NavLink>
                </li>
                <li className="c-navbar__link">
                    <NavLink href="/gallery" activeClassName="underline"><a>Gallery</a></NavLink>
                </li>
                <li className="c-navbar__link">
                    <NavLink href="/prints" activeClassName="underline"><a>Prints</a></NavLink>
                </li>
                <li className="c-navbar__link">
                    <NavLink href="/contact" activeClassName="underline"><a>Contact</a></NavLink>
                </li>
                <li className="c-navbar__link">
                    <NavLink href="/store" activeClassName="underline"><a>Print Store</a></NavLink>
                </li>
                <li className="c-navbar__link c-navbar__link--socials">
                    <a className="text-lightPrimary hover:text-lightSecondary no-underline" href="https://instagram.com/cruscanlan" target="_blank">
                        <FontAwesomeIcon icon={faInstagram} size="1x"/>
                    </a>
                </li>
                <li className="c-navbar__link c-navbar__link--socials">
                    <a className="text-lightPrimary hover:text-lightSecondary no-underline" href="https://facebook.com/cruscanlan" target="_blank">
                        <FontAwesomeIcon icon={faFacebook} size="1x"/>
                    </a>
                </li>              
            </ul>
        </nav>
    );
}

export default NavBar;
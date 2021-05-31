import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import ColorScale from 'color-scales';

import numberMap from 'utils/numberMap';
import useWindowSize from 'hooks/useWindowSize';

import './NavBar.css';

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

    if(navbarScrollAnimation.enabled && navbarScrollAnimation.startPositonRelative && navbarScrollAnimation.endPositionRelative && navbarScrollAnimation.startPositionAbsolute && navbarScrollAnimation.endPositionAbsolute ) {
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

    return (
        <nav style={style} className={`${shadow} bg-darkPrimary text-lightPrimary text-center flex justify-between fixed top-0 container overflow-hidden min-w-full z-50`}>
            <a className="c-navbar__logo">
                <StaticImage placeholder="none" loading="eager" height={60} src="../../images/logo.png" alt="Logo"/>
            </a>
            <ul className="text-lg list-none mt-5 p-0 flex items-center justify-center mr-5">
                <li className="c-navbar__link">
                    <Link to="/" activeClassName="underline">Home</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/about" activeClassName="underline ">About</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/gallery" activeClassName="underline">Gallery</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/prints" activeClassName="underline">Prints</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/contact" activeClassName="underline">Contact</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/store" activeClassName="underline">Print Store</Link>
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
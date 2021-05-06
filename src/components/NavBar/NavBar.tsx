import * as React from "react";
import { Link } from "gatsby";
import { useLocation } from '@reach/router';
import { StaticImage } from "gatsby-plugin-image";
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import ColorScale from 'color-scales';

import numberMap from 'utils/numberMap';
import useWindowSize from 'hooks/useWindowSize';

import './NavBar.css';

interface Props {
    
};

//const colorScale = new ColorScale(0, 100, ['#111827', '#ffffff']);

const NavBar: React.FC<Props> = ({  }) => {
    const location = useLocation();
    const scrollPosition = useScrollPosition(60);
    const { height: windowHeight } = useWindowSize();

    let opacity: number;
    
    if(windowHeight) {
        const [startHeight, endHeight] = [windowHeight*0.3, windowHeight*0.5]
        opacity = scrollPosition < startHeight ? 0 : scrollPosition <  endHeight ? numberMap(scrollPosition, startHeight, endHeight, 0, 1) : 1;
    }
    else opacity = scrollPosition < 50 ? 0 : scrollPosition < 200 ? numberMap(scrollPosition, 50, 200, 0, 1) : 1;

    const padding1 = 50*(1-opacity);
    const padding2 = 25*(1-opacity);

    //const newColor = colorScale.getColor(opacity*100);
    //color: `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})

    const style: React.CSSProperties = location.pathname !== '/' ? {} : {backgroundColor: `rgba(23, 23, 23, ${opacity})`, paddingTop: padding1, paddingLeft: padding1, paddingRight: padding1, paddingBottom: padding2};
    const shadow = opacity === 1 || location.pathname !== '/' ? 'shadow-lg' : '';

    return (
        <nav style={style} className={`${shadow} bg-gray-900 text-white block text-center flex justify-between fixed top-0 container overflow-hidden min-w-full z-50`}>
            <a className="c-navbar__logo">
                <StaticImage loading="eager" height={60} src="../../images/logo.png" alt="Logo"/>
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
                    <a className="text-white hover:text-gray-500 no-underline" href="https://instagram.com/cruscanlan" target="_blank">
                        <FontAwesomeIcon icon={faInstagram} size="1x"/>
                    </a>
                </li>
                <li className="c-navbar__link c-navbar__link--socials">
                    <a className="text-white hover:text-gray-500 no-underline" href="https://facebook.com/cruscanlan" target="_blank">
                        <FontAwesomeIcon icon={faFacebook} size="1x"/>
                    </a>
                </li>              
            </ul>
        </nav>
    );
}

export default NavBar;
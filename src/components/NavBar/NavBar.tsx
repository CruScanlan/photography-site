import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import NavLink from 'components/NavLink/NavLink';
import useScrollPosition from '@react-hook/window-scroll';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import ColorScale from 'color-scales';

import numberMap from 'utils/numberMap';
import useWindowSize from 'hooks/useWindowSize';

export interface INavbarScrollAnimation {
    enabled: boolean;
    startPositonRelative?: number;
    endPositionRelative?: number;
    startPositionAbsolute?: number;
    endPositionAbsolute?: number;
    scrollColor?: boolean;
};

interface Props {
    navbarScrollAnimation?: INavbarScrollAnimation;
};

const defaultOptions: Props['navbarScrollAnimation'] = {
    enabled: false,
    startPositonRelative: 0.3,
    endPositionRelative: 0.5,
    startPositionAbsolute: 50,
    endPositionAbsolute: 200,
    scrollColor: false
};

const colorScale = new ColorScale(0, 100, ['#262626', '#ffffff']);

const navLinks: {
    name: string;
    href: string;
    exact?: boolean;
}[] = [
    {
        name: "Home",
        href: "/",
        exact: true
    },
    {
        name: "About",
        href: "/about"
    },
    {
        name: "Gallery",
        href: "/gallery"
    },
    {
        name: "Prints",
        href: "/prints"
    },
    {
        name: "Contact",
        href: "/contact"
    },
    {
        name: "Print Store",
        href: "/store"
    }
];

const navSocialLinks: {
    icon: FontAwesomeIconProps['icon'];
    href: string;
}[] = [
    {
        icon: ['fab', 'instagram'],
        href: 'https://instagram.com/cruscanlan'
    },
    {
        icon: ['fab', 'facebook'],
        href: 'https://facebook.com/cruscanlan'
    }
]

const NavBar: React.FC<Props> = ({ navbarScrollAnimation }) => {
    const [hambugerOpen, setHamburgerOpen] = useState(false);

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

        const newColor = colorScale.getColor(opacity*100);
        const color =  `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})`;

        style = {
            backgroundColor: `rgba(23, 23, 23, ${opacity})`, 
            paddingTop: padding1, 
            paddingLeft: padding1, 
            paddingRight: padding1, 
            paddingBottom: padding2
        };
        if(navbarScrollAnimation.scrollColor) style.color = color;
        shadow = opacity === 1 ? 'shadow-lg' : '';
    }

    const onHamburgerClick = () => {
        setHamburgerOpen(true);
    }

    const onHamburgerMenuClose = () => {
        setHamburgerOpen(false);
    }

    return (
        <>
            <nav style={style} className={`${shadow} ${hambugerOpen ? 'hidden' : ''} bg-darkPrimary text-lightPrimary text-center fixed top-0 container overflow-hidden min-w-full z-50`}>
                <div className="flex lg:hidden justify-between min-w-full">
                    <Link href="/">
                        <a className="min-w-[205px] mx-2 mt-5 h-[64px] relative">
                            <Image
                                src="/logo.svg"
                                layout="fill"
                                objectFit="contain"
                                priority
                                unoptimized
                            />
                        </a>
                    </Link>
                    <button className="visible lg:invisible mt-9 mr-5 p-2 text-2xl" onClick={onHamburgerClick}>
                        <FontAwesomeIcon icon={['fas', 'bars']} />
                    </button>
                </div>
                <div className="hidden lg:flex justify-between min-w-full">
                    <Link href="/">
                        <a className="min-w-[205px] ml-8 mx-2 mt-5 h-[64px] relative">
                            <Image
                                src="/logo.svg"
                                layout="fill"
                                objectFit="contain"
                                priority
                                unoptimized
                            />
                        </a>
                    </Link>
                    <ul className="text-lg font-black list-none mt-5 p-0 flex items-center justify-center mr-5">
                        {
                            navLinks.map(navLink => (
                                <li className="c-navbar__link" key={navLink.href}>
                                    <NavLink href={navLink.href} activeClassName="underline" exact={navLink.exact || false}><a>{navLink.name}</a></NavLink>
                                </li>
                            ))
                        }
                        {
                            navSocialLinks.map(navSocialLink => (
                                <li className="c-navbar__link c-navbar__link--socials" key={navSocialLink.href}>
                                    <a className="text-lightPrimary hover:text-lightSecondary no-underline" href={navSocialLink.href} target="_blank">
                                        <FontAwesomeIcon icon={navSocialLink.icon} size="1x"/>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </nav>
            <div className={`relative z-50 text-lightPrimary`}>
                <div className={`fixed inset-0 bg-gray-800 transition-opacity duration-300  ${hambugerOpen ? 'opacity-40 block' : 'opacity-0 hidden'}`} onClick={onHamburgerMenuClose}></div>
                <nav className={`fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-darkSecondary border-r overflow-y-auto transition-all duration-300 ease-in-out ${hambugerOpen ? 'translate-x-0' : '-translate-x-full'} `}>
                    <div className="flex items-center mb-8">
                        <div className="w-[205px] h-[64px] mr-auto relative">
                            <Image
                                src="/logo.svg"
                                layout="fill"
                                objectFit="contain"
                                priority
                                unoptimized
                            />
                        </div>
                        <button className="ml-2" onClick={onHamburgerMenuClose}>
                            <FontAwesomeIcon icon={['fas', 'times']} size="2x"/>
                        </button>
                    </div>
                    <ul className="font-medium text-lg">
                        {
                            navLinks.map(navLink => (
                                <Link href={navLink.href} key={navLink.href}>
                                    <li className="mb-1 block p-4 hover:bg-blue-50 hover:text-blue-600 hover:underline hover:cursor-pointer rounded">
                                        <NavLink href={navLink.href} exact={navLink.exact || false} activeClassName="underline"><a>{navLink.name}</a></NavLink>
                                    </li>
                                </Link>
                            ))
                        }
                    </ul>
                    <div className="mt-auto">
                        <div className="flex justify-center">
                            {
                                navSocialLinks.map(navSocialLink => (
                                    <li className="inline-block py-2 px-4 no-underline font-medium hover:underline" key={navSocialLink.href}>
                                        <a href={navSocialLink.href} target="_blank">
                                            <FontAwesomeIcon icon={navSocialLink.icon} className="text-2xl" />
                                        </a>
                                    </li>
                                ))
                            }
                        </div>
                        <p className="my-4 text-xs text-center text-lightTertiary">
                            <span>All Content Copyright &copy; {new Date().getFullYear()} - Cru Scanlan</span>
                        </p>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default NavBar;
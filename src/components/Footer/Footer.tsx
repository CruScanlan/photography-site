import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

interface Props {

}

const Footer: React.FC<Props> = ({  }) => {
    return (
        <footer className="relative bg-darkPrimary text-lightPrimary py-8 px-4 z-10">
            <div className="mx-auto container overflow-hidden flex flex-col lg:flex-row justify-between">
                <div className="flex container justify-center text-sm mt-6 lg:mt-0">
                    {/* <ul className="text-lightSecondary list-none p-0 font-thin flex flex-col text-left">
                        <li className="inline-block py-2 px-3 text-lightPrimary uppercase no-underline font-medium tracking-wide">Product</li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Popular</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Trending</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Catalog</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Features</a></li>
                    </ul>
                    <ul className="text-lightSecondary list-none p-0 font-thin flex flex-col text-left">
                        <li className="inline-block py-2 px-3 text-lightPrimary uppercase no-underline font-medium tracking-wide">Company</li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Press Release</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Mission</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Strategy</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Works</a></li>
                    </ul>
                    <ul className="text-lightSecondary list-none p-0 font-thin flex flex-col text-left">
                        <li className="inline-block py-2 px-3 text-lightPrimary uppercase no-underline font-medium tracking-wide">Info</li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Support</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Developers</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Customer Services</a></li>
                        <li><a href="#" className="inline-block py-2 px-3 text-lightSecondary hover:text-lightTertiary no-underline">Started Guide</a></li>
                    </ul> */}
                    <div className="text-lightSecondary flex flex-col justify-center">
                        <div className="py-2 text-lightPrimary uppercase font-medium tracking-wide">
                            Follow Me
                        </div>
                        <div className="flex pl-4 justify-start">
                            <a className="flex items-center text-lightPrimary hover:text-lightSecondary no-underline" href="https://instagram.com/cruscanlan" target="_blank"><FontAwesomeIcon icon={faInstagram} size="2x"/></a>
                            <a className="flex items-center text-lightPrimary hover:text-lightSecondary no-underline ml-3" href="https://facebook.com/cruscanlan" target="_blank"><FontAwesomeIcon icon={faFacebook} size="2x"/></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 mt-4 text-lightTertiary border-t-2 border-darkPrimary text-center"> 
                All Content &copy; {new Date().getFullYear()} Cru Scanlan. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
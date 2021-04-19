import * as React from "react";
import { Link } from "gatsby";

import './NavBar.css';

interface Props {

};

const NavBar: React.FC<Props> = ({ children }) => {
    return (
        <nav className="c-navbar container max-w-full bg-blue-500">
            <ul className="c-navbar__linkContainer">
                <li className="c-navbar__link">
                    <Link to="/">Home</Link>
                </li>
                <li className="c-navbar__link">
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
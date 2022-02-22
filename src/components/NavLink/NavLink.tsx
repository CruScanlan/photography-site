import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { pathToRegexp } from 'path-to-regexp';

interface Props extends LinkProps {
    as?: any;
    exact?: boolean;
    activeClassName?: string;
}

const NavLink: React.FC<Props> = ({ href, as, exact = false, activeClassName, children, ...props }) => {
    const { asPath } = useRouter();
    let isActive = pathToRegexp(as || href, [], { sensitive: true, end: !!exact }).test(asPath);

    const child: any = React.Children.only(children);
    const className = ((child.props.className || '') + ' ' + (isActive ? activeClassName : '')).trim();

    return (
        <Link href={href} as={as} {...props}>
            {React.cloneElement(child, { className })}
        </Link>
    );
}

export default NavLink;
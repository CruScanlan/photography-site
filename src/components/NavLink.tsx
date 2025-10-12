'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { pathToRegexp } from 'path-to-regexp';

interface Props extends Omit<LinkProps, 'href'> {
    href: string;
    exact?: boolean;
    activeClassName?: string;
    children: React.ReactElement;
    className?: string;
}

const NavLink: React.FC<Props> = ({ href, exact = false, activeClassName = '', children, className = '', ...props }) => {
    const pathname = usePathname();
    let isActive = pathToRegexp(href, [], { sensitive: true, end: !!exact }).test(pathname);

    const child: any = React.Children.only(children);
    const childClassName = child.props.className || '';
    const combinedClassName = `${childClassName} ${className} ${isActive ? activeClassName : ''}`.trim();

    return (
        <Link href={href} {...props} className={combinedClassName}>
            {React.cloneElement(child, { className: combinedClassName })}
        </Link>
    );
}

export default NavLink;
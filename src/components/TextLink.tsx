import React from 'react';
import Link from 'next/link';

interface Props {
    href: string;
    external?: boolean;
    children: React.ReactNode;
    className?: string;
}

const TextLink: React.FC<Props> = ({ href, external = false, children, className = '' }) => {
    const baseClasses = 'text-orange-500 hover:text-orange-700 transition-colors';
    
    if (external) {
        return (
            <a 
                href={href}
                className={`${baseClasses} ${className}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return (
        <Link 
            href={href}
            className={`${baseClasses} ${className}`}
        >
            {children}
        </Link>
    );
};

export default TextLink;

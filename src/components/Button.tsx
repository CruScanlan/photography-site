import React from 'react';
import Link from 'next/link';

interface Props {
    classes?: React.HTMLAttributes<HTMLDivElement>['className'];
    href?: string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'transparent' | 'filled';
    fullWidth?: boolean;
    clickable?: boolean;
    onClick?: (e:  React.MouseEvent) => any;
    onMouseEnter?: (e: React.MouseEvent) => any;
};

const ButtonSizeClasses = {
    'lg': 'px-8 py-3 md:px-10 md:py-4 md:text-lg',
    'md': 'px-4 py-2 md:px-6 md:py-2 md:text-lg',
    'sm': 'px-2 py-1 md:px-4 md:py-2 md:text-lg',
}

const ButtonTypeClasses = {
    'transparent': 'border border-lightSecondary hover:border-lightPrimary',
    'filled': 'border border-transparent bg-orange-500 hover:bg-orange-700'
}

const Button: React.FC<Props>  = ({ classes = '', href, size = 'sm', fullWidth = false, type = 'transparent', clickable = false, children, ...props }) => {
    const innerClasses = `w-full flex items-center justify-center ${clickable ? 'hover:cursor-pointer' : ''} ${ButtonTypeClasses[type]} ${ButtonSizeClasses[size]}`;

    return (
        <div className={`text-base text-center font-semibold text-lightPrimary rounded-md shadow ${fullWidth ? 'w-full': ''} ${classes}`} {...props}>
            {
                href && ( //Add link
                    <Link
                        href={href}
                    >
                        <div className={innerClasses}>
                            {children}
                        </div>
                    </Link>
                )
            }
            {
                !href && ( //No link
                    <div className={innerClasses}>
                        {children}
                    </div>
                )
            }
        </div>
    )
};

export default Button;
import React from 'react';
import Link from 'next/link';

interface Props {
    classes?: React.HTMLAttributes<HTMLDivElement>['className'];
    href?: string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'transparent' | 'filled' | 'disabled';
    fullWidth?: boolean;
    clickable?: boolean;
    disabled?: boolean;
    onClick?: (e:  React.MouseEvent) => any;
    onMouseEnter?: (e: React.MouseEvent) => any;
    children: React.ReactNode;
};

const ButtonSizeClasses = {
    'lg': 'px-8 py-3 md:px-10 md:py-4 md:text-lg',
    'md': 'px-4 py-2 md:px-6 md:py-2 md:text-lg',
    'sm': 'px-2 py-1 md:px-4 md:py-2 md:text-lg',
}

const ButtonTypeClasses = {
    'transparent': 'border border-lightSecondary hover:border-lightPrimary',
    'filled': 'border border-transparent bg-orange-500 hover:bg-orange-700',
    'disabled': 'border border-transparent bg-gray-700 cursor-not-allowed opacity-60'
}

const Button: React.FC<Props>  = ({ classes = '', href, size = 'sm', fullWidth = false, type = 'transparent', clickable = false, disabled = false, children, ...props }) => {
    const innerClasses = `w-full flex items-center justify-center ${
        disabled ? ButtonTypeClasses['disabled'] : ButtonTypeClasses[type]
    } ${ButtonSizeClasses[size]} ${
        clickable && !disabled ? 'hover:cursor-pointer' : ''
    }`;

    const handleClick = (e: React.MouseEvent) => {
        if (disabled || !props.onClick) return;
        props.onClick(e);
    };

    return (
        (<div className={`text-base text-center font-semibold text-lightPrimary rounded-md shadow ${fullWidth ? 'w-full': ''} ${classes}`} onClick={handleClick} {...props}>
            {
                href && !disabled && ( //Add link only if not disabled
                    (<Link href={href} legacyBehavior>
                        <div className={innerClasses}>
                            {children}
                        </div>
                    </Link>)
                )
            }
            {
                (!href || disabled) && ( //No link or disabled
                    (<div className={innerClasses}>
                        {children}
                    </div>)
                )
            }
        </div>)
    );
};

export default Button;
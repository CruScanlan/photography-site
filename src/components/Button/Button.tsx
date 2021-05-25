import React from 'react';

interface Props {
    classes: React.HTMLAttributes<HTMLDivElement>['className'];
};

const Button: React.FC<Props>  = ({ classes, children }) => {
    return (
        <div className={`${classes} rounded-md shadow`}>
            <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-sm text-textPrimary bg-orange-500 hover:bg-orange-700 md:py-4 md:text-lg md:px-10"
            >
                {children}
            </a>
        </div>
    )
};

export default Button;
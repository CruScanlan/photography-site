import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
    classes?: React.HTMLAttributes<HTMLDivElement>['className'];
    items: string[];
    value?: string;
    onChanged: (item: string) => void;
};

/* const ButtonSizeClasses = {
    'lg': 'px-8 py-3 md:px-10 md:py-4 md:text-lg',
    'md': 'px-4 py-2 md:px-6 md:py-2 md:text-lg',
    'sm': 'px-2 py-1 md:px-4 md:py-2 md:text-lg',
} */

/* const ButtonTypeClasses = {
    'transparent': 'border border-lightSecondary hover:border-lightPrimary',
    'filled': 'border border-transparent bg-orange-500 hover:bg-orange-700'
} */

const FormDropdown: React.FC<Props>  = ({ classes = '', items, value,  onChanged}) => {
    const [selected, setSelected] = useState(value && items[0]);

    const changed = useCallback((e: React.ChangeEvent<HTMLSelectElement> ) => {
        onChanged(e.target.value);
        setSelected(e.target.value);
    }, [items, onChanged]);

    useEffect(() => {
        setSelected(value);
    }, [value]);

    return (
        <select 
            className={`text-lightPrimary w-full form-select text-base font-semibold rounded-sm shadow bg-darkTertiary py-4 px-6 ${classes}`} 
            onChange={changed}
            value={selected}
        >
            {
                items.map(item => (
                    <option key={item}>{item}</option>
                ))
            }
        </select>
    )
};

export default FormDropdown;
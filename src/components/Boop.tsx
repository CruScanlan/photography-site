import React from 'react';
import { animated } from 'react-spring';
import useBoop, { BoopConfig } from 'hooks/useBoop';

interface Props {
    boopConfig: BoopConfig;
    children: React.ReactNode;
}

const Boop: React.FC<Props> = ({ children, boopConfig }) => {
    const [style, trigger] = useBoop(boopConfig);

    return (
        <animated.div onMouseEnter={trigger} style={style}>
            {children}
        </animated.div>
    );
};

export default Boop;
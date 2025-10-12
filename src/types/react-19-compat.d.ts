// Temporary compatibility fixes for React 19
// Some libraries haven't updated their types yet for React 19

import { ReactElement } from 'react';

declare module '@fortawesome/react-fontawesome' {
  import { IconProp, SizeProp, Transform, FlipProp } from '@fortawesome/fontawesome-svg-core';
  
  export interface FontAwesomeIconProps {
    icon: IconProp;
    mask?: IconProp;
    className?: string;
    color?: string;
    spin?: boolean;
    pulse?: boolean;
    border?: boolean;
    fixedWidth?: boolean;
    inverse?: boolean;
    listItem?: boolean;
    flip?: FlipProp;
    size?: SizeProp;
    pull?: 'left' | 'right';
    rotation?: 90 | 180 | 270;
    transform?: string | Transform;
    symbol?: boolean | string;
    style?: React.CSSProperties;
    tabIndex?: number;
    title?: string;
    swapOpacity?: boolean;
  }
  
  export function FontAwesomeIcon(props: FontAwesomeIconProps): ReactElement;
}


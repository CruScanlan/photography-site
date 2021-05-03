import lerp from 'utils/lerp';
import norm from 'utils/norm';

const numberMap = (val: number, min1: number, max1: number, min2: number, max2: number) => {
    return lerp( norm(val, min1, max1), min2, max2 );
}

export default numberMap;
const lerp = (ratio: number, start: number, end: number) => {
    return start + (end - start) * ratio;
}

export default lerp;
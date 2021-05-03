const norm = (val: number, min: number, max: number) => {
    return (val - min) / (max - min);
}

export default norm;
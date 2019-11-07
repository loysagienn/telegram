
const memoizeSimple = (func) => {
    const cache = {};

    return (arg) => {
        if (arg in cache) {
            return cache[arg];
        }

        return cache[arg] = func(arg);
    };
};

export default memoizeSimple;

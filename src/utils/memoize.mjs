const createCache = () => ({
    map: new Map(),
});

const getCachedValue = (cache, args) => {
    if (args.length === 0) {
        return cache.value;
    }

    const {map} = cache;
    const [arg] = args;

    if (map.has(arg)) {
        return getCachedValue(map.get(arg), args.slice(1));
    }

    return undefined;
};

const setCachedValue = (cache, args, value) => {
    if (args.length === 0) {
        cache.value = value;

        return;
    }

    const {map} = cache;
    const [arg] = args;

    let innerCache;

    if (map.has(arg)) {
        innerCache = map.get(arg);
    } else {
        innerCache = createCache();

        map.set(arg, innerCache);
    }

    setCachedValue(innerCache, args.slice(1), value);
};

const clearCachedValue = (cache, args) => {
    if (args.length === 0) {
        delete cache.value;
    }

    const {map} = cache;
    const [arg] = args;

    if (map.has(arg)) {
        clearCachedValue(map.get(arg), args.slice(1));
    }
};

const memoize = (func, timeout) => {
    const cache = createCache();

    return (...args) => {
        const cachedValue = getCachedValue(cache, args);

        if (cachedValue !== undefined) {
            return cachedValue;
        }

        const value = func(...args);

        setCachedValue(cache, args, value);

        if (timeout) {
            setTimeout(() => clearCachedValue(cache, args), timeout);
        }

        return value;
    };
};


export default memoize;

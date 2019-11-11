const throttle = (func, timeout) => {
    let isThrottled = false;
    let savedArgs = null;

    const wrapper = (...args) => {
        if (isThrottled) {
            savedArgs = args;

            return;
        }

        func(...args);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;

            if (savedArgs) {
                wrapper(...savedArgs);

                savedArgs = null;
            }
        }, timeout);
    };

    return wrapper;
};

export default throttle;

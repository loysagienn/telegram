const createSelector = (...args) => {
    const transformer = args.pop();
    let previousValues = null;
    let previousResult = null;

    return (state) => {
        const values = [];
        let hasChanges = true;

        for (let i = 0; i < args.length; i++) {
            const value = args[i](state);

            if (!previousValues || previousValues[i] !== value) {
                hasChanges = true;
            }

            values.push(value);
        }

        if (!hasChanges) {
            return previousResult;
        }

        previousValues = values;

        return previousResult = transformer(...values);
    };
};

export default createSelector;

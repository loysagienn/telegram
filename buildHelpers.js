const {resolvePath: resolvePathDefault} = require('babel-plugin-module-resolver');


// если передать в alias в опциях module-resolver, то он после применения алиаса не переделывает путь
// относительно рута, а мне нужно, чтобы переделывал
// https://github.com/tleunen/babel-plugin-module-resolver/blob/master/src/resolvePath.js#L97
const resolvePath = (sourcePath, currentFile, options) => {
    const {pathAlias, ...restOptions} = options;

    if (pathAlias && (sourcePath in pathAlias)) {
        sourcePath = pathAlias[sourcePath];
    }

    return resolvePathDefault(sourcePath, currentFile, restOptions);
};


module.exports = {resolvePath};

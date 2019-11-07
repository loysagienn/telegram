const path = require('path');
// const {resolvePath} = require('./buildHelpers');


module.exports = {
    parser: 'babel-eslint',
    extends: [
        'airbnb',
        // 'plugin:flowtype/recommended'
    ],
    env: {
        'shared-node-browser': true,
    },
    'plugins': [
        // 'flowtype',
        // 'jest',
        'import'
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    ".js",
                    ".mjs"
                ]
            },
            'babel-module': {
                // надо бы заюзать resolvePath из buildConfig, но он не прокидывается в babel-plugin-module-resolver
                // https://github.com/tleunen/eslint-import-resolver-babel-module/blob/master/src/index.js#L88-L101
                // resolvePath,
                root: './src',
                alias: {
                    // config: path.resolve(__dirname, `src/config/development`),
                },
            }
        }
    },
    rules: {
        'max-len': ['error', {code: 120, ignoreStrings: true, ignoreTemplateLiterals: true}],
        'indent': ['error', 4],
        'object-curly-spacing': ['error', 'never'],
        'object-curly-newline': 'off',
        'no-use-before-define': 'off',
        'no-sequences': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.mjs', '.js'] }],
        'react/sort-comp': 'off',
        'react/jsx-tag-spacing': {
            beforeSelfClosing: 'never',
        },
        'react/require-default-props': 'off',
        'react/prop-types': 'off',
        // 'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        'no-console': 'off',
        'no-return-assign': 'off',
        'no-underscore-dangle': 'off',
        'function-paren-newline': 'off',
        'no-plusplus': 'off',
        'no-throw-literal': 'off',
        'no-new': 'off',
        'camelcase': 'off',

        // 'flowtype/use-flow-type': 1,
        // 'jsx-a11y/click-events-have-key-events': 'off',
        // 'jsx-a11y/no-static-element-interactions': 'off',
        // 'jsx-a11y/no-noninteractive-tabindex': 'off',
    },
    overrides: [
        {
            files: [
                'src/client/**/*.mjs',
                'src/ui/**/*.mjs',
            ],
            env: {
                browser: true,
            },
        },
        {
            files: [
                'src/server/**/*.mjs',
            ],
            env: {
                node: true,
            },
        },
    ]
};

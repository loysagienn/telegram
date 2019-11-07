const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProductionMode = process.env.NODE_ENV === 'production';

const staticDir = isProductionMode ? path.resolve(__dirname, 'static') : path.resolve(__dirname, 'static');

module.exports = {
    mode: isProductionMode ? 'production' : 'development',
    optimization: {
        usedExports: true,
    },
    entry: {
        app: './src/client/index.mjs',
    },
    externals: {},
    output: {
        path: staticDir,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                exclude: /(node_modules)/,
                // Для того чтобы можно было импортить не .mjs модули через destructuring
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [],
                        plugins: [],
                    },
                },
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]',
                            },
                        },
                        {
                            loader: 'stylus-loader',
                        },
                    ],
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
    ],
    // devtool: isProductionMode ? 'none' : 'cheap-module-source-map',
    devtool: 'none',
};

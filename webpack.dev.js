const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    // devtool: 'cheap-source-map',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'src'),
        overlay: true,
        historyApiFallback: {
            index: '/'
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    // 'source-map-loader',
                    // 'tslint-loader'
                ]
            },
            {
                test: /\.(ts|js)$/,
                use: [
                    'angular-router-loader',
                ],
                /*
                use: [
                    {
                        loader: '@ngtools/webpack'
                    }
                ],
                */
                exclude: [/node_modules/ /*, path.resolve(__dirname, 'src/app/shared/routes')*/]
            },
            /*
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src/assets/css'),
                exclude: [path.resolve(__dirname, 'src/app'), /node_modules/],
                use: 'style-loader'
            },
            {
                test: /\.s[ac]ss$/,
                include: path.resolve(__dirname, 'src/assets/sass'),
                exclude: [path.resolve(__dirname, 'src/app'), /node_modules/],
                use: "style-loader"
            },
            */
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new webpack.NamedModulesPlugin()
    ]
})
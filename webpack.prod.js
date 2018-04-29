const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const AngularCompiler = require('@ngtools/webpack');
const AngularCompilerPlugin = AngularCompiler.AngularCompilerPlugin;

const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const extractCss = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === "development"
});
const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    // filename: "[name].[hash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = merge(common, {
    // devtool: 'eval-source-map',
    // devtool: 'cheap-source-map',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js'
        // filename: '[name].[hash].js',
        // chunkFilename: '[name].[hash].bundle.js'
    },
    mode: 'production',
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
                // include: path.resolve(__dirname, 'src/assets/css'),
                exclude: [path.resolve(__dirname, 'src/app'), /node_modules/],
                use: extractCss.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.s[ac]ss$/,
                // include: path.resolve(__dirname, 'src/assets/sass'),
                exclude: [path.resolve(__dirname, 'src/app')],
                use: [{
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    },{
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },{
                        loader: 'sass-loader'
                    }
                ]
                */
                /*
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
                
            },
            */
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: './src/app/app.module#AppModule',
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            // filename: '[name].[hash].css',
            // chunkFilename: '[id].[hash].css',
        }),
        // extractCss,
        // extractSass,
        /*
        new UglifyJsPlugin({
            uglifyOptions: {
                mangle: true,
                ecma: 5,
                compress: {
                    warnings: false, // Suppress uglification warnings
                    pure_getters: true,
                    unsafe: false,
                    ie8: false
                },
                output: {
                    comments: false,
                },
                exclude: [/\.min\.js$/gi] // skip pre-minified libs
            }
        }),
        */
        new webpack.NoEmitOnErrorsPlugin(),
        /*
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
        */
    ]
})
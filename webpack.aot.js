
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ngcWebpack = require('ngc-webpack');
const CompressionPlugin = require("compression-webpack-plugin");
// const AOT = true;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const STATS = process.env.STATS === 'true';
const FAST = process.env.FAST === 'true';
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackRxjsExternals = require('webpack-rxjs-externals');
/*
console.log(`FAST: ${FAST}`);
console.log(`STATS: ${STATS}`);
*/
module.exports = {
    mode: 'production',
    entry: {
        polyfills: './src/polyfills.ts',
        vendors: './src/vendors.aot.ts',
        // app: './src/main.aot.ts'
        main: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/aot'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: [
                    '@angular-devkit/build-optimizer/webpack-loader',
                    '@ngtools/webpack'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(scss)$/,
                exclude: [
                    path.resolve(__dirname, 'src/app/shared/'),
                    path.resolve(__dirname, 'src/app/layouts/'),
                    path.resolve(__dirname, 'src/app/app.component.scss'),
                    path.resolve(__dirname, 'src/app/pages/')],
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () { // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        'sass-loader'
                    ],
                    // fallback: 'style-laoder'
                })
            },
            {
                test: /\.s[ac]ss$/,
                include: path.resolve(__dirname, 'src/app'),
                exclude: [/node_modules/, path.resolve(__dirname, 'src/styles.scss')],
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    /*
    externals: [
        webpackRxjsExternals()
    ],
    */
    plugins: [
        // new webpackRxjsExternals(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ContextReplacementPlugin(
            // /angular(\\|\/)@angular/,
            /angular(\\|\/)core(\\|\/)@angular/,
            path.join(__dirname, './src'),
            {
                'home': path.resolve(__dirname, './src/app/pages/home-page/home-pages.module.ts'),
                'search': path.resolve(__dirname, './src/app/pages/search-page/search-pages.module.ts'),
                'login': path.resolve(__dirname, './src/app/pages/login-page/login-pages.module.ts'),
                'register': path.resolve(__dirname, './src/app/pages/register-page/register-pages.module.ts'),
                'community': path.resolve(__dirname, './src/app/pages/community-page/community-pages.module.ts'),
                '': path.resolve(__dirname, './src/app/pages/communities-pages/communities-pages.module.ts')
            }
        ),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        /*
        new webpack.ContextReplacementPlugin(
            /(node_modules[\/\\])?angular-feather/,
            /angular-feather.es5|angular-feather.es5.js/
        ),
        */
        new ExtractTextPlugin('[name].css'),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            // filename: '[name].[hash].css',
            // chunkFilename: '[id].[hash].css',
        }),
        new ngcWebpack.NgcWebpackPlugin({
            AOT: true,
            tsConfigPath: './tsconfig.json',
            sourceMap: false,
            additionalLazyModules: {
                'home': path.resolve(__dirname, './src/app/pages/home-page/home-pages.module.ts'),
                'search': path.resolve(__dirname, './src/app/pages/search-page/search-pages.module.ts'),
                'login': path.resolve(__dirname, './src/app/pages/login-page/login-pages.module.ts'),
                'register': path.resolve(__dirname, './src/app/pages/register-page/register-pages.module.ts'),
                'community': path.resolve(__dirname, './src/app/pages/community-page/community-pages.module.ts'),
                '': path.resolve(__dirname, './src/app/pages/communities-pages/communities-pages.module.ts')
            },
            entryModule: 'src/app/app.module#AppModule'
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'none'
        }),
    ].concat(STATS ? [
    ] : [
        new BundleAnalyzerPlugin()
    ]).concat(FAST ? [] : [
        new PurifyPlugin(),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
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
    ]),
    optimization: {
        minimize: !FAST, // dev only
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                material: {
                    chunks: 'all',
                    name: 'material',
                    test: /[\\/]?(node_modules[\\/])?((@angular\/)?material(\/esm5)?)[\\/]?/,
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 20
                },
                commons: {
                    chunks: 'all',
                    name: 'vendors',
                    test: /(vendors|((@angular\/)?(browser|platform-browser|cdk|common)|rxjs|@?ng-bootstrap))/,
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 10
                },                
                polyfills: {
                    chunks: 'all',
                    name: 'polyfills',
                    test: 'polyfills',
                    // test: /[\\/]?(node_modules[\\/])?(zone|core-js|((@angular\/)?core(\/f?esm5)?)|rxjs|jquery|popper.js|hammerjs|bootstrap)/,
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 5
                },
                main: {
                    chunks: 'initial',
                    name: 'main',
                    test: 'main',
                    reuseExistingChunk: true, // true,
                    minChunks: 2,
                    enforce: true, // STATS,
                    priority: 0
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: true
    },
};
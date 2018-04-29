const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        vendors: './src/vendors.ts',
        // home: './src/app/pages/home-page/home-pages.module.ts',
        app: './src/main.ts'
    },
    resolve: {
        // debug: true,
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
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
            /*
            {
                test: /.css$/,
                include: path.resolve(__dirname, 'src/app'),
                exclude: /node_modeules/,
                use: 'raw-loader'
            },
            {
                test: /\.s[ac]ss$/,
                include: path.resolve(__dirname, 'src/app'),
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'sass-loader'
                ]
            }
            */
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'none'
            // filename: 'index.html'
        }),
        new ExtractTextPlugin('[name].css'),
        /*
        new webpack.ContextReplacementPlugin(
            // /angular(\\|\/)@angular/,
            /(angular(\\|\/))?(@angular(\\|\/))?core((\\|\/)(fesm5|esm5))?((\\|\/)core\.js)?/,
            path.resolve(__dirname, 'src'),
        ),
        */
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)@angular/,
            path.resolve(__dirname, 'src'),
        ), 
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    ],
    optimization: {
        minimize: false, // dev only
        splitChunks: {
            chunks: "all",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'vendors',
                    // test: 'vendors',
                    // test: /[\\/]?(node_modules[\\/])?(rxjs|@angular|tslib|jquery|bootstrap|hammer|popper)/,
                    
                    test: /(@angular|rxjs|jquery|popper.js|hammer.js|bootstrap|sockjs-client)/,
                    /*
                    import '@angular/platform-browser';
                    import '@angular/platform-browser-dynamic';
                    import '@angular/core';
                    import '@angular/common';
                    import '@angular/http';
                    import '@angular/router';
                    import '@angular/animations';
                    import '@angular/service-worker';
                    */
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 10
                },
                polyfills: {
                    chunks: 'all',
                    name: 'polyfills',
                    // test: /polyfills/,
                    test: /[\\/]?(node_modules[\\/])?(zone|core-js|((@angular\/)?core(\/f?esm5)?)|rxjs|jquery|popper.js|hammerjs|bootstrap)/,
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 5
                },
                material: {
                    chunks: 'all',
                    name: 'material',
                    test: /[\\/]?(node_modules[\\/])?((@angular\/)?material(\/esm5)?)[\\/]?/,
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 20
                },
                /*
                app: {
                    chunks: 'all',
                    name: 'app',
                    test: 'app',
                    enforce: true,
                    reuseExistingChunk: true,
                    priority: 0
                },
                */
                /*
                vendors: {
                    name: 'vendors',
                    test: 'vendors',
                    reuseExistingChunk: true,
                    enforce: true,
                    priority: 5
                },
                */
                /*
                commons: {
                    chunks: 'all',
                    name: 'vendors',
                    // test: /[\\/]node_modules[\\/]/,
                    test: /[\\/]?(node_modules[\\/])?(rxjs|@angular|tslib|jquery|bootstrap|hammer|popper)/,
                    // test: /[\\/]?(node_modules[\\/])?(rxjs|core|compiler)[\\/]?/,
                    reuseExistingChunk: true,
                    priority: -5,
                    enforce: true
                },
                */
                //default: false,
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: true
    },
    stats: {
        //add named chunks
        excludeModules: /(@angular[\\/])?(material|rxjs|@ng-bootstrap|@agm|platform-browser-dynamic|cdk)/,
        maxModules: 8, // use this to determine depth for graph
        cachedAssets: false,
        // added
        // context: path.resolve(__dirname, 'src'),
        // Show the exports of the modules
        // providedExports: false,
    }
    /*
    stats: {

        // fallback value for stats options when an option is not defined (has precedence over local webpack defaults)
        all: undefined,

        // Add asset Information
        assets: true,

        // Sort assets by a field
        // You can reverse the sort with `!field`.
        assetsSort: "field",

        // Add build date and time information
        builtAt: false, // here

        // Add information about cached (not built) modules
        cached: false, // here

        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets: false, // here

        // Add children information
        children: true, // here

        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: true,

        // Add built modules information to chunk information
        chunkModules: true,

        // Add the origins of chunks and chunk merging info
        chunkOrigins: true,

        // Sort the chunks by a field
        // You can reverse the sort with `!field`. Default is `id`.
        chunksSort: "field",

        // Context directory for request shortening
        context: path.resolve(__dirname, 'src'),

        // `webpack --colors` equivalent
        colors: false,

        // Display the distance from the entry point for each module
        depth: false,

        // Display the entry points with the corresponding bundles
        entrypoints: false,

        // Add --env information
        env: false,

        // Add errors
        errors: false, // here

        // Add details to errors (like resolving log)
        errorDetails: false, // here

        // Exclude assets from being displayed in stats
        // This can be done with a String, a RegExp, a Function getting the assets name
        // and returning a boolean or an Array of the above.
        /*
        excludeAssets: "filter" | /filter/ | (assetName) => ... return true | false |
            ["filter"] | [/filter/] | [(assetName) => ... return true | false],

        // Exclude modules from being displayed in stats
        // This can be done with a String, a RegExp, a Function getting the modules source
        // and returning a boolean or an Array of the above.
        excludeModules: "filter" | /filter/ | (moduleSource) => ... return true | false |
            ["filter"] | [/filter/] | [(moduleSource) => ... return true | false],

        // See excludeModules
        exclude: "filter" | /filter/ | (moduleSource) => ... return true | false |
            ["filter"] | [/filter/] | [(moduleSource) => ... return true | false],
            *//*
        // Add the hash of the compilation
        hash: false, //here

        // Set the maximum number of modules to be shown
        // maxModules: 15, // here

        // Add built modules information
        modules: true,

        // Sort the modules by a field
        // You can reverse the sort with `!field`. Default is `id`.
        modulesSort: "field",

        // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
        moduleTrace: false, // here

        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance: false, // here

        // Show the exports of the modules
        providedExports: false,

        // Add public path information
        publicPath: false, //here

        // Add information about the reasons why modules are included
        reasons: true,

        // Add the source code of modules
        source: true,

        // Add timing information
        timings: false, //here

        // Show which exports of a module are used
        usedExports: false,

        // Add webpack version information
        version: false, //here

        // Add warnings
        warnings: false, //here

        // Filter warnings to be shown (since webpack 2.4.0),
        // can be a String, Regexp, a function getting the warning and returning a boolean
        // or an Array of a combination of the above. First match wins.
        // here
        // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true | false
    }
    */
}
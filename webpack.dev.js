const path = require('path');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    // devtool: 'cheap-module-eval-source-map',
    /*
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    
    plugins: [
        new ExtractTextPlugin('[name].css')
    ],
    */
    devServer: {
        contentBase: path.resolve(__dirname, 'app'),
        // watchContentBase: true,
        // hot: true,
        hotOnly: true,
        overlay: true,
        host: '0.0.0.0'
    }
};
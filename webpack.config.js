const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dev = require('./webpack.dev.js');
const prod = require('./webpack.prod.js');
module.exports = (env) => {
    if (env === 'development') {
        console.log("IS NOT PROD!");
        isDevelopment = true;
        return merge(common, dev);
        /*
        baseCongif.plugins.push(
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        )
        */
    } else
        return merge(common, prod);    
}

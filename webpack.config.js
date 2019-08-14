const path = require( "path" )
const webpack = require( "webpack" )
const webroot = path.join( process.cwd(), "./www" )
module.exports = {
    entry: "./lib/index.js",
    output: {
        filename: "pack.js",
        path: webroot
    },
    devServer: {
        contentBase: webroot,
        hot: true,
        host: "0.0.0.0",
        port: 8080,
        // proxy: [ {
        //     path: "/api/**",
        //     target: "http://localhost:8080",
        //     secure: false
        // } ]
    },

    // plugins: [
    //     // new webpack.IgnorePlugin( /^crypto$/ ),
    //     new webpack.HotModuleReplacementPlugin()
    // ]
}
'use strict';

const path = require( 'path' );
const webpack = require("webpack");
const webpackRules = [];

const webpackOption = {
    entry: './app.js',

    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'bundle.js'
    },

    module: {
        rules: webpackRules
     },
     // Useful for debugging.
     devtool: 'source-map',
 
     // By default webpack logs warnings if the bundle is bigger than 200kb.
     performance: { hints: false }
};

let svgLoader = {
    test: /\.svg$/,
    use: [ 'raw-loader' ]
}

let cssLoader = {
    test: /\.css$/,
    use:['style-loader','css-loader']
}

let babelLoader = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"]
        }
    }
};

webpackRules.push(svgLoader, cssLoader, babelLoader);
module.exports = webpackOption;

// var webpack = require("webpack");

module.exports = {
    entry: {
        main: __dirname + '/configuration.ts'
    },
    target: 'node',
    output: {
        path: __dirname + '/../build/',
        filename: "tests.js"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
        alias: {

        },
        modulesDirectories: [
            '../node_modules'
        ]
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    node: {
        fs: "empty"
    }

}
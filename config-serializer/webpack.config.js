// var webpack = require("webpack");

module.exports = {
    entry: {
        main: __dirname + '/serializer.ts'
    },
    target: 'node',
    output: {
        filename: "serializer.js"
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
    plugins: [
        //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ],
    node: {
        fs: "empty"
    }

}
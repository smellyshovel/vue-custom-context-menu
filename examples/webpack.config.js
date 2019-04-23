const Path = require("path");
const Webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",

    entry: [
        "webpack-hot-middleware/client?quiet=true",
        Path.join(__dirname, "src/main.js")
    ],

    output: {
        path: Path.join(__dirname, "dist")
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-syntax-dynamic-import']
                    }
                }
            },

            {
                test: /\.vue$/,
                use: "vue-loader"
            },

            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ]
            }
        ]
    },

    resolve: {
        alias: {
            "vue-custom-context-menu": Path.join(__dirname, "..", "src")
        }
    },

    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: Path.join(__dirname, "src/index.html")
        }),
        new VueLoaderPlugin()
    ]
};

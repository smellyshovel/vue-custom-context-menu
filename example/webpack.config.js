const Path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    mode: "development",

    entry: Path.join(__dirname, "main.js"),

    output: {
        path: Path.join(__dirname, "dist"),
        filename: "main.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
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
        new VueLoaderPlugin()
    ]
};

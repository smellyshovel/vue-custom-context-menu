const Express = require("express");
const HistoryApiFallback = require("connect-history-api-fallback")();
const Compiler = require("webpack")(require("./webpack.config.js"));
const WebpackDevMiddleware = require("webpack-dev-middleware")(Compiler);
const WebpackHotMiddleware = require("webpack-hot-middleware")(Compiler);


new Express()
    .use(HistoryApiFallback)
    .use(WebpackDevMiddleware)
    .use(WebpackHotMiddleware)
    .listen(8080);

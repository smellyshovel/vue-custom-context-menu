const Express = require("express");

let app = new Express();

const Webpack = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");
const WebpackConfig = require("./webpack.config.js");

app.use(WebpackDevMiddleware(Webpack(WebpackConfig), {
    publicPath: WebpackConfig.output.publicPath
}));

app.use(Express.static(__dirname));

app.listen(process.env.PORT || 8080);

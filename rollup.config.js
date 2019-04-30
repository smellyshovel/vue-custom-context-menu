import CommonJsPlugin from "rollup-plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";
import BabelPlugin from "rollup-plugin-babel";
import BabelMinifyPlugin from 'rollup-plugin-babel-minify';

export default {
    input: "src/index.js",

    output: {
        name: "VCCM"
    },

    plugins: [
        CommonJsPlugin(),
        VuePlugin({
            css: true,
            compileTemplate: true,
        }),
        BabelPlugin({
            exclude: "node_modules/**"
        }),
        // minify the output when building for unpkg
        process.env.MINIFY ? BabelMinifyPlugin({
            comments: false,
            banner: "/* Matthew Mamonov aka smellyshovel <g.smellyshovel@gmail.com> (https://github.com/smellyshovel/vue-custom-context-menu) © 2018 */"
        }) : function() {}
    ]
};

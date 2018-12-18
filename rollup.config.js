import VuePlugin from "rollup-plugin-vue";
import BabelPlugin from "rollup-plugin-babel";
import BabelMinifyPlugin from 'rollup-plugin-babel-minify';

export default {
    input: "src/main.js",

    output: {
        name: "VCCM"
    },

    plugins: [
        VuePlugin({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        BabelPlugin({
            exclude: "node_modules/**"
        }),
        process.env.MINIFY ? BabelMinifyPlugin() : function() {}
    ]
};

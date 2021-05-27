import VuePlugin from "rollup-plugin-vue";
import PostcssPlugin from "rollup-plugin-postcss"
import BabelPlugin from "@rollup/plugin-babel";
import { terser } from 'rollup-plugin-terser';

export default {
    input: "src/index.js",

    output: {
        name: "VCCM"
    },

    plugins: [
        VuePlugin({
            preprocessStyles: true
        }),
        PostcssPlugin(),
        BabelPlugin({
            exclude: "node_modules/**"
        }),
        process.env.MINIFY ? terser() : false
    ]
};

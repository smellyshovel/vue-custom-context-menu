// rollup.config.js
import BabelPlugin from "rollup-plugin-babel";
import VuePlugin from "rollup-plugin-vue";

export default {
    input: 'src/main.js',
    output: {
        name: "CCM"
    },

    plugins: [
        BabelPlugin({
            exclude: 'node_modules/**'
        }),
        VuePlugin({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
    ]
};

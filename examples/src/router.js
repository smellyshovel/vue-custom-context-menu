import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Home from "./views/Home.vue";
import Example from "./views/Example.vue";

export default new Router({
    mode: "history",
    routes: [
        {
            path: "",
            component: Home
        },

        {
            path: "/:example",
            component: Example
        }
    ]
});

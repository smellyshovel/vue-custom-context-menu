import Vue from "vue";
import VCCM from "vue-custom-context-menu";

Vue.use(VCCM);

import App from "./App.vue";

new Vue({
    render: h => h(App)
}).$mount("#app");

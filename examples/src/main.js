import Vue from "vue";

Vue.config.productionTip = false;

import VCCM from "vue-custom-context-menu";

Vue.use(VCCM);

import router from "./router";
import App from "./App.vue";

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");

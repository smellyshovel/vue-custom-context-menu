import ContextMenuDirective from "./v-context-menu.js";
import ContextMenuComponent from "./components/Menu.vue";

const Plugin = {
    install(Vue) {
        Vue.directive("context-menu", ContextMenuDirective);
        Vue.component("context-menu", ContextMenuComponent);
    }
};

// auto-install when Vue is found (eg. in a browser via <script> tag)
let GlobalVue;

if (typeof window !== "undefined") {
	GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
	GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(Plugin);
}

export default Plugin;

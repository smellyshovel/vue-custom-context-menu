import ContextMenuDirective from "./v-context-menu.js";
import ContextMenuComponent from "./components/ContextMenu.vue";
import ContextMenuItemComponent from "./components/ContextMenuItem.vue";

const Plugin = {
    install(Vue) {
        Vue.directive("context-menu", ContextMenuDirective);
        Vue.component("ContextMenu", ContextMenuComponent);
        Vue.component("ContextMenuItem", ContextMenuItemComponent);
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

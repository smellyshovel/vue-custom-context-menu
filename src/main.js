import ContextMenuDirective from "./directives/ContextMenu.js";
import OverlayComponent from "./components/Overlay.vue";
import MenuComponent from "./components/Menu.vue";
import ItemComponent from "./components/Item.vue";

const Plugin = {
    install(Vue) {
        // allow adding `v-context-menu="'#cm-ID'"` to any element
        Vue.directive("contextMenu", ContextMenuDirective);

        // declare globally available components
        Vue.component("cmOverlay", OverlayComponent); // <cm-overlay>
        Vue.component("contextMenu", MenuComponent); // <context-menu>
        Vue.component("cmItem", ItemComponent); // <cm-item>
    }
};

// Auto-install when Vue is found (eg. in browser via <script> tag)
if (typeof window !== 'undefined') {
	var GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	var GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(Plugin);
}

export default Plugin;

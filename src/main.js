import ContextMenuDirective from "./directives/ContextMenu.js";
import OverlayComponent from "./components/Overlay.vue";
import MenuComponent from "./components/Menu.vue";
import ItemComponent from "./components/Item.vue";

const Plugin = {
    install(Vue, options) {
        options = Object.assign({
            ref: "vccm-context-menus",
            directive: "context-menu",
            overlay: "vccm-overlay",
            menu: "context-menu",
            item: "cm-item"
        }, options);

        // allow adding `v-context-menu="'#cm-ID'"` to any element
        Vue.directive(options.directive, ContextMenuDirective(options));

        // declare globally available components
        Vue.component(options.overlay, OverlayComponent); // <cm-overlay>
        Vue.component(options.menu, MenuComponent); // <context-menu>
        Vue.component(options.item, ItemComponent); // <cm-item>
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

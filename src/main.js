import ContextMenuDirective from "./directives/ContextMenu.js";
import OverlayComponent from "./components/Overlay.vue";
import MenuComponent from "./components/Menu.vue";
import ItemComponent from "./components/Item.vue";

export default {
    install(Vue) {
        // allow adding `v-context-menu="'#cm-ID'"` to any element
        Vue.directive("contextMenu", ContextMenuDirective);

        // declare globally available components
        Vue.component("cmOverlay", OverlayComponent); // <cm-overlay>
        Vue.component("contextMenu", MenuComponent); // <context-menu>
        Vue.component("cmItem", ItemComponent); // <cm-item>
    }
}

import ContextMenuDirective from "./directives/ContextMenu.js";
import OverlayComponent from "./components/Overlay.vue";
import MenuComponent from "./components/Menu.vue";
import ItemComponent from "./components/Item.vue";

export default {
    install(Vue) {
        Vue.directive("contextMenu", ContextMenuDirective);

        Vue.component("cm-overlay", OverlayComponent);
        Vue.component("contextMenu", MenuComponent);
        Vue.component("cmItem", ItemComponent);
    }
}

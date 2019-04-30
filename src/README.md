`index.js` is the entry point used by Webpack and Rollup to build the `dist/` bundles.

`v-context-menu.js` is the source code of the `v-context-menu` directive.

`components/ContextMenu.vue` - the globally-available `<context-menu>` component's source code.

`components/ContextMenuItem.vue` - the globally-available `<context-menu-item>` component's source code.

`components/ContextMenuOverlay.vue` is the `components/ContextMenu.vue` component's dependency.

These source files are compiled by Webpack when served to the dev server and are compiled by Rollup when the bundles for the `dist/` folder are being built.

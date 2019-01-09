# Vue Custom Context Menu

A Vue.js plugin that allows you to build 🖱 Context Menus for your app fast 🚀 and simple 🧩. Supports 🗂 nested Context Menus! Allows for full 🛠 customisation!

## Installation

1. Install the NPM package
    ```shell
    $ npm install vue-custom-context-menu --save
    ```

1. Import it in your app's main file the preferred way

    to import as an ES6 module
    ```javascript
    import VCCM from "vue-custom-context-menu"
    ```

    to import as a CommonJS module
    ```javascript
    const VCCM = require("vue-custom-context-menu")
    ```

1. Make Vue [use the plugin](https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin)
    ```javascript
    Vue.use(VCCM)
    ```

Or you can also include it on the page as a separate `<script>`
```html
<script src="https://unpkg.com/vue-custom-context-menu"></script>
```

*Refer [here](https://github.com/smellyshovel/vue-custom-context-menu/wiki/Installation) for more details on installation*

## Usage

**Bind** Context Menus to elements and components using the `v-context-menu` directive. **Disable** Context Menus for a specific element via the `.disabled` modifier (which also affects all of its children if not otherwise specified for a specific child (and thus its children as well). Provide the `.no-native` modifier to to show a custom Context Menu instead of the **browser's native** one even if the `[alt]` key was holded during the opening

```html
<div id="wrapper" v-context-menu.disabled>
    <custom-header v-context-menu.no-native="'#cm-for-custom-header'"></custom-header>

    <main>
        <ol>
            <file-item is="li"
                v-for="file in files"
                :key="file.id"
                :links="{plain: file.links.plain, zipped: file.links.zipped}"

                v-context-menu="'[data-cm-for-files]'"

            >{{ file.name }}</file-item>
        </ol>
    </main>
</div>
```

**Define** the `<context-menu>`s inside the `<vccm-overlay>` component on the app instance's level. **Customise** behavior by passing props. Use the `<cm-item>` component to define Context Menus' items passing the `action` prop to specify the **action** to be performed or use the familiar `v-context-menu` directive to open another Context Menu as a **nested** one when the item is selected

```html
<div id="app">
    <!-- ... -->

    <vccm-overlay
        transition="fade"
        :penetrable="true">

        <context-menu
            id="#cm-for-custom-header"
            transition="fade"
            shift="both">

            <cm-item :action="addButtonToHeader">Add fast-access button</cm-item>

            <div class=".cm-separator"></div>

            <cm-item :action="closeHeader">
                <div>Close</div>
                <div class="hint">You can reopen it at any time by pressing [Ctrl]+[H]</div>
            </cm-item>
        </context-menu>

        <context-menu
            data-cm-for-files
            :delay="500"
            @closed="(target) => target.tempHighlight()">

            <cm-item :action="openFile">Open</cm-item>
            <cm-item v-context-menu="'#cm-for-download-options'">Download</cm-item>

            <div class=".cm-separator"></div>

            <cm-item :action="cutFile">Cut</cm-item>
            <cm-item :action="copyFile">Copy</cm-item>
            <cm-item :action="renameFile">Rename</cm-item>
            <cm-item :action="deleteFile">Delete</cm-item>
        </context-menu>

        <context-menu
            id="#cm-for-download-options"
            @opened="checkServersLoad">

            <cm-item :action="(target) => download(target.links.plain)">As it is</cm-item>
            <cm-item :action="(target) => download(target.links.zipped)">Zip-compressed</cm-item>
        </context-menu>
    </vccm-overlay>
</div>
```

You can also bring the `<vccm-overlay>` to another component that must be included on the app instance's level with `ref="vccm-context-menus"` to keep your code nice and clean

```html
<!-- App.vue -->

<div id="app">
    <arbitrary-named-component-for-context-menus ref="vccm-context-menus"></arbitrary-named-component-for-context-menus>
</div>
```

```html
<!-- ArbitraryNamedComponentForContextMenus.vue -->

<template>
    <vccm-overlay>
        <!-- ... -->
    </vccm-overlay>
</template>
```

*Refer [here](https://github.com/smellyshovel/vue-custom-context-menu/wiki/Usage) for more details on usage or [here](https://github.com/smellyshovel/vue-custom-context-menu/wiki/QnA) for the QnA*

## Contribution

1. Fork the repo
1. Run `npm i`
1. Make changes under `npm run watch:esm` or `npm run watch:umd`
1. Build dist-files using `npm run build`
1. Create a pull request to the "devel" branch

*Refer [here](https://github.com/smellyshovel/vue-custom-context-menu/blob/master/CONTRIBUTING.md) for more details on contribution*

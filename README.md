# Vue Custom Context Menu

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

## Usage

Bind Context Menus to elements and components using the `v-context-menu` directive:

```html
<custom-header v-context-menu="'#cm-for-custom-header'"></custom-header>

<main>
    <ol>
        <li
            v-for="file in files"
            :key="file.id"

            v-context-menu="'[data-cm-for-files]'"

        >{{ file.name }}</li>
    </ol>
</main>
```

Define the Context Menus inside the `<vccm-overlay>` component on the app instance's level

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
            :delay="500">

            <cm-item :action="openFile">Open</cm-item>
            <cm-item v-context-menu="'#cm-for-download-options'">Download</cm-item>

            <div class=".cm-separator"></div>

            <cm-item :action="cutFile">Cut</cm-item>
            <cm-item :action="copyFile">Copy</cm-item>
            <cm-item :action="renameFile">Rename</cm-item>
            <cm-item :action="deleteFile">Delete</cm-item>
        </context-menu>

        <context-menu id="#cm-for-download-options">
            <cm-item :action="downloadPlain">As it is</cm-item>
            <cm-item :action="downloadArchive">Zip-compressed</cm-item>
        </context-menu>
    </vccm-overlay>
</div>
```

Or use a separate component with `ref="vccm-context-menus"` to keep your app instance nice and clean

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

## Contribution

1. Fork the repo
1. Run `npm i`
1. Make changes under `npm run watch:esm` or `npm run watch:umd`
1. Build dist-files using `npm run build`
1. Create a pull request

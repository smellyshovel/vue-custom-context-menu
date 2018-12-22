# Vue Custom Context Menu

[BETA] A Vue.js plugin that allows you to build 🖱 Context Menus for your app fast 🚀 and simple 🧩. Supports 🗂 nested Context Menus! Allows for full 🛠 customisation!

**[ Note that the _*Vue Custom Context Menu*_ is in BETA till v2 which means that the public API is _unstable_ and may change at any time without any warnings! _The release of v2 is expected no later than 01/01/2019_ ]**

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

*Refer [here](#) for more details on installation*

## Usage

Bind Context Menus to elements and components using the `v-context-menu` directive

```html
<custom-header v-context-menu="'#cm-for-custom-header'"></custom-header>

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

*Refer [here](#) for more details on usage*

## Contribution

1. Fork the repo
1. Run `npm i`
1. Make changes under `npm run watch:esm` or `npm run watch:umd`
1. Build dist-files using `npm run build`
1. Create a pull request

*Refer [here](#) for more details on contribution*

<template>
<div>
    <h1>Context menu item's action</h1>

    <p>
        Open the "cm-alpha" context menu first.
        Both click and right-click on an item perform the specified action (if any) and close the context menu.
        No side-effects are acceptable (such as opening of a new context menu, transposing the opened one, etc.).
        <code>action1</code> logs "1" to the console, <code>action2</code> logs "2" to the console.
        Holding <kbd>Alt</kbd> during right-click on the item opens the native context menu and prevents the action from being performed and the context menu from being closed.
    </p>

    <context-menu ref="cm-alpha">
        <context-menu-item :action="action1">Perform <code>action1</code></context-menu-item>
        <context-menu-item :action="action2">Perform <code>action2</code></context-menu-item>
        <context-menu-item>An item without the <code>action</code></context-menu-item>
    </context-menu>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        A target with <strong>v-context-menu="'cm-alpha'"</strong>
    </div>
</div>
</template>

<script>
export default {
    methods: {
        action1() {
            console.log("1");
        },

        action2() {
            console.log("2");
        }
    }
}
</script>

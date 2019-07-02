<template>
<div>
    <h1>Action's arguments</h1>

    <p>
        An action provided to an item may accept 2 arguments: the `target` that is the target element the
        Context Menu is opened for and the `cm` that is the actual Context Menu being opened.
        Open the Context Menu below, click the "Perform action 1" item. You should be responded in the console
        with the element you right-clicked to open the Context Menu (either `div` or `strong`) and with the `VueComponent`
        that represents the Context Menu itself.
    </p>

    <context-menu ref="cm-alpha">
        <context-menu-item :action="action1">Perform <code>action1</code></context-menu-item>
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
        action1(target, cm) {
            console.log(target, cm);
        }
    }
}
</script>

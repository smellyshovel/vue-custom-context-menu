<template>
<div>
    <h1>Directive dynamics</h1>

    <p>
        The value of the <code>v-context-menu</code> directive might be bind to a variable.
        The value of the variable might change. A context menu must reflect those changes:

        <ul>
            <li>
                The context menu has to be automatically repositioned (if fact it happens without
                any additional tweaks because the old context menu becomes closed and a new open
                becomes opened that leads to transposing)
            </li>
            <li>
                If was <code>v-context-menu="null"</code> and became <code>v-context-menu="'cm-alpha'"</code>
                then the "cm-alpha" context menu must not be opened by itself
            </li>
            <li>
                If was <code>v-context-menu="'cm-alpha'"</code> and became
                <code>v-context-menu="'cm-beta'"</code> then the "cm-alpha" must close
                and the "cm-beta" must open at the same spot where the "cm-alpha" closed
            </li>
            <li>
                If was <code>v-context-menu="'cm-alpha'"</code> and became
                <code>v-context-menu="null"</code> then the "cm-alpha" must close
            </li>
        </ul>

        The same applies to nested context menus as well. Though here're some caveats:

        <ul>
            <li>
                If a new context menu is about to be opened but the caller has the
                <code>disabled</code> prop bound to it then the new context menu must not open
            </li>
            <li>
                If there was a request to open a nested context menu then it must be
                canceled if the nested context menu became unbound via the <code>v-context-menu</code>
                directive or the <code>disabled option</code>
            </li>
        </ul>
    </p>

    <context-menu ref="cm-gamma">
        <div>ref="cm-gamma"</div>
    </context-menu>

    <context-menu ref="cm-delta">
        <div>ref="cm-delta"</div>
    </context-menu>

    <context-menu ref="cm-alpha">
        <context-menu-item v-context-menu="dynamicValue4">Switches from "null" to "cm-gamma" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item v-context-menu="dynamicValue5">Switches from "cm-gamma" to "cm-delta" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item v-context-menu="dynamicValue6">Switches from "cm-gamma" to "null" in 5 seconds after the page is loaded</context-menu-item>
    </context-menu>

    <context-menu ref="cm-beta">
        <context-menu-item :disabled="isDisabled" v-context-menu="dynamicValue4"><strong>disabled -> not disabled</strong> Switches from "null" to "cm-gamma" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item :disabled="isDisabled" v-context-menu="dynamicValue5"><strong>disabled -> not disabled</strong> Switches from "cm-gamma" to "cm-delta" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item :disabled="isDisabled" v-context-menu="dynamicValue6"><strong>disabled -> not disabled</strong> Switches from "cm-gamma" to "null" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item :disabled="!isDisabled" v-context-menu="dynamicValue4"><strong>not disabled -> disabled</strong> Switches from "null" to "cm-gamma" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item :disabled="!isDisabled" v-context-menu="dynamicValue5"><strong>not disabled -> disabled</strong> Switches from "cm-gamma" to "cm-delta" in 5 seconds after the page is loaded</context-menu-item>
        <context-menu-item :disabled="!isDisabled" v-context-menu="dynamicValue6"><strong>not disabled -> disabled</strong> Switches from "cm-gamma" to "null" in 5 seconds after the page is loaded</context-menu-item>
    </context-menu>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        Always "cm-alpha"
    </div>

    <div
        class="target"
        v-context-menu="'cm-beta'"
    >
        Always "cm-beta"
    </div>

    <div
        class="target"
        v-context-menu="dynamicValue1"

    >
        Switches from "null" to "cm-alpha" in 5 seconds after the page is loaded.
    </div>

    <div
        class="target"
        v-context-menu="dynamicValue2"

    >
        Switches from "cm-alpha" to "cm-beta" in 5 seconds after the page is loaded.
    </div>

    <div
        class="target"
        v-context-menu="dynamicValue3"

    >
        Switches from "cm-alpha" to "null" in 5 seconds after the page is loaded.
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            isDisabled: true,
            dynamicValue1: null,
            dynamicValue2: "cm-alpha",
            dynamicValue3: "cm-alpha",
            dynamicValue4: null,
            dynamicValue5: "cm-gamma",
            dynamicValue6: "cm-gamma"
        }
    },

    mounted() {
        setTimeout(() => {
            this.isDisabled = false;
            this.dynamicValue1 = "cm-alpha";
            this.dynamicValue2 = "cm-beta";
            this.dynamicValue3 = null;
            this.dynamicValue4 = "cm-gamma";
            this.dynamicValue5 = "cm-delta";
            this.dynamicValue6 = null;

            console.log("The values are changed!");
        }, 5000);
    }
}
</script>

<style>
.context-menu-item.disabled {
    background-color: gray;
}
</style>

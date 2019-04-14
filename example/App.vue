<template>
<div>
    <div ref="not-a-cm"></div>

    <context-menu ref="cm-inline">
        <div>TEST ITEM INLINE</div>
    </context-menu>

    <cm-wrapped ref="cm-wrapped" />

    <div class="target" v-context-menu="null">disabled</div>
    <div class="target" v-context-menu="'cm-inline'">inline "cm-inline"</div>
    <div class="target" v-if="visible" v-context-menu="'cm-inline'">disappears "cm-inline"</div>
    <div class="target" v-if="visible" v-context-menu="null">disappears disabled</div>
    <div class="target" v-context-menu="'cm-wrapped'">wrapped "cm-wrapped"</div>
    <div class="target" v-context-menu="currentContextMenu">toggles from "cm-inline" to "cm-wrapped" in 2 seconds</div>
</div>
</template>

<script>
import CmWrapped from "./components/ContextMenuWrapped.vue";

export default {
    components: {
        CmWrapped
    },

    mounted() {
        setTimeout(() => {
            this.visible = false;
        }, 2000);

        setTimeout(() => {
            this.currentContextMenu = "cm-wrapped";
        }, 2000);
    },

    data() {
        return {
            visible: true,
            currentContextMenu: "cm-inline"
        }
    }
}
</script>

<style scoped>
.target {
    margin: 0.5rem;
    padding: 1rem;
    border: 1px solid black;
}
</style>

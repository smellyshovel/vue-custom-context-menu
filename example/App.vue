<template>
<div>
    <div ref="not-a-cm"></div>

    <context-menu ref="cm-inline">
        <div>TEST ITEM</div>
    </context-menu>

    <cm-wrapped ref="cm-wrapped" />

    <div class="target" v-context-menu="null">disabled</div>
    <div class="target" v-context-menu="'cm-inline'">inline "cm-inline"</div>
    <div class="target" v-if="visible" v-context-menu="null">disappears null</div>
    <div class="target" v-context-menu="'cm-wrapped'">wrapper "cm-wrapped"</div>
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
    },

    data() {
        return {
            visible: true
        }
    }
}
</script>

<style scoped>
.target {
    padding: 1rem;
    border: 1px solid black;
}
</style>

<template>
<div>
    <h1>Callbacks</h1>

    <p :style="{ backgroundColor: pBackgroundColor }">
        Context menus trigger <code>@opened</code> and <code>@closed</code> events
        when they are opened or closed respectively. A callback function is provided
        with a single argument that is the opened (or closed) context menu instance
    </p>

    <context-menu
        ref="cm-alpha"
        @opened="makeParagraphBlue"
        @closed="makeParagraphGreen"
    >
        <div>ref="cm-alpha"</div>
    </context-menu>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        Open <strong>"cm-alpha"</strong>. The paragraph above becomes blue when the
        context menu is opened and green when it's closed. It also <code>console.log</code>s
        the context menu instance in both cases.
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            pBackgroundColor: "white"
        }
    },

    methods: {
        makeParagraphBlue(cm) {
            console.log(cm);
            this.pBackgroundColor = "blue";
        },

        makeParagraphGreen(cm) {
            console.log(cm);
            this.pBackgroundColor = "green";
        }
    }
}
</script>

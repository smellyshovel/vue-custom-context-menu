<template>
<div
    class="context-menu-overlay"
    :class="{ root: isRoot }"
    :style="{ zIndex }"

    @mousedown="close($event)"
    v-context-menu="null"
>
    <slot></slot>
</div>
</template>

<script>
export default {
    props: {
        isRoot: {
            type: Boolean,
            required: true
        },

        zIndex: {
            type: Number,
            required: true
        },

        penetrable: {
            type: Boolean,
            required: true
        }
    },

    mounted() {
        if (!this.isRoot) return;
        document.documentElement.style.overflow = "hidden";
    },

    methods: {
        close(event) {
            // the next line doesn't allow to close the context menu if the native context menu was requested
            if (event.which === 3 && event.altKey) return;

            // if the overlay is penetrable then a new context menu will be opened because the mousedown event triggers first
            // else the overlay won't yet be closed when the contextmenu event takes place hence no other context menus will open
            if (this.penetrable) {
                this.$emit("close");
            } else {
                event.stopPropagation();

                setTimeout(() => {
                    this.$emit("close");
                }, 0);
            }

        }
    }
}
</script>

<style scoped>
.context-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.root {
    pointer-events: initial;
}
</style>

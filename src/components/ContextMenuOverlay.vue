<template>
<div
    @click="close"
    @contextmenu.prevent.stop
    class="context-menu-overlay"
    :class="{ tangible }"
>
    <slot></slot>
</div>
</template>

<script>
export default {
    props: {
        tangible: {
            type: Boolean,
            required: true
        },

        tangible: {
            type: Boolean,
            required: true
        },
    },

    mounted() {
        if (!this.tangible) return;

        document.documentElement.style.overflow = "hidden";
        document.addEventListener("keydown", this.listeners.closeOnEscKey);

        if (this.penetrable) {
            this.$el.addEventListener("mousedown", (event) => {
                this.$el.style.display = "none";
                this.close();
            });
        } else {
            this.$el.addEventListener("mousedown", (event) => {
                this.close();
            });
        }
    },

    data() {return {
        listeners: {
            closeOnEscKey: (event) => {
                if (event.keyCode === 27) {
                    this.close();
                }
            }
        }
    }},

    methods: {
        close() {
            this.$emit("close");

            document.documentElement.style.overflow = "";
            document.removeEventListener("keydown", this.listeners.closeOnEscKey);
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
    z-index: 100000;
    pointer-events: none;
}

.tangible {
    pointer-events: initial;
}
</style>

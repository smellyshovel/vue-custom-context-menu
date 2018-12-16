<template>
    <transition
        :name="transition"

        ><div
            id="cm-overlay"
            v-show="show"

            @contextmenu.prevent.stop

            ><slot></slot>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            transition: String,
            penetrable: Boolean
        },

        mounted() {
            this.$nextTick(() => {
                if (this.penetrable) {
                    this.$el.addEventListener("mousedown", (event) => {
                        // without this hack "contextmenu" event would trigger on the overlay
                        this.$el.style.display = "none";

                        this.close();
                    });
                } else {
                    this.$el.addEventListener("mousedown", (event) => {
                        this.close();
                    });
                }
            });
        },

        data() {return {
            show: false,

            listeners: {
                closeOnEscKey: (event) => {
                    if (event.keyCode === 27) {
                        this.close();
                    }
                }
            }
        }},

        methods: {
            open() {
                this.show = true;

                document.documentElement.style.overflow = "hidden";
                document.addEventListener("keydown", this.listeners.closeOnEscKey);
            },

            close(event) {
                this.show = false;

                this.$children.forEach((child) => {
                    child.immediateClose();
                });

                document.documentElement.style.overflow = "";
                document.removeEventListener("keydown", this.listeners.closeOnEscKey);
            }
        }
    }
</script>

<style scoped>
    #cm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        display: block;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 10000;
    }
</style>

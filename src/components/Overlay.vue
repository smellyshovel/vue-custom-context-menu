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
            if (this.penetrable) {
                this.$nextTick(() => {
                    this.$el.addEventListener("mousedown", this.listeners.closePenetrable);
                });
            } else {
                this.$nextTick(() => {
                    this.$el.addEventListener("mousedown", this.listeners.closeImpenetrable);
                });
            }
        },

        unmounted() {
            if (this.penetrable) {
                this.$el.removeEventListener("mousedown", this.listeners.closePenetrable);
            } else {
                this.$el.removeEventListener("mousedown", this.listeners.closeImpenetrable);
            }
        },

        data() {return {
            show: false,

            listeners: {
                closePenetrable: (event) => {
                    this.$el.style.display = "none";
                    this.close();
                },

                closeImpenetrable: (event) => {
                    this.close();
                },

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
                document.documentElement.style.overflow = "";

                this.$children.forEach((child) => {
                    child.immediateClose();
                });

                document.removeEventListener("keydown", this.listeners.closeOnEscKey);
            }
        }
    }
</script>

<style>
    #cm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        display: block;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        overflow: hidden;
        z-index: 10000;
    }
</style>

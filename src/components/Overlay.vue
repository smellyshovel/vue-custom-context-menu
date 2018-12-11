<template>
    <transition
        :name="transition"

        ><div
            id="cm-overlay"
            v-show="show"
            :style="style"

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
            show: false,

            style: {
                zIndex: 10000
            }
        }},

        methods: {
            open() {
                this.show = true;
            },

            close(event) {
                this.show = false;

                this.$children.forEach((child) => {
                    child.immediateClose();
                });
            }
        }
    }
</script>

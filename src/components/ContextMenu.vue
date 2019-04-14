<template>
<context-menu-overlay
    v-if="show"
    ref="overlay"
    :tangible="overlayTangible"
    :penetrable="penetrable"

    @close="immediateClose"
>
    <div
        ref="cm"
        class="context-menu"
        :style="style"

        @mouseenter="preventCollapsing"
        @mousedown.stop
    >
        <slot></slot>
    </div>
</context-menu-overlay>
</template>

<script>
import ContextMenuOverlay from "./ContextMenuOverlay.vue";

export default {
    components: {
        ContextMenuOverlay
    },

    props: {
        penetrable: {
            type: Boolean,
            default: true // TODO -> false
        },

        shift: {
            type: String,
            default: "x", // TODO -> y
            validator: (value) => ["fit", "x", "y", "both"].includes(value)
        },

        delay: {
            type: Number,
            default: 250,
            validator: (value) => value > 0
        }
    },

    data() {
        return {
            show: false,
            target: null,

            overlayTangible: true,

            style: {
                left: 0,
                top: 0,
                height: "auto",
                zIndex: 1
            },

            parent: null,
            sub: null,

            openTimer: null,
            closeTimer: null
        }
    },

    methods: {
        open(event, caller) {
            this.show = true;

            this.style.zIndex = caller
                ? this.parent.style.zIndex + 1
                : this.style.zIndex;

            this.overlayTangible = caller
                ? false
                : true;

            this.setPosition(event, caller);

            this.$nextTick(() => {
                this.transpose(caller);
            });
        },

        abstractOpen(event, caller, parent) {
            if (!this.show) {
                this.target = event.target;

                if (parent) {
                    this.parent = parent;
                    this.parent.sub = this;
                }

                this.open(event, caller);
                this.openTimer = null;

                this.$emit("opened", this);
            }
        },

        immediateOpen(event, caller, parent) {
            this.cancelDelayedOpen();
            this.abstractOpen(event, caller, parent);
        },

        delayedOpen(event, caller, parent) {
            this.cancelDelayedOpen();

            this.openTimer = setTimeout(() => {
                this.abstractOpen(event, caller, parent);
            }, parent.delay);
        },

        cancelDelayedOpen() {
            if (this.openTimer) {
                clearTimeout(this.openTimer);
                this.openTimer = null;
            }
        },

        close() {
            this.show = false;

            this.targetComp = null;
            this.style.height = "auto";
            this.style.zIndex = 1;
        },

        abstractClose() {
            if (this.show) {
                var target = this.target;

                if (this.parent) {
                    this.parent.sub = null;
                    this.parent = null;
                }

                if (this.sub) {
                    this.sub.immediateClose();
                    this.sub = null;
                }

                this.close();
                this.closeTimer = null;

                this.$emit("closed", target, this);
            }
        },

        immediateClose() {
            this.cancelDelayedClose();
            this.abstractClose();
        },

        delayedClose() {
            this.cancelDelayedClose();

            this.closeTimer = setTimeout(() => {
                this.abstractClose();
            }, this.parent.delay);
        },

        cancelDelayedClose() {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer);
                this.closeTimer = null;
            }
        },

        preventCollapsing() {
            let parent = this;

            while (parent) {
                parent.cancelDelayedClose();
                parent = parent.parent;
            }
        },

        setPosition(event, caller) {
            if (caller) {
                this.style.left = caller.getBoundingClientRect().right;
                this.style.top = caller.getBoundingClientRect().top;
            } else {
                this.style.left = event.clientX;
                this.style.top = event.clientY;
            }

            this.style.left += "px";
            this.style.top += "px";
        },

        transpose(caller) {
            let viewportWidth = this.$refs.overlay.$el.getBoundingClientRect().width;
            let viewportHeight = this.$refs.overlay.$el.getBoundingClientRect().height;

            let cmWidth = this.$refs.cm.getBoundingClientRect().width;
            let cmHeight = this.$refs.cm.getBoundingClientRect().height;

            let furthestX = this.$refs.cm.getBoundingClientRect().right;
            let furthestY = this.$refs.cm.getBoundingClientRect().bottom;

            if (furthestX >= viewportWidth) {
                if (this.shift === "x" || this.shift === "both") {
                    if (caller) {
                        this.style.left = caller.getBoundingClientRect().left - cmWidth;
                    } else {
                        this.style.left = parseFloat(this.style.left) - cmWidth;
                    }
                } else {
                    this.style.left = viewportWidth - cmWidth;
                }
            }

            if (furthestY >= viewportHeight) {
                if (this.shift === "y" || this.shift === "both") {
                    if (caller) {
                        this.style.top = caller.getBoundingClientRect().bottom - cmHeight;
                    } else {
                        this.style.top = parseFloat(this.style.top) - cmHeight;
                    }
                } else {
                    this.style.top = viewportHeight - cmHeight;
                }
            }

            this.style.left += "px";
            this.style.top += "px";

            this.$nextTick(() => {
                if (parseFloat(this.style.top) < 0) {
                    this.style.top = "0px";

                    if (cmHeight > viewportHeight) {
                        this.style.height = viewportHeight + "px";
                    }
                }
            });
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
}

.context-menu {
    position: absolute;
    min-width: 200px;
}
</style>

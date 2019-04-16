<template>
<context-menu-overlay
    v-if="show"
    ref="overlay"

    :is-root="isRoot"
    :z-index="zIndex"
    :penetrable="penetrable"

    @close="immediateClose"
>
    <div
        ref="wrapper"
        class="context-menu-wrapper"
        :class="{ root: isRoot }"
        :style="style"

        @mouseenter="preventCollapsing"
        @mousedown.stop
    >
        <div
            ref="cm"
            class="context-menu"
        >
            <slot></slot>
        </div>
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
            default: false
        },

        shift: {
            type: String,
            default: "x",
            validator: (value) => ["fit", "x", "y", "both"].includes(value)
        },

        delay: {
            type: Number,
            default: 250,
            validator: (value) => value > 0
        }
    },

    computed: {
        root: {
            cache: false,
            get() {
                return this.isRoot
                    ? this
                    : (() => {
                        let parent = this;
                        while (parent) {
                            var root = parent;
                            parent = parent.parent;
                        }

                        return root;
                    })()
            }
        },

        overlayElement: {
            cache: false,
            get() {
                return this.$refs.overlay.$el;
            }
        },

        wrapperElement: {
            cache: false,
            get() {
                return this.$refs.wrapper;
            }
        }
    },

    data() {
        return {
            show: false,
            target: undefined,

            isRoot: undefined,
            zIndex: 100000,

            style: {
                left: 0,
                top: 0,
                height: "auto"
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

                    this.isRoot = false;
                    this.zIndex = parent.zIndex + 1;
                } else {
                    this.isRoot = true;
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
            let viewportWidth = this.overlayElement.getBoundingClientRect().width;
            let viewportHeight = this.overlayElement.getBoundingClientRect().height;

            let cmWidth = this.wrapperElement.getBoundingClientRect().width;
            let cmHeight = this.wrapperElement.getBoundingClientRect().height;

            let furthestX = this.wrapperElement.getBoundingClientRect().right;
            let furthestY = this.wrapperElement.getBoundingClientRect().bottom;

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
.context-menu-wrapper {
    position: absolute;
    pointer-events: initial;
}

.context-menu {
    height: 100%;
}
</style>

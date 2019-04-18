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
    // TODO close on esc
    // TODO test height change with dynamic items
    // TODO ALREADY CHECKED transpose on v-context-menu's value change - works!

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
            default: 500,
            validator: (value) => value > 0
        }
    },

    computed: {
        root: { // the root context menu instance (the one that is all the nested ones' ancestor)
            cache: false, // must be recalculated each time because the same context menu may be opened either as a root or as a nested one
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
            cache: false, // no reactive data to rely on -> must be recalculated each time
            get() {
                return this.$refs.overlay.$el;
            }
        },

        wrapperElement: {
            cache: false, // no reactive data to rely on -> must be recalculated each time
            get() {
                return this.$refs.wrapper;
            }
        }
    },

    data() {
        return {
            show: false,

            event: undefined, // set on open; don't reset because is might be used even after the context menu closed

            isRoot: true, // the context menu is root if it's not nested
            zIndex: 100000, // incremented on open so nested context menus always spawn above each other

            style: {
                left: 0,
                top: 0,
                height: "auto" // TODO check if it's possible to set this in CSS
            },

            parent: null, // only set for nested context menus
            sub: null, // only set for parents; stores the nested context menu's instance

            openTimer: null,
            closeTimer: null
        }
    },

    methods: {
        // the logics of context menu opening
        abstractOpen(event, caller, parent) {
            // don't open a nested context menu if its parent is closed
            if (parent && !parent.show) return;

            if (!this.show) {
                this.event = event;

                if (parent) {
                    this.parent = parent;
                    this.parent.sub = this;

                    this.isRoot = false;
                    this.zIndex = parent.zIndex + 1;
                }

                this.show = true;

                if (caller) {
                    this.style.left = caller.getBoundingClientRect().right;
                    this.style.top = caller.getBoundingClientRect().top;
                } else {
                    this.style.left = event.clientX;
                    this.style.top = event.clientY;
                }

                this.style.left += "px";
                this.style.top += "px";

                // $nextTick is used because .transpose relies on the real elements' dimensions, and there're no elements yet at this point
                this.$nextTick(() => {
                    this.transpose(caller);
                });

                this.openTimer = null;
                this.$emit("opened", this);
            }
        },

        // public; opens the context menu immediately
        immediateOpen(event, caller, parent) {
            // setTimeout helps to avoid some subtle bugs by allowing other actions to complete first
            setTimeout(() => {
                this.cancelDelayedOpen();
                this.abstractOpen(event, caller, parent);
            }, 0);
        },

        // public; opens the context menu after some time (defined by the parent's delay prop); is used exclusively to open nested context menus
        delayedOpen(event, caller, parent) {
            this.cancelDelayedOpen();

            this.openTimer = setTimeout(() => {
                this.abstractOpen(event, caller, parent);
            }, parent.delay);
        },

        // public; cancels the request to open the context menu
        cancelDelayedOpen() {
            if (this.openTimer) {
                clearTimeout(this.openTimer);
                this.openTimer = null;
            }
        },

        // the logics of context menu closing
        abstractClose() {
            if (this.show) {
                if (this.sub) {
                    this.sub.immediateClose();
                    this.sub = null;
                }

                this.show = false;
                this.style.height = "auto";
                this.zIndex = 100000;

                if (this.isRoot) {
                    document.documentElement.style.overflow = "";
                }

                this.closeTimer = null;
                this.$emit("closed", this);
            }
        },

        // public; closes the context menu (and its nested ones) immediately
        immediateClose() {
            // setTimeout helps to avoid some subtle bugs by allowing other actions to complete first
            setTimeout(() => {
                this.cancelDelayedClose();
                this.abstractClose();
            }, 0);
        },

        // public; closes the context menu (and its nested ones) after some time (defined by the parent's delay prop); is used exclusively to close nested context menus
        delayedClose() {
            this.cancelDelayedClose();

            this.closeTimer = setTimeout(() => {
                this.abstractClose();
            }, this.parent.delay);
        },

        // public; cancels the request to close the context menu
        cancelDelayedClose() {
            if (this.closeTimer) {
                clearTimeout(this.closeTimer);
                this.closeTimer = null;
            }
        },

        // cancels delayed closing of this context menu and all its parents
        preventCollapsing() {
            let parent = this;

            while (parent) {
                parent.cancelDelayedClose();
                parent = parent.parent;
            }
        },

        // shifts and shrinks (when necessary) the context menu
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
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
}
</style>

<template>
    <transition
        :name="transition"

        ><div
            class="cm"
            v-show="show"
            :style="style"

            @mouseenter="preventCollapsing"
            @mousedown.stop

            ><div>
                <ol>
                    <slot></slot>
                </ol>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            transition: String,
            shift: {
                type: [String],
                default: "x",
                validator(value) {
                    return ["fit", "x", "y", "both"].includes(value);
                }
            },
            delay: {
                type: Number,
                default: 250,
                validator(value) {
                    return value > 0;
                }
            }
        },

        data() {return {
            show: false,

            style: {
                left: 0,
                top: 0
            },

            height: 0,

            target: null,

            parent: null,
            sub: null,

            openTimer: null,
            closeTimer: null
        }},

        watch: {
            height(newValue) {
                this.$set(this.style, "height", newValue);
            }
        },

        computed: {
            overlay() {
                return this.$parent;
            },

            root() {
                let parent = this;

                while (parent.parent) {
                    parent = parent.parent;
                }

                return parent;
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
                    if (parent) {
                        this.parent = parent;
                        this.parent.sub = this;
                    }

                    this.open(event, caller);
                    this.openTimer = null;

                    this.$emit("opened", event, this);
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

                this.height = "auto";
                this.target = null;
            },

            abstractClose() {
                if (this.show) {
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

                    this.$emit("closed", this);
                }
            },

            immediateClose() {
                this.cancelDelayedClose();
                this.abstractClose();
            },

            delayedClose() {
                // in some rare cases this one is crucial
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
                let viewportWidth = this.overlay.$el.getBoundingClientRect().width;
                let viewportHeight = this.overlay.$el.getBoundingClientRect().height;

                let cmWidth = this.$el.getBoundingClientRect().width;
                let cmHeight = this.$el.getBoundingClientRect().height;

                let furthestX = this.$el.getBoundingClientRect().right;
                let furthestY = this.$el.getBoundingClientRect().bottom;

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
                            this.height = viewportHeight + "px";
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .cm {
        box-sizing: border-box;
        position: absolute;
        display: block;
        min-width: 200px;
    }

    .cm > div {
        height: 100%;
        overflow: auto;
    }
</style>

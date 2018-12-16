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
            options: Object
        },

        data() {return {
            show: false,

            style: {
                left: 0,
                top: 0
            },

            height: 0,

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

            normalizedOptions() {
                return Object.assign({
                    transfer: false,
                    delay: 250
                }, this.options);
            }
        },

        methods: {
            open(event, caller) {
                this.show = true;

                this.setPosition(event, caller);

                this.$nextTick(() => {
                    this.transfer(caller);
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
                }, parent.normalizedOptions.delay);
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
                }, this.parent.normalizedOptions.delay);
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

            transfer(caller) {
                let viewportWidth = this.overlay.$el.getBoundingClientRect().width;
                let viewportHeight = this.overlay.$el.getBoundingClientRect().height;

                let cmWidth = this.$el.getBoundingClientRect().width;
                let cmHeight = this.$el.getBoundingClientRect().height;

                let furthestX = this.$el.getBoundingClientRect().right;
                let furthestY = this.$el.getBoundingClientRect().bottom;

                if (furthestX >= viewportWidth) {
                    if (this.normalizedOptions.transfer === "x" || this.normalizedOptions.transfer === "both") {
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
                    if (this.normalizedOptions.transfer === "y" || this.normalizedOptions.transfer === "both") {
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

<template>
    <transition
        :name="transition"

        ><div
            class="cm"
            v-show="show"
            :style="style"

            @mouseenter="preventCollapsing"
            @mousedown.stop

            ><ol>
                <slot></slot>
            </ol>
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

            parent: null,
            sub: null,

            openTimer: null,
            closeTimer: null
        }},

        computed: {
            overlay() {
                return this.$parent;
            },

            normalizedOptions() {
                return Object.assign({
                    transfer: "both",
                    delay: 500
                }, this.options);
            }
        },

        methods: {
            open(event, caller) {
                console.log("Opening #" + this.$el.id + "...");

                this.style.left = "0px";
                this.style.top = "0px";
                this.show = true;

                setTimeout(() => {
                    this.setPosition(event, caller);
                }, 100);
            },

            abstractOpen(event, caller, parent) {
                if (!this.show) {
                    if (parent) {
                        this.parent = parent;
                        this.parent.sub = this;
                    }

                    this.open(event, caller);
                    this.calledBy = caller;

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
                }, this.normalizedOptions.delay);
            },

            cancelDelayedOpen() {
                if (this.openTimer) {
                    clearTimeout(this.openTimer);
                    this.openTimer = null;
                }
            },

            close() {
                console.log("CLOSING #" + this.$el.id + "...");

                this.show = false;
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
                }, this.normalizedOptions.delay);
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
                let clickedX = event.clientX,
                    clickedY = event.clientY;

                let viewportWidth = this.overlay.$el.getBoundingClientRect().width,
                    viewportHeight = this.overlay.$el.getBoundingClientRect().height;

                let cmWidth = parseFloat(window.getComputedStyle(this.$el).getPropertyValue("width")),
                    cmHeight = this.$el.getBoundingClientRect().height;

                let furthestX = clickedX + cmWidth,
                    furthestY = clickedY + cmHeight;

                if (!caller) {
                    this.style.left = clickedX;
                    this.style.top = clickedY;
                } else {
                    this.style.left = caller.getBoundingClientRect().right;
                    this.style.top = caller.getBoundingClientRect().top;
                }

                console.log(viewportWidth);
                if (furthestX >= viewportWidth) {
                    if (this.normalizedOptions.transfer === "x" || this.normalizedOptions.transfer === "both") {
                        if (!caller) {
                            this.style.left -= cmWidth;
                        } else {
                            this.style.left = caller.getBoundingClientRect().left - cmWidth;
                        }
                    } else {
                        this.style.left = viewportWidth - cmWidth;
                    }
                }

                if (furthestY >= viewportHeight) {
                    if (this.normalizedOptions.transfer === "y" || this.normalizedOptions.transfer === "both") {
                        if (!caller) {
                            this.style.top -= cmHeight;
                        } else {
                            this.style.top = caller.getBoundingClientRect().bottom - cmHeight;
                        }
                    } else {
                        this.style.top = viewportHeight - cmHeight;
                    }
                }

                this.style.left += "px";
                this.style.top += "px";
            }
        }
    }
</script>

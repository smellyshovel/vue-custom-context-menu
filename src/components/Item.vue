<template>
    <li
        class="cm-item"

        @mouseenter="itemSelected"
        @mouseleave="selectionAborted"
        @mousedown="itemTriggered"

        ><slot></slot>
    </li>
</template>

<script>
    export default {
        props: {
            action: Function
        },

        data() {return {
            calls: null
        }},

        computed: {
            cm() {
                return this.$parent;
            }
        },

        methods: {
            itemSelected(event) {
                // if the cursor enters a caller item
                if (this.calls) {
                    // if the target sub is already opened
                    if (this.cm.sub === this.calls) {
                        // cancel its closing
                        this.calls.cancelDelayedClose();
                    // if there's no opened sub or another (not target) sub is opened
                    } else {
                        // if another sub is opened
                        if (this.cm.sub) {
                            // delay closing of the opened one
                            this.cm.sub.delayedClose();
                        }

                        // delay opening of the target one
                        this.calls.delayedOpen(event, this.$el, this.cm);
                    }
                // if the cursor enters a not-a-caller item
                } else {
                    // and if there's an opened sub
                    if (this.cm.sub) {
                        // then just delay its closing if it hadn't been initiated previously already
                        if (!this.cm.sub.closeTimer) {
                            this.cm.sub.delayedClose();
                        }
                    }
                }
            },

            selectionAborted(event) {
                // only track "mouseleave" for callers
                if (this.calls) {
                    // cancel target's delayed opening
                    this.calls.cancelDelayedOpen();
                }
            },

            itemTriggered(event) {
                // if a caller item is pressed
                if (this.calls) {
                    // if there's an already opened sub (or no such at all)
                    if (this.cm.sub !== this.calls) {
                        // if there's an opened sub already
                        if (this.cm.sub) {
                            // then immediately close it
                            this.cm.sub.immediateClose();
                        }

                        // immediately open the target one
                        this.calls.immediateOpen(event, this.$el, this.cm);
                    }
                // if a not-a-caller item is pressed
                } else {
                    // perform the item's action (if any)
                    if (this.action) {
                        this.action();
                    }

                    // and close everything
                    this.cm.overlay.close();
                }
            }
        }
    }
</script>

<style>
    .cm-item {
        padding: 1rem;
        background-color: rgb(241, 241, 241);
        border-radius: 5px;
    }
</style>

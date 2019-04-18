<template>
<div
    class="context-menu-item"
    :class="{ caller: isCaller, disabled: isDisabled }"

    @mouseenter="itemSelected"
    @mouseleave="selectionAborted"
    @mousedown="itemTriggered"
>
    <slot></slot>
</div>
</template>

<script>
export default {
    props: {
        action: {
            type: Function,
            default: function() {}
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            calls: undefined, // is set from the v-context-menu.js; points to the nested context menu this item opens
        }
    },

    computed: {
        cm() { // the context menu instance this item belongs to
            return this.$parent.$parent;
        },

        isCaller() {
            return !!this.calls;
        },

        isDisabled() {
            return this.calls === null || this.disabled;
        }
    },

    watch: {
        // cancel opening of the nested context menu (or close it if it's already opened) when the item suddenly becomes disabled
        isDisabled(newValue) {
            if (newValue === true && this.isCaller) {
                this.calls.cancelDelayedOpen();
                this.calls.immediateClose();
            }
        },

        // when the nested context menu changes and the old one was about to open then cancel its opening
        calls(newValue, oldValue) {
            if (this.isCaller && oldValue) {
                oldValue.cancelDelayedOpen();
                // this.calls.immediateClose(); <- no need in this here because it's handled in the directive's update hook
            }
        }
    },

    methods: {
        itemSelected(event) {
            // don't do anything for disabled items
            if (this.isDisabled) return;

            // if the cursor entered a caller item
            if (this.isCaller) {
                // if there's already an opened sub and it's the same that this item calls
                if (this.cm.sub === this.calls) {
                    // then cancel its closing
                    this.calls.cancelDelayedClose();
                // if there's no opened sub or another (not the one this item calls) sub is opened
                } else {
                    // if another sub is opened
                    if (this.cm.sub) {
                        // delay closing of the opened one
                        this.cm.sub.delayedClose();
                    }

                    // delay opening of the target one
                    this.calls.delayedOpen(event, this.$el, this.cm);
                }
            // if the cursor entered a not-a-caller item
            } else {
                // and if there's an opened sub
                if (this.cm.sub) {
                    // then just delay its closing if it hadn't been initiated already
                    if (!this.cm.sub.closeTimer) {
                        this.cm.sub.delayedClose();
                    }
                }
            }
        },

        selectionAborted(event) {
            // don't do anything for disabled items
            if (this.isDisabled) return;

            // only track "mouseleave" for callers
            if (this.isCaller) {
                // cancel delayed opening of the target cm (it has been initiated when the cursor entered this item)
                this.calls.cancelDelayedOpen();
            }
        },

        itemTriggered(event) {
            // don't do anything for disabled items
            if (this.isDisabled) return;

            // if a caller item is pressed
            if (this.isCaller) {
                // if there's already an opened sub and it's not the same that this item calls (or if there's no opened sub at all)
                if (this.cm.sub !== this.calls) {
                    // if there's an opened sub already
                    if (this.cm.sub) {
                        // then immediately close it
                        this.cm.sub.immediateClose();
                    }

                    // immediately open the target context menu
                    this.calls.immediateOpen(event, this.$el, this.cm);
                }
            // if a not-a-caller item is pressed
            } else {
                // don't do anything if the native context menu was requested
                if (event.which === 3 && event.altKey) return;

                // perform the item's action
                this.action(this.cm.target, this.cm);

                this.cm.root.immediateClose();
            }
        }
    }
}
</script>

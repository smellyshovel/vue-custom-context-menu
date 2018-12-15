export default {
    bind: function(el, binding, vNode) {
        let findOverlayAndCm = () => {
            if ("cm-stack" in vNode.context.$refs) {
                var overlay = vNode.context.$refs["cm-stack"].$children.find((child) => {
                    return child.$options._componentTag === "cm-overlay";
                });
            } else {
                var overlay = vNode.context.$children.find((child) => {
                    return child.$options._componentTag === "cm-overlay";
                });
            }

            let cm = overlay.$children.find((child) => {
                return child.$el === document.querySelector(binding.value);
            });

            return {overlay, cm};
        };

        if (vNode.componentInstance && vNode.componentOptions.tag === "cm-item") {
            vNode.context.$nextTick(() => {
                let {overlay, cm} = findOverlayAndCm();
                vNode.componentInstance.calls = cm;
            });
        } else {
            el.addEventListener("contextmenu", (event) => {
                event.stopPropagation();

                if (!binding.modifiers["no-native"] ? event.altKey === false : true) {
                    event.preventDefault();

                    if (!binding.modifiers["disabled"]) {
                        let {overlay, cm} = findOverlayAndCm();

                        overlay.open();
                        cm.immediateOpen(event);
                    }
                }
            });
        }
    }
};

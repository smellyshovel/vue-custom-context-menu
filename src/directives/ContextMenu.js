export default function(options) { return {
    bind: function(el, binding, vNode) {
        let findOverlayAndCm = () => {
            if (options.ref in vNode.context.$root.$children[0].$refs) {
                var overlay = vNode.context.$root.$children[0].$refs[options.ref].$children.find((child) => {
                    return child.$options._componentTag === options.overlay;
                });
            } else {
                var overlay = vNode.context.$children.find((child) => {
                    return child.$options._componentTag === options.overlay;
                });
            }

            let cm = overlay.$children.find((child) => {
                return child.$el === document.querySelector(binding.value);
            });

            return {overlay, cm};
        };

        if (vNode.componentInstance && vNode.componentOptions.tag === options.item) {
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
                        cm.targetComp = vNode.componentInstance || vNode.elm;

                        overlay.open();
                        cm.immediateOpen(event);
                    }
                }
            });
        }
    }
}};

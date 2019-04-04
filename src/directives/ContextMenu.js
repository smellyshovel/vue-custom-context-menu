let overlay, cm;

let findOverlayAndCm = (options, el, binding, vNode) => {
    if (options.ref in vNode.context.$root.$children[0].$refs) {
        overlay = vNode.context.$root.$children[0].$refs[options.ref].$children.find((child) => {
            return child.$options._componentTag === options.overlay;
        });
    } else {
        overlay = vNode.context.$children.find((child) => {
            return child.$options._componentTag === options.overlay;
        });
    }

    cm = overlay.$children.find((child) => {
        return child.$el === document.querySelector(binding.value);
    });
};

export default function(options) { return {
    bind: function(el, binding, vNode) {
        if (vNode.componentInstance && vNode.componentOptions.tag === options.item) {
            vNode.context.$nextTick(() => {
                findOverlayAndCm(options, el, binding, vNode);
                vNode.componentInstance.calls = cm;
            });
        } else {
            findOverlayAndCm(options, el, binding, vNode);

            el.addEventListener("contextmenu", (event) => {
                event.stopPropagation();

                if (!binding.modifiers["no-native"] ? event.altKey === false : true) {
                    event.preventDefault();

                    if (!binding.modifiers["disabled"] && cm) {
                        cm.targetComp = vNode.componentInstance || vNode.elm;

                        overlay.open();
                        cm.immediateOpen(event);
                    }
                }
            });
        }
    },

    update: function(el, binding, vNode) {
        if (binding.oldValue !== binding.value) {
            findOverlayAndCm(options, el, binding, vNode);
        }
    }
}};

// store the attached event listeners here in order to be able to detach them in unbind
const AttachedEventListeners = [];

export default {
    bind(el, binding, vNode) {
        // each thrown error message should begin with an indication of what v-context-menu directive exactly the error is bound to
        const ERROR_PREFIX = `[v-context-menu="${ binding.expression.replace(/\"/, "\'") }"] |`;

        if (binding.value === null) { // disable the native context menu if the v-context-menu value is null
            let listener = (event) => {
                event.stopPropagation();
                event.preventDefault();
            };

            // save the element-listener pair and attach the listener
            AttachedEventListeners.push([el, listener]);
            el.addEventListener("contextmenu", listener);
        } else if (typeof binding.value === "string") { // a string is provided
            // find a context menu among the context's refs
            let cm = vNode.context.$refs[binding.value];

            if (cm) { // is somethings (either an HTML element or a component) is found
                if (!(cm instanceof HTMLElement)) { // the context menu is definetely a component
                    if (cm.$options._componentTag !== "context-menu") { // a wrapper is used
                        // find the actual wrapped context menu by the "wrapped-context-menu" ref
                        // the ref-search is used because there may be other context menus incorporated in the wrapper (which are used as nested ones)
                        cm = cm.$refs["wrapped-context-menu"];

                        if (!cm || cm instanceof HTMLElement || cm.$options._componentTag !== "context-menu") { // the context menu isn't found in the wrapper, or it's found but it's an HTML element, or it's a component but not the <context-menu> one
                            throw new Error(`${ ERROR_PREFIX } Couln't find the 'ContextMenu' component with the reference 'wrapped-context-menu' inside the '${ binding.value }' wrapper-component`);
                        }
                    }

                    /*
                        Here the `cm` variable definetely points to a <context-menu> instance.
                        The problem though is that the v-context-menu directive might be
                        used on the <cm-item> component which requires some different treatment.
                    */

                    if (vNode.componentInstance && vNode.$options._componentTag === "cm-item") { // v-context-menu is used on the <cm-item> component
                        console.log("cm-item detected");
                    } else { // v-context-menu is used on any other element
                        let listener = (event) => {
                            event.stopPropagation();

                            if (!event.altKey) { // open the context menu if the alt key was not holded during the right-click
                                event.preventDefault();
                                cm.immediateOpen(event);
                            }
                        };

                        // save the element-listener pair and attach the listener
                        AttachedEventListeners.push([el, listener]);
                        el.addEventListener("contextmenu", listener);
                    }
                } else { // the context menu is an HTML element rather than a component
                    throw new Error(`${ ERROR_PREFIX} The v-context-menu directive must point to either the 'ContextMenu' component or a 'ContextMenu' wrapper-component, but it points to a '${ cm.tagName }' HTML element`);
                }
            } else { // the ref isn't found
                throw new Error(`${ ERROR_PREFIX} Couldn't find a context menu by the reference '${ binding.value }'`);
            }
        } else { // something other than null or a string is provided
            throw new TypeError(`${ ERROR_PREFIX} The v-context-menu directive only accepts 'null' and 'string' values, but '${ typeof binding.value }' is provided`);
        }
    },

    unbind(el, binding, vNode) {
        // find the element-listener pair by the unbound element `el`
        let [element, listener] = AttachedEventListeners.find(elementListenerPair => {
            return el === elementListenerPair[0];
        });

        element.removeEventListener("contextmenu", listener);
    }
}

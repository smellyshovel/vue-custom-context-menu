// store the bound context menus here in order to be able to detach them later
const BoundContextMenus = new Map();

function bindContextMenu(el, binding, vNode) {
    // each thrown error message should begin with an indication of what v-context-menu directive exactly the error is bound to
    const ERROR_PREFIX = `[v-context-menu="${ binding.expression.replace(/\"/, "\'") }"] |`;

    if (binding.value === null) { // disable the native context menu if the v-context-menu value is null
        let listener = (event) => {
            event.stopPropagation();
            event.preventDefault();
        };

        // save the element: listener, cm triplet and attach the listener
        BoundContextMenus.set(el, { listener, cm: null });
        el.addEventListener("contextmenu", listener);
    } else if (typeof binding.value === "string") { // a string is provided
        // find a context menu among the context's refs
        let cm = vNode.context.$refs[binding.value];

        if (cm) { // if something (either an HTML element or a component) is found
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

                if (vNode.componentInstance && vNode.componentInstance.$options._componentTag === "context-menu-item") { // v-context-menu is used on the <cm-item> component
                    // vNode.context.$nextTick(() => {
                        console.log("here");
                        vNode.componentInstance.calls = cm;
                    // });
                } else { // v-context-menu is used on any other element
                    let listener = (event) => {
                        event.stopPropagation();

                        if (!event.altKey) { // open the context menu if the alt key was not holded during the right-click
                            event.preventDefault();
                            cm.immediateOpen(event);
                        }
                    };

                    // save the element: listener, cm triplet and attach the listener
                    BoundContextMenus.set(el, { listener, cm });
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
}

function closeAndUnbindContextMenu(element) {
    // find the listener and the context menu for the provided element
    let { listener, cm } = BoundContextMenus.get(element);

    // remove the existing event listener (it may possibly be replaced with a new one later if the function is called from the update hook)
    element.removeEventListener("contextmenu", listener);

    // close the context menu if it's not null and if it's not opened for another element
    if (cm && cm.target === element) cm.close();

    // delete the record in the Map in order to prevent potential memory leaks
    BoundContextMenus.delete(element);
}

export default {
    bind(el, binding, vNode) {
        bindContextMenu(el, binding, vNode);
    },

    update(el, binding, vNode) {
        if (binding.oldValue !== binding.value) {
            closeAndUnbindContextMenu(el);
            bindContextMenu(el, binding, vNode)
        }
    },

    unbind(el) {
        closeAndUnbindContextMenu(el);
    }
}

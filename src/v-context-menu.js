// store bound context menus here in order to be able to close them and detach event listeners later
const BoundContextMenus = new Map();

function bindContextMenu(element, binding, vNode) {
    // any error message should be started with an indication of the v-context-menu directive the error is thrown for
    const ERROR_PREFIX = `[v-context-menu="${ binding.expression.replace(/\"/, "\'") }"]`;

    if (binding.value === null) { // v-context-menu="null"
        if (vNode.componentInstance && vNode.componentInstance.$options._componentTag === "context-menu-item") { // v-context-menu is used on the <context-menu-item> component
            // save the [element: listener, cm] triplet (the listeners are attached at the <context-menu-item> component's level, see its source)
            BoundContextMenus.set(vNode.elm, { listener: null, cm: null });

            // tell the item instance that it's a caller-item, but it opens no nested context menus
            vNode.componentInstance.calls = null;
        } else { // v-context-menu is used on any other element (either an HTML element or a component)
             // disable the native context menu if the alt key was not holded during the right-click
            let listener = (event) => {
                event.stopPropagation();

                if (!event.altKey) {
                    event.preventDefault();
                }
            };

            // save the [element: listener, cm] triplet and attach the listener
            BoundContextMenus.set(element, { listener, cm: null });
            element.addEventListener("contextmenu", listener);
        }

        // return the bound context menu (null in this case)
        return null;
    } else if (typeof binding.value === "string") { // e.g. v-context-menu="'sample'"
        // find the context menu with the ref="sample"
        let cm = vNode.context.$refs[binding.value];

        if (cm) { // something (either an element or a component) is found
            if (!(cm instanceof HTMLElement)) { // the context menu is definitely a component
                if (cm.$options._componentTag !== "context-menu") { // assume that a wrapper is used if the component is not the <context-menu> one
                    // find the actual wrapped context menu by the "wrapped-context-menu" ref
                    cm = cm.$refs["wrapped-context-menu"];

                     // throw if the context menu isn't found in the wrapper, or it's found but it's an HTML element, or it's a component but not the <context-menu> one
                    if (!cm || cm instanceof HTMLElement || cm.$options._componentTag !== "context-menu") {
                        throw new Error(`${ ERROR_PREFIX } | Couldn't find the 'ContextMenu' component with the reference 'wrapped-context-menu' inside the '${ binding.value }' wrapper-component`);
                    }
                }

                /*
                    Here the variable `cm` definitely points to a context menu instance.
                    The problem though is that the v-context-menu directive might be
                    used on the <context-menu-item> component which requires some
                    different treatment.
                */

                if (vNode.componentInstance && vNode.componentInstance.$options._componentTag === "context-menu-item") { // v-context-menu is used on the <context-menu-item> component
                    // save the [element: listener, cm] triplet (the listeners are attached at the <context-menu-item> component's level, see its source)
                    BoundContextMenus.set(vNode.elm, { listener: null, cm });

                    // tell the item instance that it's a caller-item and opens the found context menu as a nested one
                    vNode.componentInstance.calls = cm;
                } else { // v-context-menu is used on any other element (either an HTML element or a component)
                     // open the context menu if the alt key was not holded during the right-click
                    let listener = (event) => {
                        event.stopPropagation();

                        if (!event.altKey) {
                            event.preventDefault();
                            cm.immediateOpen(event);
                        }
                    };

                    // save the [element: listener, cm] triplet and attach the listener
                    BoundContextMenus.set(element, { listener, cm });
                    element.addEventListener("contextmenu", listener);
                }

                // return the bound context menu
                return cm;
            } else { // the context menu is an HTML element rather than a component
                throw new Error(`${ ERROR_PREFIX} | The 'v-context-menu' directive must point to either the 'ContextMenu' component or a 'ContextMenu' wrapper-component, but it points to a '${ cm.tagName }' HTML element`);
            }
        } else { // neither elements nor components with the ref="sample" are found
            throw new Error(`${ ERROR_PREFIX} | Couldn't find a context menu by the reference '${ binding.value }'`);
        }
    } else { // e.g. v-context-menu="undefined"
        throw new TypeError(`${ ERROR_PREFIX} | The 'v-context-menu' directive only accepts 'null' and 'string' values, but '${ typeof binding.value }' is provided`);
    }
}

function unbindContextMenu(element) {
    // find the listener and the context menu for the provided element
    let { listener, cm } = BoundContextMenus.get(element);

    // remove the existing event listener if any (there's none for nested context menus, see above)
    if (listener) element.removeEventListener("contextmenu", listener);

    // delete the record from the Map in order to prevent potential memory leaks
    BoundContextMenus.delete(element);

    return cm;
}

export default {
    bind(element, binding, vNode) {
        bindContextMenu(element, binding, vNode);
    },

    update(element, binding, vNode) {
        // trigger only in cases when the v-context-menu directive's value is changed
        if (binding.oldValue !== binding.value) {
            // unbind the old context menu and bind the new one
            let oldCm = unbindContextMenu(element);
            let newCm = bindContextMenu(element, binding, vNode);

            // if the old context menu is opened and it's opened for the same target the update hook is triggered for
            if (oldCm && oldCm.show && oldCm.event.target === element) {
                // then close it
                oldCm.immediateClose();

                // and open the new one if it's not disabled using the old one's data
                if (newCm) {
                    newCm.immediateOpen(oldCm.event, oldCm.caller, oldCm.parent);
                }
            }
        }
    },

    unbind(element) {
        let cm = unbindContextMenu(element);

        // close the unbound context menu if it's not null, it's opened and it's opened for the same target the unbind hook is triggered for
        if (cm && cm.show && cm.event.target === element) {
            cm.immediateClose();
        }
    }
}

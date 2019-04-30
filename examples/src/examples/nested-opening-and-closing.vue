<template>
<div>
    <h1>Nested opening and closing</h1>

    <p>
        Adding the <code>v-context-menu</code> directive to a context menu item turns the item to into a "caller-item" (or just a "caller" for shortness).
        It's called "caller" because it calls a nested context menu. The nested context menu that is opened by the caller is called a "target context menu".

        <ul>
            <li>The <code>action</code> prop is ignored for callers</li>
            <li>
                Adding <code>v-context-menu</code> to a caller doesn't make the target context menu belong exclusively to that item.
                It may still be opened using any other target
            </li>
            <li>
                The target context menu is opened in the following cases:

                <ul>
                    <li>
                        The cursor enters the caller and stays there for the amount of time specified in the target's parent <code>delay</code> prop (500 by  default).
                        Thus the delay for "cm-nested-alpha" in this example is 1s and for "cm-nested-nested-alpha" is 2s
                    </li>
                    <li>
                        The item is clicked (or rather "<code>mousedown</code>ed"). It makes the target context menu open immediately.
                        The main thing to test in such case is that the same target context menu isn't opened again (because of the cursor entered the caller earlier)
                    </li>
                </ul>
            </li>
            <li>
                A nested context menu is closed in the following cases:

                <ul>
                    <li>
                        The cursor enters any of the target parent's items that is not the same caller or a caller that opens the same target context menu.
                        In such case the nested context menu will close after the target's parent <code>delay</code> amount of time
                        (the same that specifies the opening delay)
                    </li>
                    <li>The <kbd>Esc</kbd> key is pressed. In such case the nested context menu is closed immediately</li>
                </ul>
            </li>
            <li>
                A request to open a target context menu might be canceled in the following cases:
                <ul>
                    <li>The cursor leaves the caller</li>
                    <li>The target context menu's parent is closed</li>
                </ul>
            </li>
            <li>
                A request to close a target context menu might be canceled in the following cases:
                <ul>
                    <li>The cursor returns to the target context menu (though it doen't affect the target's nested context menus)</li>
                    <li>The cursor returns to the caller (doesn't affect target's nested context menus as well)</li>
                </ul>
            </li>
            <li>Closing a nested context menu means recursively close all its nested context menus as well</li>
            <li>By the way, the <kbd>Esc</kbd> key also closes the root context menu if there're no opened nested ones.</li>
        </ul>

        All the overlays other than the root's one use the <code>pointer-events: none</code> CSS property so the user can interact with underlying
        context menus when a nested one is opened.
    </p>

    <context-menu ref="cm-nested-nested-alpha">
        <context-menu-item>A regular item</context-menu-item>
    </context-menu>

    <context-menu
        ref="cm-nested-alpha"
        :delay="2000"
    >
        <context-menu-item v-context-menu="'cm-nested-nested-alpha'">Calls "cm-nested-nested-alpha"</context-menu-item>
        <context-menu-item>A regular item</context-menu-item>
    </context-menu>

    <context-menu
        ref="cm-alpha"
        :delay="1000"
    >
        <context-menu-item v-context-menu="'cm-nested-alpha'" :action="action1">Calls "cm-nested-alpha" (with action (that is ignored))</context-menu-item>
        <context-menu-item>A regular item</context-menu-item>
    </context-menu>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        Open <strong>"cm-alpha"</strong>; <strong>:delay="1000"</strong>
    </div>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        Open <strong>"cm-nested-alpha"</strong> even though it's might be used as a nested.
    </div>
</div>
</template>

<script>
export default {
    methods: {
        action1() {
            console.log("1. Never performed because is used on a caller");
        }
    }
}
</script>

<template>
<div>
    <h1>Wrapped declarations</h1>

    <p>
        A context menu can be located in a separate component. In such case it should be enough to
        insert that component into the layout and reference it as a regualar context menu.
        The context menu itself must be referenced inside the wrapper-component with <code>ref="wrapped-context-menu"</code>.
        This test ensures that wrapped context menus can be found and that they work just as inline
        context menus. A wrapped context menu may also include nested context menus in the same component (either
        inline or wrapped).
    </p>

    <cm-wrapped-alpha ref="cm-wrapped"></cm-wrapped-alpha>

    <div
        class="target"
        v-context-menu="'cm-wrapped'"
    >
        Open the <strong>"cm-wrapped"</strong> context menu
    </div>
</div>
</template>

<script>
import CmWrappedAlpha from "./../components/ContextMenuWrappedAlpha.vue";

export default {
    components: {
        CmWrappedAlpha
    }
}
</script>

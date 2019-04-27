<template>
<div>
    <h1>Penetrable option</h1>

    <p>
        The penetrable option specifies what to do if the user right-clicks the overlay.
        If a context menu is configured to be <code>penetrable</code> then right-click on the overlay
        passes the <code>contextmenu</code> event through itself thus another context menu (either native or custom)
        is immediately opened. If the context menu is <code>impenetrable</code> then right-click on the overlay
        just closes the context menu and no other context menu is opened.
    </p>

    <context-menu ref="cm-penetrable" penetrable>
        <div>ref="cm-penetrable"</div>
    </context-menu>

    <context-menu ref="cm-impenetrable">
        <div>ref="cm-impenetrable"</div>
    </context-menu>

    <div
        class="target cm-penetrable"
        v-context-menu="'cm-penetrable'"
    >
        A target that opens a <strong>penetrable</strong> context menu
    </div>

    <div
        class="target cm-impenetrable"
        v-context-menu="'cm-impenetrable'"
    >
        A target that opens an <strong>impenetrable</strong> context menu
    </div>
</div>
</template>

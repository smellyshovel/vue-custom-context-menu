<template>
<div>
    <h1>Penetrable option</h1>

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

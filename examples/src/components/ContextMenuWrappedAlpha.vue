<template>
<div>
    <context-menu ref="cm-test">
        <context-menu-item>ref="cm-test"</context-menu-item>
    </context-menu>

    <context-menu ref="wrapped-context-menu">
        <context-menu-item v-context-menu="'cm-test'">Open "cm-test"</context-menu-item>
    </context-menu>
</div>
</template>

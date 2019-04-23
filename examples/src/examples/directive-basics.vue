<template>
<div>
    <h1>Directive basics</h1>

    <context-menu ref="cm-alpha">
        <div>ref="cm-alpha"</div>
    </context-menu>

    <div
        class="target"
        data-cy="cm-null"
        v-context-menu="null"
    >
        A target with <strong>v-context-menu="null"</strong>
    </div>

    <div
        class="target"
        v-context-menu="null"
    >
        A target with <strong>v-context-menu="null"</strong>

        <div
            class="target"
            data-cy="cm-null-child-none"
        >
            A child target <strong>without</strong> v-context-menu</strong>
        </div>

        <div
            class="target"
            data-cy="cm-null-child-cm-alpha"
            v-context-menu="'cm-alpha'"
        >
            A child target with <strong>v-context-menu="'cm-alpha'"</strong>
        </div>
    </div>

    <div
        class="target"
        data-cy="cm-alpha"
        v-context-menu="'cm-alpha'"
    >
        A target with <strong>v-context-menu="'cm-alpha'"</strong>
    </div>

    <div
        class="target"
        v-context-menu="'cm-alpha'"
    >
        A target with <strong>v-context-menu="'cm-alpha'"</strong>

        <div
            class="target"
            data-cy="cm-alpha-child-none"
        >
            A child target <strong>without</strong> v-context-menu</strong>
        </div>

        <div
            class="target"
            data-cy="cm-alpha-child-cm-null"
            v-context-menu="null"
        >
            A child target with <strong>v-context-menu="null"</strong></strong>
        </div>

        <context-menu ref="cm-beta">
            <div>ref="cm-beta"</div>
        </context-menu>

        <div
            class="target"
            data-cy="cm-alpha-child-cm-beta"
            v-context-menu="'cm-beta'"
        >
            A child target with <strong>v-context-menu="'cm-beta'"</strong></strong>
        </div>
    </div>
</div>
</template>

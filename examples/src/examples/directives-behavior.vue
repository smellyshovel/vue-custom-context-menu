<template>
<div>
    <h1>Directive's behavior</h1>

    <p>
        <ul>
            <li>Elements without the <code>v-context-menu</code> directive must not be affected by the plugin</li>
            <li>Elements with <code>v-context-menu="null"</code> must disable the native context menu</li>
            <li><code>v-context-menu="null"</code> must also affect the children without the <code>v-context-menu</code> directive</li>
            <li>It must be possible for children to overwrite <code>v-context-menu="null"</code> with another context menu</li>
            <li>Elements with <code>v-context-menu="'cm-alpha'"</code> must open the "cm-alpha" context-menu</li>
            <li><code>v-context-menu="'cm-alpha'"</code> must also affect the children without the <code>v-context-menu</code> directive</li>
            <li>It must be possible for children to overwrite <code>v-context-menu="'cm-alpha'"</code> with <code>v-context-menu="null"</code></li>
            <li>It must be possible for children to overwrite <code>v-context-menu="'cm-alpha'"</code> with another context menu</li>
            <li>The native context menu must open if the <kbd>Alt</kbd> key was holded during the right-click for any of the above cases</li>
        </ul>
    </p>

    <context-menu ref="cm-alpha">
        <div>ref="cm-alpha"</div>
    </context-menu>

    <context-menu ref="cm-beta">
        <div>ref="cm-beta"</div>
    </context-menu>

    <div
        class="target cm-null"
        v-context-menu="null"
    >
        A target with <strong>v-context-menu="null"</strong>

        <div
            class="target cm-null-child-none"
        >
            A child target <strong>without</strong> v-context-menu</strong>
        </div>

        <div
            class="target cm-null-child-cm-alpha"
            v-context-menu="'cm-alpha'"
        >
            A child target with <strong>v-context-menu="'cm-alpha'"</strong>
        </div>
    </div>

    <div
        class="target cm-alpha"
        v-context-menu="'cm-alpha'"
    >
        A target with <strong>v-context-menu="'cm-alpha'"</strong>

        <div
            class="target cm-alpha-child-none"
        >
            A child target <strong>without</strong> v-context-menu</strong>
        </div>

        <div
            class="target cm-alpha-child-cm-null"
            v-context-menu="null"
        >
            A child target with <strong>v-context-menu="null"</strong></strong>
        </div>

        <div
            class="target cm-alpha-child-cm-beta"
            v-context-menu="'cm-beta'"
        >
            A child target with <strong>v-context-menu="'cm-beta'"</strong></strong>
        </div>
    </div>
</div>
</template>

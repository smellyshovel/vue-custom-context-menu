# Vue Custom Context Menu

**[ Note that the Vue Custom Context Menu is in BETA till v2 which means that public API is _unstable_ and may change at any time without any warnings! _The release of v2 is expected no later than 01/01/2019_ ]**

Check out the **Demo** (TODO)!

What makes it special 🌟:

* No more ugly ` @contextmenu.prevent="$refs['context-menu'].open"`s in your code 🎉
* Allows for full 🛠 **customisation**:
    * **Style** 💇‍♂️ everything from the overlay to arrows pointing out that an item opens a nested Context Menu the way you want it to look
    * **Configure** ⚙ everything from the penetrative properties of the overlay to what to do with Context Menus that don't fit well on the screen
* Wait a minute. "Nested Context Menus" 😍? You've read it all right! One Context Menu may has as many 🗂 **nested** Context Menus as you desire it to! As well as a nested Context Menu may itself has **unlimited** number of nested Context Menus!
* A Context Menu turned out to be as overpopulated with items that it probably wouldn't fit the **height of the screen** 😬? Not a problem! Everything's already set up for you with reasonable defaults
* Don't want a Context Menu for a specific element at all 🙅? The plugin allows you to easily **disable** it!
* Want to give your users the ability to see a browser's **native** context menu instead of a custom one in some cases? You're good to go 👍. Just tell them to hold the `alt` key. Don't want 🤔? Just configure it so!

And even a few more:
* 📱 Works well either on **desktops** and on **mobile** devices
* Don't like how the components/directives and the other related things included by the plugin are named by default? **Change** them 😉!
* Everything's made with your (and your users') convenience in mind: no more manual events registration, no more struggling with edge-cases - you can **just use it** 🛎

Sounds as a charm for you? Then dig further!

## Installation

Sure thing in order to experience all the above stated benefits yourself you first have to install the plugin. There're 2 **possible ways** to do so:

1. The first one is for use in full-fledged web applications. Using **npm**/**webpack**/**rollup**/**babel** in your project? Then probably this one is for you!

    Just **install** the `vue-custom-context-menu` npm package:
    ```shell
    $ npm install vue-custom-context-menu --save
    ```

    Then in your main file **import** the plugin:
    ```javascript
    import VCCM from "vue-custom-context-menu"
    ```
    or
    ```javascript
    require("vue-custom-context-menu")
    ```
    *The both options would work out precisely the same end result. Decide what to choose depending on what build system you use*

    And the last thing is to make Vue **use** the plugin. In order to achieve that add `Vue.use(VCCM)` before the definition of your app's main instance. Your end main file should look something like the follows:

    ```javascript
    // import the Vue itself
    import Vue from 'vue'
    // import the main component
    import App from './App.vue'
    // import the king of the party
    import VCCM from 'vue-custom-context-menu'

    // install the plugin
    Vue.use(VCCM);

    // and then define the main instance
    new Vue({
      render: h => h(App),
    }).$mount('#app')
    ```
    **Note** that in order to get the Vue Custom Context Menu working the Vue must be of version `^2.5.0` (temporarily though, the exact minimum-required version will be figured out soon)

1. The second approach is suitable when you don't use any build system and want to simply link the plugin to a page in the form of a seperate **script**. Here you go then

    ```html
    <!-- Don't forget to include Vue! -->
    <script src="unpkg.com/vue"></script>
    <!-- And the plugin itself... -->
    <script src="unpkg.com/vue-custom-context-menu"></script>
    ```
    **[ Note that _unpkg.com_ currently experiences some troubles so the link above may point to a wrong file ]**

    **Note** that using this approach you *don't have to manually install the plugin* via `Vue.use()`. As always everything's already set up for you

Cool, now that yor've installed the plugin you're finally ready to build your Custom Context Menus 🎉! Consider the next section to find out how

## Usage

There're 3 components added to your app by the plugin:
* `<vccm-overlay>`
* `<context-menu>`
* `<cm-item>`

It's not hard to guess which purpose each one of them serves. The first one, `<vccm-overlay>`, provides... Well, it basically provides an overlay for all the Context Menus defined for your app. So let's start with it.

### Defining Overlay

First of all you must insert it somewhere. There's a **restriction** though: the overlay component (i.e. `<vccm-overlay>`) must be inserted either directly inside the app's main component or inside some specifically created component located directly inside the app's main one. So the both following examples are OK

```html
<div id="main">
    <!-- ... -->

    <vccm-overlay>
        <!-- Here all the Context Menus are gonna be defined -->
    </vccm-overlay>
</div>
```
In this first one `<vccm-overlay>` is inserted as a direct child of the app's main component (the one with id `main` in this case)

```html
<div id="main">
    <!-- ... -->

    <some-other-component-for-all-the-context-menus ref="vccm-context-menus"></some-other-component-for-all-the-context-menus>
</div>
```

```html
<!-- SomeOtherComponentForAllTheContextMenus.vue -->

<template>
    <vccm-overlay>
        <!-- Here all the Context Menus are gonna be defined -->
    </vccm-overlay>
</template>
```
This 2nd example represents the second case described above: some component (with an  arbitrary name) is inserted directly into the main component and the `<vccm-overlay>` component is inserted as its root.

**Note** the `ref="vccm-context-menus"` parameter provided to the wrapper-component. It's absolutely necessary in order to let the Vue Custom Context Menu know where to search for your Custom Menus.

The both options above are essentially the same. Decide which one to choose based on your preferences. The 2nd one however is probably to be chose **more frequently** because it allows you to keep you main component clean by carrying all the Context Menus out into a separate file.

#### Overlay props

There're currently 2 parameters available to be passed to the overlay instance:
* `transition` - *`""` (empty string) by default* - used to provide the name of a  transition to be applied to a Context Menu
* `penetrable` - *`false` by default* - a boolean, specifying whether the overlay is penetrable or not

##### `transition`
**Expects**: *a __string__*  
**Defaults to**: *`""` (an empty string)*

```html
<vccm-overlay transition="fade-out">
    <!-- Here go the Context Menus -->
</vccm-overlay>
```

Using the code from the example above allows you to achive the same behavior as when using

```html
<transition name="fade-out">
    <vccm-overlay>
        <!-- Here go the Context Menus -->
    </vccm-overlay>
</transition>
```

**Note** however that you *must not* apply transitions manually as in the example above because it would break everything and flood your console with multiple errors.

*Find out how to use Vue transitions [here](https://vuejs.org/v2/guide/transitions.html).*

##### `penetrable`

The `penetrable` option allows you take control over what would happen if you right-click the overlay. There're 2 possible outcomes:
* The overlay would just become closed and nothing else would happen
* The overlay would become closed and another Context Menu (thus the overlay as well) would immediately become opened for the element that was under the cursor when the right-click happened (like if there were no overlay at all).

It's not hard to guess that the first outcome is expected when the `penetrable` option is set to `false` and the second one - when it's set to `true`.

```html
<vccm-overlay :penetrable="true">
    <!-- Here go the Context Menus -->
</vccm-overlay>
```

### Defining Context Menus

The 2nd component provided by the plugin, `<context-menu>`, is used to define Context Menus themselfs. Each `<context-menu>` must be a child of the sole `<vccm-overlay>`

```html
<vccm-overlay>
    <context-menu id="cm-alfa">
        <!-- Here go the items -->
    </context-menu>

    <context-menu id="cm-lambda">
        <!-- Here go the items -->
    </context-menu>

    <context-menu id="cm-omega">
        <!-- Here go the items -->
    </context-menu>
</vccm-overlay>
```

At first glance it may seem quite wierd that there's the **sole overlay** for all the Context Menus. But actually it's more than OK since in such case the overlay not only acts as an overlay for a Context Menu but it also plays the role of kind of a grouping element for all the Context Menus out there. It may also seem that using such an approach it would be impossible to have a custom-styled overlay for a specific Context Menu. But hey! Don't forget about the Vue's capabilities 😉.

**Note** that if you accidentally do something like the following

```html
<vccm-overlay>
    <context-menu id="cm-alfa">
        <!-- Here go the items -->
    </context-menu>
</vccm-overlay>

<vccm-overlay>
    <context-menu id="cm-lambda">
        <!-- Here go the items -->
    </context-menu>
</vccm-overlay>

<vccm-overlay>
    <context-menu id="cm-omega">
        <!-- Here go the items -->
    </context-menu>
</vccm-overlay>
```

then neither the `cm-lambda` nor the `cm-omega` would be reachable.

**Note** the `cm-` part of IDs. It's not necessary, though it's still a good practice to avoid global namespace pollution. In reality an ID might look whatever you like it to.

#### Context Menu props

There're currently 2 parameters available to be passed to a Context Menu instance:
* `transition` - *`""` (empty string) by default* - used to provide the name of a  transition to be applied to a Context Menu
* `options` - *`{transfer: "x", delay: 250}` by default* - an object with options for a specific Context Menu
delay is only respected

##### `transition`
**Expects**: *a __string__*  
**Defaults to**: *`""` (an empty string)*

```html
<context-menu transition="fade-out">
    <!-- Here go the Context Menus -->
</context-menu>
```

Using the code from the example above allows you to achive the same behavior as when using

```html
<transition name="fade-out">
    <context-menu>
        <!-- Here go the Context Menus -->
    </context-menu>
</transition>
```

**Note** however that you *must not* apply transitions manually as in the example above because it would break everything and flood your console with multiple errors.

*Find out how to use Vue transitions [here](https://vuejs.org/v2/guide/transitions.html).*

### Defining Items

The 3d component, `<cm-item>`, is to be used to describe the items of your Context Menus (what a surprise, huh?). Each `<cm-item>` must be a child of the `<context-menu>` that it is item of

```html
<context-menu id="cm-alfa">
    <cm-item :action="actionForItemNo1">Item #1</cm-item>
    <cm-item :action="actionForItemNo2">Item #2</cm-item>
    <cm-item :action="actionForItemNo3">Item #3</cm-item>
    <cm-item :action="actionForItemNo4">Item #4</cm-item>
    <cm-item :action="actionForItemNo5">Item #5</cm-item>
    <cm-item :action="actionForItemNo6">Item #6</cm-item>
    <cm-item :action="actionForItemNo7">Item #7</cm-item>
</context-menu>
```

Everything's straightforward here. The `action` parameter specifies what action to perform when an item is selected. The item's `<slot>` (the space between opening and closing tags) states what it would be visible for user when he/she would open the `#cm-alfa` Context Menu.

In the mean time an item is trated as "selected" only when it's clicked, though it's planned to add the keyboard support to be able to navigate through Context Menus via `[key down]`, `[key up]` and trigger actions via `[enter]` (for example).

**Note** that the `action` is optional. Nothing bad would happen when such an item without the `action` is selected - all the Context Menus will just be closed.

### Opening a Context Menu

Great, you've built dozens of Context Menus for your app. Now you open your project in a browser and what do you see? Nothing. And that's quite expected since Context Menus are meant to become visible only on demand. More specific, when a user right-clicks somewhere. So how do you describe which element should open which Context Menu when it's right-clicked?

Well, just provide the `v-context-menu="'#cm-ID'"` directive to the needed element!

```html
<div id="app">
    <div id="app-wrapper" v-context-menu="'#cm-app-wide'">
        <!-- Imagine that you've defined all the Context Menus for your app inside the <context-menus> component -->
        <context-menus ref="vccm-context-menus"></context-menus>

        <h1 v-context-menu="'#cm-for-heading'">The Heading</h1>

        <p
            v-for="paragraph in article.paragraphs"
            :key="paragraph.id"

            v-context-menu="'#cm-for-paragraph'"

            >{{ paragraph.contents }}
        </p>
    </div>
</div>
```

Now all the article paragraphs, when right-clicked, would open the `#cm-for-paragrahs` Context Menu. If instead the user right-clicked the `<h1>` element then the `#cm-for-heading` would be opened. If he/she missed and clicked anywhere alse on the page then the fallback Context Menu `#cm-app-wide` would become the one to be opened!

**Note** that in the example above the `<vccm-overlay>` is declared inside the `<context-menus>` component which in its turn is used *not directly* inside the main component's root element (`div#app` in this case) but inside another element `<div id="app-wrapper">` which doesn't correlate with what've been said before (in the "Defining Overlay" section). It's actually perfectly fine to do so due to the fact that the `#app-wrapper` is *not* a component itself. In that section it was meant that the component defining the `<vccm-overlay>` must be direct child of the main *component instance* rather than the main *element*.

**Note** also the double-quotes in the example above. These are quite crucial beacause the Vue Custom Context Menu uses the good-old `querySelector` API in order to find a requested Context Menu. And, as you probably know, the `querySelector` method accepts **string** as the first argument, so we must provide it a string via another pair of qoutes. If you would accidentally forget to add them then the most probable outcome would be that the Vue would complain that it can't find data property or method called `#cm-ID`. It also means that you can refer to you Context Menus not only by their IDs but rather by any unique property they obtain. For example `v-context-menu="'[data-my-cm]'"` is perfectly fine till the "my-cm" dataset property is not used with more than one Context Menu. In the opposite case the first matched Context Menu would be opened.

#### `v-context-menu` directive's modifiers

You can add modifiers to the `v-context-menu` directive just the way you do so with any other directive. There're now only 2 modifiers exist:
* `disabled` - *`false` by defaul* - allows you to disable Context Menu for a specific element at all
* `no-native` - *`false` by default* - if set to `true` then even if the `[alt]` key was holded when the user right-clicked the element then the custom Context Menu would appear anyway istead of the browser's native one

The next example shows you how to disable a Context Menu for the `div#target` element
```html
<div id="target" v-context-menu.disabled>Hey, I've got no Context Menu!</div>
```

In the following example if the user would hold the `[alt]` key during the right-click on the `button#confirm` element the `#cm-for-button` Context Menu will appear anyway instead of the browser's native one
```html
<button id="confirm" v-context-menu.no-native="'#cm-for-button'">Confirm request</button>
```

You can even chain them! In such case even the browser's native Context Menu would be disabled (which is not the case when a sole `disabled` modifier is applied to an element)
```html
<my-component v-context-menu.disabled.no-native>No Context Menus here. At all.</my-component>
<!-- or -->
<my-component v-context-menu.no-native.disabled>The order doesn't matter</my-component>
```

#### Nested Context Menus

All you have to do in order to be able to open one Context Menu when pointing the cursor of your mouse to an item of some another Context Menu (or clicking an item) is to add that item the same `v-context-menu="'#cm-ID'"` directive as you do with any other element

```html
<vccm-overlay>
    <context-menu id="cm-alfa">
        <cm-item v-context-menu="'#cm-lambda'">Open Lambda</cm-item>
        <cm-item v-context-menu="'#cm-omega'">Open Omega</cm-item>
        <cm-item>Item #3</cm-item>
        <cm-item>Item #4</cm-item>
        <cm-item>...</cm-item>
    </context-menu>

    <context-menu id="cm-lambda">
        <cm-item :action="defaultAction">Just a Regular Item</cm-item>
        <cm-item v-context-menu="'#cm-omega'">Open Omega From Here</cm-item>
        <cm-item>Item #3</cm-item>
        <cm-item>Item #4</cm-item>
        <cm-item>...</cm-item>
    </context-menu>

    <context-menu id="cm-omega">
        <cm-item :action="defaultAction">Just a Regular Item</cm-item>
    </context-menu>
</vccm-overlay>
```

**Note** that when a `<cm-item>` is provided with the `v-context-menu` directive then its `action` is ignored. And that's quite logical since if the directive is provided then it's clear that the main purpose of the item is to open some Context Menu. So it don't have to respond to anything else.

**Note** that items of child Context Menu must not be used to open this Context Menu's parental Context Menu. The next example shows this case

```html
<!-- Don't do so. Bad example -->
<context-menu id="cm-alfa">
    <cm-item v-context-menu="'#cm-lambda'">Open Lambda</cm-item>
</context-menu>

<context-menu id="cm-lambda">
    <cm-item v-context-menu="'#cm-alfa'">Open Omega From Here</cm-item>
</context-menu>
```

**Though the code is perfectly fine by itself and even throws no errors or warnings the behavior is still unpredictible at its most. Just try to avoid doing so.**

## Contribution

Currently in progress... Check out later!

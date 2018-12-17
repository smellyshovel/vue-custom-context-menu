# Vue Custom Context Menu

Check out the [Demo (TODO)](#)!

What makes it special 🌟:

* No more ugly ` @contextmenu.prevent="$refs['context-menu'].open"`s in your code 🎉
* Allows for full 🛠 **customisation**:
    * **Style** 💇‍♂️ everything from the overlay to arrows pointing out that an item opens a nested Context Menu the way you want it to look
    * **Configure** ⚙ everything from the penetrative properties of the overlay to what to do with Context Menus that doesn't fit well on the screen
* Wait a minute. "Nested Context Menus" 😍? You've read it all right! One Context Menu may has as many 🗂 **nested** Context Menus as you desire it to! As well as a nested Context Menu may itself has **unlimited** number of nested Context Menus!
* A Context Menu turned out to be as overpopulated with items that it probably wouldn't fit the **height of the screen** 😬? Not a problem! Everything's already set up for you with reasonable defaults
* Don't want a Context Menu for a specific element at all 🙅? The plugin allows you to easily **disable** it!
* Want to give your users the ability to see a standard **native** context menu instead of a custom one in some cases? You're good to go 👍. Just tell them to hold the `alt` key. Don't want 🤔? Just configure it so!

And even a few more:
* 📱 Works well either on **desktops** and on **mobile** devices
* Everything is made for your (and your users') convenience: no more manual events registration, no more struggling with edge-cases - you can **just use it** 🛎

Sounds as a charm for you? Then dig further!

## Installation

Sure thing in order to experience all the above stated benefits yourself you first have to install the plugin. There're 2 possible ways to do so:

1. The first one is for use in full-fledged web applications

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

1. The second approach is suitable when you don't use any build system and want to simply link the plugin to a page in the form of a seperate script. Here you go then
    ```html
    <!-- Don't forget to include Vue! -->
    <script src="unpkg.com/vue"></script>
    <!-- And the plugin itself... -->
    <script src="unpkg.com/vue-custom-context-menu"></script>
    ```
    **Note** that using this approach you *don't have to manually install the plugin* via `Vue.use()`. As always everything's already set up for you

Cool, now yor're ready to build your Custom Context Menus! Consider the next section to find out how

## Usage

Currently in progress... Check out later!

## Contribution

Currently in progress... Check out later!

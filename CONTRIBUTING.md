Feel free to open a new issue of create a pull request. All the bugs are tracked using issues. All the future plans are there as well but may also by found among Projects.

The Vue Custom Context Menu is not a standalone project that can be tested during development without any preparations. Instead, in order to be able to test it you must have
some sort of a testing stand. It can actually be any application you like, but if you don't have any consider the [Vue CLI](https://cli.vuejs.org/).
It allows you to easily create a take-off page you can link the plugin to in order to test it whilst making changes.

The best way is the following:

1. Fork the repo
1. Clone it
1. Navigate to the clone
1. Install dependencies via `$ npm i`
1. Link the plugin to make it available as a local npm-package via `$ npm link`
1. Enable watcher so changes can be seen instantly without recompiling via `$ npm run watch:esm` (to auto-recompile only the ESM verstion of the plugin) or `$ npm run watch:umd` (to test
in browser or in an application that uses some old build-system (such as webpack\@1))
1. Navigate to you test-stand
1. Add the plugin via `$ npm link vue-custom-context-menu` and include it to your project
1. Make changes
1. After you're done build all the package's versions via `$ npm run build`
1. Commit changes and create a pull request to the devel branch

And you're done!

# There's still helluva lot work to do

First of all it would be great if someone can help me with automated tests. The problem here is that there's no good enough tools currently available for e2e-testing. For example, Cypress is great, but it can't work with native context menus and what's even more important - it's not capable of right-clicking. Nightwatch on the other hand can perform right-clicks but its documentation/API is just awful.

The second thing is automation in general. Git-hooks, cloud-testing, cloud-building, continuous integration and all that stuff.

And the last thing is that the plugin obtains some minor imperfections that should ideally be eliminated. See the "Other" section in the README.md and issues to find such things.

## How to contribute

First of all, thank you. I really do appreciate it!

Nowadays the workflow would be something like the follows

1. Fork the repo and clone it
1. `$ npm i` or `$ yarn install`
1. `$ npm run dev` or `$ yarn dev`
1. Make changes...
1. <s>`$ npm run test`</s> (will only become true when we're done with automated testing issues we're currently experiencing)
1. `$ npm run build` or `$ yarn build`
1. Commit, push and start a pull request

No need to update the NPM-package version, I'll do it myself (since the process isn't automated yet).

Don't be shy to submit a new issue if you have **any** questions!

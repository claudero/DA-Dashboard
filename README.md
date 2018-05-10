# da-dashboard-webApp

## Installation

1. `yarn install`
2. Add file dev.config.json in src. You can override any properties from config.js in this.
3. `yarn start`

## Development Workflow

`yarn start` - Starts the local server that hosts the app at http://localhost:3000 and watches for file changes

`yarn storybook` - Starts a local server at http://localhost:9009 that hosts a ["Storybook"](https://github.com/storybooks/storybook) and listens to file changes

`yarn test` - Runs the tests

`yarn flow status` - Verifies [Flow](https://flow.org/en/docs/frameworks/react/)

### SASS only commands

`yarn build-css` - Compiles all SCSS files and creates CSS files next to them

`yarn watch-css` - Runs build-css each time a change happens on a SCSS file

## Building & Deploying the app

`yarn eslint` - Checks for linting errors in the app

`yarn build` - Builds the app for production to the ./build folder.

`yarn deploy-aws` - Syncs to AWS

`yarn deploy-aws-staging` - Syncs to AWS in the staging bucket

For staging or prod deploys, don't forget to change the config to the staging stage or the prod stage and environment and to build before deploying.

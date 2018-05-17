# da-dashboard-webApp

## Installation

1. `yarn install`
2. Add file dev.config.json in src. You can override any properties from config.js in this.
3. `yarn start-dev`

## Development Workflow

`yarn start-dev` - Starts the local react server that hosts the app at http://localhost:3000 and watches for file changes
In parallel, a proxy is booted on port 3001 which serves all of Design Automation and Forge APIs

`yarn start` - Starts the main server on port 3000 and serves the build folder. This will host the most recent version of the react app that has been built and published int the repo.
This is used in the context of a deployment to something like Heroku.

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

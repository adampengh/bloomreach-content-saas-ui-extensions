# Contributing to the project

## Quick Links

| Link                            | URL                                                                 |
| ------------------------------- | ------------------------------------------------------------------- |
| GitHub Repo                     | https://github.com/bloomreach-content-marketplace/ContentSync.git  |
| Production Application          | https://content-tools-devapp.bloomreach.works/                |
| Test Application                | https://test-bloomreach-content-ui-extension.netlify.app/           |


## Installation
Clone the project from GitHub repository:
### `git clone https://github.com/bloomreach-content-marketplace/ContentSync.git`

Change into the cloned project directory:
### `cd ContentSync`

Install the dependencies:
### `yarn`

---

## Available scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br>
Open <http://localhost:3000> to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

---

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

---

### `yarn start`

Runs the built production-ready app from the `build` folder. You need to run `yarn build` before running `yarn start`

---

## Developer Workflow

1. Pull the latest changes from the `develop` branch
1. Create a new branch based off the `develop` branch
1. Make any necessary code changes
1. Run `yarn build` to ensure the project builds properly
1. Update the `CHANGELOG.md` file with the latest changes
1. Update the version number in the package.json file using correct semantic versioning
1. Create a Pull Request for the `develop` branch

---

## Deploying the application

The application is hosted at [Netlify](https://www.netlify.com/). The application will be automatically deployed when code is merged into either the `main` or `develop` branches.

| Branch   | Deploys to                                                          |
| -------- | ------------------------------------------------------------------- |
| main     | https://content-tools-devapp.bloomreach.works/                      |
| develop  | https://test-bloomreach-content-ui-extension.netlify.app/           |

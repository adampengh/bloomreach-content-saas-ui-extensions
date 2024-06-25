# Bloomreach Content SaaS UI Extension

This application was built to facilitate development tasks for Bloomreach Content SaaS. Specifically, this application aids in copying configuration and content between the Test and Production CMS environments.

- [Contributing](/CONTRIBUTING.md)
- [Release Notes](/CHANGELOG.md)

## Quick Links

| Link                            | URL                                                                 |
| ------------------------------- | ------------------------------------------------------------------- |
| GitHub Repo                     | https://github.com/adampengh/bloomreach-content-saas-ui-extensions  |
| Production Application          | https://bloomreach-content-ui-extension.netlify.app/                |
| Test Application                | https://test-bloomreach-content-ui-extension.netlify.app/           |


## Installation
Clone the project from GitHub repository:
### `git clone https://github.com/adampengh/bloomreach-content-saas-ui-extensions`

Change into the cloned project directory:
### `cd bloomreach-content-saas-ui-extensions`

Install the dependencies:
### `yarn`



## Project Structure
The project follows a general structure of Page > Module(s) > Component(s)

```
- public
  - static
    - images
- src
  - app
  - components
  - contexts
  - icons
  - lib
  - mocks
  - modules
  - theme

```

| Folder | Purpose/Use |
| --- | --- |
| app | App Router folder for all pages/routes; folders with parentheses are route  |
| components | Re-Usable Components generally used in Modules |
| contexts | Global context for Applicaton Configuration, Loading State, Error Handling |
| icons | All Material Icons used in the project
| lib | Library of re-usable functions
| mocks | Mock data for testing
| modules | Modules used in Pages
| theme | Theme styling
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

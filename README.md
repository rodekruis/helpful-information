# Helpful Information

> A (web-)app _People Affected_ can use to lookup useful organizations.

---

## Status

Latest releases and notable changes are in the [CHANGELOG](CHANGELOG.md).

- [![Tests](https://github.com/rodekruis/helpful-information/actions/workflows/tests.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/tests.yml)
- NL:
  - [![staging: Deploy Azure Static Web App](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging.yml)
  - [![production: Deploy Azure Static Web App](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production.yml)
- UKR:
  - [![staging UKR: Deploy Azure Static Web App](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging-ukr.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging-ukr.yml)
  - [![production UKR: Deploy Azure Static Web App](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production-ukr.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production-ukr.yml)

---

## Getting Started

- Install environment requirements:

  Install the Node.js version specified in the [`.node-version`](.node-version)-file.  
  To prevent conflicts it is recommended to use a 'version manager'.

  - [`fnm`](https://github.com/Schniz/fnm#readme) (for Windows/macOS/Linux)
    After installing, run in this directory:

        fnm use

- Install dependencies (from this folder):

      npm install

- To finish you local set-up, run (required only once):

      npm run setup

- Start in development-mode:

      npm start

- Start in production-mode:

      npm run start:production

## Configuration

Some specific information needs to be configured before use:

- For use in development:  
  Set these different properties in the [`environment.ts`](./src/environments/environment.ts)-file.

- For use in production:  
  These values need to be set in the [`.env`](.env.example)-file.

- For deployments:  
  The ENV-variables defined in the [`.env.example`](.env.example)-file need to be defined in the build-environment according to the specific deployment-tool/service.  
  See for example the [GitHub Action workflow (production)](.github/workflows/deploy-production.yml).

### Using the Google Sheets API

The contents of the web-app is loaded at runtime by the visitor's browser from the [Google Sheets API](https://developers.google.com/sheets/api).

- To be able to use that a 'credential' in the shape of an API-key is required.
- To get an API-key, follow the instructions:  
  <https://developers.google.com/workspace/guides/create-credentials#api-key>
- Configure the restrictions on the API-key following:  
  <https://cloud.google.com/docs/authentication/api-keys#adding_http_restrictions>  
  Make sure to include _only_ the domains/referrers that will be used.  
  Also include `http://localhost:4200/*` and `http://localhost:8080/*` to be able to load data during local development. (Or even better; create a separate API-key for that)

## Local development

As part of the installed dev-dependencies, we use [Prettier](https://prettier.io/) to format our code and [husky](https://typicode.github.io/husky/#/?id=faq) to automate that when using Git.

### Testing

Automated tests are configured and can be run (once) with:

    npm test

During development, an automated watch-process can be run with:

    npm run test:watch

### Recommended tools

- [Workspace recommendations for VS Code](.vscode/extensions.json)
  When you use [VS Code](https://code.visualstudio.com/) and go to: "_Extensions_" and use the filter: "_Recommended_";
  A list should be shown and each extension can be installed individually.

### Libraries/frameworks in use

- [Ionic v4](https://ionicframework.com/docs/v4/)
- [Angular v8](https://v8.angular.io/docs/)

---

## Deployment

The web-app can be deployed as a static single-page-app or PWA.

- Make sure the `.env`-configuration is prepared. See: [`.env.example`](.env.example)
- To generate a folder(`www`) with all HTML, JS, JSON and SVG assets, run:

      npm run build:production

- This folder can be deployed to any hosting-solution (supporting HTTPS), using [the recommended server configuration](https://v8.angular.io/guide/deployment#server-configuration).

### Using Azure Static Web Apps

To deploy the web-app using [Azure Static Web App service](https://azure.microsoft.com/en-us/services/app-service/static/):

- A GitHub-Actions workflow needs to be defined,  
  See: [`.github/workflows/deploy-production.yml`](.github/workflows/deploy-production.yml)
- The configuration of URLs, Headers for the web-app is defined,  
  in: [`staticwebapp.config.json`](staticwebapp.config.json)  
  See documentation about the format in [this example configuration file](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration#example-configuration-file)

### Using static file hosting (i.e. Surge.sh or similar)

To deploy the web-app using [Surge.sh](https://surge.sh/) or a similar static-files web-host:

Configure and build a 'production'-build of the web-app following the steps [defined at "Deployment"](#deployment).

Follow one of these ['guides' from Surge](https://surge.sh/help/#:~:text=Guides)

---

## License

Released under the Apache 2.0 License. See [LICENSE](./LICENSE).

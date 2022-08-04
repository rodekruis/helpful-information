# Helpful Information

> A web-app _People Affected_ can use to lookup useful organizations and information.

---

## Status

Latest releases and notable changes are in the [CHANGELOG](CHANGELOG.md).

- [![Tests](https://github.com/rodekruis/helpful-information/actions/workflows/tests.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/tests.yml)
- NL:
  [![staging](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging.yml)
  [![production](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production.yml)
- UKR:
  [![staging UKR](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging-ukr.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-staging-ukr.yml)
  [![production UKR](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production-ukr.yml/badge.svg)](https://github.com/rodekruis/helpful-information/actions/workflows/deploy-production-ukr.yml)

---

## How it works

The Helpful Information App (HIA) is a web-app that can show a list of 1 or more "_regions_", each of which is a separate dataset of structured content. This consists of "_Offers_", sorted in "_Categories_" and (optional) "_Sub-Categories_".

The web-app is a pre-build, static web-app that lists links to "regions", which are all separate data-sources contained in Google Sheets 'files'.

The different sheets within these 'files' each have a different data-model. So that their content can be used to display in the web-app.

The contents of these is loaded at runtime by the visitor's browser from the "Google Sheets API".

## How to use

Once the web-app is configured (See [Configuration](#configuration)) and deployed (See [Deployment](#deployment)) its content can be managed via the [Google Sheets interface](https://docs.google.com/spreadsheets).

### Security

> ⚠️ **All content** of the web-app can be controlled by the contents of the Google Sheet in use.

So take appropriate precautions regarding file-ownership and "edit"-permissions of these files and the related Google Accounts.

- Limit the amount of users/Google Accounts that have "edit"-permissions to the 'least possible'
- Don't share the credentials/passwords of these accounts with multiple people
- Use a strong password on these Google Accounts
- Use all possible extra security-features on these Google Accounts, like 2-factor-authentication etc.

### Working with Google Sheets 'files'

> ⚠️ **Everything** is visible on the website on **every** 'save' (so, immediately, most of the times).

- Don't change the _name_ of any sheet
- Don't change the _name_ or _order_ of columns in any sheet
- Don't use formatting (bold/italic/underline/fonts/colors); It will not be used.
- Don't use the "insert link"-feature.  
  The plain text in a cell should be the full URL.

Optional:

- You can use the toggle in the "_Visible?_"-column to prepare a 'draft' of a row and finally 'publish' by setting it to "_Show_".
- You can use background-colors to mark/highlight any changes or 'flag issues'; These styles will not be used in the web-app

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
  These values need to be set in the [`.env`](.env.example)-file. Or as ENV-variables via other means.

- For deployments:  
  The ENV-variables defined in the [`.env.example`](.env.example)-file need to be defined in the build-environment according to the specific deployment-tool/service.  
  See for example the [GitHub Action workflow (production)](.github/workflows/deploy-production.yml).

### Using the Google Sheets API

- To be able to use the [Google Sheets API](https://developers.google.com/sheets/api) a 'credential' in the shape of an API-key is required.
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

- [Ionic v6](https://ionicframework.com/docs/v6/)
  > ⚠️ The [`Ionicons`](https://ionic.io/ionicons) icon-set is NOT included in the final build, so cannot be used 'by default'. Icons can be added manually.
- [Angular v14](https://v14.angular.io/docs/)

---

## Deployment

The web-app can be deployed as a static single-page-app or PWA.

- Make sure the `.env`-configuration is prepared. See: [`.env.example`](.env.example)
- To generate a folder(`www`) with all HTML, JS, JSON and SVG assets, run:

      npm run build:production

- This folder can be deployed to any hosting-solution (supporting HTTPS), using [the recommended server configuration](https://v13.angular.io/guide/deployment#server-configuration).

### Using Azure Static Web Apps

To deploy the web-app using [Azure Static Web App service](https://azure.microsoft.com/en-us/services/app-service/static/):

- A GitHub-Actions workflow needs to be defined,  
  See: [`.github/workflows/deploy-production.yml`](.github/workflows/deploy-production.yml)
- The configuration of URLs, Headers for the web-app is defined,  
  in: [`staticwebapp.config.json`](staticwebapp.config.json)  
  See documentation about the format in [this example configuration file](https://docs.microsoft.com/en-us/azure/static-web-apps/configuration#example-configuration-file)

### Using static file hosting (i.e. Surge.sh, GitHub/GitLab Pages or similar)

To deploy the web-app using or a static-files web-host, see options at: <https://www.jamstackdeploy.com/>

Configure and build a 'production'-build of the web-app following the steps [defined at "Deployment"](#deployment).

Follow one of these ['guides' from Surge](https://surge.sh/help/#:~:text=Guides)

---

## License

Released under the Apache 2.0 License. See [LICENSE](./LICENSE).

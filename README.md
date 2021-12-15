# Helpful Information

> A (web-)app _People Affected_ can use to lookup useful organizations.

---

## Status

Latest releases and notable changes are in the [CHANGELOG](CHANGELOG.md).

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

- Start in development-mode:

      npm start

- Test in production-mode:

      npm run start:production

## Configuration

Some specific information needs to be configured before use:

- For development-mode:  
  Set these different properties in the [`environment.ts`](./src/environments/environment.ts)-file.

- For production-mode:  
  These values need to be set in a [`.env`](.env.example)-file.  
  To start, run:

      cp .env.example .env

  And edit the `.env`-file locally.

- For deployments:  
  The ENV-variables defined in the [`.env.example`](.env.example)-file need to be defined in the build-environment according to the specific deployment-tool/service.  
  See for example the [GitHub Action workflow](.github/workflows/workflow.yml).

## Local development

As part of the installed dev-dependencies, we use [Prettier](https://prettier.io/) to format our code and [husky](https://typicode.github.io/husky/#/?id=faq) to automate that when using Git.

### Recommended tools

- [Workspace recommendations for VS Code](.vscode/extensions.json)
  When you use [VS Code](https://code.visualstudio.com/) and go to: "_Extensions_" and use the filter: "_Recommended_";
  A list should be shown and each extension can be installed individually.

### Libraries/frameworks in use

- [Ionic v4](https://ionicframework.com/docs/v4/)
- [Angular v7](https://v7.angular.io/docs/)
- [`ngx-translate`](https://github.com/ngx-translate/core#readme)

## License

Released under the Apache 2.0 License. See [LICENSE](./LICENSE).

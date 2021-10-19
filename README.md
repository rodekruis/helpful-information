# Helpful Information

The front-end of the application _People Affected_ use to lookup useful organizations.

## Getting Started

- Install environment requirements:

  - Node.js LTS v14

- Install dependencies (from this folder):

      npm install

- Start in development-mode:

      npm start

- Test in production-mode:

      npm run start:production

## Configuration

Some specific information need to be configured before development-use:

- Set the API-endpoint(s) in the [`environment.ts`](./src/environments/environment.ts)-file.

For production-mode, these values need to be set in a [`.env`](.env.example)-file. To start, run:

    cp .env.example .env

And edit the `.env`-file locally.

---

## License

Released under the Apache 2.0 License. See [LICENSE](./LICENSE).

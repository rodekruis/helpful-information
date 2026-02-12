# Helpful Information - Development Instructions

This is an Angular 19 + Ionic 8 web application that displays structured helpful information content fetched from Google Sheets via API. The app supports multiple regions/languages and provides categories, offers, and Q&A content to end users.

**Always reference these instructions first** and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup and Dependencies

Install the exact Node.js version and dependencies:

- Check required Node.js version: `cat .node-version` (currently v22)
- Install Node.js v22 using a version manager like fnm: `fnm use`
- Install all dependencies: `npm install` -- **takes ~60 seconds**. NEVER CANCEL.
- Complete local setup: `npm run setup` -- **takes <5 seconds**. Creates .env file and sets up Husky.

### Building and Development

Essential build commands with validated timing:

**Development build:**

- `npm run build` -- **takes ~16 seconds**. NEVER CANCEL. Set timeout to 30+ seconds.

**Production build:**

- `npm run build:production` -- **takes ~16 seconds**. NEVER CANCEL. Set timeout to 30+ seconds.
- Generates static files in `www/` directory ready for deployment

**Development server:**

- `npm start` -- **takes ~13 seconds to build**, then runs on http://localhost:4200
- Supports hot module replacement and live reloading
- NEVER CANCEL the build phase. Set timeout to 30+ seconds for initial build.

**Production server:**

- `npm run start:production` -- builds production and serves on http://localhost:8080

### Testing and Quality Assurance

**Run tests:**

- `npm test` -- **takes ~50 seconds**. NEVER CANCEL. Set timeout to 90+ seconds.
- Includes linting (syntax, typecheck, code) + Karma/Jasmine unit tests
- Must pass before CI build will succeed

**Linting only:**

- `npm run lint` -- **takes ~16 seconds**. Runs syntax, typecheck, and code linting.
- ALWAYS run before committing changes or CI will fail
- Auto-fix most issues: `npm run fix`

### Local Development Options

**Option 1: Local JSON API (Recommended for development)**

1. Start local data server: `npm run serve:local-data` -- serves on http://localhost:3001
2. The default environment.ts is already configured for local development
3. Modify JSON files in `data/` directory to test different content
4. Start dev server: `npm start`

**Option 2: Google Sheets API**

1. Update `src/environments/environment.ts` with:
   - Set `google_sheets_api_key` to your API key
   - Set `google_sheets_api_url` to 'https://sheets.googleapis.com/v4/spreadsheets'
   - Configure your actual Google Sheet IDs in `regionsSheetIds`
2. Start dev server: `npm start`

## Validation Requirements

**ALWAYS validate application functionality after making changes:**

1. **Start both servers for local development:**

   ```bash
   # Terminal 1
   npm run serve:local-data

   # Terminal 2
   npm start
   ```

2. **Test complete user scenarios:**
   - Navigate to http://localhost:4200
   - Verify main page loads with region selection buttons
   - Click on "Test Local 1" region to verify navigation works
   - Verify category pages load with proper content
   - Test search functionality if enabled
   - Verify responsive design on mobile viewport

3. **Test builds work correctly:**
   - `npm run build:production`
   - `npm run serve:production`
   - Test production build on http://localhost:8080

4. **ALWAYS run linting and tests before finishing:**
   - `npm run lint` -- must pass or CI fails
   - `npm test` -- must pass or CI fails

## Critical Timing and "NEVER CANCEL" Warnings

**⚠️ CRITICAL: NEVER CANCEL these commands even if they appear to hang:**

- `npm install` -- **NEVER CANCEL**. Takes ~60 seconds. Set timeout to 120+ seconds.
- `npm run build` -- **NEVER CANCEL**. Takes ~16 seconds. Set timeout to 30+ seconds.
- `npm run build:production` -- **NEVER CANCEL**. Takes ~16 seconds. Set timeout to 30+ seconds.
- `npm test` -- **NEVER CANCEL**. Takes ~50 seconds. Set timeout to 90+ seconds.
- `npm start` initial build -- **NEVER CANCEL**. Takes ~13 seconds. Set timeout to 30+ seconds.

## Key Architecture and Locations

**Project Structure:**

- `src/app/` -- Angular application code
- `src/environments/` -- Environment configuration files
- `data/` -- Local JSON test data files
- `www/` -- Built application output (generated)
- `.github/workflows/` -- CI/CD pipelines
- `scripts/` -- Build helper scripts

**Important Files:**

- `package.json` -- All npm scripts and dependencies
- `.env` -- Production environment variables (created by setup)
- `src/environments/environment.ts` -- Development configuration
- `src/environments/environment.prod.ts` -- Generated production config
- `angular.json` -- Angular build configuration

**Data Flow:**

- App loads regions from environment config
- Each region corresponds to a Google Sheet or local JSON files
- Content is structured as: Categories → Sub-Categories → Offers/Q&As
- Local API serves files from `data/test-sheet-id-*/values/*.json`

## Common Development Tasks

**Adding new features:**

1. Make code changes in `src/app/`
2. Test with local development: `npm start`
3. Run linting: `npm run lint`
4. Run tests: `npm test`
5. Test production build: `npm run build:production`

**Modifying content structure:**

1. Update TypeScript models in `src/app/models/`
2. Update local test data in `data/` directory
3. Test with both local API and development server

**Environment configuration:**

- Development: Edit `src/environments/environment.ts`
- Production: Edit `.env` file (create from `.env.example`)

**Dependency updates:**

- Angular/ESLint updates: `npm run upgrade:angular`
- Individual updates: Use Dependabot PRs or manual npm commands

## Pre-commit Requirements

Husky is configured to automatically run on git commits:

- `lint-staged` runs Prettier and ESLint fixes
- ALWAYS ensure `npm run lint` and `npm test` pass before pushing
- CI will fail if any linting or test failures exist

## Known Issues and Workarounds

**TypeScript version warning:**

- ESLint shows warning about TypeScript 5.8.3 vs supported <5.6.0
- This is non-blocking and tests still pass

**Stencil core warnings:**

- Build shows empty-glob warnings for Stencil/Ionic components
- These are non-blocking and do not affect functionality

**Node.js version compatibility:**

- Repository requires Node.js v22 (specified in .node-version)
- Use `fnm use` to automatically switch to correct version

## Deployment Notes

**Static hosting:**

- Build: `npm run build:production`
- Deploy contents of `www/` directory
- Requires HTTPS and SPA routing configuration

**Environment variables:**

- All production config comes from `.env` file or ENV variables
- See `.env.example` for complete list of required variables
- Google Sheets API key required for production use

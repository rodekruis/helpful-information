# Guide: How to set up an instance (quickly)

## Introduction

This guide will help you set up an instance of a [Helpful Information App](https://github.com/rodekruis/helpful-information).  
See the GitHub-repository website to find out how it works and how to use it.

> [!TIP]
> Example instances: ([Demo Google Sheet](https://docs.google.com/spreadsheets/d/1op6Ouyxtwv4f8GAEAMSn5PVzcXtfZuftMiLYWsX0pbs))
>
> - <https://helpful-info.github.io/example/> - An example with (almost) all features enabled/used.
> - <https://helpful-info.github.io/example-multilingual/> - An example with local data, focussing on "one sheet/region per language".

## Preparations

- Make sure to have a good overview of the specific information-needs of the people affected
- Make sure to involve _all appropriate people from possible partner organizations_
- Make sure to involve a _CEA specialist to start up the process of gathering, sorting, prioritizing all expected content_
- Make sure to meet all [technical requirements](#technical-requirements) within the (partner-)organization.
- Make sure to set up a monitoring/evaluation-process of the effectiveness of the content and categorization/prioritization.
- Decide on using a (third-party) service for monitoring/analytics of the usage of the instance. To see which content is most used or searched-for/missing by visitors. See: [Set up Monitoring / Analytics](#set-up-monitoring--analytics).

## Technical Requirements

- A Google Account (or [create one](#create-a-google-account))
- A GitHub Account (or [create one](#create-a-github-account))
- (optional) A GitHub Organization (or [create one](#create-a-github-organization))
- A static file hosting solution/service. GitHub Pages is used by default.
  - For alternatives, see: [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment).

## Checklist

- [ ] Choose or [Create a Google Account](#create-a-google-account) that will own all the content.
- [ ] Sign into that Google account.
- Create a copy of a HIA Google Sheet Template.
  - [ ] Select one of the template-sheets from the Google Drive folder: "[HIA Templates (public)](https://drive.google.com/drive/folders/1eoKlwKqPXagTnkQGxj0JpH5TRplqXX-C)".

    > [!TIP]
    > The template-sheet "[HIA - All Features - Demo](https://docs.google.com/spreadsheets/d/1l43SgRymj3EPBOd-wp3mWrfcqDZlKbuAy7HQGo8YnT8)" is recurrently used to test all HIA functionalities, so it is the best starting point to understand how the app works and what it offers.

  - [ ] Click "**File**" > "**Make a copy**"; from now on, you will only work on this copy of the template-sheet. Give the sheet a descriptive title.
  - [ ] Share the file with "**Anyone with the link**" set to "**Viewer**".
  - [ ] Take note of the `Google Spreadsheet ID` of the created file:  
         It is the special, 44-character string in the URL: `https://docs.google.com/spreadsheets/d/`**`___SPREADSHEET_ID___`**`/edit?usp=sharing`
  - [ ] (optional) Share the file with other Google Accounts by giving them "**Edit**"-permissions.
  - [ ] (optional) These editors can already start adding/changing content in this sheet from this point forward.

- Create a Google Sheets API-key, to let the web-app access the sheet in the visitors' browser
  - [ ] Go to <https://console.cloud.google.com/projectcreate>
  - [ ] Complete any "getting started"-steps when prompted. Select or create a 'project' with a descriptive title.
  - Enable the Google Sheets API
    - [ ] Go to <https://console.cloud.google.com/apis/dashboard>, the "**Enabled APIs & services**"-page.
    - [ ] Click on the "**+ Enable APIs and Services**"-button
    - [ ] Search for "google sheets api", or go directly to: <https://console.cloud.google.com/apis/library/sheets.googleapis.com>
    - [ ] Click on the "**Enable**"-button
  - Create an API-key
    - [ ] Go to <https://console.cloud.google.com/apis/credentials>, the "**Credentials**"-page
    - [ ] Click on the "**+ Create Credential**"-button
    - [ ] Select "**API-key**" from the list, wait for the key to be generated. Store the key at a secure place; you will need this later.
    - [ ] After closing the pop-up, click the "**Edit API key**"-link
    - [ ] Give it a recognizable name; make sure to include its _scope_, i.e. "production" or "local-dev", to know which key is responsible for what.
    - [ ] (_Optional, but highly recommended; Can be enabled/updated later._)  
           Select "**HTTP referrers (websites)**" from the "**Application restrictions**"-list.  
           Add (all) the public URL(s) under "**Website Restrictions**".  
           For example `https://<organization-or-user-name>.github.io/*`

    - [ ] (_Optional, but highly recommended; Can be enabled/updated later._)  
           Set "**API restrictions**" to "**Restrict key**" and Select the "**Google Sheets API**" from the list
    - [ ] Save all changes/settings

- By default, the URL of your HIA instance will be `https://<organization-or-user-name>.github.io/<repository-name>`,
  if you need a different one, see [more options in the appendix.](#choose-a-public-url)

- Create the GitHub-repository
  - [ ] Log into GitHub; if you need a Github Organization to host HIA, make sure you have permission to create new repositories in that organization.
  - [ ] Go to <https://github.com/helpful-info/template/generate>
  - [ ] Name the repository as (the last part of) the URL; select as owner the appropriate GitHub Organization, if necessary.
  - [ ] Make sure to select "**Public**" as the repository visibility.
  - [ ] Complete the process of creating the repository
  - [ ] Go to "**Settings**" > "**Pages**" and select "**Source**": "**Github Actions**".
- Add the Google Sheet API Key as a secret to the repository
  - [ ] Go to the repository's "**Settings**" > "**Secret and variables**" > "**Actions**" > "**New repository secret**"
  - [ ] Name the secret: `GOOGLE_SHEETS_API_KEY`and insert the API Key as value

- Define dynamic values and settings of your instance and deploy it
  - [ ] Go to the file: `.github/workflows/deploy-github-pages.yml` and click "**Edit this file**" (pencil icon)
  - [ ] Configure the necessary variables; see comment lines to understand what each variable does
  - [ ] Specifically make sure to fill in the `Google Spreadsheet ID` under `REGIONS_SHEET_IDS` (and remove the default/placeholder value)
  - [ ] Save/Commit the changes
  - [ ] Verify the deployment is triggered by going to the "**Actions**"-tab and checking the latest run
  - [ ] After a successful run, the instance should be available on the chosen URL

- (Optional) Configure a custom (sub-)domain-name to use as public URL. (Applicable for [Solution 3](#solution-3-custom-domain-name) and [Solution 4](#solution-4-custom-sub-domain-name)
  - Edit the file: `.github/workflows/deploy-github-pages.yml`, below the line:

    ```yml
    # NOTE: When the instance will be run on a custom (sub-)domain, remove the `--base-href`-flag+value.
    ```

    So that it looks like:

    ```yml
    run: 'npm run build:production -- --output-path=../www'
    ```

  - On the GitHub repository-page, go to: "Settings" → "Pages" → "Custom domain" and fill in the applicable public URL
  - GitHub will validate the DNS-records for the (sub-)domain

- (Optional) Add any files to the `public/files/`-folder in the repository.
  - These files will be available at: `https://<your-public-instance-URL>/files/<file-name>`
  - They can be linked to from the content in the Google Sheet, using this full URL. (or using a Markdown-link)
  - They can be used as icons/logos for Offers, (Sub-)Categories, etc. Use this full URL in the applicable rows/columns in the Google Sheet(s).
- ✅ Done.

  Editors can now see their content-changes on the public URL.  
  People affected can be informed about the available information at the public URL.

- Editors can see details about "[How to use](https://github.com/rodekruis/helpful-information#how-to-use)"-HIA in the [helpful-information/README](https://github.com/rodekruis/helpful-information#readme)

---

## Appendix

### Create a Google Account

1. Go to <https://accounts.google.com/signup>  
   Its not necessary to create a new Gmail-address; using an existing organization-address is possible.
2. Finish the flow to create the account and store the login-credentials in a secure place, for example a password-manager.
3. Enable any additional security measures

### Create a GitHub Account

A GitHub Account is meant to be used by a single user, with a single set of log-in credentials.

1. Go to <https://github.com/signup> and follow the steps.
2. When choosing a username, take into account that possible URL(s) will be: `https://<username>.github.io` or `https://<username>.github.io/<specific-name>`.
3. A user-account can later be transformed into a GitHub Organization. See: <https://github.com/settings/organizations> (when logged in as that user)

### Create a GitHub Organization

A GitHub Organization is meant to be used/administered by multiple users, using their own private account/log-in credentials.

1. Log into GitHub as the owner/admin of the new to-be-created Organization.
2. Go to <https://github.com/account/organizations/new?plan=free>
3. When choosing an account-name, take into account that possible URL(s) will be: `https://<organization-name>.github.io` or `https://<organization-name>.github.io/<specific-name>`.

### Choose a public URL

This is the link/URL you'll communicate to the people affected and/or aid-workers.

#### **Solution 1 (default)**: In "`helpful-info`" GitHub-organization

- **URL**: `https://helpful-info.github.io/<specific-repository-name>`
- Fast to set-up.
- Name is generic, but clear. No existing 'brand' or 'trust' attached (yet).
- No additional accounts/services/fees.

#### **Solution 2**: Custom GitHub-organization

- **URL**: `https://<organization-name>.github.io/<specific-repository-name>`
- Fast to set-up.
- 1 extra account/entity to create.
- Name of organization needs to be clear, recognizable and trustworthy. (and available on GitHub)
- No additional services/fees.

#### **Solution 3**: Custom domain-name

- **URL**: `https://<specific-domain-name>.<com|org|info|almost-anything>`
- Needs to be available.
- Name needs to be clear, recognizable, trustworthy, easily communicated (digitally and verbally).
- Separate registration-process.
- Separate configuration required to use domain-name with hosting-solution(GitHub Pages).
- Not free.

#### **Solution 4**: Custom sub-domain-name

- **URL**: `https://<specific-sub-domain>.example.org`
- Needs access to 'parent' organizations' domain-name.
- Technical limitations depend on parent organization's preferences/abilities.
- Separate configuration required to use domain-name with hosting-solution(GitHub Pages).

#### **Solution 5**: Shared hosting-service

- **URL**: `https://<specific-sub-domain>.<service-domain>`
- Depending on service, for options, see [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment)

### Set up Monitoring / Analytics

Each page-visit("a page-view") and user-interaction("an event") can be logged/monitored using a third-party (web-analytics) service.
The application is set-up to do this in a privacy-concious way, by anonymizing IP-addresses and not using cookies, thus complying to GDPR-requirements.

#### Set up to use Matomo for Analytics

Matomo is a popular open-source web-analytics platform, that can be self-hosted or used as a service via [Matomo Cloud](https://matomo.org/matomo-cloud/).

1. Create a Matomo-account/user, either self-hosted or via Matomo Cloud.
2. Create a new "Measurable"(with the type "Website") in Matomo for your HIA-instance.
3. After creation, click the "View tracking code"-link.  
   In the shown JavaScript Tracking Code, take note of the following values:
   - As "Site ID", the _number_ shown in: `_paq.push(['setSiteId', '00']);` (without the `'`-quotes)
   - As "Matomo URL", the _URL_ shown in: `var u="https://matomo.example.org/";`
4. Use these values to configure the ENV-variable `MATOMO_CONNECTION_STRING`, following the format (specified in [`.env.example`](../.env.example)):

   ```ts
   id=<Site-ID-number>;api=<Matomo-URL+matomo.php>;sdk=<Matomo-URL+matomo.js>
   ```

   - Note that Matomo Cloud, uses a _different_ CDN-version of the `sdk=`-URL!

5. This combined connection-string should be configured for the instance as the ENV-variable `MATOMO_CONNECTION_STRING` in the `.github/workflows/deploy-github-pages.yml`-file.

#### Set up to use GoatCounter for Analytics

GoatCounter is a simple, privacy-concious web-analytics platform, that can be self-hosted or used as a service via [GoatCounter.com](https://www.goatcounter.com/).
It provides a generous free-tier for non-commercial projects.

1. Create an initial GoatCounter-account, for the organization, on: <https://www.goatcounter.com/signup>
   - Note the "Account name", as this will be used in the connection-string AND the (public) URL to view the dashboard.
   - Under this 'organization', other users can be created/added to ALSO manage the dashboard(s)/account.
2. Make sure to review the GoatCounter settings for the account, especially regarding data-retention and privacy.
3. Use the "Account name"(as "YOUR_CODE") to configure the ENV-variable `GOATCOUNTER_CONNECTION_STRING`, following the format (specified in [`.env.example`](../.env.example)):

   ```ts
   api=https://<your-code>.goatcounter.com/count;sdk=https://gc.zgo.at/count.js
   ```

4. This combined connection-string should be configured for the instance as the ENV-variable `GOATCOUNTER_CONNECTION_STRING` in the `.github/workflows/deploy-github-pages.yml`-file.
5. After deployment, visit the dashboard at: `https://<your-code>.goatcounter.com/`

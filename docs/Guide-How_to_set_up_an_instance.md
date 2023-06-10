# Guide: How to set up an instance (quickly)

## Introduction

This guide will help you set up an instance of a [Helpful Information App](https://github.com/rodekruis/helpful-information). See the GitHub-repository website to find out how it works and how to use it.

## Preparations

-   [ ] Make sure to have a good overview of the specific information-needs of the people affected
-   [ ] Make sure to involve *all appropriate people from possible partner organizations*
-   [ ] Make sure to involve a *CEA specialist to start up the process of gathering, sorting, prioritizing all expected content*
-   [ ] Make sure to meet all [technical requirements](#technical-requirements) within the (partner-)organization.
-   [ ] Make sure to set up a follow-up/monitoring/evaluation process of the effectiveness of the content and categorization/prioritization.

## Technical Requirements

-   A Google Account (or [create one](#create-a-google-account))
-   A GitHub Account (or [create one](#create-a-github-account))
-   (optional) A GitHub Organization (or [create one](#create-a-github-organization))
-   (optional) A static file hosting solution/service (see options: [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment), use GitHub by default)

## Checklist

-   [ ] Choose/[Create a Google Account](#create-a-google-account) that will own all the content.
-   [ ] Create a copy of a HIA Google Sheet Template.

    -   [ ] Select one of the template-sheets from the Google Drive folder: "[HIA Templates (public)](https://drive.google.com/drive/folders/1eoKlwKqPXagTnkQGxj0JpH5TRplqXX-C)".\
             From the "right-click"- or "**⋮**"-menu.
    -   [ ] Share the file with "**Anyone with the link**" set to "**Viewer**".
    -   [ ] Take note of the `Google Spreadsheet ID` of the created file:\
             It is the special, 44-character string in the URL: `https://docs.google.com/spreadsheets/d/`**`___SPREADSHEET_ID___`**`/edit?usp=sharing`
    -   [ ] (optional) Share the file with other Google Accounts by giving them "**Edit**"-permissions.
    -   [ ] (optional) These editors can already start adding/changing content in this sheet from this point forward.

-   [ ] [Choose what public URL the web-app will be available on.](#choose-a-public-url)
-   [ ] [Create the GitHub-repository](#create-a-github-repository) of your instance.
-   [ ] Go to Settings > Pages and select Source: Github Actions.

-   [ ] [Create a Google Sheets API-key](#create-a-google-sheets-api-key)\
         To let the web-app access the sheet in the visitors' browser and to comply with Google's terms of service.

-   [ ] [Define all dynamic values and settings](#configure-instance-settings) of your instance.\
         Including all sensitive or secret values.

-   [ ] Deploy your instance, by running the GitHub Actions workflow manually.

-   [ ] ✅ Done.\
         Editors can now see their content-changes on the public URL.\
         People affected can be informed about the available information at the public URL.

* * *

## Appendix

### Create a Google Account

1.  Go to \
    Its not necessary to create a new Gmail-address; using an existing organization-address is possible.
2.  Finish the flow to create the account and store the login-credentials in a secure place, for example a password-manager.
3.  Enable any additional security measures

### Create a Google Sheets API-key

1.  Go to 
2.  Complete any "getting started"-steps when prompted
3.  Enable the Google Sheets API
    1.  Go to , the "*Enabled APIs & services*"-page
    2.  Click on the "**+ Enable APIs and Services**"-button
    3.  Search for "`google sheets api`", or go directly to: 
    4.  Click on the "**Enable**"-button
4.  Create an API-key
    1.  Go to , the "*Credentials*"-page
    2.  Click on the "**+ Create Credential**"-button
    3.  Select "API-key" from the list, wait for the key to be generated
    4.  In the pop-up, click the "**Edit API key**"-link
    5.  Give it a recognizable name. Make sure to include its 'scope', i.e. "production" or "local-dev", to know which key is responsible for what.
    6.  Save all changes/settings

### Create a GitHub Account

A GitHub Account is meant to be used by a single user, with a single set of log-in credentials.

1.  Go to  and follow the steps.
2.  When choosing a username, take into account that possible URL(s) will be: `https://.github.io` or `https://.github.io/`.
3.  A user-account can later be transformed into a GitHub Organization. See:  (when logged in as that user)

### Create a GitHub Organization

A GitHub Organization is meant to be used/administered by multiple users, using their own private account/log-in credentials.

1.  Log into GitHub as the owner/admin of the new to-be-created Organization.
2.  Go to 
3.  When choosing an account-name, take into account that possible URL(s) will be: `https://.github.io` or `https://.github.io/`.

### Create a GitHub Repository

A GitHub Repository will hold all code and configuration of your instance.

1.  Log into GitHub as a user of the appropriate GitHub Organization (with the permissions to create new repositories)
2.  Go to 
3.  Name the repository as the public URL, under the appropriate GitHub Organization
4.  Complete the process of creating the repository
5.  Git clone the repository locally and add missing submodule (to be fixed)

```
    git submodule add --name helpful-information https://github.com/rodekruis/helpful-information.git 
    git add *
    git commit -m "add submodule"
    git push
```

### Choose a public URL

This is the link/URL you'll communicate to the people affected.

#### **Solution 1 (default)**: Custom GitHub-organization

-   **URL**: `https://.github.io/`
-   Fast to set-up.
-   1 extra account/entity to create.
-   No additional services/fees.

#### **Solution 2**: In `rodekruis`' GitHub-organization

-   **URL**: `https://rodekruis.github.io/`
-   Fast to set-up.
-   No additional accounts/services/fees.

#### **Solution 3**: Custom domain-name

-   **URL**: `https://.test`
-   Needs to be available.
-   Separate registration-process.
-   Not free.

#### **Solution 4**: Custom sub-domain-name

-   **URL**: `https://.example.org`
-   Needs access to 'parent' organizations' domain-name.

#### **Solution 5**: Shared hosting-service

-   **URL**: `https://.`
-   Depending on service, for options, see [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment)

### Configure instance settings

If you deploy using GitHub Pages (default):

-   [ ] Configure the following variables in `workflows/deploy-github-pages.yml`:
    -   [ ] `TXT_APP_NAME`: the name of your app
    -   [ ] `TXT_APP_LOGO_URL`: URL to the logo of your app
    -   [ ] `TXT_MAIN_PAGE_HEADER`: title displayed on landing page
    -   [ ] `TXT_MAIN_PAGE_INTRO`: introduction text displayed on landing page
    -   [ ] `REGIONS`: URL-slugs of main options on landing page, each corresponding to a separate Google Spreadsheet; add additional lines for each required.
    -   [ ] `REGIONS_LABELS`: names of the main options displayed on landing page
    -   [ ] `REGIONS_SHEET_IDS`: The `Google Spreadsheet ID` that you noted down previsouly
-   [ ] Add the `GOOGLE_SHEETS_API_KEY` in the repository's Secrets > Actions

If you deploy with another method

-   [ ] Choose a deployment-method
    -   To use Azure Static Web Apps, continue with the file: `.github/workflows/deploy-azure-static-web-apps.yml`
    -   To use a different hosting/deployment service: `.github/workflows/deploy-example.yml`
-   [ ] Give each item its appropriate value.\
         See each item and its description in: [.env.example](https://github.com/rodekruis/helpful-information/blob/main/.env.example).\
         Look for each capitalized `key` in the `env`-set in the "Build"-step.
         
### Deploy using Azure Static Web Apps

-   [ ] Create a new "Static Web App" via: 
-   [ ] Set all appropriate fields like name/location etc
-   [ ] Choose "Other" as "Deployment source" (*not GitHub*)
-   [ ] Complete the creation process
-   [ ] From the "Overview"-page, click "Manage deployment token".\
         Copy this (*sensitive!*) "Deployment token"
-   [ ] Define the `AZURE_STATIC_WEB_APPS_API_TOKEN` value in the repository's "Secrets and variables" collection.\
         See: ``**`/settings/secrets/actions/new`**

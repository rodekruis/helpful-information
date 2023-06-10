# Guide: How to set up an instance (quickly)

## Introduction

This guide will help you set up an instance of a [Helpful Information App](https://github.com/rodekruis/helpful-information). See the GitHub-repository website to find out how it works and how to use it.

## Preparations

- [ ] Make sure to have a good overview of the specific information-needs of the people affected
- [ ] Make sure to involve _all appropriate people from possible partner organizations_
- [ ] Make sure to involve a _CEA specialist to start up the process of gathering, sorting, prioritizing all expected content_
- [ ] Make sure to meet all [technical requirements](#technical-requirements) within the (partner-)organization.
- [ ] Make sure to set up a follow-up/monitoring/evaluation process of the effectiveness of the content and categorization/prioritization.

## Technical Requirements

- A Google Account (or [create one](#create-a-google-account))
- A GitHub Account (or [create one](#create-a-github-account))
- (optional) A GitHub Organization (or [create one](#create-a-github-organization))
- (optional) A static file hosting solution/service (see options: [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment), use GitHub by default)

## Checklist

- [ ] Choose/[Create a Google Account](#create-a-google-account) that will own all the content.
- [ ] Create a copy of a HIA Google Sheet Template.

  - [ ] Select one of the template-sheets from the Google Drive folder: "[HIA Templates (public)](https://drive.google.com/drive/folders/1eoKlwKqPXagTnkQGxj0JpH5TRplqXX-C)".  
         From the "right-click"- or "**⋮**"-menu.
  - [ ] Share the file with "**Anyone with the link**" set to "**Viewer**".
  - [ ] Take note of the `Google Spreadsheet ID` of the created file:  
         It is the special, 44-character string in the URL: `https://docs.google.com/spreadsheets/d/`**`___SPREADSHEET_ID___`**`/edit?usp=sharing`
  - [ ] (optional) Share the file with other Google Accounts by giving them "**Edit**"-permissions.
  - [ ] (optional) These editors can already start adding/changing content in this sheet from this point forward.

- [ ] [Choose what public URL the web-app will be available on.](#choose-a-public-url)

- [ ] [Create the GitHub-repository](#create-a-github-repository) of your instance.
- [ ] Git clone your repository locally and add HIA submodule 
```
git submodule add --name helpful-information https://github.com/rodekruis/helpful-information.git 
git add *
git commit -m "add submodule"
git push
```
- [ ] Go to Settings > Pages and select Source: Github Actions
- [ ] [Create a Google Sheets API-key](#create-a-google-sheets-api-key)  
       To let the web-app access the sheet in the visitors' browser and to comply with Google's terms of service.

- [ ] [Define all dynamic values and settings](#configure-instance-settings) of your instance.  
       Including all sensitive or secret values.

- [ ] Deploy your instance, by running the GitHub Actions workflow manually.

- [ ] ✅ Done.  
       Editors can now see their content-changes on the public URL.  
       People affected can be informed about the available information at the public URL.

---

## Appendix

### Create a Google Account

1. Go to <https://accounts.google.com/signup>  
   Its not necessary to create a new Gmail-address; using an existing organization-address is possible.
2. Finish the flow to create the account and store the login-credentials in a secure place, for example a password-manager.
3. Enable any additional security measures

### Create a Google Sheets API-key

1. Go to <https://console.cloud.google.com/projectcreate>
2. Complete any "getting started"-steps when prompted
3. Enable the Google Sheets API
   1. Go to <https://console.cloud.google.com/apis/dashboard>, the "_Enabled APIs & services_"-page
   2. Click on the "**+ Enable APIs and Services**"-button
   3. Search for "`google sheets api`", or go directly to: <https://console.cloud.google.com/apis/library/sheets.googleapis.com>
   4. Click on the "**Enable**"-button
4. Create an API-key
   1. Go to <https://console.cloud.google.com/apis/credentials>, the "_Credentials_"-page
   2. Click on the "**+ Create Credential**"-button
   3. Select "API-key" from the list, wait for the key to be generated
   4. In the pop-up, click the "**Edit API key**"-link
   5. Give it a recognizable name. Make sure to include its 'scope', i.e. "production" or "local-dev", to know which key is responsible for what.
   6. Select "**HTTP referrers (web sites)**" from the "_Application restrictions_"-list.  
      Add (all) the public URL(s) under "_Website Restrictions_".  
      For example:
      - `https://rodekruis.github.io/<repository-name>/*`
      - or `https://<custom-domain-name>.example.org/*`
      - Include `https://*.translate.goog/*` to enable use of Google Translate by people affected.
   7. Set "_API restrictions_" to "**Restrict key**" and Select the "_Google Sheets API_" from the list
   8. Save all changes/settings

---

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

### Create a GitHub Repository

A GitHub Repository will hold all code and configuration of your instance.

1. Log into GitHub as a user of the appropriate GitHub Organization (with the permissions to create new repositories)
2. Go to <https://github.com/rodekruis/create-helpful-information-app/generate>
3. Name the repository as the public URL, under the appropriate GitHub Organization
4. Complete the process of creating the repository

---

### Choose a public URL

This is the link/URL you'll communicate to the people affected.

#### **Solution 1**: Custom domain-name

- **URL**: `https://<specific-domain-name>.test`
- Needs to be available.
- Separate registration-process.
- Not free.

#### **Solution 2**: Custom sub-domain-name

- **URL**: `https://<specific-sub-domain>.example.org`
- Needs access to 'parent' organizations' domain-name.

#### **Solution 3**: Shared hosting-service

- **URL**: `https://<specific-sub-domain>.<service-domain>`
- Depending on service, for options, see [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment)

#### **Solution 4**: Custom GitHub-organization

- **URL**: `https://<organization-name>.github.io/<specific-name>`
- Fast to set-up.
- 1 extra account/entity to create.
- No additional services/fees.

#### **Solution 5**: In `rodekruis`' GitHub-organization

- **URL**: `https://rodekruis.github.io/<specific-name>`
- Fast to set-up.
- No additional accounts/services/fees.

---

### Configure instance settings

Some features can be enabled/disabled for each instance and the language/tone of the text used needs to be appropriate for the intended people affected.

- [ ] Choose a deployment-method

  - To use Google Pages, continue with the file: `.github/workflows/deploy-github-pages.yml`
  - To use Azure Static Web Apps, continue with the file: `.github/workflows/deploy-azure-static-web-apps.yml`
  - To use a different hosting/deployment service: `.github/workflows/deploy-example.yml`

- [ ] Give each item its appropriate value.  
       See each item and its description in: [.env.example](https://github.com/rodekruis/helpful-information/blob/main/.env.example).  
       Look for each capitalized `key` in the `env`-set in the "Build"-step.

- [ ] Define all `REGION`'s URL-slugs, labels and "Google Spreadsheet ID" (created earlier)
- [ ] Define the `GOOGLE_SHEETS_API_KEY` value in the repository's "Secrets and variables" collection.  
       See: `<your-repository-url>`**`/settings/secrets/actions/new`**

### Deploy using GitHub Pages

- [ ] In the workflow-file `.github/workflows/deploy-github-pages.yml`, at the "Add static version of region(s)"-step:  
       Add additional lines for each required `REGION` URL-slug.

### Deploy using Azure Static Web Apps

- [ ] Create a new "Static Web App" via: <https://portal.azure.com/#create/Microsoft.StaticApp>
- [ ] Set all appropriate fields like name/location etc
- [ ] Choose "Other" as "Deployment source" (_not GitHub_)
- [ ] Complete the creation process
- [ ] From the "Overview"-page, click "Manage deployment token".  
       Copy this (_sensitive!_) "Deployment token"
- [ ] Define the `AZURE_STATIC_WEB_APPS_API_TOKEN` value in the repository's "Secrets and variables" collection.  
       See: `<your-repository-url>`**`/settings/secrets/actions/new`**

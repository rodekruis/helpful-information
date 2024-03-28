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
- A static file hosting solution/service. GitHub Pages is used by default.
  - For alternatives, see: [helpful-information / Deployment](https://github.com/rodekruis/helpful-information#deployment).

## Checklist

- [ ] Choose/[Create a Google Account](#create-a-google-account) that will own all the content.
- [ ] Create a copy of a HIA Google Sheet Template.
> [!TIP]
> The template-sheet "[HIA - Staging  Demo/Example](https://docs.google.com/spreadsheets/d/1l43SgRymj3EPBOd-wp3mWrfcqDZlKbuAy7HQGo8YnT8)"
> is displayed at [helpful-info.github.io/example/demo](https://helpful-info.github.io/example/demo);
> this template contains all functionalities of HIA and is
> therefore the best choice to familiarize yourself with them.
  - [ ] Select one of the template-sheets from the Google Drive folder: "[HIA Templates (public)](https://drive.google.com/drive/folders/1eoKlwKqPXagTnkQGxj0JpH5TRplqXX-C)".  
         From the "right-click"- or "**⋮**"-menu.
  - [ ] Share the file with "**Anyone with the link**" set to "**Viewer**".
  - [ ] Take note of the `Google Spreadsheet ID` of the created file:  
         It is the special, 44-character string in the URL: `https://docs.google.com/spreadsheets/d/`**`___SPREADSHEET_ID___`**`/edit?usp=sharing`
  - [ ] (optional) Share the file with other Google Accounts by giving them "**Edit**"-permissions.
  - [ ] (optional) These editors can already start adding/changing content in this sheet from this point forward.

- [ ] [Choose what public URL the web-app will be available on.](#choose-a-public-url)

- [ ] [Create a Google Sheets API-key](#create-a-google-sheets-api-key)  
       To let the web-app access the sheet in the visitors' browser and to comply with Google's terms of service.

- [ ] [Create the GitHub-repository](#create-a-github-repository) of your instance.

- [ ] [Define all dynamic values and settings](#configure-instance-settings) of your instance. (Using all previously created IDs, keys, etc.)

- [ ] Your instance will be deployed automatically.

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
   5. Give it a recognizable name.  
      Make sure to include its 'scope', i.e. "production" or "local-dev", to know which key is responsible for what.
   6. (_Optional, but highly recommended; Can be enabled/updated later._)  
      Select "**HTTP referrers (web sites)**" from the "_Application restrictions_"-list.  
      Add (all) the public URL(s) under "_Website Restrictions_".  
      For example:

      - `https://helpful-info.github.io/<repository-name>/*`
      - or `https://<custom-domain-name>.example.org/*`
      - Include `https://*.translate.goog/*` to enable use of Google Translate by people affected.

   7. (_Optional, but highly recommended; Can be enabled/updated later._)  
      Set "_API restrictions_" to "**Restrict key**" and Select the "_Google Sheets API_" from the list
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

1. Log into GitHub as a user of the appropriate GitHub Organization (with the permission to create new repositories)
2. Go to <https://github.com/helpful-info/template/generate>
3. Name the repository as (last part of) the public URL, under the appropriate GitHub Organization
4. Complete the process of creating the repository
5. Go to Settings > Pages and select Source: "Github Actions".

---

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

---

### Configure instance settings

If you deploy using GitHub Pages (default):

1. Go to the file: `.github/workflows/deploy-github-pages.yml` and click "**Edit in place**".  
   Or go to the URL: `https://github.com/helpful-info/`**_`<your-repository-name>`_**`/edit/main/.github/workflows/deploy-github-pages.yml`
2. Configure all variables mentioned in the ENV section on top
3. Save/Commit the changes
4. Verify the deployment is triggered by going to the **Actions**-tab and checking the latest run
5. After a successful run, the instance should be available on the chosen public URL

# ETR Learn v3 — Start Here

This version removes the mixed module-loading approach and uses Firebase's official browser-compatible SDK consistently on both the employee and administrator pages.

## 1. Confirm the configuration

Open `firebase-config.js`. It should contain the Firebase Config values copied from:

Firebase → Project settings → Your apps → ETR Policy Refresher → Config

Keep quotation marks around every value. The administrator email must be the exact lowercase email used for the administrator account.

## 2. Firebase Authentication

Open Firebase → Authentication → Sign-in method → Email/Password. Enable the first Email/Password option.

Under Authentication → Settings → Authorized domains, add:

`rjean93.github.io`

## 3. Firestore rules

Open Firebase → Firestore → Rules. Replace the existing rules with the contents of `firestore.rules`, then click Publish.

## 4. Replace the GitHub files

Upload every file and the `assets` folder from this package to the root of the `ETR-Policy-Refresher` repository. Commit the changes and wait for GitHub Pages to redeploy.

## 5. Test without cached files

Open the site in an Incognito window:

`https://rjean93.github.io/ETR-Policy-Refresher/`

Create the administrator account using the exact email in `firebase-config.js`.

The admin dashboard is:

`https://rjean93.github.io/ETR-Policy-Refresher/admin.html`

## Important

The Firebase Web API key is designed to be present in client-side code. Access to employee records is protected by Authentication and Firestore rules.

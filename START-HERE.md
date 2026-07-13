# ETR Learn — Start Here

The Firebase project information is already inserted into `firebase-config.js`.
Complete the steps below before publishing the site.

## 1. Choose your administrator email

Use the exact email address you will use to create/sign into the course.

Replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` in BOTH:

- `firebase-config.js`
- `firestore.rules`

The two entries must match exactly and should be lowercase.

## 2. Enable Email/Password sign-in

In Firebase Console:

1. Open **Authentication**.
2. Select **Sign-in method**.
3. Open **Email/Password**.
4. Enable **Email/Password** (the first switch).
5. Save.

## 3. Publish the Firestore rules

1. Open **Firestore Database**.
2. Select the **Rules** tab.
3. Delete the existing rules.
4. Copy all contents of `firestore.rules` into the editor.
5. Click **Publish**.

Do not use open test rules for the live course.

## 4. Add your GitHub Pages domain to Firebase Authentication

After GitHub Pages gives you a URL, it will normally look like:

`YOUR-USERNAME.github.io`

In Firebase Console:

1. Open **Authentication**.
2. Open **Settings**.
3. Open **Authorized domains**.
4. Click **Add domain**.
5. Enter only `YOUR-USERNAME.github.io` (no `https://` and no repository path).

## 5. Upload to GitHub

Upload every file and folder INSIDE this project folder to the root of the GitHub repository.
Do not upload only the ZIP.

Then open repository **Settings → Pages** and select:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

## 6. Create your admin account

1. Open the live employee course (`index.html`).
2. Enter your name, the same admin email configured above, and a password of at least six characters.
3. Click **Create account**.
4. Open `admin.html` on the same live site and sign in with that email/password.

Example:

- Employee course: `https://YOUR-USERNAME.github.io/etr-training/`
- Admin dashboard: `https://YOUR-USERNAME.github.io/etr-training/admin.html`

## Course flow

Each module requires:

1. Complete narration
2. Pass the module knowledge check
3. Check the acknowledgement
4. Complete the module

The final assessment unlocks after all modules are complete. An 80% score is required for a certificate.

## Important browser note

The required narration uses the device browser's speech engine. Microsoft Edge or Google Chrome on a desktop is recommended. The site records that narration reached its end; it cannot prove the employee actively listened or that their volume was turned on.

# ETR Employee Policy Refresher — Free Hosted & Tracked Edition

This version adds:

- Required full narration before each knowledge check unlocks
- One knowledge check after every module
- Policy acknowledgement before module completion
- Locked next-module navigation
- Final exam unlocked only after all modules are complete
- 80% final exam passing score
- Employee login and cloud progress tracking using Firebase's free Spark plan
- Administrator dashboard and CSV export
- Local demonstration mode when Firebase is not configured
- GitHub Pages-ready static hosting

## Important limitation of browser narration

The course verifies that browser text-to-speech reached the end of every module. It cannot prove the employee remained at the computer, kept the volume audible, or actively listened. For stronger control, replace browser narration with recorded MP3 files and use the HTML audio `ended` event.

## Free setup: Firebase + GitHub Pages

### 1. Create a free Firebase project

1. Open Firebase Console and create a project.
2. Add a Web App.
3. Copy the web configuration values into `firebase-config.js`.
4. In **Authentication**, enable **Email/Password**.
5. In **Firestore Database**, create a database.
6. Open **Rules**, paste the contents of `firestore.rules`, replace the sample administrator email, and publish.
7. Put the same administrator email in `ETR_ADMIN_EMAILS` inside `firebase-config.js`.
8. Create the administrator account through the course sign-up screen using that email.

Firebase's free Spark plan is generally sufficient for a small employee training program, subject to Firebase's current limits and terms.

### 2. Host free with GitHub Pages

1. Create a GitHub account and a new repository.
2. Upload every file and the `assets` folder from this project.
3. Open **Settings > Pages**.
4. Choose **Deploy from a branch**, select the main branch and root folder.
5. GitHub will provide the course URL.
6. Add the GitHub Pages domain under Firebase Authentication's **Authorized domains** if it is not added automatically.

Employees use `index.html`. Administrators use `admin.html`.

## Admin tracking

The admin dashboard displays:

- Employee name and email
- Modules completed
- Highest exam score
- Completion status
- Last update
- Certificate ID

Use **Export CSV** to download the training records.

## Testing checklist

- Create a test employee account.
- Start a module and confirm the knowledge check remains locked.
- Let narration finish and confirm the knowledge check unlocks.
- Pass the check, acknowledge the policy and complete the module.
- Confirm the next module unlocks.
- Complete all modules and confirm the final exam unlocks.
- Pass with at least 80% and confirm the certificate appears.
- Open `admin.html` with an administrator account and confirm the employee record appears.

## Files

- `index.html` — employee course
- `admin.html` / `admin.js` — administrator dashboard
- `app.js` — course, audio, gating and exam logic
- `tracker.js` — Firebase employee tracking
- `firebase-config.js` — Firebase project values and admin email list
- `firestore.rules` — database security rules template
- `course-data.js` — policy content
- `module-checks.js` — module knowledge checks
- `quiz.js` — final assessment
- `progress.js` — local fallback progress
- `certificate.js` — certificate
- `style.css` — responsive styling

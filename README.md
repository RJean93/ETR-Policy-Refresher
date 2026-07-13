# ETR Learn — real software project

A Vite + React + Firebase employee-training application.

## Deploy without installing anything
Upload everything inside `dist/` to the root of the GitHub Pages repository.

## Develop locally
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Build with `npm run build`.

## Firebase setup
- Enable Authentication > Email/Password.
- Create Cloud Firestore.
- Publish `firestore.rules` in Firestore > Rules.
- Add `rjean93.github.io` under Authentication > Settings > Authorized domains.
- The Firebase configuration is in `src/firebaseConfig.js`.

## Important API-key diagnostic
The current key was transcribed from screenshots. If Firebase still reports `auth/api-key-not-valid`, copy the API key directly from Firebase Console and paste it into `src/firebaseConfig.js`, then run `npm run build` and upload the new `dist` files. Pay particular attention to visually similar capital `I`, lowercase `l`, and capital `L` characters.

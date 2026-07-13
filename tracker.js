window.ETRTracker = (() => {
  let auth = null;
  let db = null;
  let user = null;
  let configured = false;
  let initPromise = null;

  const config = window.ETR_FIREBASE_CONFIG || {};
  configured = Boolean(
    config.apiKey &&
    config.apiKey !== "REPLACE_ME" &&
    config.projectId &&
    config.projectId !== "REPLACE_ME"
  );

  function friendlyError(error) {
    const code = error && error.code ? error.code : "unknown";
    const messages = {
      "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "Firebase rejected the web API key. Copy a fresh Config block from Firebase Project settings → Your apps → Config, replace firebase-config.js, then redeploy.",
      "auth/invalid-api-key": "Firebase rejected the web API key. Copy a fresh Config block from Firebase Project settings → Your apps → Config, replace firebase-config.js, then redeploy.",
      "auth/operation-not-allowed": "Email/password sign-in is not enabled. In Firebase, open Authentication → Sign-in method → Email/Password and enable it.",
      "auth/unauthorized-domain": "This GitHub Pages domain is not authorized. Add rjean93.github.io under Firebase Authentication → Settings → Authorized domains.",
      "auth/email-already-in-use": "An account already exists for this email. Use Sign in instead.",
      "auth/invalid-credential": "The email or password is incorrect.",
      "auth/weak-password": "Use a password with at least six characters.",
      "auth/invalid-email": "Enter a valid email address.",
      "permission-denied": "Firestore blocked this request. Publish the included firestore.rules file in Firebase.",
      "firestore/permission-denied": "Firestore blocked this request. Publish the included firestore.rules file in Firebase."
    };
    return messages[code] || (error && error.message ? error.message : "An unexpected Firebase error occurred.");
  }

  async function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      if (!configured) return { configured: false, user: null };
      if (!window.firebase || !window.firebase.initializeApp) {
        throw new Error("Firebase SDK did not load. Check the internet connection or browser content blocking.");
      }
      const existing = window.firebase.apps && window.firebase.apps.length
        ? window.firebase.app()
        : window.firebase.initializeApp(config);
      auth = window.firebase.auth(existing);
      db = window.firebase.firestore(existing);
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          user = currentUser;
          unsubscribe();
          resolve();
        });
      });
      return { configured: true, user };
    })();
    return initPromise;
  }

  async function signUp(email, password) {
    await init();
    try {
      const credential = await auth.createUserWithEmailAndPassword(email, password);
      user = credential.user;
      return user;
    } catch (error) {
      error.friendlyMessage = friendlyError(error);
      throw error;
    }
  }

  async function signIn(email, password) {
    await init();
    try {
      const credential = await auth.signInWithEmailAndPassword(email, password);
      user = credential.user;
      return user;
    } catch (error) {
      error.friendlyMessage = friendlyError(error);
      throw error;
    }
  }

  async function signOut() {
    await init();
    if (auth) await auth.signOut();
    user = null;
  }

  async function saveProgress(state) {
    await init();
    if (!configured || !user) return false;
    try {
      const payload = {
        ...state,
        email: user.email || state.email || "",
        uid: user.uid,
        lastUpdated: window.firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection("trainingUsers").doc(user.uid).set(payload, { merge: true });
      return true;
    } catch (error) {
      error.friendlyMessage = friendlyError(error);
      throw error;
    }
  }

  async function loadProgress() {
    await init();
    if (!configured || !user) return null;
    try {
      const snapshot = await db.collection("trainingUsers").doc(user.uid).get();
      return snapshot.exists ? snapshot.data() : null;
    } catch (error) {
      error.friendlyMessage = friendlyError(error);
      throw error;
    }
  }

  function diagnostics() {
    return {
      configured,
      projectId: config.projectId || "missing",
      authDomain: config.authDomain || "missing",
      apiKeyEnding: config.apiKey ? config.apiKey.slice(-6) : "missing",
      sdkLoaded: Boolean(window.firebase && window.firebase.initializeApp)
    };
  }

  return {
    init,
    signUp,
    signIn,
    signOut,
    saveProgress,
    loadProgress,
    diagnostics,
    friendlyError,
    get user() { return user; },
    get configured() { return configured; }
  };
})();

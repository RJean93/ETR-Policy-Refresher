window.ETRTracker = (() => {
  let auth = null, db = null, user = null, configured = false;
  let api = {};
  const config = window.ETR_FIREBASE_CONFIG || {};
  configured = Boolean(config.apiKey && config.apiKey !== 'REPLACE_ME' && config.projectId && config.projectId !== 'REPLACE_ME');

  async function init(){
    if(!configured) return {configured:false, user:null};
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');
    const fireMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
    const app = appMod.initializeApp(config);
    auth = authMod.getAuth(app); db = fireMod.getFirestore(app);
    api = {...authMod, ...fireMod};
    await new Promise(resolve => authMod.onAuthStateChanged(auth, u => { user = u; resolve(); }));
    return {configured:true, user};
  }
  async function signUp(email,password){ const c=await api.createUserWithEmailAndPassword(auth,email,password); user=c.user; return user; }
  async function signIn(email,password){ const c=await api.signInWithEmailAndPassword(auth,email,password); user=c.user; return user; }
  async function signOut(){ if(auth) await api.signOut(auth); user=null; }
  async function saveProgress(state){
    if(!configured || !user) return false;
    const payload = {...state, email:user.email || state.email, uid:user.uid, lastUpdated:api.serverTimestamp()};
    await api.setDoc(api.doc(db,'trainingUsers',user.uid),payload,{merge:true});
    return true;
  }
  async function loadProgress(){
    if(!configured || !user) return null;
    const snap = await api.getDoc(api.doc(db,'trainingUsers',user.uid));
    return snap.exists()?snap.data():null;
  }
  return {init,signUp,signIn,signOut,saveProgress,loadProgress,get user(){return user},get configured(){return configured}};
})();

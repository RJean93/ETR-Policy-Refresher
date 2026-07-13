const config = window.ETR_FIREBASE_CONFIG || {};
const adminEmails = (window.ETR_ADMIN_EMAILS || []).map((email) => email.toLowerCase());
const message = document.getElementById('adminMessage');
const loginSection = document.getElementById('adminLogin');
const dashboard = document.getElementById('adminDashboard');
let auth;
let db;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'error-text' : 'status-text';
}

function readableDate(value) {
  if (!value) return '—';
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

function initFirebase() {
  if (!config.apiKey || !config.projectId) throw new Error('Firebase configuration is missing.');
  if (!window.firebase.apps.length) window.firebase.initializeApp(config);
  auth = window.firebase.auth();
  db = window.firebase.firestore();
}

async function loadRecords() {
  const snapshot = await db.collection('trainingUsers').orderBy('lastUpdated', 'desc').get();
  const rows = [];
  snapshot.forEach((doc) => rows.push({ id: doc.id, ...doc.data() }));
  renderRecords(rows);
}

function renderRecords(records) {
  const body = document.getElementById('recordsBody');
  body.innerHTML = '';
  const complete = records.filter((r) => r.courseCompleted || r.examPassed).length;
  const scores = records.map((r) => Number(r.examScore)).filter(Number.isFinite);
  document.getElementById('totalStat').textContent = records.length;
  document.getElementById('completeStat').textContent = complete;
  document.getElementById('progressStat').textContent = Math.max(0, records.length - complete);
  document.getElementById('scoreStat').textContent = scores.length ? `${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}%` : '—';
  records.forEach((record) => {
    const completedCount = Array.isArray(record.completed) ? record.completed.length : Object.keys(record.completed || {}).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${record.employeeName || record.name || '—'}</td><td>${record.email || '—'}</td><td>${completedCount}/31</td><td>${Number.isFinite(Number(record.examScore)) ? `${record.examScore}%` : '—'}</td><td>${record.courseCompleted || record.examPassed ? 'Complete' : 'In progress'}</td><td>${readableDate(record.lastUpdated)}</td><td>${record.certificateId || '—'}</td>`;
    body.appendChild(tr);
  });
  window.__etrRecords = records;
}

function exportCsv() {
  const records = window.__etrRecords || [];
  const headers = ['Employee','Email','Modules Complete','Exam Score','Status','Last Updated','Certificate'];
  const lines = [headers, ...records.map((r) => [
    r.employeeName || r.name || '', r.email || '', Array.isArray(r.completed) ? r.completed.length : Object.keys(r.completed || {}).length,
    r.examScore ?? '', r.courseCompleted || r.examPassed ? 'Complete' : 'In progress', readableDate(r.lastUpdated), r.certificateId || ''
  ])].map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(','));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'etr-training-records.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

try {
  initFirebase();
  auth.onAuthStateChanged(async (user) => {
    const isAdmin = user && adminEmails.includes((user.email || '').toLowerCase());
    loginSection.hidden = Boolean(isAdmin);
    dashboard.hidden = !isAdmin;
    if (isAdmin) {
      showMessage('');
      try { await loadRecords(); } catch (error) { showMessage(error.message, true); }
    } else if (user) {
      showMessage('This account is not listed as an administrator.', true);
      await auth.signOut();
    }
  });
} catch (error) {
  showMessage(error.message, true);
}

document.getElementById('adminLoginBtn').addEventListener('click', async () => {
  try {
    showMessage('Signing in…');
    await auth.signInWithEmailAndPassword(document.getElementById('adminEmail').value.trim(), document.getElementById('adminPassword').value);
  } catch (error) { showMessage(error.message, true); }
});
document.getElementById('adminSignOut').addEventListener('click', () => auth && auth.signOut());
document.getElementById('exportBtn').addEventListener('click', exportCsv);

(()=>{
  const data=window.COURSE_DATA;
  let state=ProgressStore.load(), current=0, voices=[], chunks=[], chunkIndex=0, speaking=false, paused=false, demoMode=false;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const has=(arr,id)=>arr.includes(id);
  const add=(arr,id)=>{if(!arr.includes(id))arr.push(id)};
  const module=()=>data[current];

  async function persist(){
    ProgressStore.save(state);
    if(!demoMode && ETRTracker.user){
      try{await ETRTracker.saveProgress(state);$('saveModeText').textContent='Progress saved to your employee record.'}
      catch(e){$('saveModeText').textContent='Cloud save unavailable; progress is saved locally.'}
    }
  }
  function mergeCloud(cloud){
    if(!cloud)return;
    const union=(a,b)=>[...new Set([...(a||[]),...(b||[])])];
    state={...state,...cloud,
      completed:union(state.completed,cloud.completed),
      audioCompleted:union(state.audioCompleted,cloud.audioCompleted),
      checksPassed:union(state.checksPassed,cloud.checksPassed),
      quizScore:Math.max(state.quizScore||0,cloud.quizScore||0),
      employeeName:cloud.employeeName||state.employeeName,
      email:cloud.email||state.email
    };
    ProgressStore.save(state);
  }
  function pct(){return Math.round(state.completed.length/data.length*100)}
  function updateProgress(){
    const p=pct(); $('globalProgress').style.width=p+'%'; $('progressText').textContent=`${state.completed.length} of ${data.length} complete`; $('heroProgressText').textContent=`${state.completed.length} of ${data.length} modules complete`;
    $('progressRing').style.background=`conic-gradient(#fff ${p}%,rgba(255,255,255,.2) ${p}% 100%)`; $('progressRing').querySelector('span').textContent=p+'%';
    document.querySelectorAll('.nav-item').forEach((b,i)=>b.classList.toggle('done',has(state.completed,data[i].id)));
    const unlocked=state.completed.length===data.length; $('examNavBtn').classList.toggle('ready',unlocked);
    if(state.quizScore>=80){$('certificateSection').hidden=false; if(!state.certificateId){state.certificateId=`ETR-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;persist();}}
  }
  function renderNav(){
    $('moduleNav').innerHTML=data.map((m,i)=>`<button class="nav-item ${has(state.completed,m.id)?'done':''}" data-i="${i}"><span class="nav-index">${has(state.completed,m.id)?'✓':i+1}</span><span class="nav-label">${esc(m.title)}</span></button>`).join('');
    $('moduleNav').onclick=e=>{const b=e.target.closest('.nav-item');if(b)openModule(+b.dataset.i)};
  }
  function formatPolicy(text){return text.split(/\n\n+/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')}
  function showOnly(which){
    ['welcome','moduleView','finalAssessment','certificateSection'].forEach(id=>{if(id!=='certificateSection')$(id).hidden=id!==which});
    if(which!=='finalAssessment' && state.quizScore<80)$('certificateSection').hidden=true;
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderQuestion(){
    const q=MODULE_CHECKS[module().id];
    $('moduleQuestion').innerHTML=q?`<fieldset class="question"><legend>${esc(q.q)}</legend>${q.o.map((o,j)=>`<label class="option"><input type="radio" name="moduleAnswer" value="${j}"> ${esc(o)}</label>`).join('')}</fieldset>`:'<p>No question available.</p>';
  }
  function updateGate(){
    const id=module().id, audio=has(state.audioCompleted,id), check=has(state.checksPassed,id), done=has(state.completed,id);
    $('audioStep').classList.toggle('done',audio); $('checkStep').classList.toggle('done',check); $('ackStep').classList.toggle('done',done);
    $('moduleKnowledge').classList.toggle('locked-card',!audio); $('submitModuleCheck').disabled=!audio||check; $('knowledgeLockText').textContent=audio?(check?'Knowledge check passed.':'Choose the best answer, then check your response.'):'Complete the narration first.';
    $('ackCheck').disabled=!check; $('ackCheck').checked=done; $('completeBtn').disabled=!check||!$('ackCheck').checked||done; $('completeBtn').textContent=done?'Module complete ✓':'Complete module';
    $('nextBtn').disabled=!done; $('nextBtn').textContent=current===data.length-1?'Open final assessment →':'Next policy →';
    if(audio){$('audioStatus').textContent='Narration requirement complete.';$('audioProgressBar').style.width='100%'}
  }
  function openModule(i){
    stopSpeech(false); current=i; const m=module(); showOnly('moduleView');
    $('moduleCategory').textContent=m.category; $('moduleTitle').textContent=m.title; $('modulePages').textContent=`Handbook pages ${m.start}${m.end>m.start?'–'+m.end:''}`;
    $('takeawayList').innerHTML=(m.takeaways.length?m.takeaways:['Review the complete policy wording below and apply it to your work.']).map(x=>`<li>${esc(x)}</li>`).join('');
    $('policyContent').innerHTML=formatPolicy(m.text); $('policyContent').classList.remove('expanded'); $('expandBtn').textContent='Expand all'; $('moduleCheckResult').textContent='';
    $('prevBtn').disabled=i===0; renderQuestion(); document.querySelectorAll('.nav-item').forEach((b,j)=>b.classList.toggle('active',j===i)); $('sidebar').classList.remove('open'); updateGate();
  }
  function buildChunks(){
    const m=module(); const full=`${m.title}. Key refresher points. ${m.takeaways.join('. ')}. Policy content. ${m.text}`;
    const sentences=full.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[full]; const out=[]; let buffer='';
    for(const s of sentences){if((buffer+s).length>800){if(buffer.trim())out.push(buffer.trim());buffer=s}else buffer+=s}
    if(buffer.trim())out.push(buffer.trim()); return out;
  }
  function loadVoices(){voices=speechSynthesis.getVoices();$('voiceSelect').innerHTML=voices.map((v,i)=>`<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join('')}
  function speakChunk(){
    if(chunkIndex>=chunks.length){finishAudio();return}
    const u=new SpeechSynthesisUtterance(chunks[chunkIndex]);u.rate=parseFloat($('rateSelect').value);const v=voices[+$('voiceSelect').value];if(v)u.voice=v;
    u.onstart=()=>{speaking=true;paused=false;$('audioStatus').textContent=`Playing section ${chunkIndex+1} of ${chunks.length}`};
    u.onend=()=>{chunkIndex++;$('audioProgressBar').style.width=`${Math.round(chunkIndex/chunks.length*100)}%`;speakChunk()};
    u.onerror=e=>{if(e.error!=='canceled')$('audioStatus').textContent='Narration stopped. Press Start to begin again.'};speechSynthesis.speak(u);
  }
  function startAudio(){
    if(has(state.audioCompleted,module().id)){$('audioStatus').textContent='Narration requirement already complete.';return}
    stopSpeech(false); chunks=buildChunks();chunkIndex=0;$('audioProgressBar').style.width='0%';speakChunk();
  }
  function stopSpeech(reset=true){speechSynthesis.cancel();speaking=false;paused=false;if(reset){chunkIndex=0;$('audioProgressBar').style.width='0%';$('audioStatus').textContent='Stopped. Start again to complete the narration.'}}
  function finishAudio(){
    speaking=false;add(state.audioCompleted,module().id);$('audioStatus').textContent='Narration complete. Knowledge check unlocked.';$('audioProgressBar').style.width='100%';persist();updateGate();
  }
  function submitCheck(){
    const q=MODULE_CHECKS[module().id], selected=document.querySelector('input[name="moduleAnswer"]:checked');
    if(!selected){$('moduleCheckResult').textContent='Choose an answer first.';return}
    if(+selected.value===q.a){add(state.checksPassed,module().id);$('moduleCheckResult').innerHTML='<strong class="success">Correct. You may now acknowledge the policy.</strong>';persist();updateGate()}
    else $('moduleCheckResult').innerHTML='<strong class="error">Not quite. Review the policy and try again.</strong>';
  }
  async function completeModule(){
    if(!$('ackCheck').checked)return;add(state.completed,module().id);if(state.completed.length===data.length&&!state.completedAt)state.completedAt=new Date().toISOString();await persist();renderNav();updateProgress();updateGate();
  }
  function openExam(){
    stopSpeech(false);showOnly('finalAssessment');const unlocked=state.completed.length===data.length;$('examLocked').hidden=unlocked;$('quizArea').hidden=!unlocked;$('examIntro').textContent=unlocked?'Answer all questions. A score of 80% or higher is required.':'Complete every module narration, knowledge check and acknowledgement before the exam unlocks.';
  }
  async function submitQuiz(){
    let score=0,answered=0;QUIZ_QUESTIONS.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(a){answered++;if(+a.value===q.a)score++}});
    if(answered<QUIZ_QUESTIONS.length){$('quizResult').textContent=`Please answer all ${QUIZ_QUESTIONS.length} questions.`;return}
    const percent=Math.round(score/QUIZ_QUESTIONS.length*100);state.quizAttempts=(state.quizAttempts||0)+1;state.quizScore=Math.max(state.quizScore||0,percent);
    if(percent>=80&&!state.completedAt)state.completedAt=new Date().toISOString();await persist();$('quizResult').textContent=percent>=80?`Passed: ${percent}%. Your certificate is unlocked.`:`Score: ${percent}%. Review the policies and try again. You need 80% to pass.`;updateProgress();if(percent>=80){$('certificateSection').hidden=false;$('certificateSection').scrollIntoView({behavior:'smooth'})}
  }
  async function enterCourse(mode){
    demoMode=mode==='demo';$('loginOverlay').hidden=true;$('signOutBtn').textContent=demoMode?'Exit demo':'Sign out';$('saveModeText').textContent=demoMode?'Progress is saved only in this browser.':'Progress is saved to your employee record.';$('signedInAs').textContent=demoMode?'Demo mode':(ETRTracker.user?.email||state.email||'Signed in');
    setupCertificate(state);renderNav();updateProgress();
  }
  async function authenticate(kind){
    const name=$('loginName').value.trim(),email=$('loginEmail').value.trim(),password=$('loginPassword').value;
    if(!name||!email||password.length<6){$('loginMessage').textContent='Enter your full name, work email and a password of at least 6 characters.';return}
    if(!ETRTracker.configured){$('loginMessage').textContent='Firebase is not configured yet. Use local demo mode or complete the setup steps in README.md.';return}
    try{
      $('loginMessage').textContent='Connecting…'; if(kind==='signup')await ETRTracker.signUp(email,password);else await ETRTracker.signIn(email,password);
      const cloud=await ETRTracker.loadProgress();mergeCloud(cloud);state.employeeName=name||state.employeeName;state.email=email;await persist();await enterCourse('cloud');
    }catch(e){$('loginMessage').textContent=(e.code==='auth/email-already-in-use'?'That email already has an account. Use Sign in.':e.message.replace('Firebase:','').trim())}
  }
  async function init(){
    renderQuiz();speechSynthesis.onvoiceschanged=loadVoices;loadVoices();
    try{const result=await ETRTracker.init();if(result.user){const cloud=await ETRTracker.loadProgress();mergeCloud(cloud);await enterCourse('cloud')}}catch(e){$('loginMessage').textContent='Cloud tracking is unavailable. Local demo mode is still available.'}
  }
  $('signInBtn').onclick=()=>authenticate('signin');$('signUpBtn').onclick=()=>authenticate('signup');$('demoBtn').onclick=()=>{state.employeeName=$('loginName').value.trim()||state.employeeName;enterCourse('demo')};
  $('signOutBtn').onclick=async()=>{stopSpeech(false);if(!demoMode)await ETRTracker.signOut();location.reload()};
  $('startBtn').onclick=()=>{const i=data.findIndex(m=>!has(state.completed,m.id));openModule(i<0?0:i)};$('closeModule').onclick=()=>{stopSpeech(false);showOnly('welcome')};
  $('openExamBtn').onclick=openExam;$('examNavBtn').onclick=openExam;$('closeExam').onclick=()=>showOnly('welcome');$('submitQuiz').onclick=submitQuiz;
  $('prevBtn').onclick=()=>openModule(current-1);$('nextBtn').onclick=()=>current<data.length-1?openModule(current+1):openExam();$('submitModuleCheck').onclick=submitCheck;
  $('ackCheck').onchange=updateGate;$('completeBtn').onclick=completeModule;$('playBtn').onclick=startAudio;
  $('pauseBtn').onclick=()=>{if(!speaking)return;if(speechSynthesis.paused){speechSynthesis.resume();paused=false;$('audioStatus').textContent=`Playing section ${chunkIndex+1} of ${chunks.length}`}else{speechSynthesis.pause();paused=true;$('audioStatus').textContent='Paused'}};
  $('stopBtn').onclick=()=>stopSpeech(true);$('expandBtn').onclick=()=>{const p=$('policyContent');p.classList.toggle('expanded');$('expandBtn').textContent=p.classList.contains('expanded')?'Collapse':'Expand all'};
  $('themeBtn').onclick=()=>document.body.classList.toggle('dark');$('menuBtn').onclick=()=>$('sidebar').classList.toggle('open');
  $('searchInput').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.nav-item').forEach((b,i)=>b.hidden=!(data[i].title+' '+data[i].text).toLowerCase().includes(q))};
  init();
})();

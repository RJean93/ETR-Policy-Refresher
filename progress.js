window.ProgressStore = (() => {
  const key = 'etrPolicy2025Tracked';
  const blank = () => ({
    employeeName: '', email: '', completed: [], audioCompleted: [], checksPassed: [],
    quizScore: 0, quizAttempts: 0, startedAt: new Date().toISOString(), completedAt: '',
    lastUpdated: new Date().toISOString(), certificateId: ''
  });
  function normalize(raw){
    return Object.assign(blank(), raw || {}, {
      completed: Array.isArray(raw?.completed) ? raw.completed : [],
      audioCompleted: Array.isArray(raw?.audioCompleted) ? raw.audioCompleted : [],
      checksPassed: Array.isArray(raw?.checksPassed) ? raw.checksPassed : []
    });
  }
  return {
    load(){ try { return normalize(JSON.parse(localStorage.getItem(key))); } catch { return blank(); } },
    save(state){ state.lastUpdated = new Date().toISOString(); localStorage.setItem(key, JSON.stringify(state)); },
    reset(){ localStorage.removeItem(key); },
    blank
  };
})();

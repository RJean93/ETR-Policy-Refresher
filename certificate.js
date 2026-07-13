window.setupCertificate = function(state){
  const nameInput=document.getElementById('employeeName');
  const nameDisplay=document.getElementById('certNameDisplay');
  const date=document.getElementById('certDate');
  const id=document.getElementById('certId');
  nameInput.value=state.employeeName||'';
  function refresh(){
    state.employeeName=nameInput.value.trim();
    nameDisplay.textContent=state.employeeName||'Employee Name';
    date.textContent=new Date().toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'});
    id.textContent=state.certificateId?`Certificate ID: ${state.certificateId}`:'';
    ProgressStore.save(state);
  }
  nameInput.addEventListener('input',refresh);
  document.getElementById('printCert').addEventListener('click',()=>{refresh();window.print()});
  refresh();
};

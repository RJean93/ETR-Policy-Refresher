window.QUIZ_QUESTIONS=[
{q:'Who shares responsibility for workplace health and safety at ETR?',o:['Management only','The workplace committee only','Everyone in the workplace','Outside regulators only'],a:2},
{q:'What are the three basic worker rights described by the Internal Responsibility System?',o:['Know, participate and refuse dangerous work','Train, supervise and discipline','Inspect, report and repair','Stop, look and listen'],a:0},
{q:'Who acts as the designated recipient for harassment and violence notices?',o:['Any co-worker','The HR Manager/designated recipient identified in policy','A customer','Police only'],a:1},
{q:'Within how many days should the designated recipient respond to a notice of occurrence?',o:['2 days','7 days','30 days','60 days'],a:1},
{q:'When should emergency services be called for an immediate threat of violence?',o:['Only after the shift','As soon as safely possible','After completing paperwork','Never'],a:1},
{q:'What must an employee do when refusing dangerous work?',o:['Leave without telling anyone','Follow the prescribed work-refusal procedure','Post about it online','Continue the work regardless'],a:1},
{q:'Fatigue management is best described as whose responsibility?',o:['Only the employee','Only the scheduler','A shared responsibility','Only the union'],a:2},
{q:'May a communication device be used while driving contrary to law or company policy?',o:['Yes, briefly','Only for personal calls','No','Only at night'],a:2},
{q:'What should be done when a sharp is found?',o:['Pick it up barehanded','Use the approved sharps procedure and container','Put it in regular garbage','Leave it without reporting'],a:1},
{q:'Employees must report fit for duty and free from what?',o:['All medication','Impairment','Coffee','Fatigue concerns'],a:1},
{q:'What is required upon hearing an evacuation signal?',o:['Finish the task first','Shut down safely, evacuate and report to the assembly area','Drive home','Wait for a text'],a:1},
{q:'Who must be accounted for at an evacuation assembly area?',o:['Employees only','Managers only','Employees, visitors and contractors','No one'],a:2},
{q:'WHMIS training helps employees understand what?',o:['Payroll systems','Hazardous products, labels and safety data sheets','Vacation scheduling','Customer service'],a:1},
{q:'Hazards should be reported to whom?',o:['A supervisor or manager','Only a family member','The public','No one'],a:0},
{q:'Personal protective equipment must be used when?',o:['Only when convenient','As required by policy, task and hazard assessment','Only during inspections','Only by new workers'],a:1},
{q:'Who may operate lifting devices, MEWPs or forklifts?',o:['Any visitor','Only trained and authorized workers','Anyone with a driver licence','Customers'],a:1},
{q:'Fall protection must be selected based on what?',o:['Personal preference','The identified fall hazard and applicable procedure','Weather only','Seniority'],a:1},
{q:'Why are incidents investigated?',o:['To assign blame only','To identify causes and prevent recurrence','To delay work','For publicity'],a:1},
{q:'Entry into a confined space requires what?',o:['No preparation','Authorization, assessment and required controls','Only a flashlight','A verbal promise'],a:1},
{q:'Hearing protection must be worn when?',o:['Noise exposure and posted requirements call for it','Only outside','Only once a year','Never'],a:0}
];
window.renderQuiz=function(){const c=document.getElementById('quizContainer');c.innerHTML=QUIZ_QUESTIONS.map((x,i)=>`<fieldset class="question"><legend>${i+1}. ${x.q}</legend>${x.o.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}</fieldset>`).join('')};
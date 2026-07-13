window.ProgressStore={
  key:'etrPolicy2025',
  load(){
    try{
      const saved=JSON.parse(localStorage.getItem(this.key))||{};
      return {completed:saved.completed||[],moduleChecks:saved.moduleChecks||{},quizScore:saved.quizScore||0,name:saved.name||''};
    }catch(e){return{completed:[],moduleChecks:{},quizScore:0,name:''}}
  },
  save(s){localStorage.setItem(this.key,JSON.stringify(s))},
  reset(){localStorage.removeItem(this.key)}
};

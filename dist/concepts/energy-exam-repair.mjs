import {createEnergyFault,actEnergyFault} from './energy-faults.mjs';
export function createExamRepair(exam,index){
 if(exam.status!=='finished'||!exam.cases[index])throw Error('Termina el examen antes de reparar.');
 const c=exam.cases[index],s=createEnergyFault(c.lab,()=>0,c.level);
 s.faults=[...c.faults];s.fault=s.faults[0];s.diagnosedIds=[...s.faults];s.diagnosed=true;
 s.sourceExam=exam.id;s.sourceCase=index;
 return {state:s,index};
}
export function applyExamRepair(repair,action,choice){
 if(!['repair','hint','verify'].includes(action))throw Error('Acción no válida');
 return actEnergyFault(repair.state,action,choice);
}

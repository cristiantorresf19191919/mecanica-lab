import {createEnergyFault,faultCatalog} from './energy-faults.mjs';
import {nextEnergyReview} from './energy-adaptive.mjs';
export function createEnergyExam(rows,random=Math.random){return {id:crypto.randomUUID(),date:new Date().toISOString(),status:'active',answers:[],cases:Object.keys(faultCatalog).map(lab=>createEnergyFault(lab,random,nextEnergyReview(rows,lab).level))};}
export function examCorrect(c,answer){return Array.isArray(answer)&&answer.length===c.faults.length&&c.faults.every(f=>answer.includes(f));}
export function finishEnergyExam(exam,store){if(exam.answers.length!==3)return false;exam.status='finished';exam.finishedAt??=new Date().toISOString();exam.cases.forEach((c,i)=>{const ok=examCorrect(c,exam.answers[i]);store.save({...c,id:exam.id+':'+i,done:true,finishedAt:exam.finishedAt,errors:ok?0:1,hints:0,events:ok?[]:[{action:'exam',wrong:true,targets:c.faults}],exam:true,examScore:ok?100:0});});return true;}

import assert from 'node:assert/strict';
import {createEnergyExam,finishEnergyExam} from '../dist/concepts/energy-exam-model.mjs';
import {createEnergyExamHistory,energyExamScore,energyMastery} from '../dist/concepts/energy-exam-history.mjs';
let text='[]';const storage={getItem:()=>text,setItem:(k,v)=>{text=v;}};const h=createEnergyExamHistory(storage);
for(let i=0;i<3;i++){const e=createEnergyExam([],()=>0);e.answers=e.cases.map(c=>[...c.faults]);finishEnergyExam(e,{save(){}});h.add(e);h.add(e);e.answers[0]=[];}
assert.equal(h.all().length,3);assert.equal(energyExamScore(h.all()[0]),100);assert(energyMastery(h.all()).every(x=>x.status==='Aciertos consistentes'));assert.equal(createEnergyExamHistory(storage).all().length,3);
for(let i=0;i<52;i++){const e=createEnergyExam([],()=>.9);e.answers=e.cases.map(c=>c.faults);finishEnergyExam(e,{save(){}});h.add(e);}assert.equal(h.all().length,50);
const bad=createEnergyExamHistory({getItem(){throw Error()},setItem(){throw Error()}});bad.add(h.all()[0]);assert(bad.warning());assert.equal(bad.all().length,1);
console.log('PASS immutable snapshots, ID dedupe, score, per-cause consistency, reload, 50 exam cap and fallback.');

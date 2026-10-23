import assert from 'node:assert/strict';
import {createEnergyExam,finishEnergyExam,examCorrect} from '../dist/concepts/energy-exam-model.mjs';
import {createEnergyResults} from '../dist/concepts/energy-results.mjs';
import {createEnergySpacing} from '../dist/concepts/energy-spacing.mjs';
let data='[]';const storage={getItem:()=>data,setItem:(k,v)=>{data=v;}};const store=createEnergyResults(storage),e=createEnergyExam([],()=>0);assert.equal(e.cases.length,3);assert.equal(finishEnergyExam(e,store),false);
e.answers=e.cases.map(c=>[...c.faults]);e.answers[0]=['invalid'];finishEnergyExam(e,store);finishEnergyExam(e,store);assert.equal(store.all().length,3);assert.deepEqual(store.all().map(r=>r.score),[0,100,100]);assert.equal(examCorrect(e.cases[0],[]),false);
const spacing=createEnergySpacing({getItem:()=>null,setItem(){}});spacing.sync(store.all());assert.equal(Object.values(spacing.snapshot().days)[0].count,2);assert.equal(createEnergyResults(storage).all().length,3);
console.log('PASS three-lab coverage, completion gate, exact scoring, deduplication, persistence and failed exams excluded from daily goals.');

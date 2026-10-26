import assert from 'node:assert/strict';
import {createWorkshop,snapshot,required,answers,measureWorkshop,diagnoseWorkshop,repairWorkshop,verifyWorkshop} from '../dist/learn/workshop-model.mjs';
import {alternate,expectedReading,challengeScore,loadResults,saveResult,historyKey} from '../dist/learn/workshop-challenges.mjs';
for(const kind of Object.keys(required))for(const fault of ['primary','alternate']){
 const s=createWorkshop(kind);s.fault=fault;const before=snapshot(s,false,.5),normal=snapshot(s,true,.5);assert.notDeepEqual(before,normal);
 const answer=fault==='alternate'?alternate[kind].answer:answers[kind];assert.equal(diagnoseWorkshop(s,answer),'evidence');
 for(const id of required[kind]){measureWorkshop(s,id);assert.equal(typeof expectedReading(kind,fault,id),'boolean');}
 assert.equal(diagnoseWorkshop(s,fault==='alternate'?answers[kind]:alternate[kind].answer),'wrong');assert.equal(diagnoseWorkshop(s,answer),'diagnosed');assert.ok(repairWorkshop(s));assert.equal(verifyWorkshop(s),false);for(const id of required[kind])measureWorkshop(s,id);assert.ok(verifyWorkshop(s));
 for(let i=0;i<800;i++)assert.deepEqual(snapshot(s,false,i/100),snapshot(s,true,i/100));
}
assert.equal(expectedReading('mechanics','alternate','ground'),false);assert.equal(expectedReading('hydraulics','alternate','leak'),false);assert.equal(expectedReading('pneumatics','alternate','supply'),true);
assert.equal(challengeScore({wrongDiagnosis:1,readings:[{correct:false}],hints:2}),59);assert.equal(challengeScore({wrongDiagnosis:10,readings:[],hints:2}),0);
const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};assert.deepEqual(loadResults(storage),[]);data.set(historyKey,'garbage');assert.deepEqual(loadResults(storage),[]);
const row={id:'one',kind:'mechanics',fault:'alternate',date:new Date().toISOString(),score:59,wrongDiagnosis:1,hints:2,readings:[{id:'ground',correct:false}]};saveResult(storage,row);saveResult(storage,row);assert.equal(loadResults(storage).length,1);for(let i=0;i<205;i++)saveResult(storage,{...row,id:'r'+i});assert.equal(loadResults(storage).length,200);assert.equal(loadResults(storage).at(-1).id,'r204');
console.log('PASS eight fault scenarios, evidence/repair gates, interpretation expectations, scoring, bounded storage and duplicate protection');

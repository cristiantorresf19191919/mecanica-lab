import assert from 'node:assert/strict';
import {createWorkshop,snapshot,required,faultModes,sampleTimes,correctDiagnosis,measureWorkshop,diagnoseWorkshop,repairWorkshop,verifyWorkshop} from '../dist/learn/workshop-model.mjs';
import {expectedReading,saveResult,loadResults} from '../dist/learn/workshop-challenges.mjs';
import {adaptivePlan} from '../dist/learn/workshop-adaptive.mjs';
const row=(kind,fault='primary',score=100,i=0)=>({id:String(i),kind,fault,score,date:new Date().toISOString(),wrongDiagnosis:0,hints:0,readings:required[kind].map(id=>({id,correct:true}))});
for(const kind of Object.keys(required)){
 assert.equal(adaptivePlan([],kind).level,1);
 const basic=[0,1,2].map(i=>row(kind,'primary',100,i));assert.equal(adaptivePlan(basic,kind).level,2);
 const advanced=[0,1,2].map(i=>row(kind,'combined',100,i+3));assert.equal(adaptivePlan([...basic,...advanced],kind).level,3);
 assert.equal(adaptivePlan([...basic,...advanced,...[0,1,2].map(i=>row(kind,'combined',30,i+6))],kind).level,1);
 for(const fault of faultModes){const s=createWorkshop(kind);s.fault=fault;assert.equal(diagnoseWorkshop(s,correctDiagnosis(s)),'evidence');
  for(const time of sampleTimes(s))for(const id of required[kind]){s.sampleTime=time;measureWorkshop(s,id);}
  if(fault.startsWith('intermittent')){assert.equal(expectedReading(kind,fault,required[kind][0],.5),false);const a=snapshot(s,false,.5),b=snapshot(s,false,1.25);assert.ok(required[kind].some(id=>expectedReading(kind,fault,id,1.25)));assert.notDeepEqual(a,b);
   for(const edge of [.75,1.75,2.75,3.75,4.75]){const before=snapshot(s,false,edge-1e-6),after=snapshot(s,false,edge+1e-6);if(kind==='mechanics')assert.ok(Math.abs(after.turns-before.turns)<.001);if(['hydraulics','pneumatics'].includes(kind))assert.ok(Math.abs(after.position-before.position)<.001);}}
  assert.equal(diagnoseWorkshop(s,correctDiagnosis(s)),'diagnosed');assert.ok(repairWorkshop(s));for(const id of required[kind]){s.sampleTime=.5;measureWorkshop(s,id);}if(sampleTimes(s).length===2)assert.equal(verifyWorkshop(s),false);for(const time of sampleTimes(s))for(const id of required[kind]){s.sampleTime=time;measureWorkshop(s,id);}assert.ok(verifyWorkshop(s));for(let i=0;i<800;i++)assert.deepEqual(snapshot(s,false,i/100),snapshot(s,true,i/100));
 }
}
const weak=[{...row('mechanics'),wrongDiagnosis:2,readings:[{id:'ground',correct:false},{id:'battery',correct:true}]}];const plan=adaptivePlan(weak,'mechanics');assert.equal(plan.focus,'ground');assert.ok(plan.primaryWeight>plan.alternateWeight);assert.equal(adaptivePlan(weak,'electronics').recentCount,0);
const combined={kind:'hydraulics',fault:'combined',time:.5};assert.equal(snapshot(combined).useful,0);assert.equal(snapshot(combined).position,0);const pneu=snapshot({kind:'pneumatics',fault:'combined',time:.5});assert.ok(pneu.force<0);assert.equal(pneu.speed,0);
const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};for(const [i,fault]of faultModes.entries())saveResult(storage,row('hydraulics',fault,100,i));assert.equal(loadResults(storage).length,5);
console.log('PASS 20 scenarios, progression/regression, weak-skill weighting, legacy/advanced history, two-time evidence, continuous motion, combined stalls and full-period repair verification');

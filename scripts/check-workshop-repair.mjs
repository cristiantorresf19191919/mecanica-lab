import assert from 'node:assert/strict';
import {newRepair,repairState,repairScore,intervene,captureRepair,verifyRepair,causes} from '../dist/learn/workshop-repair-model.mjs';
import {required,sampleTimes,faultModes,snapshot} from '../dist/learn/workshop-model.mjs';
for(const kind of Object.keys(required))for(const fault of faultModes)for(const order of [['primary','alternate'],['alternate','primary']]){
 const original={kind,fault},before=JSON.stringify(original),r=newRepair(original);
 assert.equal(verifyRepair(r),'missing');assert.equal(repairScore(r),100);
 const measure=()=>{for(const id of required[kind])for(const time of sampleTimes(r))captureRepair(r,id,time);};
 measure();assert.equal(verifyRepair(r),'remaining');
 for(const id of order.filter(x=>causes(r).includes(x))){assert.ok(intervene(r,id));assert.equal(r.readings.length,0);measure();if(r.fixed.length<causes(r).length)assert.equal(verifyRepair(r),'remaining');}
 assert.equal(verifyRepair(r),'verified');assert.equal(JSON.stringify(original),before);
 assert.deepEqual(snapshot({...repairState(r),time:1.25}),snapshot({...repairState(r),time:1.25},true));
 const score=repairScore(r);verifyRepair(r);assert.equal(repairScore(r),score);
}
const r=newRepair({kind:'mechanics',fault:'intermittent-primary'});assert.equal(intervene(r,'alternate'),false);r.hints++;assert.equal(repairScore(r),80);captureRepair(r,'battery',.5);captureRepair(r,'ground',.5);assert.equal(verifyRepair(r),'missing');assert.equal(captureRepair(r,'bogus',1),false);
console.log('PASS all four workshops, five fault modes, either repair order, partial repairs, post-repair evidence, full-cycle checks, scoring and exam immutability');

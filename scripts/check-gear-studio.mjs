import assert from 'node:assert/strict';
import {ratio,observation,config} from '../dist/studio/config.mjs';
for(const k of [0,1,2,3,4,5])for(const en of [true,false])for(const [v] of config(k,0,en)[1].entries()){
 assert.ok(Number.isFinite(ratio(k,v)));assert.ok(observation(k,v,en).every(Boolean));
}
assert.equal(ratio(1,1),-.5);for(let i=0;i<3;i++)assert.equal(ratio(2,i),.5);
assert.equal(ratio(3,1),1/6);
for(const v of [0,1]){const q=ratio(4,v),c=v?0:q,r=v?q:0;assert.equal(18*(1-c)+54*(r-c),0)}
assert.equal(ratio(5,0),0);assert.equal(ratio(5,1),-1/3);assert.equal(ratio(5,4),-5/3);
console.log('PASS: gear ratios, idler independence, compounded reduction, planetary constraints and gear selection');

const {shift,steps}=await import('../dist/studio/shift.mjs');
for(let g=0;g<=4;g++)for(let step=0;step<steps.length;step++){
 const s=shift(g,step);assert.equal(s.torque!==0,!!g&&step>=3);
 if(g&&step===2)assert.ok(s.locked&&!s.closed);
 if(s.loaded)assert.ok(Math.abs(Math.abs(s.output)*s.torque-6)<1e-10);
}

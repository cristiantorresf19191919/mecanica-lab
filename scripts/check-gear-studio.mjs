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

const {sample}=await import('../dist/studio/upshift.mjs');
for(let j=1;j<3200;j++){const t=j/1000,f=sample(t);if(f.locked===2)assert.ok(f.delta<1e-8);
 for(const k of ['engine','input']){const w=(sample(t+.00001)[k].angle-sample(t-.00001)[k].angle)/.00002;assert.ok(Math.abs(w*30/Math.PI-f[k].rpm)<.01)}}
assert.equal(sample(.9).delta,240);assert.equal(sample(1.4).delta,120);assert.equal(sample(1.9).locked,0);assert.equal(sample(2.15).locked,2);assert.equal(sample(3.2).engine.rpm,500);

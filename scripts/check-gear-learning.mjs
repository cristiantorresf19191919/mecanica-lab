import assert from 'node:assert/strict';
import {readings} from '../dist/studio/gear-learning-model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
for(const stage of [1,2,3,4,5])for(let v=0;v<(stage===5?5:stage===3||stage===4?2:3);v++){
 const r=readings(stage,v,120,6,.8);
 if(r.q){near(r.out*r.speed*Math.PI/30,r.power*.8);near(r.delivered+r.loss,r.power)}else {assert.equal(r.out,0);assert.equal(r.delivered,0)}
}
near(readings(1,1,120,6).force,1000/3);near(readings(1,1,120,6).out,12);near(readings(3,1,120,6).speed,20);near(readings(4,0,120,6).speed,30);
assert.equal(readings(5,1,120,6,1,100).canLift,true);assert.equal(readings(5,4,120,6,1,100).canLift,false);
console.log('PASS: gear learning power balance, force, reductions, neutral and load margin');

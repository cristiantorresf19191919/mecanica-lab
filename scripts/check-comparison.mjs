import {changedParts} from '../dist/machines/comparison-highlights.mjs';
import assert from 'node:assert/strict';
import {buildComparison,differences,propagationSteps} from '../dist/machines/comparison-model.mjs';
for(const kind of ['pressure','jam','sensor']){
 const e=buildComparison(kind);assert(e.first>0);assert(e.alarm>=e.first);assert(e.frames.at(-1).normal.complete);assert(e.frames.at(-1).fault.fault);
 for(const [i,p]of e.frames.entries()){assert.equal(p.normal.time,p.fault.time);if(i<e.first)assert.equal(differences(p.normal,p.fault).length,0);}
 assert(differences(e.frames[e.first].normal,e.frames[e.first].fault).length);
 assert.equal(e.frames[e.alarm].fault.q,false);assert.equal(e.frames[e.alarm].fault.qB,false);
 if(kind==='jam')assert(e.alarm>e.first);
 if(kind==='sensor'){assert(e.frames.some(p=>p.fault.x===1&&!p.fault.i1));assert(e.frames.some(p=>p.fault.x===1&&p.fault.i1));}
 console.log('PASS',kind,'first',e.first*.02,'alarm',e.alarm*.02);
}

const sensorSteps=propagationSteps(buildComparison('sensor'));
assert(sensorSteps.every((s,i)=>!i||s.index>=sensorSteps[i-1].index));
assert(sensorSteps.find(s=>s.title==='Cambian las salidas').text.includes('Todavía no hay alarma'));
for(const kind of ['pressure','jam','sensor']){const e=buildComparison(kind);for(const s of propagationSteps(e))assert(s.index>=0&&s.index<e.frames.length);}
console.log('PASS propagation milestones follow measured scans; normal output divergence precedes sensor timeout.');

const sensorExperiment=buildComparison('sensor'),pair=sensorExperiment.frames[sensorExperiment.first];
assert.deepEqual(changedParts(pair.normal,pair.normal),[]);
assert.deepEqual(changedParts(pair.normal,pair.fault),['sensor_i1']);
console.log('PASS exact sensor highlighting without unrelated piston/valve highlights.');

import assert from 'node:assert/strict';
import {createShift,shiftAct} from '../dist/bikes/shift-model.mjs';
import {replaySample,oppositeSample} from '../dist/bikes/shift-replay.mjs';
const s=createShift('intermittent');for(const g of [0,1,2,3,4,5,6,5,4,3,2,1,0])shiftAct(s,'select',null,g);
const i=s.trace.findIndex(t=>t.drag&&t.gear>1&&t.gear<7),old=replaySample(s.trace,i);assert(old.model.cableDrag);const pair=oppositeSample(s.trace,i);assert(pair>=0);assert.equal(s.trace[pair].gear,s.trace[i].gear);assert.equal(s.trace[pair].direction,-s.trace[i].direction);
const original=JSON.stringify(s);old.model.position=999;assert.notEqual(replaySample(s.trace,i).model.position,999);assert.equal(JSON.stringify(s),original);shiftAct(s,'inspect','cable');shiftAct(s,'repair','cable');assert(!s.intermittent);assert(replaySample(s.trace,i).model.cableDrag);for(const g of [1,2,3])shiftAct(s,'select',null,g);assert.equal(oppositeSample(s.trace,s.trace.length-1),-1);assert.equal(replaySample([{position:0}],0),null);assert.equal(replaySample(s.trace,-1),null);console.log('PASS immutable snapshots, historical fault after repair, same-revision opposite pairing and missing-snapshot guards');

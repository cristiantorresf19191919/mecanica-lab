import assert from 'node:assert/strict';
import {createShift,shiftAct,shiftState} from '../dist/bikes/shift-model.mjs';
import {cableComparison} from '../dist/bikes/shift-replay.mjs';
const s=createShift('intermittent');
for(const g of [0,1,2,3,4,5,6,5,4,3,2,1,0])shiftAct(s,'select',null,g);
for(const t of s.trace){const p=cableComparison(t.snapshot);assert.equal(p.healthy.cableDrag,false);assert.equal(p.healthy.position,t.gear-1);if(!t.drag)assert.equal(p.delta,0);else if(t.gear>1&&t.gear<7)assert(Math.abs(p.delta+t.direction*.35)<1e-9);}
const original=JSON.stringify(s),t=s.trace.find(t=>t.drag&&t.gear===2);cableComparison(t.snapshot).healthy.position=99;assert.equal(JSON.stringify(s),original);
shiftAct(s,'inspect','cable');shiftAct(s,'repair','cable');assert(!shiftState(s).cableDrag);assert(cableComparison(t.snapshot).actual.cableDrag);
s.trim=.4;s.h=.5;s.l=5.6;s.hanger=true;shiftAct(s,'select',null,2);const last=s.trace.at(-1);assert.equal(last.snapshot.healthy.position,shiftState({...s,sticky:false,intermittent:false}).position);assert.equal(cableComparison({}),null);
console.log('PASS bidirectional drag, clear phases, limits, immutable historical reference and retained calibration');

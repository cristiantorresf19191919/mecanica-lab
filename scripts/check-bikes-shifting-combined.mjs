import assert from 'node:assert/strict';
import {createShift,combinedShiftCases,shiftAct,shiftState,shiftHintAvailable,shiftScore} from '../dist/bikes/shift-model.mjs';
const inspectAll=s=>{for(const k of ['b','hanger','cable'])shiftAct(s,'inspect',k);shiftAct(s,'test','h');shiftAct(s,'test','l');for(let g=0;g<7;g++)shiftAct(s,'select',null,g);};
for(let i=0;i<combinedShiftCases.length;i++){
 const s=createShift('combined',()=>i/combinedShiftCases.length+.001);assert.deepEqual(s.causes,combinedShiftCases[i]);assert(s.causes.length>=2);const original=[...s.causes];shiftAct(s,'hint');assert.equal(shiftAct(s,'hint'),false);assert.equal(s.hints,1);
 for(const [key,field]of [['cable','sticky'],['hanger','hanger']])if(s[field]){shiftAct(s,'inspect',key);shiftAct(s,'repair',key);}
 for(const [key,target]of [['b',1],['h',0],['l',6],['trim',0]])while(Math.abs(s[key]-target)>.01)shiftAct(s,'adjust',key,s[key]<target?1:-1);
 inspectAll(s);shiftAct(s,'verify');assert(s.done);assert.equal(shiftScore(s),90);assert.deepEqual(s.causes,original);assert.equal(shiftAct(s,'repair','hanger'),false);
}
for(const first of ['hanger','cable']){const s=createShift('combined',()=>0);shiftAct(s,'hint');shiftAct(s,'inspect',first);shiftAct(s,'repair',first);const remaining=first==='hanger'?'sticky':'hanger';assert(s[remaining]);inspectAll(s);shiftAct(s,'verify');assert(!s.done);assert.equal(s.events.find(e=>e.repair).remaining[0],remaining);if(first==='cable'){assert(shiftHintAvailable(s));shiftAct(s,'hint');assert.equal(s.hints,2);}assert.equal(shiftState(s).hangerAngle>0,s.hanger);assert.equal(shiftState(s).cableDrag,s.sticky);}
const s=createShift('combined',()=>0);shiftAct(s,'select',null,2);shiftAct(s,'select',null,3);const up=shiftState(s).position;shiftAct(s,'select',null,4);shiftAct(s,'select',null,3);assert.notEqual(up,shiftState(s).position);console.log('PASS all combined cases, independent repairs in both orders, residual faults, progressive hints, immutable initial causes, full verification and score');

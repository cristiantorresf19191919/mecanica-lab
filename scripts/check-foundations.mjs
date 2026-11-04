import assert from 'node:assert/strict';import {tracks} from '../dist/learn/content.mjs';import {foundations} from '../dist/foundations/content.mjs';import {state} from '../dist/foundations/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
assert.equal(Object.keys(foundations).length,20);
for(const tr of tracks)for(const lesson of tr.lessons){const d=foundations[lesson.id];assert.ok(d);for(const key of ['idea','action','observe','real'])for(const lang of ['en','es'])assert.ok(d[key][lang].length>20);for(const position of [0,.25,.5,.75,1])for(const bound of ['min','value','max']){const m=state(lesson.id,d.controls.map(c=>c[bound]),position);assert.ok(m.read.length);for(const r of m.read)assert.ok(Number.isFinite(r.value),lesson.id+': '+r.en);}}
near(state('torque',[100,.25,90],0).torque,25);near(state('torque',[100,.25,0],0).torque,0);
near(state('ohm',[12,1000],0).current,.012);near(state('rectifier',[12,.7],.25).output,10.6);near(state('rectifier',[12,.7],.75).output,10.6);near(state('opamp',[3,5],.25).output,12);
near(state('threephase',[50,4],.2).currents.reduce((a,b)=>a+b),0);
let press=state('pascal',[20,4],1);near(press.inputMM,press.outputMM*4);near(press.outputForce,80);
near(state('flow',[6,20],.2).speed,5);near(state('flow',[6,40],.2).speed,2.5);
let relief=state('relief',[70,60],.4);near(relief.returnFlow+relief.cylinderFlow,6);assert.ok(relief.opening>0);
near(state('air',[.5],0).absolute,4);near(state('air',[.5],0).gauge,3);
assert.ok(state('cylinderforce',[4,0],.1).force>state('cylinderforce',[4,0],.6).force);assert.ok(state('pneudiagnosis',[4,3],.1).force<state('pneudiagnosis',[4,0],.1).force);
near(state('airchain',[2,4,0],.1).gaugePressure,2);
console.log('PASS: all 20 bilingual foundations, boundary readings, conservation and causal experiments');

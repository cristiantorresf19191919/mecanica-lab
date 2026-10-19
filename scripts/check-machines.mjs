import assert from 'node:assert/strict';
import {engineState,pressState,motorState,windingLayout} from '../dist/machines/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
for(const l of [1.6,1.85,1.95])for(let i=0;i<=1000;i++){const m=engineState(i/1001,.55,l);near(Math.hypot(m.pin[0],m.pistonY-m.pin[1]),l);assert.ok(m.pistonY+.25<4.08);assert.ok(m.intake>=-1e-12&&m.exhaust>=-1e-12);if(m.phase!==0)near(m.intake,0);if(m.phase!==3)near(m.exhaust,0)}
for(const r of [1,2,4,8])for(const f of [10,20,100])for(let i=0;i<100;i++){const m=pressState(i/100,f,r);near(m.inputMM,m.outputMM*r);near(f*m.inputMM,m.outputForce*m.outputMM);near((m.outputRadius/.48)**2,r);near(m.pressure,f/2e-4)}
for(const f of [10,50,80])for(const s of [0,4,15]){const m=motorState(1,f,s);near(m.nr,m.ns*(1-s/100));near(m.rotorAngle,m.fieldAngle*(1-s/100));near(m.currents.reduce((a,b)=>a+b),0)}
console.log('PASS: slider-crank constraint and clearance; valve timing; hydraulic volume, work and radii; rotor/field slip and balanced currents.');

for(let t=0;t<2;t+=.013){const m=motorState(t,50,4);const v=windingLayout.reduce((v,p)=>[v[0]+p.sign*m.currents[p.phase]*Math.cos(p.angle),v[1]+p.sign*m.currents[p.phase]*Math.sin(p.angle)],[0,0]);near(v[0],3*Math.cos(m.fieldAngle));near(v[1],3*Math.sin(m.fieldAngle));}
console.log("PASS: winding positions and current polarity agree with rotating field direction.");

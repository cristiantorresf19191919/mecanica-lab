import assert from 'node:assert/strict';
import {engineState,pressState,motorState,windingLayout} from '../dist/machines/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
for(const l of [1.6,1.85,1.95])for(let i=0;i<=1000;i++){const m=engineState(i/1001,.55,l);near(Math.hypot(m.pin[0],m.pistonY-m.pin[1]),l);assert.ok(m.pistonY+.25<4.08);assert.ok(m.intake>=-1e-12&&m.exhaust>=-1e-12);if(m.phase!==0)near(m.intake,0);if(m.phase!==3)near(m.exhaust,0)}
for(const r of [1,2,4,8])for(const f of [10,20,100])for(let i=0;i<100;i++){const m=pressState(i/100,f,r);near(m.inputMM,m.outputMM*r);near(f*m.inputMM,m.outputForce*m.outputMM);near((m.outputRadius/.48)**2,r);near(m.pressure,f/2e-4)}
for(const f of [10,50,80])for(const s of [0,4,15]){const m=motorState(1,f,s);near(m.nr,m.ns*(1-s/100));near(m.rotorAngle,m.fieldAngle*(1-s/100));near(m.currents.reduce((a,b)=>a+b),0)}
console.log('PASS: slider-crank constraint and clearance; valve timing; hydraulic volume, work and radii; rotor/field slip and balanced currents.');

for(let t=0;t<2;t+=.013){const m=motorState(t,50,4);const v=windingLayout.reduce((v,p)=>[v[0]+p.sign*m.currents[p.phase]*Math.cos(p.angle),v[1]+p.sign*m.currents[p.phase]*Math.sin(p.angle)],[0,0]);near(v[0],3*Math.cos(m.fieldAngle));near(v[1],3*Math.sin(m.fieldAngle));}
console.log("PASS: winding positions and current polarity agree with rotating field direction.");

const {pneumaticState,reversePneumatic}=await import('../dist/machines/model.mjs');
for(const p of [1,4,8])for(const d of [20,40,80])for(let i=0;i<1000;i++){const u=i/1000,m=pneumaticState(u,p,d),reversed=pneumaticState(reversePneumatic(u),p,d);near(m.x,reversed.x);near(m.forceReturn,.75*m.forceAdvance);near(m.pA+m.pB,p);assert.notEqual(m.advance,reversed.advance);assert.ok(m.x>=0&&m.x<=1);assert.deepEqual(m.paths,m.advance?['1→2','4→5']:['1→4','2→3']);}
for(const u of [.45,.95])assert.equal(pneumaticState(u).moving,false);
near(pneumaticState(.2,4,40).forceAdvance,160*Math.PI);near(pneumaticState(.7,4,40).forceReturn,120*Math.PI);
console.log('PASS: 5/2 routing, chamber pressure, annular force, end dwells and continuous reversal across 9,000 pneumatic states.');

const {createPLC,stepPLC,resetPLCFault}=await import('../dist/machines/plc-model.mjs');
for(const duration of [1,2,5])for(const dwell of [0,.6,3]){const s=createPLC();for(let i=0;i<Math.ceil((4*duration+4*dwell+3)/.02);i++){stepPLC(s,duration,dwell);assert.ok(s.x>=0&&s.x<=1);if(s.state==='WAIT_END')assert.ok(s.i1);if(s.state==='WAIT_HOME')assert.ok(s.i0);assert.equal(s.q,['EXTEND','WAIT_END'].includes(s.state));}assert.ok(s.cycles>=2);assert.equal(s.fault,false);}
const fault=createPLC();for(let i=0;i<600;i++)stepPLC(fault,2,.6,true);assert.equal(fault.state,'FAULT');assert.equal(fault.q,false);assert.equal(fault.x,0);assert.equal(fault.i1,false);assert.ok(resetPLCFault(fault));for(let i=0;i<400;i++)stepPLC(fault,2,.6,false);assert.ok(fault.cycles>0);assert.equal(fault.fault,false);
const mid=createPLC();mid.x=.5;mid.i0=false;assert.equal(resetPLCFault(mid),false);
console.log('PASS: PLC scan sequencing, sensor-dependent transitions, 9 timing combinations, missing-sensor timeout, output drop, physical return and guarded rearm.');

// Ladder networks are the executed program, including normally-closed fault checks.
const {ladderRows,ladderOutput}=await import('../dist/machines/ladder-model.mjs');
for(const state of ['HOME','WAIT_HOME','EXTEND','WAIT_END','RETRACT','FAULT'])for(const i0 of [false,true])for(const i1 of [false,true])for(const age of [0,.6,4]){
 const before={state,i0,i1,age};const rows=ladderRows(before,2,.6);assert.ok(rows.filter(r=>r.active).length<=1,'exclusive state transition');assert.equal(ladderOutput(before),state==='EXTEND'||state==='WAIT_END');
 if(state==='EXTEND'&&i1)assert.equal(rows.find(r=>r.active)?.id,'03','sensor wins over timeout');
 if(state==='EXTEND'&&!i1&&age>3)assert.equal(rows.find(r=>r.active)?.id,'06','NC sensor and timeout enter fault');
}
const ladderCycle=createPLC();for(let i=0;i<400;i++){stepPLC(ladderCycle,1,.1);const active=ladderCycle.scan.rows.find(r=>r.active);assert.equal(ladderCycle.state,active?.next||ladderCycle.scan.state,'displayed scan is committed');assert.equal(ladderCycle.q,ladderOutput(ladderCycle),'displayed coil equals plant command');}
console.log('PASS: ladder exclusivity, sensor priority, NC timeout contacts, scan snapshot and output coherence.');

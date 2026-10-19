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

const {createDual,stepDual,resetDual,dualOutputs,commandDual}=await import('../dist/machines/dual-model.mjs');
function fastDual(){const s=createDual();for(const key of Object.keys(s.delays))s.delays[key]=0;return s;}
for(const ta of [1,2,5])for(const tb of [1,2,5]){const s=fastDual(),seen=[];commandDual(s,'start');for(let i=0;i<Math.ceil((4*(ta+tb)+1)/.02);i++){const old=s.state;stepDual(s,ta,tb);if(s.state!==old)seen.push(s.state);assert.ok(s.x>=0&&s.x<=1&&s.y>=0&&s.y<=1);assert.equal(s.q,dualOutputs(s).q);assert.equal(s.qB,dualOutputs(s).qB);assert.ok(s.scan.rows.filter(r=>r.active).length<=1);if(['BP','BM'].includes(s.state))near(s.x,1);if(s.state==='AM')near(s.y,0);if(s.state==='AP')near(s.y,0);assert.equal(s.fault,false);}assert.deepEqual(seen.slice(0,9),['AP','BP','BM','AM','AP','BP','BM','AM','AP']);assert.ok(s.cycles>=2);}
const brokenB=fastDual();commandDual(brokenB,'start');let faultSeen=false;for(let i=0;i<350;i++){stepDual(brokenB,1,1,true);if(brokenB.fault&&!faultSeen){faultSeen=true;assert.equal(brokenB.q,false);assert.equal(brokenB.qB,false);assert.equal(resetDual(brokenB),false);}}assert.ok(faultSeen);near(brokenB.x,0);near(brokenB.y,0);assert.ok(resetDual(brokenB));commandDual(brokenB,'start');for(let i=0;i<210;i++)stepDual(brokenB,1,1);assert.equal(brokenB.cycles,1);assert.equal(brokenB.fault,false);
console.log('PASS: A+ B+ B− A− order, independent speeds, hold A during B, exclusive transitions, b1 timeout, both-output drop and guarded recovery.');

const op=fastDual();for(let i=0;i<100;i++)stepDual(op,1,1);assert.equal(op.run,false);assert.equal(op.x,0);assert.equal(op.state,'HOME');
commandDual(op,'start');stepDual(op,1,1);assert.equal(op.run,true);for(let i=0;i<75;i++)stepDual(op,1,1);assert.equal(op.state,'BP');assert.ok(op.y>0);
commandDual(op,'stop');stepDual(op,1,1);assert.equal(op.run,false);assert.equal(op.q,false);assert.equal(op.qB,false);
commandDual(op,'start');stepDual(op,1,1);assert.equal(op.run,false,'auto start blocked away from origin');
commandDual(op,'manual');stepDual(op,1,1);assert.equal(op.run,false);commandDual(op,'A+');stepDual(op,1,1);assert.equal(op.q,false,'manual requires Marcha');
commandDual(op,'start');stepDual(op,1,1);commandDual(op,'B+');stepDual(op,1,1);for(let i=0;i<60;i++)stepDual(op,1,1);near(op.x,0);near(op.y,1);assert.equal(op.q,false);assert.equal(op.qB,true);
commandDual(op,'A+');stepDual(op,1,1);for(let i=0;i<60;i++)stepDual(op,1,1);near(op.x,1);near(op.y,1);
commandDual(op,'B−');stepDual(op,1,1);for(let i=0;i<60;i++)stepDual(op,1,1);near(op.x,1);near(op.y,0);assert.equal(op.cycles,0,'manual does not count automatic cycles');
commandDual(op,'auto');stepDual(op,1,1);assert.equal(op.run,false);assert.equal(op.manualA,false);assert.equal(op.q,false);for(let i=0;i<60;i++)stepDual(op,1,1);near(op.x,0);assert.equal(op.state,'HOME');commandDual(op,'start');stepDual(op,1,1);assert.equal(op.state,'AP');
console.log('PASS: idle startup, retained RUN, priority stop, guarded auto start, manual independence and non-restarting mode change.');

// TON starts at the sensed endpoint, not at departure; CTU counts complete automatic cycles only.
for(const wait of [0,.2,1,3]){const s=createDual();for(const st of Object.keys(s.delays))s.delays[st]=wait;commandDual(s,'start');let pulses=0,arrivedAt=null;for(let i=0;i<Math.ceil((5*(2*1+2*1.4+4*wait)+3)/.02);i++){const old=s.state;stepDual(s,1,1.4);const timer=s.scan.timers[old];if(timer?.input&&arrivedAt===null)arrivedAt=s.time;if(s.state!==old){if(['AP','BP','BM','AM'].includes(old)&&s.state!=='FAULT'){assert.ok(arrivedAt!==null);assert.ok(s.time-arrivedAt+1e-8>=wait,'full endpoint dwell');assert.ok(timer.q);}arrivedAt=null;}if(s.countPulse)pulses++;assert.ok(s.cycles<=5);assert.equal(s.fault,false);}assert.equal(pulses,5);assert.equal(s.cycles,5);assert.equal(s.state,'DONE');assert.equal(s.run,false);assert.equal(s.q,false);assert.equal(s.qB,false);near(s.x,0);near(s.y,0);commandDual(s,'start');stepDual(s,1,1.4);assert.equal(s.run,false,'completed batch blocks start');commandDual(s,'resetCount');stepDual(s,1,1.4);assert.equal(s.cycles,0);assert.equal(s.complete,false);assert.equal(s.run,false,'counter reset does not start');}
const interruptedTimer=createDual();commandDual(interruptedTimer,'start');for(let i=0;i<80;i++)stepDual(interruptedTimer,1,1);assert.ok(interruptedTimer.timers.AP.et>0);assert.equal(interruptedTimer.timers.AP.q,false);commandDual(interruptedTimer,'stop');stepDual(interruptedTimer,1,1);assert.equal(interruptedTimer.timers.AP.et,0);assert.equal(interruptedTimer.cycles,0);
console.log('PASS: four sensor-triggered TON waits, zero-delay option, nonretentive reset, exactly five CTU pulses, no sixth cycle and explicit non-starting counter reset.');

const {configureHMI,acknowledgeAlarms}=await import('../dist/machines/hmi-model.mjs');
const hs=createDual(),recipe={target:2,delays:{AP:0,BP:.2,BM:0,AM:.2}};assert.equal(configureHMI(hs,{...recipe,target:2.5}).ok,false);assert.equal(configureHMI(hs,{...recipe,target:51}).ok,false);assert.equal(configureHMI(hs,{...recipe,delays:{...recipe.delays,AP:-1}}).ok,false);assert.equal(hs.target,5);assert.equal(configureHMI(hs,recipe).ok,true);commandDual(hs,'start');stepDual(hs,1,1);assert.equal(configureHMI(hs,{...recipe,target:3}).ok,false);for(let i=0;i<600;i++)stepDual(hs,1,1);assert.equal(hs.cycles,2);assert.equal(hs.complete,true);assert.equal(configureHMI(hs,{...recipe,target:3}).ok,false);commandDual(hs,'resetCount');stepDual(hs,1,1);assert.equal(configureHMI(hs,{...recipe,target:3}).ok,true);assert.equal(hs.run,false);
for(const sensor of ['i0','i1','i2','i3']){const s=fastDual();commandDual(s,'start');stepDual(s,1,1);s.disabledSensors[sensor]=true;for(let i=0;i<500;i++)stepDual(s,1,1);assert.equal(s.fault,true);assert.equal(s.alarms.length,1);assert.equal(s.alarms[0].sensor,sensor);assert.equal(s.q,false);assert.equal(s.qB,false);acknowledgeAlarms(s);assert.equal(s.alarms[0].ack,true);assert.equal(s.fault,true,'ack is not reset');assert.equal(resetDual(s),false,'repair required');s.disabledSensors[sensor]=false;stepDual(s,1,1);assert.equal(resetDual(s),true);assert.equal(s.alarms[0].active,false);assert.equal(s.run,false);}
console.log('PASS: atomic HMI validation, configurable batch target, RUN write lock, four sensor alarms, acknowledgement versus guarded rearm.');

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

const {createTrace,recordTrace,clearTrace,traceWindow,stepPath}=await import('../dist/machines/trends-model.mjs');
const history=createTrace(),plant=fastDual();recordTrace(history,plant);commandDual(plant,'start');for(let i=0;i<420;i++){stepDual(plant,1,1);const sample=recordTrace(history,plant);near(sample.A,plant.x*100);near(sample.B,plant.y*100);assert.equal(sample.q,Number(plant.q));assert.equal(sample.i1,Number(plant.i1));}assert.equal(history.size,421);const points=traceWindow(history,plant.time,10).points;assert.equal(points.length,421);assert.ok(points.some((p,i)=>i&&p.q!==points[i-1].q));const before=plant.time;clearTrace(history);recordTrace(history,plant);near(plant.time,before);assert.equal(history.size,1);
const bounded=createTrace(4);for(let i=0;i<10;i++)recordTrace(bounded,{...plant,time:i});assert.equal(bounded.size,4);assert.deepEqual(traceWindow(bounded,9,2).points.map(p=>p.time),[6,7,8,9]);recordTrace(bounded,{...plant,time:0});assert.equal(bounded.size,1,'reset removes prior history');recordTrace(bounded,{...plant,time:0});assert.equal(bounded.size,1,'same time does not duplicate');assert.equal(stepPath([{time:0,q:0},{time:1,q:1}], 'q',x=>x,y=>y),'M0,0H1V1');
console.log('PASS: scan-exact trends, digital edges, bounded chronological buffer, time-reset handling and non-mutating trace clear.');
// Process faults alter the plant, while the PLC observes pressure and endpoints.
const {dualFrame}=await import('../dist/machines/dual-model.mjs');
for(const jam of ['jamA','jamB']){const s=fastDual();commandDual(s,'start');while((jam==='jamA'?s.x:s.y)<.35)stepDual(s,1,1);s[jam]=true;const position=jam==='jamA'?s.x:s.y;for(let i=0;i<180;i++)stepDual(s,1,1);near(jam==='jamA'?s.x:s.y,position);assert.ok(s.fault);assert.equal(s.q,false);assert.equal(s.qB,false);assert.equal(s.cycles,0);assert.equal(resetDual(s),false);assert.equal(jam==='jamA'?dualFrame(s).moving:dualFrame(s).B.moving,false);s[jam]=false;for(let i=0;i<100;i++)stepDual(s,1,1);assert.ok(resetDual(s));assert.equal(s.run,false);}
for(const mode of ['auto','manual']){const s=fastDual();s.mode=mode;commandDual(s,'start');stepDual(s,1,1);if(mode==='manual'){commandDual(s,'A+');stepDual(s,1,1);}for(let i=0;i<20;i++)stepDual(s,1,1);s.lowPressure=true;const x=s.x;stepDual(s,1,1);assert.ok(s.fault);assert.equal(s.pressureOK,false);assert.equal(s.alarms[0].code,'P01');assert.equal(s.q,false);assert.equal(s.run,false);for(let i=0;i<100;i++)stepDual(s,1,1);near(s.x,x);assert.equal(s.alarms.length,1);assert.equal(dualFrame(s).pB,0);assert.equal(resetDual(s),false);s.lowPressure=false;for(let i=0;i<100;i++)stepDual(s,1,1);assert.ok(s.fault);assert.ok(resetDual(s));assert.equal(s.run,false);}
console.log('PASS: A/B jams freeze only their plant, timeout drops outputs; pressure loss trips auto/manual, freezes motion, restores return without restart and guards rearm.');
const {cases,startDiagnostic,answerDiagnostic,diagnosticHidden}=await import('../dist/machines/diagnostic.mjs');
const singleCases=cases.filter(c=>['pressure','jamA','jamB','i1','i3'].includes(c.id));for(const [i,c]of singleCases.entries()){const s=fastDual();startDiagnostic(s,()=> (i+.1)/singleCases.length);assert.equal(s.diagnostic.id,c.id);answerDiagnostic(s,c.id);assert.equal(s.diagnostic.revealed,false);commandDual(s,'start');for(let n=0;n<600&&!s.fault;n++)stepDual(s,1,1);assert.ok(s.fault,c.id);assert.ok(s.diagnostic.injected);assert.ok(diagnosticHidden(s));if(c.id==='pressure')assert.equal(s.pressureOK,false);if(c.id==='jamA')assert.ok(s.x>.3&&s.x<.6);if(c.id==='jamB')assert.ok(s.y>.3&&s.y<.6);if(c.id==='i1'){near(s.x,1);assert.equal(s.i1,false);}if(c.id==='i3'){near(s.y,1);assert.equal(s.i3,false);}answerDiagnostic(s,c.id==='pressure'?'jamA':'pressure');assert.equal(s.diagnostic.revealed,false);answerDiagnostic(s,c.id);assert.ok(s.diagnostic.solved);assert.equal(diagnosticHidden(s),false);assert.equal(s.diagnostic.attempts,2);}
console.log('PASS: all five surprise faults inject during motion, produce distinguishable evidence, reject early/wrong guesses and reveal correct explanations.');
const {levels,scoreDiagnostic,saveDiagnostic,readHistory,summarizeHistory}=await import('../dist/machines/diagnostic-progress.mjs');
for(const level of Object.keys(levels))for(let i=0;i<20;i++){const s=fastDual();startDiagnostic(s,()=>i/20,level);assert.ok(levels[level].pool.includes(s.diagnostic.id));assert.ok(s.diagnostic.threshold>=.2&&s.diagnostic.threshold<=.7);}
assert.equal(scoreDiagnostic({solved:true,attempts:1,hints:0}),100);
assert.equal(scoreDiagnostic({solved:true,attempts:3,hints:2}),40);
assert.equal(scoreDiagnostic({solved:true,attempts:20,hints:3}),0);
assert.equal(scoreDiagnostic({solved:false,attempts:1,hints:0}),0);
const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
const result={runId:'test-result',level:'expert',solved:true,revealed:true,attempts:2,hints:0};saveDiagnostic(result,storage);saveDiagnostic(result,storage);assert.equal(readHistory(storage).length,1);assert.equal(readHistory(storage)[0].score,80);
saveDiagnostic({runId:'abandoned',level:'expert',attempts:0,hints:0},storage);
saveDiagnostic({runId:'revealed',level:'basic',revealed:true,attempts:0,hints:0},storage);
const stats=summarizeHistory(readHistory(storage),'expert');assert.equal(stats.total,2);assert.equal(stats.solved,1);assert.equal(stats.abandoned,1);assert.equal(stats.recent,80);
for(let i=0;i<105;i++)saveDiagnostic({runId:'bounded-'+i,level:'basic',solved:true,attempts:1,hints:0},storage);
assert.equal(readHistory(storage).length,100);
console.log('PASS: difficulty pools and thresholds, score penalties/floor, single-save persistence, level-specific summaries and 100-entry history bound.');
const {combinedCases,repairDiagnostic,continueDiagnostic}=await import('../dist/machines/diagnostic.mjs');
for(let i=0;i<combinedCases.length;i++){
 const s=fastDual();startDiagnostic(s,()=> (i+.1)/4,'expert');commandDual(s,'start');
 const scan=()=>{stepDual(s,1,1);continueDiagnostic(s);};
 for(let n=0;n<500&&!s.fault;n++)scan();
 assert.ok(s.fault);assert.equal(s.disabledSensors[s.diagnostic.ids[1]],true);
 answerDiagnostic(s,s.diagnostic.ids[1]);assert.equal(s.diagnostic.confirmed.length,0,'masked cause cannot be guessed');
 answerDiagnostic(s,s.diagnostic.ids[0]);assert.equal(s.diagnostic.confirmed.length,1);assert.equal(s.diagnostic.revealed,false);
 assert.equal(repairDiagnostic(s),true);assert.equal(repairDiagnostic(s),false);
 for(let n=0;n<800;n++){scan();if(!s.diagnostic.recovering&&s.fault)break;}
 assert.ok(s.fault);assert.equal(s.pressureOK,true);assert.equal(s.disabledSensors[s.diagnostic.ids[1]],true);
 const axis=s.diagnostic.ids[1]==='i1'?'x':'y';near(s[axis],1);
 answerDiagnostic(s,s.diagnostic.ids[1]);assert.ok(s.diagnostic.solved);assert.equal(s.diagnostic.confirmed.length,2);assert.equal(scoreDiagnostic(s.diagnostic),80);
}
console.log('PASS: four simultaneous fault pairs, masked-cause rejection, single-cause repair, retained sensor failure, second alarm and complete two-cause scoring.');
const {diagnosticShouldPause}=await import('../dist/machines/diagnostic.mjs');
for(let i=0;i<3;i++){
 const s=createDual();startDiagnostic(s,()=> (i+.1)/3,'intermittent');commandDual(s,'start');const samples=[];let paused=false;
 for(let n=0;n<1200;n++){stepDual(s,2,2);paused=diagnosticShouldPause(s);samples.push({p:s.pressure,ps:s.pressureOK,i1:s.i1,i3:s.i3,x:s.x,y:s.y,q:s.q,qB:s.qB,fault:s.fault,t:s.time});if(paused)break;}
 assert.ok(paused,s.diagnostic.id);assert.ok(s.fault);
 if(i===0){assert.ok(s.time-s.diagnostic.faultAt>=3-1e-8);assert.ok(samples.filter((p,j)=>j&&p.ps!==samples[j-1].ps).length>=4);assert.ok(samples.some(p=>p.fault&&p.ps));assert.ok(samples.filter(p=>p.fault).every(p=>!p.q&&!p.qB));assert.equal(s.alarms.length,1);}
 else{const bit=i===1?'i1':'i3',axis=i===1?'x':'y',held=samples.filter(p=>p[axis]>=1-1e-9&&!p.fault);assert.ok(held.filter((p,j)=>j&&p[bit]!==held[j-1][bit]).length>=4,'pulses while stationary');}
 answerDiagnostic(s,'pressure');assert.equal(s.diagnostic.solved,false);answerDiagnostic(s,s.diagnostic.id);assert.equal(s.diagnostic.solved,true);assert.equal(scoreDiagnostic(s.diagnostic),80);
}
console.log('PASS: fluctuating pressure crosses threshold repeatedly while fault remains latched; a1/b1 pulse at stationary endpoints, timeout, observation window and scoring.');
const {selectTrace,moveTrace,tracePoints,traceKeys}=await import('../dist/machines/trends-model.mjs');
const cursorPLC=createDual(),cursorTrace=createTrace(500);commandDual(cursorPLC,'start');
for(let n=0;n<200;n++){stepDual(cursorPLC,1,1);recordTrace(cursorTrace,cursorPLC);}
const frozen=selectTrace(cursorTrace,.8),frozenRows=JSON.stringify(frozen.snapshot.scan);
for(let n=0;n<20;n++)stepDual(cursorPLC,1,1);
assert.equal(JSON.stringify(frozen.snapshot.scan),frozenRows);
near(frozen.time,.8);near(moveTrace(cursorTrace,1).time,.82);near(moveTrace(cursorTrace,-1).time,.8);
const event=moveTrace(cursorTrace,1,true),all=tracePoints(cursorTrace),eventIndex=all.indexOf(event);
assert.ok(traceKeys.some(k=>event[k]!==all[eventIndex-1][k]));
assert.equal(selectTrace(cursorTrace,-999),all[0]);assert.equal(selectTrace(cursorTrace,999),all.at(-1));
clearTrace(cursorTrace);assert.equal(cursorTrace.selected,null);
console.log('PASS: immutable scan snapshots, nearest-time selection, adjacent sample/event stepping, history boundaries and cursor reset.');
const {startReplay,advanceReplay}=await import('../dist/machines/trends-model.mjs');
const replayTrace=createTrace(),replayPlant=createDual();commandDual(replayPlant,'start');
for(let i=0;i<100;i++){stepDual(replayPlant,1,1);recordTrace(replayTrace,replayPlant);}
const plantBefore=JSON.stringify(replayPlant);startReplay(replayTrace);const initialTime=replayTrace.selected.time;replayTrace.replaySpeed=.25;advanceReplay(replayTrace,.4);near(replayTrace.selected.time,initialTime+.1);assert.equal(JSON.stringify(replayPlant),plantBefore);
advanceReplay(replayTrace,100);assert.equal(replayTrace.replaying,false);assert.equal(replayTrace.selected,tracePoints(replayTrace).at(-1));startReplay(replayTrace);assert.equal(replayTrace.selected,tracePoints(replayTrace)[0]);clearTrace(replayTrace);assert.equal(replayTrace.replaying,false);
console.log('PASS: slow history playback follows recorded timestamps, preserves live plant, stops at end, restarts and clears correctly.');

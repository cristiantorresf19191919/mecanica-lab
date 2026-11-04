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

// A teaching comparison must isolate one change and remain reachable with the actual controls.
const {comparisons} = await import('../dist/foundations/comparisons.mjs');
assert.deepEqual(Object.keys(comparisons).sort(), Object.keys(foundations).sort());
for (const [id, trial] of Object.entries(comparisons)) {
  const controls = foundations[id].controls;
  const differences = trial.first.filter((v, i) => v !== trial.second[i]).length;
  assert.equal(differences + Number(trial.phaseA !== trial.phaseB), 1, id);
  for (const values of [trial.first, trial.second]) {
    assert.equal(values.length, controls.length, id);
    values.forEach((value, i) => {
      const {min, max, step} = controls[i];
      assert.ok(value >= min && value <= max, id);
      near((value - min) / step, Math.round((value - min) / step));
    });
  }
}
near(state('thermal', [200,10], .5).temp, 40 - 20 * Math.exp(-3));
near(state('ac', [12,50], .75).read.at(-1).value, 144);
console.log('PASS: 20 controlled A/B experiments use reachable settings and isolate one change');
near(state('threephase', [50,4], 1/6).lineVoltage, 10 * Math.sqrt(3));
const bridge=(cap,load,u)=>state('rectifier',[12,.7,cap,load],u);
const trough=bridge(100,200,.5);
near(trough.bridgeCurrent,0);near(trough.capCurrent,-trough.current);
assert.ok(trough.output>trough.bare && bridge(100,200,.2).capCurrent>0);
assert.ok(bridge(470,200,.5).ripple<trough.ripple && bridge(100,100,.5).ripple>trough.ripple);
for(let i=0;i<=200;i++){
  const u=i/200, m=bridge(100,200,u);
  near(m.bridgeCurrent,m.current+m.capCurrent);
  near(m.output,bridge(100,200,u+.5).output);
  near(bridge(0,200,u).output,m.bare);
  assert.ok(m.output>=m.bare-1e-9 && m.output<=10.6+1e-9);
}
near(state('rectifier',[1,1,100,200],.25).output,0);
console.log('PASS: bridge cutoff, charge balance, periodicity and ripple under load.');

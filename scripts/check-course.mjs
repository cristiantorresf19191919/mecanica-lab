import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import vm from 'node:vm';
import {catalog} from '../dist/concepts/catalog.mjs';
import {calculate,controllerStep} from '../dist/concepts/models.mjs';
const context={window:{}};vm.createContext(context);
for(const file of ['concepts/curriculum.js','concepts/notes.js'])vm.runInContext(readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),context);
const source=readFileSync(new URL('../dist/course.js',import.meta.url),'utf8').split('const cq=')[0];
const tracks=vm.runInContext(source+';courseTracks',context),lessons=tracks.flatMap(t=>t.lessons);
assert.equal(tracks.length,7);assert.equal(lessons.length,58);
assert.equal(new Set(lessons.map(l=>l.progressId)).size,58);assert.equal(new Set(lessons.map(l=>l.concept)).size,58);
for(const l of lessons){assert.equal(l.length,10);assert.ok(l[7]>=0&&l[7]<l[6].length);assert.ok(catalog[l.concept],l.concept);assert.ok(context.window.lessonNotes[l.concept],l.concept)}
for(const [id,c]of Object.entries(catalog)){for(const a of [c.a.min,c.a.value,c.a.max])for(const b of [c.b.min,c.b.value,c.b.max])for(const t of [0,.25,1,9.5])for(const on of [true,false]){const m=calculate(id,c.type,a,b,t,on);assert.equal(m.metrics.length,3);for(const [label,v]of m.metrics)assert.ok(Number.isFinite(v),`${id}: ${label} ${v}`)}}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} vs ${b}`);
for(let t=0;t<10;t+=.037){const m=calculate('threephase','three',37,120,t);near(m.values.reduce((s,v)=>s+v,0),0)}
near(calculate('motor','motor',50,4,0).nr,2880);
near(calculate('ohm','circuit',12,12,0).i,1);near(calculate('closed','circuit',12,12,0,false).i,0);
near(calculate('star','star',400,40,0,true).vf,400/Math.sqrt(3));near(calculate('star','star',400,40,0,false).vf,400);
near(calculate('pwm','pwm',25,12,0).metrics[1][1],6);
near(calculate('capacitor','rc',1000,1000,1).v,12*(1-Math.exp(-1)));
near(calculate('pascal','press',20,4,1).metrics[0][1],80);
near(calculate('boyle','gas',50,100,0).metrics[1][1],200);
near(calculate('adc','adc',5,10,0).code,1023);
let p={y:0,integral:0,u:0},pi={...p};for(let i=0;i<30000;i++){controllerStep(p,70,2,0,.001);controllerStep(pi,70,2,1,.001)}assert.ok(Math.abs(p.y-70*2/3)<.01);assert.ok(Math.abs(pi.y-70)<.01);
// Previous progress must still refer to the same topic after the electrical route is reordered.
assert.equal(lessons.find(l=>l.progressId==='electric-3').concept,'threephase');
console.log('PASS: 58 lesson mappings, stable progress IDs, controls at boundaries, AC balance, motor slip, Ohm, Y/Δ, RC, PWM, Pascal, Boyle, ADC and PI steady state.');

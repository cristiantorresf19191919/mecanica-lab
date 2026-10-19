import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {model} from '../dist/anatomy/model.mjs';
const source=readFileSync(new URL('../dist/course.js',import.meta.url),'utf8').split('const cq=')[0];
const tracks=vm.runInNewContext(source+';courseTracks');
assert.equal(tracks.length,6);
for(const t of tracks){assert.equal(t.lessons.length,6);for(const l of t.lessons){assert.equal(l.length,10);assert.equal(l[6].length,3);assert.ok(l[7]>=0&&l[7]<3);assert.ok(l.every(x=>x!==undefined));}}
// Biela length and stroke throughout two complete revolutions.
for(let i=0;i<=100;i++){const m=model('engine',i/100);const pistonZ=78+m.travel;const pinZ=30+m.crank[1];assert.ok(Math.abs(Math.hypot(m.crank[0],pistonZ-pinZ)-70)<1e-10);assert.ok(m.travel>=-1e-10&&m.travel<=44+1e-10);}
assert.equal(model('engine',0).phase,'Admisión');assert.equal(model('engine',.25).phase,'Compresión');assert.equal(model('engine',.5).phase,'Expansión');assert.equal(model('engine',.75).phase,'Escape');
assert.match(model('electric',1).read,/1.00 A.*12.0 W/);
assert.match(model('physics',1).read,/20.0 N.*200 mm/);
assert.match(model('fluid',1).read,/40.0 mm.*10.0 mm/);
assert.match(model('pneumatic',1).read,/754 N/);
console.log('36 lessons valid; crank geometry, four strokes, Ohm, Hooke, Pascal and pneumatic readouts verified.');

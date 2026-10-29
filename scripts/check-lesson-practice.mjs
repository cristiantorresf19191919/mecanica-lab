import assert from 'node:assert/strict';
import {tracks} from '../dist/learn/content.mjs';
import {practice} from '../dist/learn/practice-content.mjs';
const lessons=tracks.flatMap(t=>t.lessons);
assert.equal(Object.keys(practice).length,lessons.length);
for(const l of lessons){const p=practice[l.id];assert.ok(p,l.id);assert.equal(p.options.length,3);assert.equal(p.why.length,3);assert.ok(Number.isInteger(p.correct)&&p.correct>=0&&p.correct<3);for(const v of [p.title,p.scene,p.question,...p.steps,...p.options,...p.why])for(const lang of ['en','es'])assert.ok(typeof v[lang]==='string'&&v[lang].length>0,`${l.id} ${lang}`);assert.ok(p.steps.length>=2);}
assert.equal(new Set(Object.values(practice).map(p=>p.question.en)).size,lessons.length);
console.log(`PASS: ${lessons.length} unique bilingual worked problems, transfer questions and option-specific explanations.`);

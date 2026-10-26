import assert from 'node:assert/strict';
import {tracks} from '../dist/learn/content.mjs';
import {depth} from '../dist/learn/depth.mjs';
import {cases} from '../dist/learn/cases.mjs';
const bilingual=x=>{for(const lang of ['es','en'])assert.ok(typeof x[lang]==='string'&&x[lang].length>5);};
assert.equal(Object.keys(depth).length,20);
for(const t of tracks){for(const l of t.lessons){const d=depth[l.id];assert.equal(d.steps.length,3);assert.equal(d.why.length,l.answers.length);d.steps.forEach(bilingual);d.why.forEach(bilingual);for(const lang of ['es','en'])assert.equal(new Set(d.why.map(w=>w[lang])).size,3);}const c=cases[t.id];bilingual(c.title);bilingual(c.context);bilingual(c.conclusion);assert.equal(c.steps.length,2);for(const s of c.steps){bilingual(s.evidence);bilingual(s.question);assert.equal(s.options.length,3);assert.equal(s.why.length,3);assert.ok(s.correct>=0&&s.correct<3);s.options.forEach(bilingual);s.why.forEach(bilingual);}}
console.log('PASS 20 reasoning sequences, 60 distinct bilingual answer explanations and 4 two-step evidence cases');

import assert from 'node:assert/strict';
import {createGuidedRepair,guidedScore,guidedChoose,guidedHint,guidedNext} from '../dist/concepts/repair-guided.mjs';
const c={lab:'opamp',faults:['rail','gain'],level:'combined'},g=createGuidedRepair(c);
guidedHint(g);guidedHint(g);assert.equal(g.hints,1);guidedChoose(g,'repair','gain');assert.equal(g.errors,0);assert.deepEqual(g.fixed,['gain']);assert.deepEqual(g.recommendedIds,['rail']);assert.equal(guidedChoose(g,'verify'),false);
guidedNext(g);assert.equal(g.phase,'question');assert.deepEqual(g.recommendedIds,g.fixed);guidedChoose(g,'verify');assert.equal(g.errors,1);assert.equal(g.done,false);guidedNext(g);guidedChoose(g,'repair','gain');assert.equal(g.errors,2);guidedNext(g);guidedChoose(g,'repair','rail');guidedNext(g);guidedChoose(g,'verify');assert(g.done);assert.equal(guidedScore(g),60);const saved=JSON.stringify(g);guidedNext(g);guidedHint(g);guidedChoose(g,'repair','rail');assert.equal(JSON.stringify(g),saved);assert.deepEqual(c.faults,['rail','gain']);
const bad=createGuidedRepair({lab:'relief',faults:['pump'],level:'intermittent'});guidedChoose(bad,'repair','spring');assert.equal(bad.errors,1);assert.deepEqual(bad.fixed,[]);
console.log('PASS pause/feedback phases, single hint charge, alternative valid order, repeated/absent/premature penalties, verification and terminal guard.');

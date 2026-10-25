import assert from 'node:assert/strict';
import {createCase,frame,ignition,measure,score,faults,diagnose} from '../dist/autos/model.mjs';
import {createGuide,recommendation,chooseTest,guideHint,nextQuestion} from '../dist/autos/guided.mjs';
for(const fault of Object.keys(faults)){
 const s=createCase();s.fault=fault;ignition(s,'crank');if(frame(s).starts)ignition(s,'run');const g=createGuide();let n=0;
 while(g.phase!=='complete'&&n++<8){const r=recommendation(s);assert(r.choices.length);const before=s.events.length;assert(chooseTest(s,g,r.choices[0]));assert.equal(s.events.length,before);assert(!chooseTest(s,g,r.choices[0]));measure(s,r.choices[0]);assert(s.measured.includes(r.choices[0]));nextQuestion(s,g);}
 assert.equal(g.phase,'complete',fault);assert.equal(score(s),100);diagnose(s,fault);assert(s.diagnosed,fault);
}
const s=createCase();s.fault='ground';ignition(s,'crank');const g=createGuide();assert(!chooseTest(s,g,'charge'));assert.equal(s.errors,1);assert(!chooseTest(s,g,'charge'));assert.equal(s.errors,1);assert.equal(s.measured.length,0);guideHint(s,g);guideHint(s,g);assert.equal(s.hints,1);assert(chooseTest(s,g,'battery'));measure(s,'battery');nextQuestion(s,g);assert.equal(g.phase,'question');assert.deepEqual(recommendation(s).choices,['drop']);guideHint(s,g);assert.equal(s.hints,2);assert.equal(score(s),70);
console.log('PASS 7 guided paths, accepted alternatives, no pre-choice measurement, duplicate guards, per-step hints and completion evidence');

import assert from 'node:assert/strict';
import {examPlan} from '../dist/learn/workshop-exam-adaptive.mjs';
import {newExam} from '../dist/learn/workshop-exam-model.mjs';
const row=(i,fault='primary',score=100,source='exam')=>({id:'r'+i,kind:'mechanics',fault,score,source,date:new Date(2026,9,1+i).toISOString(),hints:0,wrongDiagnosis:score===100?0:1,readings:[{id:'battery',correct:true},{id:'ground',correct:score===100}]});
const basic=[0,1,2].map(i=>row(i));assert.equal(examPlan(basic,'mechanics').level,2);assert.equal(examPlan(basic.map(r=>({...r,source:'exam-retry'})),'mechanics').level,1);assert.equal(examPlan(basic.map(r=>({...r,source:undefined})),'mechanics').level,1);
const advanced=[...basic,...[3,4,5].map(i=>row(i,'combined'))];assert.equal(examPlan(advanced,'mechanics').level,3);assert.equal(examPlan([...advanced,row(6,'combined',0),row(7,'combined',0)],'mechanics').level,1);assert.equal(examPlan(advanced,'electronics').level,1);
const weak=[row(0,'primary',0)];const plan=examPlan(weak,'mechanics');assert.equal(plan.focus,'ground');assert.ok(plan.primaryWeight>plan.alternateWeight);assert.equal(examPlan(weak,'mechanics',0).fault,'primary');assert.equal(examPlan(weak,'mechanics',.999).fault,'alternate');assert.equal(examPlan([basic[0],basic[0],basic[0]],'mechanics').level,1);
const e=newExam(advanced,()=>.1);assert.equal(e.cases[0].fault,'intermittent-primary');assert.equal(e.cases[0].plan.level,3);assert.equal(e.cases[1].plan.level,1);const before=JSON.stringify(e);advanced.push(row(8,'combined',0));assert.equal(JSON.stringify(e),before);
console.log('PASS exam-only progression, retry/practice exclusion, independent disciplines, regression, weak-skill weighting, variety, deduplication and frozen case selection');

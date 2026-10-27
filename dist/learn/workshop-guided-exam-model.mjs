import {causes} from './workshop-repair-model.mjs';
import {newRepairExam,validRepairExam,repairExamGrade} from './workshop-repair-exam-model.mjs';
import {guidedReviewPlan} from './workshop-repair-guided-progress.mjs';
export const guidedExamKey='mecanica.workshop.guidedExam.v1',guidedExamArchiveKey='mecanica.workshop.guidedExams.v1';
export function newGuidedExam(rows=[],random=Math.random){const e=newRepairExam(random);e.guidedExam=true;for(const c of e.cases){const focus=random()<.5?'primary':'alternate',p=guidedReviewPlan(rows,c.repair.kind,focus);c.repair.fault=p.fault;c.plan={...p,focus};c.awaitingNext=false;}return e;}
export function loadGuidedExams(storage){const rows=JSON.parse(storage.getItem(guidedExamArchiveKey)||'[]');return Array.isArray(rows)?rows.filter(e=>validRepairExam(e)&&e.guidedExam&&e.finished).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(-25):[];}
export function saveGuidedExam(storage,e){if(!validRepairExam(e)||!e.guidedExam)return false;storage.setItem(guidedExamKey,JSON.stringify(e));if(e.finished){const rows=loadGuidedExams(storage);if(!rows.some(x=>x.id===e.id))storage.setItem(guidedExamArchiveKey,JSON.stringify([...rows,e].slice(-25)));}return true;}
export function guidedExamEvidence(storage){return loadGuidedExams(storage).flatMap(e=>e.cases.flatMap(c=>{const g=repairExamGrade(c),ids=new Set([...g.remaining,...c.repair.actions.filter(a=>!a.useful).map(a=>a.id),...(!g.evidence?causes(c.repair):[])]);return [...ids].map(id=>({kind:c.repair.kind,id,finished:e.finished,key:c.repair.kind+':'+id}));}));}

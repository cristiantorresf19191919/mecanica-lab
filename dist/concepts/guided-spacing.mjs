import {createEnergySpacing} from './energy-spacing.mjs';
import {faultCatalog} from './energy-faults.mjs';
import {guidedInterventions,targetedGuidedRepair} from './repair-guided-history.mjs';
import {createGuidedRepair} from './repair-guided.mjs';
const names={transformload:'Transformador',opamp:'Operacional',relief:'Hidráulica'};
export const interventionCatalog=Object.fromEntries(Object.entries(faultCatalog).map(([lab,fs])=>[lab,[...fs.map(f=>({id:f.id,label:names[lab]+' · '+f.repair})),{id:'verify',label:names[lab]+' · Verificar todas las averías'}]]));
const key=s=>s.action==='verify'?'verify':s.choice;
export function guidedSpacingRows(rows){return rows.map(r=>({id:r.id,date:r.finishedAt,lab:r.lab,score:100,exam:false,faults:[...new Set([...r.steps.map(key),...r.hintEvents.map(key)])],events:[...r.steps.filter(s=>!s.correct).map(s=>({wrong:true,targets:[key(s)]})),...r.hintEvents.map(s=>({action:'hint',targets:[key(s)]}))]}));}
export const createGuidedSpacing=storage=>createEnergySpacing(storage,{key:'mecanica.guided-spacing.v1',catalog:interventionCatalog,preserveEarlyDue:true});
export function guidedSpacingPlan(rows){const stats=guidedInterventions(rows);return Object.entries(interventionCatalog).flatMap(([lab,fs])=>fs.map(f=>{const found=stats.find(s=>s.lab===lab&&(s.choice||'verify')===f.id);return {...found,lab,fault:f.id,choice:f.id==='verify'?null:f.id,action:f.id==='verify'?'verify':'repair',label:f.label,priority:found?.priority??5};})).sort((a,b)=>b.priority-a.priority);}
export function startSpacedGuided(item,rows){if(item.source)return targetedGuidedRepair(item,rows);const g=createGuidedRepair({lab:item.lab,faults:[item.choice||faultCatalog[item.lab][0].id],level:'basic'});g.reviewTarget={lab:item.lab,action:item.action,choice:item.choice,sourceId:null};g.adaptation='Primera práctica de esta intervención: comienza con una causa estable.';return g;}

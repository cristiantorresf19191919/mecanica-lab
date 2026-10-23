import {compareRepairSequence} from './repair-sequence.mjs';
import {faultCatalog,verifyEnergyFault,diagnosticSetup} from './energy-faults.mjs';
export function createGuidedRepair(c){return {lab:c.lab,faults:[...c.faults],level:c.level,steps:[],fixed:[],recommendedIds:[],phase:'question',errors:0,hints:0,hintUsed:false,feedback:'',recommendation:null,done:false};}
export const guidedScore=g=>Math.max(0,100-15*g.errors-10*g.hints);
export function guidedRecommendation(g){return compareRepairSequence({...g,steps:[]}).recommended.find(s=>s.action==='repair'&&!g.fixed.includes(s.choice))||{action:'verify',choice:null};}
export function guidedHint(g){if(g.phase!=='question'||g.hintUsed||g.done)return;g.hintUsed=true;g.hints++;const r=guidedRecommendation(g);g.feedback=r.action==='verify'?'Ya aplicaste todas las reparaciones. Falta comprobar que las señales coinciden.':faultCatalog[g.lab].find(f=>f.id===r.choice).hint;}
export function guidedChoose(g,action,choice){if(g.phase!=='question'||g.done||!['repair','verify'].includes(action)||action==='repair'&&!faultCatalog[g.lab].some(f=>f.id===choice))return false;
 const rec=guidedRecommendation(g),before=[...g.fixed];g.recommendation=rec;g.recommendedIds=rec.action==='repair'?[...before,rec.choice]:[...before];let correct=false;
 if(action==='verify'){correct=verifyEnergyFault({...g,repairedIds:g.fixed},...diagnosticSetup[g.lab]);g.done=correct;g.feedback=correct?'Verificación correcta: todas las causas quedaron corregidas.':'Comprobación prematura: todavía quedan causas sin corregir.';}
 else if(g.fixed.includes(choice))g.feedback='Esta reparación ya estaba aplicada; repetirla no cambia las señales.';
 else if(!g.faults.includes(choice))g.feedback='Esa avería no está presente; esta intervención no elimina los síntomas.';
 else{correct=true;g.fixed.push(choice);g.feedback=choice===rec.choice?'Tu elección coincide con la recomendada.':'Tu reparación es útil y el orden alternativo es válido en este modelo: no pierdes puntos.';}
 if(!correct)g.errors++;g.steps.push({action,choice,before,after:[...g.fixed],recommendedIds:[...g.recommendedIds],correct});g.phase='feedback';return true;
}
export function guidedNext(g){if(g.phase!=='feedback'||g.done)return;g.phase='question';g.hintUsed=false;g.feedback='';g.recommendation=null;g.recommendedIds=[...g.fixed];}

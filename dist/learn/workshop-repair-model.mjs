import {required,sampleTimes,snapshot} from './workshop-model.mjs';
export const causes=c=>c.fault==='combined'?['primary','alternate']:[c.fault.endsWith('alternate')?'alternate':'primary'];
export function newRepair(c){return {kind:c.kind,fault:c.fault,fixed:[],actions:[],readings:[],hints:0,failedChecks:0,verified:false};}
export function repairState(r){const left=causes(r).filter(x=>!r.fixed.includes(x));return {kind:r.kind,fault:left.length===2?'combined':left.length?(r.fault.startsWith('intermittent-')?'intermittent-':'')+left[0]:r.fault,repaired:!left.length};}
export const repairScore=r=>Math.max(0,100-15*r.actions.filter(a=>!a.useful).length-5*r.hints-10*r.failedChecks);
export function intervene(r,id){if(r.verified||!['primary','alternate'].includes(id))return false;const useful=causes(r).includes(id)&&!r.fixed.includes(id);r.actions.push({id,useful});if(useful){r.fixed.push(id);r.readings=[];}return useful;}
export function captureRepair(r,id,time){if(!required[r.kind].includes(id)||!sampleTimes(r).includes(time))return false;if(!r.readings.some(x=>x.id===id&&x.time===time))r.readings.push({id,time});return true;}
export function verifyRepair(r){if(r.verified)return 'verified';if(!required[r.kind].every(id=>sampleTimes(r).every(time=>r.readings.some(x=>x.id===id&&x.time===time))))return 'missing';const state=repairState(r);const ok=Array.from({length:800},(_,i)=>i/100).every(time=>JSON.stringify(snapshot({...state,time}))===JSON.stringify(snapshot({...state,time},true)));if(ok)r.verified=true;else r.failedChecks++;return ok?'verified':'remaining';}

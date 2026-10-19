import {SCAN,plcFrame} from './plc-model.mjs';
export const dualStages={HOME:'Origen',AP:'A+',BP:'B+',BM:'B−',AM:'A−',FAULT:'Fallo'};
export function createDual(){return {time:0,age:0,state:'HOME',x:0,y:0,i0:true,i1:false,i2:true,i3:false,q:false,qB:false,cycles:0,fault:false,events:[]};}
export function dualRows(s,ta,tb){const c=(tag,value,nc=false)=>({tag,value:!!value,nc,pass:nc?!value:!!value}),r=(id,stage,cs,next,note)=>({id,contacts:[c(dualStages[stage],s.state===stage),...cs],next,note});return [
 r('01','HOME',[c('a0 / I0.0',s.i0),c('b0 / I0.2',s.i2)],'AP','Ambos cilindros en origen: habilita A+.'),
 r('02','AP',[c('a1 / I0.1',s.i1)],'BP','Solo cuando A llega al final comienza B+. A permanece extendido.'),
 r('03','BP',[c('b1 / I0.3',s.i3)],'BM','B llega al final: quita Q0.1 para iniciar B−. Q0.0 mantiene A extendido.'),
 r('04','BM',[c('b0 / I0.2',s.i2)],'AM','B confirma origen: ahora quita Q0.0 y comienza A−.'),
 r('05','AM',[c('a0 / I0.0',s.i0)],'AP','A confirma origen: cuenta un ciclo completo y vuelve a A+.'),
 ...[['AP','a1',s.i1,ta],['BP','b1',s.i3,tb],['BM','b0',s.i2,tb],['AM','a0',s.i0,ta]].map(([st,tag,value,t],j)=>r(String(j+6).padStart(2,'0'),st,[c(tag,value,true),c('t > límite',s.age>t+1)],'FAULT','Sin sensor '+tag+' y con carrera excedida: desactiva ambas salidas.'))
 ].map(row=>({...row,active:row.contacts.every(c=>c.pass)}));}
export function dualOutputs(s){return {q:['AP','BP','BM'].includes(s.state),qB:s.state==='BP'};}
export function stepDual(s,ta=2,tb=2,broken=false){s.time+=SCAN;s.age+=SCAN;const old=s.state;const log=message=>{s.events.unshift({t:s.time,message});s.events.length=Math.min(16,s.events.length)};
 s.x=Math.max(0,Math.min(1,s.x+(s.q?1:-1)*SCAN/ta));s.y=Math.max(0,Math.min(1,s.y+(s.qB?1:-1)*SCAN/tb));
 for(const [key,v,tag]of [['i0',s.x<=1e-9,'a0 / I0.0'],['i1',s.x>=1-1e-9,'a1 / I0.1'],['i2',s.y<=1e-9,'b0 / I0.2'],['i3',s.y>=1-1e-9&&!broken,'b1 / I0.3']]){if(s[key]!==v)log(tag+' = '+Number(v));s[key]=v;}
 s.scan={time:s.time,state:old,age:s.age,rows:dualRows(s,ta,tb)};const transition=s.scan.rows.find(r=>r.active);if(transition){s.state=transition.next;s.age=0;if(transition.id==='05')s.cycles++;log(dualStages[old]+' → '+dualStages[s.state]);}
 s.fault=s.state==='FAULT';for(const [key,value]of Object.entries(dualOutputs(s))){if(s[key]!==value)log((key==='q'?'Q0.0 / YA':'Q0.1 / YB')+' = '+Number(value));s[key]=value;}return s;
}
export function resetDual(s){if(!s.fault||!s.i0||!s.i2)return false;s.state='HOME';s.age=0;s.fault=false;s.scan=null;s.events.unshift({t:s.time,message:'Rearme: a0 y b0 confirmados'});return true;}
export function dualFrame(s){return {...plcFrame(s),B:plcFrame({...s,x:s.y,q:s.qB,i0:s.i2,i1:s.i3})};}

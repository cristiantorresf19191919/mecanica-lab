// One immutable input/state image per scan. A single transition is committed afterwards.
export const stages={HOME:'Inicio',WAIT_HOME:'Espera origen',EXTEND:'Avance',WAIT_END:'Espera final',RETRACT:'Retorno',FAULT:'Fallo'};
export function ladderRows(s,stroke,dwell){
 const c=(tag,value,nc=false)=>({tag,value:!!value,nc,pass:nc?!value:!!value});
 const state=k=>c(stages[k],s.state===k);
 const wait=()=>c('t ≥ espera',s.age>=dwell),timeout=()=>c('t > límite',s.age>stroke+1);
 const row=(id,from,conditions,next,note)=>({id,contacts:[state(from),...conditions],next,note});
 return [
 row('01','HOME',[c('I0.0',s.i0)],'WAIT_HOME','I0.0 confirma que el pistón está retraído.'),
 row('02','WAIT_HOME',[wait()],'EXTEND','Al cumplir la espera en origen, comienza el avance.'),
 row('03','EXTEND',[c('I0.1',s.i1)],'WAIT_END','El sensor extendido confirma la llegada; Q sigue activa durante la espera.'),
 row('04','WAIT_END',[wait()],'RETRACT','Al cumplir la espera final se retira Q: la válvula vuelve por muelle.'),
 row('05','RETRACT',[c('I0.0',s.i0)],'WAIT_HOME','El sensor de origen confirma el retorno y suma un ciclo.'),
 row('06','EXTEND',[c('I0.1',s.i1,true),timeout()],'FAULT','Sin confirmación de extendido y con tiempo excedido: fallo.'),
 row('07','RETRACT',[c('I0.0',s.i0,true),timeout()],'FAULT','Sin confirmación de origen y con tiempo excedido: fallo.')
 ].map(r=>({...r,active:r.contacts.every(c=>c.pass)}));
}
export function ladderOutput(s){return s.state==='EXTEND'||s.state==='WAIT_END';}

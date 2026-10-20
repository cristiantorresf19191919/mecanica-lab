import {sensorAlarm} from './hmi-model.mjs';
import {SCAN,plcFrame} from './plc-model.mjs';
export const dualStages={HOME:'Origen',AP:'A+',BP:'B+',BM:'B−',AM:'A−',FAULT:'Fallo',DONE:'Fin lote'};
export function createDual(){return {pressure:4,pressureOK:true,lowPressure:false,jamA:false,jamB:false,time:0,age:0,state:'HOME',x:0,y:0,i0:true,i1:false,i2:true,i3:false,q:false,qB:false,cycles:0,target:5,complete:false,countPulse:false,delays:{AP:1,BP:1,BM:1,AM:1},timers:{},disabledSensors:{i0:false,i1:false,i2:false,i3:false},alarms:[],fault:false,events:[],mode:'auto',run:false,manualA:false,manualB:false,pending:null,operatorMessage:'Pulsa Marcha para habilitar el automático.'};}
export function dualRows(s,ta,tb){const c=(tag,value,nc=false)=>({tag,value:!!value,nc,pass:nc?!value:!!value}),r=(id,stage,cs,next,note)=>({id,contacts:[c(dualStages[stage],s.state===stage),...cs],next,note});return [
 r('01','HOME',[c('a0 / I0.0',s.i0),c('b0 / I0.2',s.i2)],'AP','Ambos cilindros en origen: habilita A+.'),
 r('02','AP',[c('a1 / I0.1',s.i1),c('T1.Q',s.timers.AP?.q)],'BP','a1 inicia T1; al cumplirse la espera comienza B+. A permanece extendido.'),
 r('03','BP',[c('b1 / I0.3',s.i3),c('T2.Q',s.timers.BP?.q)],'BM','b1 inicia T2; al cumplirse la espera quita Q0.1 para iniciar B−. Q0.0 mantiene A extendido.'),
 r('04','BM',[c('b0 / I0.2',s.i2),c('T3.Q',s.timers.BM?.q)],'AM','b0 inicia T3; al cumplirse la espera quita Q0.0 y comienza A−.'),
 r('05','AM',[c('a0 / I0.0',s.i0),c('T4.Q',s.timers.AM?.q)],s.cycles+1>=s.target?'DONE':'AP','a0 y T4.Q completan un ciclo. C1 llega a PV: termina el lote; en otro caso vuelve a A+.'),
 ...[['AP','a1',s.i1,ta],['BP','b1',s.i3,tb],['BM','b0',s.i2,tb],['AM','a0',s.i0,ta]].map(([st,tag,value,t],j)=>r(String(j+6).padStart(2,'0'),st,[c(tag,value,true),c('t > límite',s.age>t+1)],'FAULT','Sin sensor '+tag+' y con carrera excedida: desactiva ambas salidas.'))
 ].map(row=>({...row,enabled:s.run&&s.mode==='auto'&&!s.fault,active:s.run&&s.mode==='auto'&&!s.fault&&row.contacts.every(c=>c.pass)}));}
export function dualOutputLogic(s,key){return {gate:s.run&&!s.fault,auto:s.mode==='auto',manual:s.mode==='manual',stage:key==='q'?['AP','BP','BM'].includes(s.state):s.state==='BP',request:key==='q'?s.manualA:s.manualB};}
export function dualOutputs(s){const output=key=>{const l=dualOutputLogic(s,key);return l.gate&&((l.auto&&l.stage)||(l.manual&&l.request));};return {q:output('q'),qB:output('qB')};}
export function commandDual(s,command){s.pending=command;}
function operatorScan(s,log){const cmd=s.pending;s.pending=null;const previous=s.run,changed=(cmd==='auto'||cmd==='manual')&&cmd!==s.mode;
 if(changed){s.mode=cmd;s.manualA=s.manualB=false;s.state=s.fault?'FAULT':'HOME';s.age=0;s.operatorMessage='Modo '+(cmd==='auto'?'automático':'manual')+'. Salidas desactivadas; requiere nueva Marcha.';}
 const stop=cmd==='stop'||changed,start=cmd==='start',allowed=s.mode==='manual'||(s.i0&&s.i2),startOK=start&&allowed&&!(s.complete&&s.mode==='auto');
 s.run=(previous||startOK)&&!stop&&!s.fault&&!(s.complete&&s.mode==='auto');
 s.control={start,startOK,previous,stop,fault:s.fault,done:s.complete&&s.mode==='auto'};
 if(stop){s.manualA=s.manualB=false;if(!s.fault)s.state='HOME';s.age=0;}
 if(start)s.operatorMessage=s.complete&&s.mode==='auto'?'Lote terminado: reinicia C1 antes de otra Marcha.':s.fault?'Rearma el fallo antes de Marcha.':!allowed?'Marcha rechazada: espera a0 y b0 en origen.':s.mode==='manual'?'Manual habilitado: selecciona A+, A−, B+ o B−.':'Automático en marcha.';
 if(cmd==='resetCount'){if(!s.run&&s.i0&&s.i2&&!s.fault){s.cycles=0;s.complete=false;s.countPulse=false;s.state='HOME';s.age=0;s.timers={};s.control.done=false;s.operatorMessage='C1 = 0. Lote nuevo preparado; pulsa Marcha.';}else s.operatorMessage='Detén la marcha y confirma a0 y b0 antes de reiniciar C1.';}
 if(cmd==='stop')s.operatorMessage='Paro: YA=0, YB=0. Ambos cilindros retornan por muelle.';
 if(['A+','A−','B+','B−'].includes(cmd)){if(s.mode==='manual'&&s.run&&!s.fault){s[cmd[0]==='A'?'manualA':'manualB']=cmd[1]==='+';s.operatorMessage='Orden manual '+cmd+' retenida hasta la orden contraria o Paro.';}else s.operatorMessage='Selecciona Manual y pulsa Marcha antes de mover los cilindros.';}
 if(cmd)log(s.operatorMessage);
}

export function updateTimers(s){for(const [stage,bit]of [['AP','i1'],['BP','i3'],['BM','i2'],['AM','i0']]){const prev=s.timers[stage]||{et:0},input=s.run&&s.mode==='auto'&&!s.fault&&s.state===stage&&s[bit],pt=s.delays[stage];const et=input?(prev.input?Math.min(pt,prev.et+SCAN):0):0;s.timers[stage]={input,pt,et,q:input&&et+1e-9>=pt};}}
export function stepDual(s,ta=2,tb=2,broken=false){s.time+=SCAN;s.age+=SCAN;const old=s.state;const log=message=>{s.events.unshift({t:s.time,message});s.events.length=Math.min(16,s.events.length)};
 s.pressure=s.lowPressure?0:4;s.pressureOK=s.pressure>=3;
 if(!s.jamA&&s.pressureOK)s.x=Math.max(0,Math.min(1,s.x+(s.q?1:-1)*SCAN/ta));if(!s.jamB&&s.pressureOK)s.y=Math.max(0,Math.min(1,s.y+(s.qB?1:-1)*SCAN/tb));
 for(const [key,v,tag]of [['i0',s.x<=1e-9&&!s.disabledSensors.i0,'a0 / I0.0'],['i1',s.x>=1-1e-9&&!s.disabledSensors.i1,'a1 / I0.1'],['i2',s.y<=1e-9&&!s.disabledSensors.i2,'b0 / I0.2'],['i3',s.y>=1-1e-9&&!broken&&!s.disabledSensors.i3,'b1 / I0.3']]){if(s[key]!==v)log(tag+' = '+Number(v));s[key]=v;}
 if(!s.pressureOK&&!s.fault){s.alarms.unshift({code:'P01',tag:'PS / I0.4',time:s.time,active:true,ack:false,message:'Presión baja: 0 bar. Se requieren al menos 3 bar. Salidas desactivadas.'});s.alarms.length=Math.min(10,s.alarms.length);s.state='FAULT';s.fault=true;log('P01 · presión baja: ambas salidas desactivadas');}
 operatorScan(s,log);s.countPulse=false;updateTimers(s);s.scan={time:s.time,state:s.state,age:s.age,timers:structuredClone(s.timers),rows:dualRows(s,ta,tb)};const transition=s.scan.rows.find(r=>r.active);if(transition){if(transition.next==='FAULT')sensorAlarm(s,s.state);s.state=transition.next;s.age=0;if(transition.id==='05'){s.countPulse=true;s.cycles++;if(s.cycles>=s.target){s.complete=true;s.run=false;s.control.done=true;s.operatorMessage='Lote completo: '+s.cycles+' de '+s.target+' ciclos. Ambos cilindros en origen. Reinicia C1 para otro lote.';log(s.operatorMessage);}}log(dualStages[old]+' → '+dualStages[s.state]);}
 s.fault=s.state==='FAULT';if(s.fault){s.operatorMessage='Fallo retenido: '+(s.alarms.find(a=>a.active)?.message||'Revisa el proceso.');s.run=false;s.manualA=s.manualB=false;s.control.fault=true;}for(const [key,value]of Object.entries(dualOutputs(s))){if(s[key]!==value)log((key==='q'?'Q0.0 / YA':'Q0.1 / YB')+' = '+Number(value));s[key]=value;}return s;
}
export function resetDual(s){if(s.lowPressure||s.jamA||s.jamB||!s.fault||!s.i0||!s.i2||s.alarms.some(a=>a.active&&s.disabledSensors[a.sensor]))return false;s.state='HOME';s.age=0;s.fault=false;s.run=false;s.manualA=s.manualB=false;s.control=null;s.scan=null;s.operatorMessage='Fallo rearmado. Pulsa Marcha para habilitar.';for(const alarm of s.alarms)alarm.active=false;s.events.unshift({t:s.time,message:'Rearme: a0 y b0 confirmados'});return true;}
export function dualFrame(s){const frame=(state,jam)=>{const m=plcFrame(state);return {...m,moving:m.moving&&!jam&&s.pressureOK,pA:m.advance?s.pressure:0,pB:m.advance?0:s.pressure,forceAdvance:m.forceAdvance*s.pressure/4,forceReturn:m.forceReturn*s.pressure/4};};return {...frame(s,s.jamA),B:frame({...s,x:s.y,q:s.qB,i0:s.i2,i1:s.i3},s.jamB)};}

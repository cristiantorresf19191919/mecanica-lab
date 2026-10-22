import {createDual,commandDual,stepDual,resetDual} from './dual-model.mjs';
import {traceSnapshot} from './trends-model.mjs';
export const repairLabels={pressure:'Restablecer aire a 4 bar',jam:'Liberar cilindro A',i0:'Reparar conexión a0 / I0.0',i1:'Reparar conexión a1 / I0.1'};
export function createRepair(kind){
 const causes=({pressure:['pressure'],jam:['jam'],sensor:['i1'],pressureWave:['pressure'],combined:['pressure','i0']})[kind];
 if(!causes)throw Error('Unknown repair case');
 const r={kind,remaining:[...causes],normal:createDual(),fault:createDual(),errors:0,hints:0,done:false,verified:false,log:[],message:'Observa el banco averiado y decide tu primera reparación.'};
 r.normal.target=r.fault.target=1;commandDual(r.normal,'start');commandDual(r.fault,'start');
 for(let i=0;i<230;i++)advanceRepair(r);
 return r;
}
export function advanceRepair(r){
 const s=r.fault,active=s.time>=1;
 s.lowPressure=active&&r.remaining.includes('pressure')&&r.kind!=='pressureWave';
 s.pressureOverride=active&&r.remaining.includes('pressure')&&r.kind==='pressureWave'?4+2*Math.sin(s.time*Math.PI*2/1.2):null;
 s.jamA=active&&r.remaining.includes('jam');
 for(const id of ['i0','i1'])s.disabledSensors[id]=active&&r.remaining.includes(id)&&Math.floor(s.time/.14)%2===0;
 stepDual(r.normal);stepDual(s);
}
export function repairScore(r){return Math.max(0,100-r.errors*15-r.hints*10);}
export function repairAction(r,action){
 if(r.done)return;
 if(action==='hint'){r.hints++;r.message=r.remaining.includes('pressure')?'PS exige al menos 3 bar. Observa presión y permiso de marcha.':r.remaining.includes('jam')?'Hay presión, pero A no sigue la orden. Revisa la libertad de movimiento.':r.remaining.length?'Compara el extremo físico con a0/a1: una conexión intermitente puede ocultarse entre scans.':r.fault.fault?'Las causas están corregidas; espera el retorno y rearma el fallo retenido.':'Pulsa Marcha y verifica un ciclo completo A+ B+ B− A−.';}
 else if(action in repairLabels){if(r.remaining.includes(action)){r.remaining=r.remaining.filter(c=>c!==action);r.message=repairLabels[action]+': corrección aplicada. Observa la respuesta antes de continuar.';}else{r.errors++;r.message='Esa intervención no corrige ninguna avería pendiente.';}advanceRepair(r);}
 else if(action==='reset'){if(resetDual(r.fault)){r.message='PLC rearmado. Hace falta una nueva Marcha.';}else{r.errors++;r.message='Rearme rechazado: confirma presión, cilindros libres y sensores de origen. Si ya no hay fallo, no necesita rearme.';}}
 else if(action==='start'){commandDual(r.fault,'start');advanceRepair(r);r.message=r.fault.operatorMessage;}
 else if(action==='verify'){r.verified=true;if(!r.remaining.length&&r.fault.complete&&!r.fault.fault){r.done=true;r.message='Reparación verificada: sin causas pendientes y un ciclo completo confirmado por a0, a1, b0 y b1.';}else{r.errors++;r.message='Verificación incompleta: '+(r.remaining.length?'queda al menos una causa activa.':'falta completar un ciclo sin fallo.');}}
 r.log.push({time:r.fault.time,action,message:r.message});
}
export function repairPair(r){return {normal:traceSnapshot(r.normal),fault:traceSnapshot(r.fault)};}

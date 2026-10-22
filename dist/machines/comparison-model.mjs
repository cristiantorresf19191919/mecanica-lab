import {createDual,commandDual,stepDual} from './dual-model.mjs';
import {traceSnapshot} from './trends-model.mjs';
export const comparedKeys=['x','y','i0','i1','i2','i3','q','qB','pressure','pressureOK','fault','state'];
export function differences(a,b){return comparedKeys.filter(k=>typeof a[k]==='number'?Math.abs(a[k]-b[k])>1e-8:a[k]!==b[k]);}
// Controlled experiment: same initial conditions and recipe; only the injected fault conditions differ.
export function buildComparison(kind='pressure'){
 if(!['pressure','jam','sensor','pressureWave','combined'].includes(kind))throw Error('Unknown comparison fault');
 const normal=createDual(),fault=createDual();normal.target=fault.target=1;
 commandDual(normal,'start');commandDual(fault,'start');
 const frames=[{normal:traceSnapshot(normal),fault:traceSnapshot(fault)}];
 let first=-1,alarm=-1,injection=-1;
 for(let i=1;i<=1500;i++){
  if(kind==='pressure'&&fault.time>=1){fault.lowPressure=true;if(injection<0)injection=i;}
  if(kind==='jam'&&fault.time>=1){fault.jamA=true;if(injection<0)injection=i;}
  if(kind==='sensor'&&fault.x>=1-1e-9){if(injection<0)injection=i;fault.disabledSensors.i1=Math.floor((i-injection)/7)%2===0;}
  if(kind==='pressureWave'&&fault.time>=1)fault.pressureOverride=4+2*Math.sin((fault.time-1)*Math.PI*2/1.2);
  if(kind==='combined'&&fault.time>=1){fault.lowPressure=fault.time<1.8;fault.disabledSensors.i0=fault.time<1.8||Math.floor((fault.time-1.8)/.14)%2===0;}
  stepDual(normal,2,2);stepDual(fault,2,2);
  const pair={normal:traceSnapshot(normal),fault:traceSnapshot(fault)};
  frames.push(pair);
  if(first<0&&differences(pair.normal,pair.fault).length)first=i;
  if(alarm<0&&fault.fault)alarm=i;
  if(normal.complete&&alarm>=0&&i>alarm+150)break;
 }
 return {kind,frames,first,alarm,injection};
}

export function propagationSteps(e){
 if(['pressureWave','combined'].includes(e.kind))return [{index:e.first,title:'Primera diferencia',text:e.kind==='combined'?'Coexisten pérdida temporal de presión y señal intermitente del sensor de origen a0. Una avería puede ocultar la otra.':'La presión fluctúa entre 2 y 6 bar; PS cambia al cruzar 3 bar.'},{index:e.alarm,title:'Protección retenida',text:'PS=0 retiene FALLO y quita RUN y salidas. Recuperar presión no rearma el PLC.'},{index:Math.min(e.frames.length-1,e.alarm+150),title:'Después de recuperar presión',text:e.kind==='combined'?'El cilindro puede regresar con aire, pero a0 pierde señal por momentos aun estando físicamente en origen.':'PS vuelve a 1 al recuperar presión; FALLO sigue retenido.'}];
 const find=fn=>e.frames.findIndex((p,i)=>i>0&&fn(p));
 const steps=[{index:e.first,title:'Aparece la avería',text:({pressure:'La alimentación cae de 4 a 0 bar. El presostato detecta presión insuficiente.',jam:'A queda atascado a mitad de carrera. YA sigue activa: una orden no garantiza movimiento.',sensor:'A alcanza el extremo, pero la conexión de a1 empieza a perder señal cada 140 ms.'})[e.kind]}];
 const input=find(p=>['i0','i1','i2','i3','pressureOK'].some(k=>p.normal[k]!==p.fault[k]));
 if(input>=0)steps.push({index:input,title:'Las entradas difieren',text:e.kind==='jam'?'La referencia llega a a1; el cilindro atascado no. El PLC sigue esperando confirmación.':e.kind==='sensor'?'La posición física de A coincide, pero a1 no. Los contornos marcan el sensor y los contactos que leen su señal.':'PS pasa a 0 en el banco averiado. El contacto negado de P01 se cumple.'});
 const timer=find(p=>['AP','BP','BM','AM'].some(k=>Math.abs((p.normal.timers[k]?.et||0)-(p.fault.timers[k]?.et||0))>1e-8));
 if(timer>=0&&timer<e.alarm)steps.push({index:timer,title:'La espera ya no coincide',text:'T1 acumula tiempo en la referencia. Sin a1 continuo, el TON del banco averiado no completa la espera; su tiempo se reinicia cuando la entrada cae.'});
 steps.push({index:e.alarm,title:'El PLC retiene FALLO',text:e.kind==='pressure'?'P01 actúa en el mismo scan que PS=0. No necesita esperar el timeout de carrera.':'Se supera carrera + 1 s con a1 ausente. La supervisión fija FALLO, retira RUN y desactiva YA/YB en ese scan.'});
 const output=find(p=>p.normal.q!==p.fault.q||p.normal.qB!==p.fault.qB);
 if(output>=0)steps.push({index:output,title:'Cambian las salidas',text:output<e.alarm?'La referencia completa T1 y activa YB para avanzar B. En el banco averiado, a1 no ha permitido completar T1: B sigue esperando. Todavía no hay alarma.':'El bloqueo de fallo retira RUN y las bobinas YA/YB. Las válvulas vuelven por muelle. Los contactos ámbar tienen un resultado lógico distinto; verde sigue significando verdadero.'});
 steps.push({index:Math.min(e.frames.length-1,e.alarm+25),title:'Respuesta física',text:e.kind==='pressure'?'Sin presión, los pistones no avanzan aunque las válvulas hayan cambiado. El ciclo normal continúa.':e.kind==='jam'?'A permanece inmóvil por el atasco aunque YA ya esté a 0. Q=0 por sí solo no demuestra que el cilindro regresó.':'Con presión disponible y sin atasco, A empieza a regresar. Los sensores de extremo cambian al alcanzarse sus posiciones.'});
 return steps.sort((a,b)=>a.index-b.index);
}

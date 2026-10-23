import {calculate} from './models.mjs';
export const faultCatalog={
 transformload:[{id:'ratio',label:'Toma secundaria incorrecta',repair:'Restituir la toma del secundario',hint:'Compara Vs/Vp. ¿Coincide con la relación nominal?',explain:'La toma efectiva tenía la mitad de la relación prevista: bajan tensión, corriente y potencia secundaria.'},{id:'load',label:'Resistencia de carga degradada',repair:'Sustituir la resistencia de carga',hint:'Si Vs coincide, compara corriente y potencia. Deduce R=Vs/Is.',explain:'La resistencia de carga se duplicó. Vs permanece igual; Is, Ip y potencia se reducen a la mitad.'}],
 opamp:[{id:'gain',label:'Resistencia de realimentación alterada',repair:'Restaurar la red Rf/Rg',hint:'Compara la ganancia lejos de las crestas: ¿la pendiente de salida cambió?',explain:'La relación de realimentación cambió y la ganancia efectiva aumentó. La saturación aparece antes.'},{id:'rail',label:'Alimentación reducida a ±6 V',repair:'Restablecer la alimentación ±12 V',hint:'Mira la alimentación y la amplitud máxima. ¿Cambió la pendiente o solo el techo?',explain:'Los rieles cayeron a ±6 V. La ganancia lineal sigue igual, pero la salida se recorta a una tensión menor.'}],
 relief:[{id:'spring',label:'Ajuste del resorte desplazado',repair:'Recalibrar el ajuste del alivio',hint:'¿El retorno abre por debajo del ajuste nominal? Compara apertura, presión y caudal.',explain:'El ajuste efectivo cayó al 60 %. El retorno abre antes y deja menos caudal útil al cilindro.'},{id:'pump',label:'Pérdida de caudal de la bomba',repair:'Restaurar el caudal de la bomba',hint:'Suma caudal al tanque y al cilindro. ¿La bomba sigue entregando 6 L/min?',explain:'La bomba entrega la mitad del caudal. Con carga baja puede mantener presión, pero el cilindro avanza más despacio.'}]
};
export const diagnosticSetup={transformload:[2,48],opamp:[3,3],relief:[4,60]};
export function createEnergyFault(id,random=Math.random,level='basic'){const catalog=faultCatalog[id];if(!catalog||!['basic','combined','intermittent'].includes(level))throw Error('Unknown diagnostic');const first=catalog[Math.min(catalog.length-1,Math.floor(random()*catalog.length))].id;return {id:crypto.randomUUID(),date:new Date().toISOString(),lab:id,level,fault:first,faults:level==='combined'?catalog.map(f=>f.id):[first],repairedIds:[],diagnosedIds:[],repaired:false,diagnosed:false,done:false,errors:0,hints:0,log:[],events:[]};}
export const energyFaultScore=s=>Math.max(0,100-15*s.errors-10*s.hints);
export function faultyEnergy(s,a,b,t){
 const active=id=>s.faults.includes(id)&&!s.repairedIds.includes(id)&&(s.level!=='intermittent'||Math.floor((t+0.2)/.7)%2===0);
 let aa=a,bb=b;if(active('ratio'))aa*=.5;if(active('load'))bb*=2;if(active('gain'))aa*=1.8;if(active('spring'))bb*=.6;
 const m={...calculate(s.lab,s.lab,aa,bb,t),a,b,rail:active('rail')?6:12,pumpFlow:active('pump')?3:6};
 if(s.lab==='opamp'){m.effectiveGain=aa;m.output=Math.max(-m.rail,Math.min(m.rail,aa*m.input));m.clipped=aa*b>m.rail;m.metrics[1][1]=Math.min(m.rail,aa*b);}
 if(active('pump')){m.returnFlow*=.5;m.cylinderFlow*=.5;m.speed*=.5;m.heat*=.5;m.x=(t*m.speed)%.5;m.metrics=[['Presión',m.p,'bar'],['Velocidad',m.speed,'m/s'],['Calor en alivio',m.heat,'W']];}
 return m;
}
export function verifyEnergyFault(s,a,b){if(!s.faults.every(f=>s.repairedIds.includes(f)))return false;for(let i=0;i<=100;i++){const t=i*.04,n=calculate(s.lab,s.lab,a,b,t),f=faultyEnergy(s,a,b,t);for(const k of s.lab==='transformload'?['vs','ip','power']:s.lab==='opamp'?['input','output']:['p','opening','returnFlow','cylinderFlow','x'])if(Math.abs(n[k]-f[k])>1e-8)return false;}return true;}
export function actEnergyFault(s,action,choice){if(s.done)return 'Reto terminado. Inicia otro para practicar.';
 const pending=s.faults.filter(f=>!s.repairedIds.includes(f)),targets=pending.length?pending:s.faults;let msg,wrong=false;
 if(action==='hint'){s.hints++;const f=targets[s.hints%targets.length];msg=faultCatalog[s.lab].find(x=>x.id===f).hint+(s.level==='intermittent'?' Recorre varios segundos: una lectura normal aislada no descarta la avería.':'');}
 if(action==='diagnose'){if(s.faults.includes(choice)){if(!s.diagnosedIds.includes(choice))s.diagnosedIds.push(choice);msg='Causa identificada. Puede haber más de una: compara todas las señales.';}else{wrong=true;msg='Ese diagnóstico no explica las señales. Compara ambos bancos.';}}
 if(action==='repair'){if(pending.includes(choice)){s.repairedIds.push(choice);msg='Intervención aplicada. Comprueba si persisten otros síntomas.';}else{wrong=true;msg='Intervención innecesaria: no corrige una avería pendiente.';}}
 s.repaired=s.faults.every(f=>s.repairedIds.includes(f));s.diagnosed=s.faults.every(f=>s.diagnosedIds.includes(f));
 if(action==='verify'){const [a,b]=diagnosticSetup[s.lab];if(s.diagnosed&&verifyEnergyFault(s,a,b)){s.done=true;s.finishedAt=new Date().toISOString();msg='Verificado: todas las causas identificadas y corregidas; 101 muestras coinciden durante 4 s simulados. '+s.faults.map(f=>faultCatalog[s.lab].find(x=>x.id===f).explain).join(' ');}else{wrong=true;msg='Aún no está resuelto: confirma todas las causas y corrígelas. Un intervalo sin síntomas no demuestra reparación.';}}
 if(wrong)s.errors++;s.events.push({action,choice,wrong,targets:action==='hint'?[targets[s.hints%targets.length]]:targets});s.log.push(msg);return msg;
}

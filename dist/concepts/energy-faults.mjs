import {calculate} from './models.mjs';
export const faultCatalog={
 transformload:[{id:'ratio',label:'Toma secundaria incorrecta',repair:'Restituir la toma del secundario',hint:'Compara Vs/Vp. ¿Coincide con la relación nominal?',explain:'La toma efectiva tenía la mitad de la relación prevista: bajan tensión, corriente y potencia secundaria.'},{id:'load',label:'Resistencia de carga degradada',repair:'Sustituir la resistencia de carga',hint:'Si Vs coincide, compara corriente y potencia. Deduce R=Vs/Is.',explain:'La resistencia de carga se duplicó. Vs permanece igual; Is, Ip y potencia se reducen a la mitad.'}],
 opamp:[{id:'gain',label:'Resistencia de realimentación alterada',repair:'Restaurar la red Rf/Rg',hint:'Compara la ganancia lejos de las crestas: ¿la pendiente de salida cambió?',explain:'La relación de realimentación cambió y la ganancia efectiva aumentó. La saturación aparece antes.'},{id:'rail',label:'Alimentación reducida a ±6 V',repair:'Restablecer la alimentación ±12 V',hint:'Mira la alimentación y la amplitud máxima. ¿Cambió la pendiente o solo el techo?',explain:'Los rieles cayeron a ±6 V. La ganancia lineal sigue igual, pero la salida se recorta a una tensión menor.'}],
 relief:[{id:'spring',label:'Ajuste del resorte desplazado',repair:'Recalibrar el ajuste del alivio',hint:'¿El retorno abre por debajo del ajuste nominal? Compara apertura, presión y caudal.',explain:'El ajuste efectivo cayó al 60 %. El retorno abre antes y deja menos caudal útil al cilindro.'},{id:'pump',label:'Pérdida de caudal de la bomba',repair:'Restaurar el caudal de la bomba',hint:'Suma caudal al tanque y al cilindro. ¿La bomba sigue entregando 6 L/min?',explain:'La bomba entrega la mitad del caudal. Con carga baja puede mantener presión, pero el cilindro avanza más despacio.'}]
};
export const diagnosticSetup={transformload:[2,48],opamp:[3,3],relief:[4,60]};
export function createEnergyFault(id,random=Math.random){const faults=faultCatalog[id];if(!faults)throw Error('Unknown lab');return {lab:id,fault:faults[Math.min(faults.length-1,Math.floor(random()*faults.length))].id,repaired:false,diagnosed:false,done:false,errors:0,hints:0,log:[]};}
export const energyFaultScore=s=>Math.max(0,100-15*s.errors-10*s.hints);
export function faultyEnergy(s,a,b,t){let m=calculate(s.lab,s.lab,a,b,t);m.rail=12;m.pumpFlow=6;
 if(!s.repaired){
 if(s.fault==='ratio')m={...calculate(s.lab,s.lab,a*.5,b,t),a,b};
 if(s.fault==='load')m={...calculate(s.lab,s.lab,a,b*2,t),a,b};
 if(s.fault==='gain')m={...calculate(s.lab,s.lab,a*1.8,b,t),a,b,effectiveGain:a*1.8,rail:12};
 if(s.fault==='rail'){m.rail=6;m.output=Math.max(-6,Math.min(6,a*m.input));m.clipped=a*b>6;m.metrics[1][1]=Math.min(6,a*b);}
 if(s.fault==='spring')m={...calculate(s.lab,s.lab,a,b*.6,t),a,b,pumpFlow:6};
 if(s.fault==='pump'){m.pumpFlow=3;m.returnFlow*=.5;m.cylinderFlow*=.5;m.speed*=.5;m.heat*=.5;m.x=(t*m.speed)%.5;m.metrics=[['Presión',m.p,'bar'],['Velocidad',m.speed,'m/s'],['Calor en alivio',m.heat,'W']];}
 }
 return m;
}
export function verifyEnergyFault(s,a,b){if(!s.repaired)return false;for(let i=0;i<=100;i++){const t=i*.04,n=calculate(s.lab,s.lab,a,b,t),f=faultyEnergy(s,a,b,t);for(const k of s.lab==='transformload'?['vs','ip','power']:s.lab==='opamp'?['input','output']:['p','opening','returnFlow','cylinderFlow','x'])if(Math.abs(n[k]-f[k])>1e-8)return false;}return true;}
export function actEnergyFault(s,action,choice){if(s.done)return 'Reto terminado. Inicia otro para practicar.';const f=faultCatalog[s.lab].find(f=>f.id===s.fault);let msg;
 if(action==='hint'){s.hints++;msg=f.hint;}
 if(action==='diagnose'){if(choice===s.fault){s.diagnosed=true;msg='Diagnóstico correcto. Elige ahora la intervención.';}else{s.errors++;msg='Ese diagnóstico no explica todas las señales. Compara ambos bancos.';}}
 if(action==='repair'){if(choice===s.fault&&!s.repaired){s.repaired=true;msg='Intervención aplicada. Compara las lecturas y ejecuta la comprobación.';}else{s.errors++;msg='Intervención innecesaria: no corrige una avería pendiente.';}}
 if(action==='verify'){const [a,b]=diagnosticSetup[s.lab];if(s.diagnosed&&verifyEnergyFault(s,a,b)){s.done=true;msg='Verificado: diagnóstico correcto y 101 muestras coincidentes durante 4 s simulados. '+f.explain;}else{s.errors++;msg='Aún no está resuelto: confirma el diagnóstico y corrige la causa antes de verificar.';}}
 s.log.push(msg);return msg;
}

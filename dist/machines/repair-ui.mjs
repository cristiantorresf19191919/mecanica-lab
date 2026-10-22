import {createRepair,advanceRepair,repairAction,repairScore,repairPair,repairLabels} from './repair-model.mjs';
export function createRepairUI({displayPair,refresh}){
 let session=null,timer=null;
 function pause(){clearInterval(timer);timer=null;}
 function publish(){displayPair(repairPair(session),session.kind);}
 function act(action){repairAction(session,action);if(session.done)pause();publish();}
 return {
 active:()=>!!session,state:()=>session,
 start(kind){pause();session=createRepair(kind);publish();},
 close(){pause();session=null;},
 render(host,exit){
 const add=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;host.append(n);return n;};
 const button=(id,text,fn)=>{const b=add('button',text);b.id=id;b.onclick=fn;return b;};
 add('h3','Taller de reparación · '+repairScore(session)+'/100');
 add('p','Nueva práctica del caso del examen. En el combinado, la pérdida de aire persiste hasta repararla. El banco izquierdo es la referencia; el derecho responde a tus decisiones. Simulación educativa: las intervenciones representan trabajos realizados con la máquina aislada.');
 add('p','Cada intervención innecesaria, rearme rechazado o comprobación prematura resta 15 puntos; cada pista resta 10. Puedes corregir las causas en cualquier orden.');
 const status=add('p',session.message);status.setAttribute('role','status');status.className='repair-feedback';
 add('p','Tiempo: '+session.fault.time.toFixed(2)+' s · Presión: '+session.fault.pressure.toFixed(2)+' bar · PLC: '+session.fault.state+' · Ciclos: '+session.fault.cycles+'/1');
 if(!session.done){
 for(const [id,label]of Object.entries(repairLabels))button('repair-'+id,label,()=>act(id));
 button('repair-run',timer?'Pausar observación':'Observar a ½ velocidad',()=>{if(timer)pause();else timer=setInterval(()=>{if(document.hidden){pause();refresh();return;}for(let i=0;i<5;i++)advanceRepair(session);publish();},200);refresh();});
 button('repair-step','Avanzar 1 scan (20 ms)',()=>{pause();advanceRepair(session);publish();});
 button('repair-reset','Rearmar PLC',()=>act('reset'));
 button('repair-start','Marcha · probar ciclo',()=>act('start'));
 button('repair-verify','Comprobar reparación',()=>act('verify'));
 button('repair-hint','Pista (−10)',()=>act('hint'));
 }else add('p','Reto resuelto. La nota de tu examen permanece intacta.');
 const details=add('details','');const title=document.createElement('summary');title.textContent='Bitácora de decisiones ('+session.log.length+')';details.append(title);for(const entry of session.log){const p=document.createElement('p');p.textContent=entry.time.toFixed(2)+' s · '+entry.message;details.append(p);}
 button('repair-exit','Volver a la revisión',()=>{pause();session=null;exit();});
 }
 };
}

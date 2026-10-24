import {dayKey} from './energy-spacing.mjs';
import {energyWeekly} from './energy-weekly.mjs';
import {guidedSpacingRows,guidedSpacingPlan} from './guided-spacing.mjs';
import {guidedProgress} from './repair-guided-progress.mjs';
import {guidedScore} from './repair-guided.mjs';
export function guidedWeekly(rows,store,today=dayKey()){
 const mapped=guidedSpacingRows(rows).map((r,i)=>({...r,score:guidedScore(rows[i]),errors:rows[i].errors,hints:rows[i].hints}));
 const plan=guidedSpacingPlan(rows).map(item=>({...item,...guidedProgress(rows,item)}));
 const report=energyWeekly(mapped,store,today,{plan,dailyLimit:store.snapshot().goal});
 const scheduled=new Set(report.dates.flatMap(d=>d.items.map(i=>i.lab+':'+i.fault)));
 const backlog=store.schedule(today).filter(i=>i.due<=report.nextEnd&&!scheduled.has(i.lab+':'+i.fault)).map(i=>({...plan.find(p=>p.lab===i.lab&&p.fault===i.fault),due:i.due}));
 return {...report,backlog};
}
export function renderGuidedWeekly(host,{rows,store,begin}){
 const r=guidedWeekly(rows,store),root=document.createElement('section');root.className='energy-weekly guided-weekly';host.append(root);
 const el=(tag,text,parent=root)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};
 const levels={basic:'estable',intermittent:'intermitente',combined:'combinado'};
 el('h3','Tu semana en el modo guiado');el('p',r.start+' → '+r.today+' · semana actual hasta hoy');
 el('strong',r.current.count+' prácticas · '+(r.current.mean===null?'Sin puntuación':r.current.mean+'/100 de media')+' · '+r.current.errors+' errores · '+r.current.hints+' pistas');
 el('p','Metas cumplidas: '+r.goalsMet+'/'+r.daysElapsed+' días transcurridos · Racha: '+r.streak.current+' días · Mejor racha: '+r.streak.best+'.');
 el('p','Semana anterior completa: '+r.previous.count+' prácticas · '+(r.previous.mean===null?'sin puntuación':r.previous.mean+'/100 de media')+'. La semana actual está incompleta; los niveles y contextos pueden variar. La comparación no demuestra mejora por sí sola.');
 el('h4','Intervenciones que más te costaron');const hard=r.difficult.filter(i=>i.weekErrors||i.weekHints);
 if(!hard.length)el('p',r.current.count?'No registraste errores ni pistas esta semana.':'Completa una práctica guiada para comenzar el resumen.');
 for(const i of hard)el('p',i.label+' · '+i.weekErrors+' errores · '+i.weekHints+' pistas en '+i.weekCount+' prácticas.');
 el('p','Las pistas se atribuyen a la intervención sugerida; los errores, a la decisión elegida. El detalle usa hasta 100 resultados guardados; el registro diario conserva metas y rachas.');
 el('h3','Tu plan guiado para la próxima semana');el('p',r.next+' → '+r.nextEnd+' · lunes a domingo');el('p','Máximo '+store.snapshot().goal+' retos por día, según tu meta. Cada intervención aparece una vez con su vencimiento actual; el plan se recalcula al practicar o cambiar la meta. Practicar una tarjeta futura inicia el reto ahora.');
 const task=(i,parent)=>{el('p',i.label+' · Nivel '+levels[i.level]+'. '+i.reason+' Vencimiento actual: '+i.due+'.',parent);const b=el('button','Practicar ahora',parent);b.dataset.guidedWeekly=i.lab+':'+i.fault;b.onclick=()=>begin(i);};
 for(const d of r.dates){const card=el('article','');card.className='energy-week-day';el('h4',new Date(d.date+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'short'}),card);if(!d.items.length)el('p','Sin vencimientos previstos; vuelve a consultar después de practicar.',card);for(const i of d.items)task(i,card);}
 if(r.backlog.length){el('h4','Pendientes que no caben en tu meta semanal');el('p','Estas intervenciones siguen pendientes. Puedes practicarlas ahora o ajustar tu meta; no se ocultan ni se consideran completadas.');for(const i of r.backlog)task(i,root);}
 el('p','Es una previsión con la evidencia actual, sin recordatorios externos ni resultados futuros supuestos.');
}

import {dayKey,shiftDay} from './energy-spacing.mjs';
import {energyReviewPlan} from './energy-adaptive.mjs';
export function energyWeekly(rows,store,today=dayKey()){
 const offset=(new Date(today+'T12:00:00').getDay()+6)%7,start=shiftDay(today,-offset),end=shiftDay(start,6),next=shiftDay(start,7),previous=shiftDay(start,-7);
 const within=(a,b)=>rows.filter(r=>{const d=dayKey(r.date);return d>=a&&d<=b;});
 const summarize=rs=>({count:rs.length,mean:rs.length?Math.round(rs.reduce((n,r)=>n+r.score,0)/rs.length):null,errors:rs.reduce((n,r)=>n+(r.errors||0),0),hints:rs.reduce((n,r)=>n+(r.hints||0),0)});
 const currentRows=within(start,today),snapshot=store.snapshot(),calendar=store.schedule(today),adapted=energyReviewPlan(rows,new Date(today+'T12:00:00').getTime());
 const difficult=adapted.map(item=>{const relevant=currentRows.filter(r=>r.lab===item.lab&&r.faults.includes(item.fault));let errors=0,hints=0;for(const r of relevant)for(const e of r.events){if(!e||!Array.isArray(e.targets)||!e.targets.includes(item.fault))continue;if(e.wrong)errors++;if(e.action==='hint')hints++;}return {...item,weekCount:relevant.length,weekErrors:errors,weekHints:hints};}).filter(x=>x.weekCount).sort((a,b)=>b.weekErrors-a.weekErrors||b.weekHints-a.weekHints).slice(0,3);
 const dates=Array.from({length:7},(_,i)=>({date:shiftDay(next,i),items:[]}));
 // Schedule one current due-date per cause; future successful completions are unknown.
 for(const item of calendar.filter(x=>x.due<=shiftDay(next,6)).sort((a,b)=>a.due.localeCompare(b.due)||adapted.findIndex(x=>x.lab===a.lab&&x.fault===a.fault)-adapted.findIndex(x=>x.lab===b.lab&&x.fault===b.fault))){const earliest=item.due<next?next:item.due;const slot=dates.find(d=>d.date>=earliest&&d.items.length<3);if(slot)slot.items.push({...adapted.find(x=>x.lab===item.lab&&x.fault===item.fault),due:item.due,overdue:item.due<next});}
 return {start,end,today,next,nextEnd:shiftDay(next,6),current:summarize(currentRows),previous:summarize(within(previous,shiftDay(start,-1))),streak:store.streak(today),goalsMet:Object.entries(snapshot.days).filter(([d,s])=>d>=start&&d<=today&&s.count>=s.goal).length,daysElapsed:offset+1,difficult,dates};
}
export function renderEnergyWeekly(host,{rows,store,lab,begin}){
 const report=energyWeekly(rows,store),section=document.createElement('section');section.className='energy-weekly';host.append(section);
 const names={transformload:'Transformador',opamp:'Operacional',relief:'Hidráulica',basic:'Básico',combined:'Combinado',intermittent:'Intermitente'};
 const el=(tag,text,parent=section)=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n;};
 el('h3','Tu resumen semanal');el('p',report.start+' → '+report.today+' · semana actual hasta hoy');
 const c=report.current,p=report.previous;el('strong',`${c.count} retos · ${c.mean===null?'Sin nota todavía':c.mean+'/100 de media'} · ${c.errors} errores · ${c.hints} pistas`);
 el('p',`Metas cumplidas: ${report.goalsMet}/${report.daysElapsed} días transcurridos · Racha actual: ${report.streak.current} días · Mejor racha: ${report.streak.best}.`);
 el('p',`Semana anterior completa: ${p.count} retos · ${p.mean===null?'sin nota':p.mean+'/100 de media'}. La semana actual está incompleta y puede incluir niveles distintos; esta comparación no mide por sí sola una mejora.`);
 el('h4','Averías que más costaron esta semana');if(!report.difficult.length)el('p','Completa un diagnóstico para comenzar el resumen.');for(const item of report.difficult)el('p',`${names[item.lab]} · ${item.label}: ${item.weekErrors} errores y ${item.weekHints} pistas en ${item.weekCount} retos.`);
 el('p','Un error combinado puede aparecer en varias averías pendientes; el total de errores de la semana cuenta cada intento una sola vez. El detalle usa los últimos 200 resultados guardados; las metas y rachas conservan su registro diario.');
 el('h3','Plan de la próxima semana');el('p',report.next+' → '+report.nextEnd+' · lunes a domingo');el('p','Previsión según vencimientos actuales: máximo tres averías por día, una aparición por causa. Los pendientes se trasladan al lunes o al siguiente hueco. Se recalcula cuando practicas; no supone que vayas a completar los retos ni agenda avisos.');
 for(const day of report.dates){const card=el('article','');card.className='energy-week-day';el('h4',new Date(day.date+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'short'}),card);if(!day.items.length)el('p','Sin vencimientos previstos. Vuelve a consultar tras tus próximos retos.',card);for(const item of day.items){el('p',`${names[item.lab]} · ${item.label} · ${names[item.level]}. ${item.overdue?'Pendiente anterior; puedes practicarlo hoy.':'Vencimiento: '+item.due+'.'} ${item.reason}`,card);if(item.lab===lab){const b=el('button','Practicar ahora',card);b.dataset.weeklyReview=item.fault;b.onclick=()=>begin(item);}else{const a=el('a','Abrir reto de '+names[item.lab],card);a.href='../concepts/index.html?id='+item.lab+'&review='+item.fault;a.target='_top';a.className='energy-review-link';}}}
}

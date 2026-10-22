import {dateKey,dailyProgress} from './practice-calendar.mjs';
import {signalStats} from './prediction-progress.mjs';
import {spacedRecommendations} from './prediction-spacing.mjs';
export function mondayOf(now){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());d.setDate(d.getDate()-(d.getDay()+6)%7);return d;}
const plus=(d,n)=>{const x=new Date(+d);x.setDate(x.getDate()+n);return x;};
export function weeklyReport(rows,state,now=new Date()){
 const start=mondayOf(now),previous=plus(start,-7),next=plus(start,7);
 const inRange=(r,a,b)=>{const t=new Date(r.completedAt||r.date);return t>=a&&t<b&&t<=now;};
 const current=rows.filter(r=>inRange(r,start,next)),old=rows.filter(r=>inRange(r,previous,start));
 const stats=list=>{const solved=list.filter(r=>r.resolved);return {solved:solved.length,independent:solved.filter(r=>!r.revealed).length,mean:solved.length?Math.round(solved.reduce((n,r)=>n+r.points,0)/solved.length):null,errors:list.reduce((n,r)=>n+r.errors,0),hints:list.reduce((n,r)=>n+r.hints,0)};};
 const days=Array.from({length:7},(_,i)=>{const date=plus(start,i),ledger=state.days[dateKey(date)];return {date:dateKey(date),count:ledger?.ids.length||0,target:ledger?.target||state.goal,achieved:!!ledger&&ledger.ids.length>=ledger.target,future:date>now};});
 return {start:dateKey(start),end:dateKey(plus(next,-1)),nextStart:dateKey(next),current:stats(current),previous:stats(old),days,weaknesses:signalStats(current).filter(s=>s.priority>0).slice(0,3),streak:dailyProgress(state,now),limited:rows.length>=500};
}
export function nextWeekPlan(rows,now=new Date()){
 const start=plus(mondayOf(now),7),recs=spacedRecommendations(rows,now).map(r=>({...r,next:new Date(r.due)}));
 return Array.from({length:7},(_,i)=>{const date=plus(start,i),selected=recs.filter(r=>r.next<=date).sort((a,b)=>+a.next-+b.next||b.priority-a.priority).slice(0,3);for(const r of selected)r.next=plus(date,r.interval);return {date:dateKey(date),signals:selected.map(r=>({id:r.signal,label:r.label,reason:r.reason}))};});
}
export function renderWeekly(host,rows,state,{ready,start,startFresh,now=new Date()}){
 const report=weeklyReport(rows,state,now),plan=nextWeekPlan(rows,now);host.replaceChildren();const el=(tag,text,parent=host)=>{const n=document.createElement(tag);if(text!==null)n.textContent=text;parent.append(n);return n;};
 el('h3','Tu semana · '+report.start+' — '+report.end);el('p','Semana actual de lunes a domingo, actualizada hasta hoy. Los resultados detallados usan el historial local disponible; las metas usan el registro diario.');
 const metrics=el('div',null);metrics.className='weekly-metrics';for(const text of [report.current.solved+' preguntas resueltas',report.current.independent+' sin consultar solución',(report.current.mean===null?'Sin nota':report.current.mean+'/100 de media'),report.streak.streak+' días de racha',report.days.filter(d=>d.achieved).length+' días con meta cumplida',report.streak.best+' días · mejor racha'])el('strong',text,metrics);
 el('p','Semana anterior completa: '+report.previous.solved+' preguntas · media '+(report.previous.mean===null?'sin datos':report.previous.mean+'/100')+'. Esta semana puede estar incompleta y las dificultades variar; las cifras no son una comparación equivalente.');
 const bars=el('div',null);bars.className='weekly-days';report.days.forEach((d,i)=>{const item=el('div',null,bars);el('strong',['L','M','X','J','V','S','D'][i],item);const meter=el('meter',null,item);meter.min=0;meter.max=d.target;meter.value=Math.min(d.count,d.target);meter.setAttribute('aria-label',d.date+' · '+d.count+' de '+d.target);el('small',d.future?'Próximo':d.count+'/'+d.target+(d.achieved?' ✓':''),item);});
 el('h4','Dónde necesitas más práctica esta semana');if(!report.weaknesses.length)el('p',report.current.solved?'No se registran dificultades esta semana.':'Todavía no hay resultados suficientes esta semana.');for(const s of report.weaknesses){const p=el('p',s.label+' · '+s.errors+' errores · '+s.hints+' pistas · '+s.reveals+' soluciones consultadas.');const b=el('button','Practicar esta señal',p);b.disabled=!ready;b.onclick=()=>start([s.signal]);}
 if(report.limited)el('p','El historial alcanzó el límite de 500 preguntas: el detalle semanal puede ser parcial. Las metas y rachas conservan su registro diario.');
 el('h3','Plan de la próxima semana');el('p','Plan estimado con tus errores e intervalos actuales, hasta 3 señales por día. Se recalcula cuando practicas: no da por completados los retos futuros. Cada sesión ofrece hasta 8 preguntas adaptativas; puedes repetir para alcanzar tu meta. Abrir un reto aquí permite adelantarlo.');
 const grid=el('div',null);grid.className='weekly-plan';for(const d of plan){const card=el('article',null,grid);el('h4',d.date,card);if(d.signals.length){const ul=el('ul',null,card);for(const s of d.signals)el('li',s.label+' · '+s.reason,ul);const b=el('button','Abrir retos de este día',card);b.disabled=!ready;b.onclick=()=>start(d.signals.map(s=>s.id));}else{el('p',rows.length?'Sin repasos previstos. Puedes dedicar el día a práctica libre.':'Empieza un recorrido guiado para personalizar tus próximos repasos.',card);const b=el('button','Práctica libre',card);b.disabled=!ready;b.onclick=startFresh;}}
}

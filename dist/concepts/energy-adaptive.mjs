import {faultCatalog} from './energy-faults.mjs';
export function energyReviewPlan(rows,now=Date.now()){
 const items=Object.entries(faultCatalog).flatMap(([lab,fs])=>fs.map(f=>{
 const history=rows.filter(r=>r.lab===lab&&r.faults.includes(f.id)).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)),recent=history.slice(-3);
 const errors=recent.reduce((n,r)=>n+r.events.filter(e=>e?.wrong&&Array.isArray(e.targets)&&e.targets.includes(f.id)).length,0),hints=recent.reduce((n,r)=>n+r.events.filter(e=>e?.action==='hint'&&Array.isArray(e.targets)&&e.targets.includes(f.id)).length,0),mean=recent.length?recent.reduce((n,r)=>n+r.score,0)/recent.length:0;
 const days=history.length?Math.max(0,(now-Date.parse(history.at(-1).date))/86400000):null;
 const proficient=recent.length>=2&&mean>=80&&errors<=1&&hints<=1;
 return {lab,fault:f.id,label:f.label,n:history.length,recent:recent.length,mean,errors,hints,days,proficient,advanced:recent.length>=3&&mean>=85&&errors===0&&hints<=1&&recent.some(r=>r.level==='intermittent'||r.level==='combined'),priority:recent.length?(errors*15+hints*7)/recent.length+(100-mean)*.3+Math.min(30,days)*.7:12};
 }));
 for(const item of items){const ready=items.filter(x=>x.lab===item.lab).every(x=>x.advanced);item.level=ready?'combined':item.proficient?'intermittent':'basic';item.reason=item.n===0?'Sin práctica registrada: empieza por una causa estable.':item.errors?'Prioridad por errores recientes: '+item.errors+' en los últimos '+item.recent+' retos.':item.hints?'Refuerza el diagnóstico sin depender de pistas.':item.days>=7?'Han pasado '+Math.floor(item.days)+' días desde el último repaso.':item.level==='combined'?'Ambas causas muestran resultados consistentes; combina las averías.':item.level==='intermittent'?'Buen desempeño reciente: practica síntomas que aparecen y desaparecen.':'Consolida la causa con otro reto básico.';}
 return items.sort((a,b)=>b.priority-a.priority||a.n-b.n||a.lab.localeCompare(b.lab)||a.fault.localeCompare(b.fault));
}
export function nextEnergyReview(rows,lab,preferred,now=Date.now()){const all=energyReviewPlan(rows,now);return all.find(x=>x.lab===lab&&x.fault===preferred)||all.find(x=>x.lab===lab);}

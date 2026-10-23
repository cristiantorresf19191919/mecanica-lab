import {faultCatalog} from './energy-faults.mjs';
const orders={transformload:['ratio','load'],opamp:['rail','gain'],relief:['pump','spring']};
const reasons={transformload:'Restituye primero la relación de tensión para interpretar después la corriente de carga.',opamp:'Restablece primero los rieles para separar el recorte por alimentación de la ganancia alterada.',relief:'Restituye primero el caudal de la bomba para observar después el reparto entre cilindro y retorno.'};
export function compareRepairSequence(c){
 const ids=orders[c.lab].filter(f=>c.faults.includes(f)),recommended=[];let fixed=[];
 for(const f of ids){recommended.push({action:'repair',choice:f,before:[...fixed],after:[...fixed,f]});fixed.push(f);}
 recommended.push({action:'verify',choice:null,before:[...fixed],after:[...fixed]});
 const actual=c.steps.map(step=>({...step,kind:step.action==='verify'?(c.faults.every(f=>step.before.includes(f))?'verification':'premature'):step.before.includes(step.choice)?'repeated':!c.faults.includes(step.choice)?'unnecessary':'useful'}));
 const avoidable=actual.filter(s=>['premature','repeated','unnecessary'].includes(s.kind)).length;
 return {actual,recommended,avoidable,reason:ids.length>1?reasons[c.lab]:'Corrige la única causa presente y verifica después; intervenir otras piezas no ayuda a resolver este caso.',max:Math.max(actual.length,recommended.length)};
}
export function sequenceSnapshot(c,index){const plan=compareRepairSequence(c),n=Math.max(0,Math.min(plan.max,Math.floor(index)));return {...plan,index:n,user:n?plan.actual[Math.min(n,plan.actual.length)-1]?.after||[]:[],recommendedIds:n?plan.recommended[Math.min(n,plan.recommended.length)-1].after:[],userStep:n?plan.actual[n-1]||null:null,recommendedStep:n?plan.recommended[n-1]||null:null};}
export function renderSequence(host,c,index,onChange){
 const p=sequenceSnapshot(c,index),el=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;host.append(n);return n;};host.className='repair-sequence';
 const label=s=>!s?'Secuencia terminada':s.action==='verify'?'Verificar todas las averías':faultCatalog[c.lab].find(f=>f.id===s.choice)?.repair||'Intervención';
 el('h3','Tu secuencia frente a la recomendada');el('p',p.actual.length+' acciones tuyas · '+p.recommended.length+' recomendadas · '+p.avoidable+' pasos evitables.');el('p',p.reason+' Es un orden didáctico: las reparaciones del modelo son independientes y otro orden correcto no se penaliza.');el('p','A: tu secuencia · B: recomendada. Mismo número de acciones y mismo reloj de simulación; no es una comparación de tiempos reales. Una secuencia terminada conserva su estado final.');
 el('strong',p.index===0?'Estado inicial · mismas averías en ambos bancos':'Paso '+p.index+' de '+p.max);
 el('p','Tú: '+(p.index?label(p.userStep):'Sin intervenir'));el('p','Recomendación: '+(p.index?label(p.recommendedStep):'Sin intervenir'));
 const explanations={premature:'Comprobación prematura: aún quedaban causas sin corregir. Comprueba al terminar las reparaciones.',repeated:'Intervención repetida: esta causa ya estaba corregida. Repetirla no cambia las lecturas.',unnecessary:'Intervención innecesaria: esta avería no estaba presente. Decide a partir de las diferencias medidas.',useful:'Intervención útil. Si el orden difiere, sigue siendo válido en este modelo.',verification:'Comprobación correcta: todas las causas estaban reparadas.'};
 if(p.userStep)el('p',explanations[p.userStep.kind]);
 const slider=el('input','');slider.type='range';slider.min=0;slider.max=p.max;slider.value=p.index;slider.setAttribute('aria-label','Paso de comparación de secuencias');slider.oninput=()=>onChange(+slider.value);slider.dataset.sequenceStep='';
 for(const [text,n] of [['Paso anterior',p.index-1],['Paso siguiente',p.index+1]]){const b=el('button',text);b.disabled=n<0||n>p.max;b.onclick=()=>onChange(n);b.dataset.sequenceNav=n;}
 return p;
}

// Sampling manualPair makes the instrument, the chart and replay use the same model.
import {manualPair,end} from './synchro-compare.mjs';
const KEY='mecanica.synchro.manual.v1',LIMIT=100;
function capture(ms,id,at){
 const t=ms/1000;
 return {ms,id,at,banks:manualPair(t,t).map(f=>({wheel:Math.abs(f.second),hub:Math.abs(f.output),delta:f.delta,clash:f.clash}))};
}
export function mountHistory(host,en,onReview){
 const t=(s,e)=>en?e:s,fmt=(n,d=2)=>n.toLocaleString(en?'en':'es',{maximumFractionDigits:d}),svgNS='http://www.w3.org/2000/svg';
 let rows=[],selected=null,unavailable=false;
 try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(raw))rows=raw.filter(r=>r&&Number.isInteger(r.ms)&&r.ms>=900&&r.ms<=end*1000&&Number.isSafeInteger(r.id)&&Number.isFinite(r.at)).slice(-LIMIT).map(r=>capture(r.ms,r.id,r.at))}catch{unavailable=true}
 const el=(tag,parent,text='')=>{const n=document.createElement(tag);n.textContent=text;parent.append(n);return n};
 el('small',host,t('Telemetría / cambio 1 → 2','Telemetry / 1 → 2 shift'));
 el('h2',host,t('Mis intentos de segunda','My second-gear attempts'));
 const hint=el('p',host);hint.className='hint';
 const legend=el('p',host);legend.className='attempt-legend';
 [t('● Rueda sana','● Healthy gear'),t('◆ Rueda desgastada','◆ Worn gear'),t('– – Cubo de ambas cajas','– – Hub of both gearboxes')].forEach((s,i)=>el('span',legend,s).className='series-'+i);
 const viewport=el('div',host);viewport.className='attempt-chart';const list=el('div',host);list.className='attempt-list';const msg=el('p',host);msg.setAttribute('role','status');
 function choose(r){selected=r.id;paint();onReview(r)}
 function paint(){viewport.replaceChildren();list.replaceChildren();hint.textContent=t('Últimos 100 intentos en este navegador. Cada columna es un intento; toca su número para volver al contacto.','Last 100 attempts in this browser. Each column is one attempt; select its number to return to contact.');
 msg.textContent=unavailable?t('Almacenamiento no disponible: historial solo durante esta visita.','Storage unavailable: history is kept for this visit only.'):'';
 legend.hidden=!rows.length;if(!rows.length){el('p',viewport,t('Aún no hay intentos. Usa «Meter segunda ahora» para registrar el primero.','No attempts yet. Use “Try second now” to record your first.'));return}
 const w=Math.max(360,80+rows.length*64),svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 '+w+' 200');svg.style.minWidth=w+'px';svg.setAttribute('aria-label',t('RPM al intentar el acople, por intento','RPM at attempted engagement, by attempt'));viewport.append(svg);
 const node=(tag,attrs,txt='',parent=svg)=>{const n=document.createElementNS(svgNS,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);n.textContent=txt;parent.append(n);return n};
 const y=v=>154-(v-280)*.48;node('text',{x:5,y:16},'rpm');
 for(const v of [300,400,500,550]){node('line',{x1:40,x2:w-10,y1:y(v),y2:y(v),stroke:v===300?'#e5e9e7':'#41505c','stroke-dasharray':v===300?'6 4':'2 5'});node('text',{x:4,y:y(v)+4},v)}
 rows.forEach((r,i)=>{const x=48+(i+.5)*(w-64)/rows.length,g=node('g',{role:'button',tabindex:'0','aria-label':t('Revisar intento ','Review attempt ')+r.id,'aria-pressed':String(r.id===selected)},'');g.style.cursor='pointer';g.onclick=()=>choose(r);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(r)}};
 node('rect',{x:x-26,y:13,width:52,height:181,rx:8,fill:r.id===selected?'#37515d':'transparent',opacity:.6},'',g);
 r.banks.forEach((b,j)=>{const xx=x+(j?7:-7),yy=y(b.wheel),color=j?'#ffbe78':'#64e6ef';node('line',{x1:xx,x2:xx,y1:y(b.hub),y2:yy,stroke:color,'stroke-width':2},'',g);if(j)node('path',{d:'M '+xx+' '+(yy-5)+' l 5 5 -5 5 -5 -5 z',fill:color},'',g);else node('circle',{cx:xx,cy:yy,r:5,fill:color},'',g)});
 node('text',{x,y:183,'text-anchor':'middle'},'#'+r.id,g)});
 for(const r of [...rows].reverse()){const btn=el('button',list,'#'+r.id+' · '+fmt(r.ms/1000,3)+' s　'+r.banks.map((b,j)=>(j?t('Desgastado','Worn'):t('Sano','Healthy'))+': '+(b.clash?t('rasca','clash'):t('suave','smooth'))+' · Δ '+fmt(b.delta)+' rpm').join('　/　'));btn.setAttribute('aria-pressed',String(r.id===selected));btn.onclick=()=>choose(r)}
 }
 paint();return {save(seconds){const r=capture(Math.round(seconds*1000),(rows.at(-1)?.id??0)+1,Date.now());rows=[...rows,r].slice(-LIMIT);selected=r.id;
 try{localStorage.setItem(KEY,JSON.stringify(rows));unavailable=false}catch{unavailable=true}paint();viewport.scrollLeft=viewport.scrollWidth;return r}};
}

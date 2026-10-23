import {faultCatalog,diagnosticSetup,createEnergyFault,energyFaultScore,actEnergyFault} from './energy-faults.mjs';
export function mountEnergyDiagnostic(root,id,{start,changed,exit}){
 const panel=document.createElement('section');panel.className='energy-diagnostic';root.prepend(panel);let state=null;
 function render(message=''){panel.replaceChildren();const el=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;panel.append(n);return n;};const button=(text,fn,action)=>{const b=el('button',text);b.onclick=fn;if(action)b.dataset.faultAction=action;return b;};
 el('h2','Taller · avería sorpresa');el('p','Banco A: referencia normal. Banco B: misma consigna con una avería oculta. El diagrama inferior corresponde a A. Usa las lecturas y piezas de B para diagnosticar. Las reparaciones representan intervenciones realizadas con el equipo aislado.');
 if(!state){button('Comenzar diagnóstico sorpresa',()=>{state=createEnergyFault(id);start(state,diagnosticSetup[id]);render('Observa las lecturas sobre las piezas. Puedes pausar y recorrer el tiempo.');},'start');return;}
 el('strong','Puntuación: '+energyFaultScore(state)+'/100 · Intentos erróneos: '+state.errors+' · Pistas: '+state.hints);el('p','−15 por diagnóstico, reparación o comprobación incorrectos; −10 por pista. La puntuación se conserva solo durante este reto.');const status=el('p',message||'Compara síntomas antes de intervenir.');status.setAttribute('role','status');status.dataset.faultStatus='';
 if(!state.done){el('h3','1 · Diagnostica');for(const f of faultCatalog[id])button(f.label,()=>action('diagnose',f.id),'diagnose-'+f.id);el('h3','2 · Repara');for(const f of faultCatalog[id])button(f.repair,()=>action('repair',f.id),'repair-'+f.id);button('Pista (−10)',()=>action('hint'),'hint');button('3 · Verificar reparación',()=>action('verify'),'verify');}
 else el('p','Reto resuelto. Ambos bancos representan ya el funcionamiento normal; puedes seguir comparándolos.');
 const history=el('details',''),summary=document.createElement('summary');summary.textContent='Bitácora de decisiones';history.append(summary);for(const text of state.log){const p=document.createElement('p');p.textContent=text;history.append(p);}
 button('Salir del diagnóstico',()=>{state=null;exit();render();},'exit');
 }
 function action(action,choice){const msg=actEnergyFault(state,action,choice);changed();render(msg);}
 render();return {state:()=>state};
}

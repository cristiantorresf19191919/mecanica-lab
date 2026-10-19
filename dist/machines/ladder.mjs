import {ladderRows,stages} from './ladder-model.mjs';
const wire=(x1,x2,y,on)=>`<path class="wire ${on?'on':''}" d="M${x1} ${y}H${x2}"/>`;
export function contact(c,x,y){return `<g class="contact ${c.pass?'on':''}"><text x="${x}" y="${y-15}">${c.tag}</text><path d="M${x-6} ${y-9}v18m12-18v18${c.nc?`m-16 0l20-18`:''}"/><text class="bit" x="${x}" y="${y+23}">${c.pass?'TRUE':'FALSE'}</text></g>`;}
export function rung(r,names=stages){let powered=r.enabled??true,prev=15;let body='<path class="rail '+(powered?'on':'')+'" d="M15 20v42"/><path class="rail" d="M405 20v42"/>';
 r.contacts.forEach((c,i)=>{const x=[65,163,253][i];body+=wire(prev,x-6,38,powered)+contact(c,x,38);powered=powered&&c.pass;prev=x+6;});
 body+=wire(prev,310,38,powered)+`<g class="${r.active?'on':''}"><rect x="310" y="22" width="86" height="32" rx="3"/><text x="353" y="34">MOV etapa</text><text x="353" y="47">${names[r.next]}</text></g>`+wire(396,405,38,r.active);
 return `<svg viewBox="0 0 420 68" aria-hidden="true">${body}</svg>`;
}
export function createLadder({host,inspector,onPlay,onScan,onChange}){
 const panel=document.createElement('section');panel.className='ladder-panel';panel.setAttribute('aria-label','Programa ladder del PLC');
 panel.innerHTML=`<span class="eyebrow">PROGRAMA / MONITOR ONLINE</span><h2>Ladder en vivo</h2><p class="ladder-legend"><b>Verde = condición verdadera</b> · línea verde = continuidad lógica. Toca un peldaño para leerlo.</p><div class="ladder-actions"><button id="ladderPlay">Reproducir</button><button id="ladderScan">+1 scan</button><label><input id="breakTransition" type="checkbox"> Pausar al cambiar etapa</label></div><div id="ladderClock"></div><div id="ladderRungs"></div><div id="ladderOutput"></div><p id="ladderRead" role="status">I0.0 confirma el origen. Pulsa +1 scan para ejecutar el primer peldaño.</p><details class="ladder-help"><summary>Cómo leer este programa</summary><p>—| |— comprueba un bit verdadero; —|/|— comprueba que sea falso. Los contactos en serie son AND y las ramas paralelas son OR. Son pruebas lógicas, no contactos eléctricos físicos.</p><p>Los peldaños 01–07 calculan la siguiente etapa desde una única imagen de entradas y etapa. MOV cambia esa etapa al terminar la evaluación; no se encadenan varias transiciones en un scan. El peldaño 08 escribe Q usando la etapa resultante.</p><p>t es el tiempo desde la entrada en la etapa. «Espera» es el ajuste inferior; «límite» = tiempo de carrera + 1 s. En fallo, Q queda a cero; el rearme manual exige I0.0. Es un ladder didáctico del secuenciador, no un archivo para cargar a un PLC comercial.</p></details>`;
 host.append(panel);
 const details=document.createElement('details');details.className='plc-inspection';details.innerHTML='<summary>Explorar las piezas del circuito 3D</summary>';host.after(details);details.append(inspector);
 panel.querySelector('#ladderPlay').onclick=onPlay;panel.querySelector('#ladderScan').onclick=onScan;
 let selected='01',cache='';
 panel.querySelector('#ladderRungs').onclick=e=>{const b=e.target.closest('button');if(b){selected=b.dataset.rung;cache='';onChange();}};
 return {panel,update(s,stroke,dwell,playing,disabled){
  const rows=s.scan?.rows||ladderRows(s,stroke,dwell),image=s.scan?.state||s.state;
  panel.querySelector('#ladderPlay').textContent=playing?'Pausar':'Reproducir';panel.querySelector('#ladderPlay').disabled=disabled;panel.querySelector('#ladderScan').disabled=disabled;
  const key=JSON.stringify([rows,s.state,Math.floor(s.time*10),playing,selected]);if(key===cache)return;cache=key;
  panel.querySelector('#ladderClock').textContent=`${s.scan?'Último scan':'Antes del primer scan'} · ${s.time.toFixed(2)} s · ${stages[image]} → ${stages[s.state]} · t=${(s.scan?.age||0).toFixed(2)} s`;
  const rungs=panel.querySelector('#ladderRungs');
  for(const r of rows){let button=rungs.querySelector(`[data-rung="${r.id}"]`);if(!button){button=document.createElement('button');button.dataset.rung=r.id;rungs.append(button);}button.className=`ladder-rung ${r.active&&s.scan?'energized':''}`;button.setAttribute('aria-pressed',String(selected===r.id));button.setAttribute('aria-label',`${r.id}. ${r.note} ${r.contacts.map(c=>c.tag+': '+(c.pass?'verdadero':'falso')).join(', ')}`);const markup=`<span>${r.id}</span>${rung(r)}`;if(button.innerHTML!==markup)button.innerHTML=markup;}
  const advance=s.state==='EXTEND',hold=s.state==='WAIT_END';
  panel.querySelector('#ladderOutput').innerHTML=`<span class="eyebrow">08 · SALIDA DESPUÉS DE ACTUALIZAR ETAPA</span><svg viewBox="0 0 420 128" role="img" aria-label="Avance O espera final activa la bobina Q0.0. Q0.0 = ${Number(s.q)}"><path class="rail on" d="M15 12v108"/><path class="rail" d="M405 12v108"/>${wire(15,55,42,true)}<path class="wire on" d="M55 42v52H94"/>${wire(55,94,42,true)}${contact({tag:'Avance',pass:advance},100,42)}${contact({tag:'Espera final',pass:hold},100,94)}${wire(106,230,42,advance)}<path class="wire ${hold?'on':''}" d="M106 94H230V42"/>${wire(230,320,42,s.q)}<g class="coil ${s.q?'on':''}"><text x="345" y="19">Q0.0 / Y1</text><path d="M333 27Q314 42 333 57M357 27Q376 42 357 57"/><text x="345" y="47">${Number(s.q)}</text></g>${wire(370,405,42,s.q)}</svg><strong>${s.q?'Y1 energizada → avance / mantener extendido':'Y1 desenergizada → retorno por muelle'}</strong>`;
  const r=rows.find(r=>r.id===selected);const readText=`${r.id} · ${r.note} ${s.scan?(r.active?'Se ejecutó en este scan.':'No se ejecutó en este scan.'):'Aún no ejecutado.'}`;const read=panel.querySelector('#ladderRead');if(read.textContent!==readText)read.textContent=readText;
 }};
}

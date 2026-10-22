import {differences} from './comparison-model.mjs';
import {dualRows,dualStages} from './dual-model.mjs';
import {runSVG,controlledOutputSVG} from './operator.mjs';
import {rung} from './ladder.mjs';
export function changedParts(a,b){const keys=differences(a,b),parts=[];for(const k of keys){parts.push(...({x:['A_piston'],y:['B_piston'],i0:['sensor_i0'],i1:['sensor_i1'],i2:['sensor_i2'],i3:['sensor_i3'],q:['A_valve','A_spool'],qB:['B_valve','B_spool'],pressure:['A_regulator','manifold'],pressureOK:['A_regulator'],fault:['plc'],state:[]}[k]||[]));}return [...new Set(parts)];}
export function highlightViews(s,peer){
 const mark=(el,on)=>{if(el)el.classList.toggle('comparison-difference',!!on);};
 const compare=(selector,markup)=>{const el=document.querySelector(selector);if(!el)return;const temp=document.createElement('div');temp.innerHTML=markup;const other=temp.querySelectorAll('.contact,.coil');el.querySelectorAll('.contact,.coil').forEach((g,i)=>mark(g,other[i]&&g.classList.contains('on')!==other[i].classList.contains('on')));};
 compare('#runLadder',runSVG(peer));compare('#ladderOutput',controlledOutputSVG(peer,'q','Q0.0')+controlledOutputSVG(peer,'qB','Q0.1'));
 compare('#pressureLadder',rung({enabled:true,contacts:[{tag:'PS / I0.4',pass:!peer.pressureOK,nc:true}],active:!peer.pressureOK,next:'FAULT'},dualStages));
 const rows=s.scan?.rows||dualRows(s,2,2),other=peer.scan?.rows||dualRows(peer,2,2);
 for(const row of rows){const p=other.find(r=>r.id===row.id),selector='[data-rung="'+row.id+'"]';compare(selector,rung(p,dualStages));mark(document.querySelector(selector),row.active!==p.active||row.enabled!==p.enabled);}
 const ts=s.scan?.timers||s.timers,ps=peer.scan?.timers||peer.timers;
 ['AP','BP','BM','AM'].forEach((k,i)=>{const a=ts[k]||{},b=ps[k]||{},el=document.querySelectorAll('.ton-network')[i];mark(el,Math.abs((a.et||0)-(b.et||0))>1e-8||!!a.q!==!!b.q);mark(el?.querySelector('.contact'),!!a.input!==!!b.input);});
 mark(document.querySelector('#ctuNetwork .contact'),s.countPulse!==peer.countPulse);mark(document.querySelector('.counter-panel'),s.cycles!==peer.cycles||s.complete!==peer.complete);
 ['i0','i1','i2','i3'].forEach((k,i)=>mark(document.querySelectorAll('#hmiInputs>span')[i],s[k]!==peer[k]));
 ['x','y'].forEach((k,i)=>mark(document.querySelectorAll('.hmi-position')[i],Math.abs(s[k]-peer[k])>1e-8));
 mark(document.querySelector('#hmiPressure'),s.pressure!==peer.pressure);mark(document.querySelector('#hmiAlarms'),s.fault!==peer.fault);
}

import {canHint} from './adaptive.mjs';
import {context} from './guided-progress.mjs';
import {frame} from './model.mjs';
export const createGuide=()=>({date:new Date().toISOString(),hintLog:[],level:'support',phase:'question',round:1,log:[],hinted:false,wrong:[],message:''});
export function recommendation(s){const v=frame(s),has=k=>s.measured.includes(k);
 if(has('battery')&&v.loaded<9||has('command')&&!v.command||has('drop')&&v.cranks&&v.drop>1||has('spark')&&v.cranks&&!v.spark||has('fuel')&&!v.fuel||has('compression')&&v.compression<7||has('charge')&&v.charge<13)return {choices:[],reason:'Ya hay evidencia anormal suficiente para proponer una causa en este caso de una sola avería. Confirma el diagnóstico, repara y vuelve a verificar.'};
 if(v.running)return {choices:['charge'],reason:'Con el motor funcionando, compara el aporte del sistema de carga.'};
 if(!v.cranks)return {choices:['battery','command'].filter(k=>!has(k)),reason:'El motor no gira. Primero separa disponibilidad de energía y llegada de la orden; una prueba de compresión necesita giro.'};
 if(v.rpm<100)return {choices:has('battery')?['drop']:['battery'],reason:has('battery')?'La batería sostiene tensión: busca pérdidas en la conexión de retorno bajo carga.':'Hay giro lento. Comprueba primero si la batería sostiene la demanda antes de atribuirlo a una conexión.'};
 return {choices:['spark','fuel','compression'].filter(k=>!has(k)),reason:'El giro es normal: encendido, alimentación y compresión son comprobaciones útiles. Aquí se aceptan distintos órdenes entre las pruebas pendientes.'};
}
export function chooseTest(s,g,id){if(g.phase!=='question')return false;const r=recommendation(s),ok=r.choices.includes(id);if(!ok){if(!g.wrong.includes(id)){g.wrong.push(id);s.errors++;g.log.push({round:g.round,choice:id,correct:false,before:context(s),recommended:[...r.choices]});}g.message='Esa prueba no es la prioridad en este punto o ya está comprobada. −10 solo la primera vez que eliges esta opción en este paso. '+(g.level==='challenge'?'Vuelve a observar el síntoma; ya puedes pedir una pista.':r.reason);return false;}g.log.push({round:g.round,choice:id,correct:true,before:context(s),recommended:[...r.choices]});g.phase='review';g.message='Elección útil. '+r.reason;return true;}
export function guideHint(s,g){if(!canHint(g))return g.message;if(!g.hinted){g.hinted=true;s.hints++;g.hintLog.push({round:g.round,before:context(s),recommended:[...recommendation(s).choices]});}g.message='Pista (−10, una por paso): '+recommendation(s).reason;return g.message;}
export function nextQuestion(s,g){if(g.phase!=='review')return;g.round++;g.hinted=false;g.wrong=[];g.message='';g.phase=recommendation(s).choices.length?'question':'complete';}

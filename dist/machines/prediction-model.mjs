const signals=[
 ...['i0','i1','i2','i3'].map((k,i)=>({id:k,label:['Sensor a0','Sensor a1','Sensor b0','Sensor b1'][i],type:'sensor',read:s=>!!s[k]})),
 {id:'ps',label:'Presostato PS',type:'sensor',read:s=>!!s.pressureOK},
 {id:'q',label:'Salida YA / Q0.0',type:'salida',read:s=>!!s.q},
 {id:'qB',label:'Salida YB / Q0.1',type:'salida',read:s=>!!s.qB},
 {id:'permit',label:'Contacto RUN válido',type:'contacto',read:s=>s.run&&!s.fault},
 {id:'p01',label:'Contacto negado PS / P01',type:'contacto',read:s=>!s.pressureOK},
 ...['AP','BP','BM','AM'].map((k,i)=>({id:'T'+(i+1),label:'Contacto T'+(i+1)+'.Q',type:'contacto',read:s=>!!s.timers[k]?.q}))
];
export function predictionEvents(experiment){const events=[];for(let i=1;i<experiment.frames.length;i++){const before=experiment.frames[i-1],after=experiment.frames[i],changes=[];for(const bank of ['fault','normal'])for(const signal of signals){const from=signal.read(before[bank]),to=signal.read(after[bank]);if(from!==to)changes.push({bank,id:signal.id,label:signal.label,type:signal.type,from:Number(from),to:Number(to)});}if(!changes.length)continue;
 const bank=changes.some(c=>c.bank==='fault')?'fault':'normal',pool=changes.filter(c=>c.bank===bank),answer=pool[events.length%pool.length];
 const distractors=signals.filter(s=>!pool.some(c=>c.id===s.id)).slice(0,3).map(s=>({id:s.id,label:s.label,type:s.type}));
 const options=[...distractors,{id:answer.id,label:answer.label,type:answer.type}];const shift=events.length%options.length;options.push(...options.splice(0,shift));
 events.push({index:i,bank,answer,options,changes});}return events;}
export function createPrediction(experiment){return {events:predictionEvents(experiment),at:0,phase:'question',attempts:0,hints:0,results:[],feedback:''};}
export function predictionAnswer(g,id,reveal=false){if(g.phase!=='question')return false;const e=g.events[g.at];if(!reveal&&!e.options.some(o=>o.id===id))return false;if(!reveal&&id!==e.answer.id){g.attempts++;g.feedback='Esa señal no cambia en el siguiente scan. Revisa el estado actual y vuelve a intentarlo.';return false;}const points=reveal?0:Math.max(0,100-g.attempts*20-g.hints*10);g.results.push({points,attempts:g.attempts,hints:g.hints,revealed:reveal});g.phase='answer';g.feedback=reveal?'Solución consultada · 0 puntos.':'Predicción correcta · '+points+' puntos.';return true;}
export function predictionHint(g){if(g.phase==='question')g.hints=Math.min(2,g.hints+1);}
export function predictionScore(g){return g.results.length?Math.round(g.results.reduce((s,r)=>s+r.points,0)/g.results.length):0;}

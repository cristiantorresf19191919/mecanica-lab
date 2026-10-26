export const required={mechanics:['battery','ground'],electronics:['input','output'],hydraulics:['speed','flow','leak'],pneumatics:['supply','exhaust']};
export const answers={mechanics:'ground',electronics:'clipping',hydraulics:'leak',pneumatics:'restriction'};
export function createWorkshop(kind){if(!required[kind])throw Error('Unknown case');return {kind,repaired:false,diagnosed:false,verified:false,measurements:[],attempts:0,time:0};}
export function snapshot(s,healthy=false,t=s.time){const good=healthy||s.repaired,kind=s.kind;
 if(kind==='mechanics')return {kind,rest:12.6,loaded:10.8,drop:good?.15:2.8,rpm:good?220:65,cranks:true,spark:true,combustion:good,command:true,running:false};
 if(kind==='electronics'){const inputPeak=good?2:3,gain=5,rail=12,angle=t*Math.PI;return {kind,inputPeak,gain,rail,outputPeak:Math.min(rail,inputPeak*gain),input:inputPeak*Math.sin(angle),output:Math.max(-rail,Math.min(rail,inputPeak*gain*Math.sin(angle))),clipped:inputPeak*gain>rail,angle,t,a:gain,effectiveGain:gain};}
 const advance=t%8<4,elapsed=t%4,stroke=100;
 if(kind==='hydraulics'){const inlet=6,leak=good?0:3,useful=inlet-leak,speed=useful/60*1000;const x=advance?Math.min(1,elapsed*speed/stroke):Math.max(0,1-elapsed*speed/stroke);return {kind,advance,x,position:x*stroke,inlet,leak,useful,speed,pressure:20,moving:elapsed*speed<stroke};}
 const p=4,back=good?.2:3,area=Math.PI*.04**2/4,annular=area*.75,speed=advance?(good?100:25):100,x=advance?Math.min(1,elapsed*speed/stroke):Math.max(0,1-elapsed*speed/stroke);return {kind,advance,x,position:x*stroke,speed,supply:p,gaugePressure:p,back:advance?back:.2,pA:advance?p:.2,pB:advance?back:p,force:advance?p*1e5*area-back*1e5*annular:p*1e5*annular-.2*1e5*area,paths:advance?['1→2','4→5']:['1→4','2→3'],compressorAngle:t*2,phase:advance?0:2,moving:elapsed*speed<stroke};
}
export function measureWorkshop(s,id){if(!required[s.kind].includes(id))return null;s.time=.5;const item={id,repaired:s.repaired,actual:snapshot(s),normal:snapshot(s,true)};s.measurements=s.measurements.filter(m=>!(m.id===id&&m.repaired===s.repaired));s.measurements.push(item);return item;}
export function hasEvidence(s,after=false){return required[s.kind].every(id=>s.measurements.some(m=>m.id===id&&m.repaired===after));}
export function diagnoseWorkshop(s,id){if(s.repaired||s.verified)return 'locked';if(!hasEvidence(s))return 'evidence';s.attempts++;if(id!==answers[s.kind])return 'wrong';s.diagnosed=true;return 'diagnosed';}
export function repairWorkshop(s){if(!s.diagnosed)return false;if(s.repaired)return false;s.repaired=true;s.time=0;return true;}
export function verifyWorkshop(s){if(!s.repaired||!hasEvidence(s,true))return false;for(let i=0;i<800;i++){const t=i/100;const a=snapshot(s,false,t),b=snapshot(s,true,t);if(JSON.stringify(a)!==JSON.stringify(b))return false;}s.verified=true;return true;}

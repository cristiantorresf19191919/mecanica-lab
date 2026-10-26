export const required={mechanics:['battery','ground'],electronics:['input','output'],hydraulics:['speed','flow','leak'],pneumatics:['supply','exhaust']};
export const answers={mechanics:'ground',electronics:'clipping',hydraulics:'leak',pneumatics:'restriction'};
export function createWorkshop(kind){if(!required[kind])throw Error('Unknown case');return {kind,repaired:false,diagnosed:false,verified:false,measurements:[],attempts:0,time:0};}
export const faultModes=['primary','alternate','combined','intermittent-primary','intermittent-alternate'];
export const isIntermittent=s=>s.fault?.startsWith('intermittent-');
export const sampleTimes=s=>isIntermittent(s)?[.5,1.25]:[.5];
export function faultFlags(s,healthy,t){
 const enabled=!healthy&&!s.repaired&&(!isIntermittent(s)||(t%2>=.75&&t%2<1.75));
 return {primary:enabled&&s.fault!=='alternate'&&s.fault!=='intermittent-alternate',alternate:enabled&&['alternate','combined','intermittent-alternate'].includes(s.fault)};
}
export function correctDiagnosis(s){return s.fault==='combined'?'combined':isIntermittent(s)?s.fault:s.fault==='alternate'?({mechanics:'battery',electronics:'gain',hydraulics:'pump',pneumatics:'compressor'})[s.kind]:answers[s.kind];}
// Integrate piecewise prescribed speeds, retaining position/angle at fault transitions.
function integrate(s,healthy,t,rate,clamp=false){let value=0,start=0;const edges=[.75,1.75,2.75,3.75,4,4.75,5.75,6.75,7.75,8];for(const edge of edges){const end=Math.min(t,edge);if(end>start){value+=rate((start+end)/2)*(end-start);if(clamp)value=Math.max(0,Math.min(100,value));}if(end>=t)break;start=edge;}return value;}
export function snapshot(s,healthy=false,t=s.time){const kind=s.kind,{primary,alternate:alt}=faultFlags(s,healthy,t),good=!primary&&!alt;
 if(kind==='mechanics'){const speed=u=>{const f=faultFlags(s,healthy,u);return f.primary&&f.alternate?35:f.primary||f.alternate?65:220;};return {kind,rest:12.6,loaded:alt?8:10.8,drop:primary?2.8:.15,rpm:speed(t),turns:integrate(s,healthy,t,speed)/120*.15,cranks:true,spark:true,combustion:good,command:true,running:false};}
 if(kind==='electronics'){const inputPeak=primary?3:2,gain=alt?8:5,rail=12,angle=t*Math.PI;return {kind,inputPeak,gain,rail,outputPeak:Math.min(rail,inputPeak*gain),input:inputPeak*Math.sin(angle),output:Math.max(-rail,Math.min(rail,inputPeak*gain*Math.sin(angle))),clipped:inputPeak*gain>rail,angle,t,a:gain,effectiveGain:gain};}
 const advance=t%8<4,stroke=100;
 if(kind==='hydraulics'){const inlet=alt?3:6,leak=primary?3:0,useful=inlet-leak,speed=useful/60*1000;
 const position=integrate(s,healthy,t,u=>{const f=faultFlags(s,healthy,u);return ((f.alternate?3:6)-(f.primary?3:0))/60*1000*(u<4?1:-1);},true),x=position/stroke;
 return {kind,advance,x,position,inlet,leak,useful,speed,pressure:20,moving:speed>0&&(advance?x<1:x>0)};}
 const p=alt?2:4,back=primary?3:.2,area=Math.PI*.04**2/4,annular=area*.75;
 const velocity=u=>{const f=faultFlags(s,healthy,u);return u>=4?-100:f.primary&&f.alternate?0:f.primary||f.alternate?25:100;};
 const speed=Math.abs(velocity(t)),position=integrate(s,healthy,t,velocity,true),x=position/stroke;
 return {kind,advance,x,position,speed,supply:p,gaugePressure:p,back:advance?back:.2,pA:advance?p:.2,pB:advance?back:p,force:advance?p*1e5*area-back*1e5*annular:p*1e5*annular-.2*1e5*area,paths:advance?['1→2','4→5']:['1→4','2→3'],compressorAngle:t*2,phase:advance?0:2,moving:speed>0&&(advance?x<1:x>0)};
}
export function measureWorkshop(s,id){if(!required[s.kind].includes(id))return null;s.time=isIntermittent(s)&&s.sampleTime===1.25?1.25:.5;const item={id,time:s.time,repaired:s.repaired,actual:snapshot(s),normal:snapshot(s,true)};s.measurements=s.measurements.filter(m=>!(m.id===id&&m.repaired===s.repaired&&(m.time??.5)===s.time));s.measurements.push(item);return item;}
export function hasEvidence(s,after=false){return required[s.kind].every(id=>sampleTimes(s).every(time=>s.measurements.some(m=>m.id===id&&m.repaired===after&&(m.time??.5)===time)));}
export function diagnoseWorkshop(s,id){if(s.repaired||s.verified)return 'locked';if(!hasEvidence(s))return 'evidence';s.attempts++;if(id!==correctDiagnosis(s))return 'wrong';s.diagnosed=true;return 'diagnosed';}
export function repairWorkshop(s){if(!s.diagnosed)return false;if(s.repaired)return false;s.repaired=true;s.time=0;return true;}
export function verifyWorkshop(s){if(!s.repaired||!hasEvidence(s,true))return false;for(let i=0;i<800;i++){const t=i/100;const a=snapshot(s,false,t),b=snapshot(s,true,t);if(JSON.stringify(a)!==JSON.stringify(b))return false;}s.verified=true;return true;}

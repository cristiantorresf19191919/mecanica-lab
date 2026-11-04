import {ratio} from './config.mjs';
export function readings(stage,setting,rpm,torque,efficiency=1,load=100){
 const q=ratio(stage,setting),speed=rpm*Math.abs(q),out=q?torque*efficiency/Math.abs(q):0;
 const teeth=stage===5?[12,12,18,24,30][setting]:18;
 // Standard illustrative module 2 mm; bench geometry uses a proportional display scale.
 const radius=teeth*.002/2,force=torque/radius,power=torque*rpm*Math.PI/30;
 return {q,speed,out,teeth,radius,force,power,delivered:q?power*efficiency:0,loss:q?power*(1-efficiency):0,lift:out/.1,height:speed*2*Math.PI*.1/60,required:load*.1,canLift:out/.1>load};
}

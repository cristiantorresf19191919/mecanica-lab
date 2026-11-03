import {sample,duration as healthyEnd,shaft,ramp} from './upshift.mjs';
export const end=3.8,contact=2.15;
export function compare(time,wait=false){
 const t=Math.max(0,Math.min(time,end)),h=sample(t);
 // The healthy bench keeps rotating in second while the other bench finishes.
 if(t>healthyEnd){const dt=(t-healthyEnd)*Math.PI/30;h.t=t;h.engine.angle+=dt*h.engine.rpm;h.input.angle+=dt*h.input.rpm;h.outputAngle+=dt*h.output}
 const input=shaft(t,.9,2.9,900,500),second=-.6*input.rpm,delta=Math.abs(second+300);
 const clash=!wait&&t>=contact&&t<2.39;
 const approach=!wait?.105*ramp(t,1.95,contact):0;
 const rebound=!wait?.105*ramp(t,contact,2.39):0;
 const taps=clash?.028*Math.abs(Math.sin(3*Math.PI*ramp(t,contact,2.39))):0;
 const sleeve=-.31+.31*ramp(t,.4,.65)+.18*ramp(t,.65,.9)+approach-rebound-taps+.13*ramp(t,2.95,3.15);
 const phase=t<.4?0:t<.9?1:t<2.9?2:t<3.15?3:t<3.4?4:t<3.65?5:6;
 return [h,{t,engine:{...h.engine},input,second,output:-300,outputAngle:-300*t*Math.PI/30,delta,sleeve,phase,clash,
 open:ramp(t,.2,.4)-ramp(t,3.4,3.65),locked:t<.4?1:t>=3.15?2:0}];
}

// A deliberate attempt to pass the blocker. If the speeds differ, the dogs
// touch and recoil; a rejected attempt never silently turns into engagement.
export function manualPair(time,attempt=null){
 const t=Math.max(0,Math.min(time,4.6));
 return [1.9,2.9].map(match=>{
  const engine=shaft(t,.4,2.9,900,500),input=shaft(t,.9,match,900,500);
  const second=-.6*input.rpm,delta=Math.abs(second+300);
  const elapsed=attempt===null?-1:t-attempt;
  const smooth=attempt!==null&&attempt>=match,hit=elapsed>=0&&!smooth&&elapsed<.24;
  const locked=t<.4?1:smooth&&elapsed>=.16?2:0;
  const close=Math.max(2.9,(attempt??0)+.22);
  const sleeve=-.31+.31*ramp(t,.4,.65)+.18*ramp(t,.65,.9)+(elapsed<0?0:smooth?.13*ramp(elapsed,0,.16):hit?.1*(1-elapsed/.24)-.018*Math.abs(Math.sin(3*Math.PI*elapsed/.24)):0);
  return {t,engine,input,output:-300,outputAngle:-300*t*Math.PI/30,second,delta,sleeve,clash:hit,locked,
   open:ramp(t,.2,.4)-(smooth?ramp(t,close,close+.16):0),
   phase:t<.4?0:t<.9?1:hit?2:locked===2?(t<close?4:t<close+.16?5:6):t<match?2:3};
 });
}

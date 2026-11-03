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

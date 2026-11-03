// Prescribed rolling upshift. Signed output is opposite the input across an external mesh.
export const duration=3.2;
const clamp=x=>Math.max(0,Math.min(1,x));
export const ramp=(t,start,end)=>clamp((t-start)/(end-start));
// Integral in rpm·seconds of a linear speed transition, including both plateaus.
export function shaft(t,start,end,initial,final){
 const u=ramp(t,start,end),dt=end-start;
 return {rpm:initial+(final-initial)*u,angle:Math.PI/30*(initial*t+(final-initial)*(dt*u*u/2+Math.max(0,t-end)))};
}
export const milestones=[0,.4,.9,1.9,2.15,2.55,3];
export function sample(time){
 const t=Math.max(0,Math.min(duration,time)),engine=shaft(t,.4,2.9,900,500),input=shaft(t,.9,1.9,900,500);
 const output=-300,second=-.6*input.rpm,phase=milestones.filter(x=>x<=t).length-1;
 const sleeve=-.31+.31*ramp(t,.4,.65)+.18*ramp(t,.65,.9)+.13*ramp(t,1.95,2.15);
 return {t,phase,engine,input,output,outputAngle:output*t*Math.PI/30,second,delta:Math.abs(second-output),sleeve,
 open:ramp(t,.2,.4)-ramp(t,2.9,3),locked:t<.4?1:t>=2.15?2:0};
}

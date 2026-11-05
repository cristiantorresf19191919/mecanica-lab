// Steady periodic solution of a full-wave bridge feeding a parallel R and C.
// Angles refer to one rectified half-cycle, so the period is pi radians.
const pi=Math.PI, w=2*pi*50;
function crossing(lo,hi,positive) {
  for(let n=0;n<48;n++){const mid=(lo+hi)/2;if(positive(mid))hi=mid;else lo=mid;}
  return (lo+hi)/2;
}
// Ideal series regulator. Its input current equals the resistive load current.
export const targetVoltage = 8;
export const dropoutVoltage = 1;
export const minimumInput = targetVoltage + dropoutVoltage;
const regulatedVoltage = voltage => Math.min(targetVoltage, Math.max(0, voltage - dropoutVoltage));

function reservoirVoltage(initial, seconds, timeConstant, enabled) {
  if (!enabled) return initial * Math.exp(-seconds / timeConstant);
  if (initial <= dropoutVoltage) return initial;
  // While regulated the resistor draws constant current and Vcap falls linearly.
  const holdTime = Math.max(0, initial - minimumInput) * timeConstant / targetVoltage;
  if (seconds <= holdTime) return initial - seconds * targetVoltage / timeConstant;
  // In dropout the current falls with Vout = Vcap - Vdrop.
  const start = Math.min(initial, minimumInput);
  return dropoutVoltage + (start - dropoutVoltage) * Math.exp(-(seconds - holdTime) / timeConstant);
}
let cache;
export function rectifier([peak,drop,uf=0,R=1000,enabled=0],u){
  const C=uf*1e-6,D=2*drop,max=Math.max(0,peak-D),input=peak*Math.sin(2*pi*u);
  const phi=((2*pi*u)%pi+pi)%pi,bare=Math.max(0,Math.abs(input)-D);
  const loadVoltage = enabled ? regulatedVoltage : voltage => voltage;
  let output=bare,min=0,capCurrent=0,bridgeCurrent=loadVoltage(bare)/R;
  if(C>0 && max>0){
    const key=[peak,drop,uf,R,enabled].join(':');
    if(cache?.key!==key){
      const threshold=Math.asin(D/peak);
      const v=x=>peak*Math.sin(x)-D;
      const off=crossing(pi/2,pi-threshold,x=>loadVoltage(v(x))/R+C*w*peak*Math.cos(x)<=0);
      const decay=x=>reservoirVoltage(v(off),x/w,R*C,enabled);
      const on=crossing(threshold,pi/2,x=>v(x)>=decay(pi+x-off));
      cache={key,on,off,min:v(on),decay};
    }
    const {on,off,decay}=cache;min=cache.min;
    if(phi>=on && phi<=off){
      capCurrent=C*w*peak*Math.cos(phi);
      bridgeCurrent=Math.max(0,loadVoltage(bare)/R+capCurrent);
    }else{
      output=decay((phi-off+pi)%pi);capCurrent=-loadVoltage(output)/R;bridgeCurrent=0;
    }
  }
  return {loadVoltage:loadVoltage(output), enabled, margin:output-minimumInput, input,bare,output,current:loadVoltage(output)/R,capCurrent,bridgeCurrent,ripple:max-min,charge:C*output};
}

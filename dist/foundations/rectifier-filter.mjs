// Steady periodic solution of a full-wave bridge feeding a parallel R and C.
// Angles refer to one rectified half-cycle, so the period is pi radians.
const pi=Math.PI, w=2*pi*50;
function crossing(lo,hi,positive) {
  for(let n=0;n<48;n++){const mid=(lo+hi)/2;if(positive(mid))hi=mid;else lo=mid;}
  return (lo+hi)/2;
}
let cache;
export function rectifier([peak,drop,uf=0,R=1000],u){
  const C=uf*1e-6,D=2*drop,max=Math.max(0,peak-D),input=peak*Math.sin(2*pi*u);
  const phi=((2*pi*u)%pi+pi)%pi,bare=Math.max(0,Math.abs(input)-D);
  let output=bare,min=0,capCurrent=0,bridgeCurrent=bare/R;
  if(C>0 && max>0){
    const key=[peak,drop,uf,R].join(':');
    if(cache?.key!==key){
      const threshold=Math.asin(D/peak);
      const v=x=>peak*Math.sin(x)-D;
      const off=crossing(pi/2,pi-threshold,x=>v(x)/R+C*w*peak*Math.cos(x)<=0);
      const decay=x=>v(off)*Math.exp(-x/(w*R*C));
      const on=crossing(threshold,pi/2,x=>v(x)>=decay(pi+x-off));
      cache={key,on,off,min:v(on),decay};
    }
    const {on,off,decay}=cache;min=cache.min;
    if(phi>=on && phi<=off){
      capCurrent=C*w*peak*Math.cos(phi);
      bridgeCurrent=Math.max(0,bare/R+capCurrent);
    }else{
      output=decay((phi-off+pi)%pi);capCurrent=-output/R;bridgeCurrent=0;
    }
  }
  return {input,bare,output,current:output/R,capCurrent,bridgeCurrent,ripple:max-min,charge:C*output};
}

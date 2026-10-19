export const TAU=2*Math.PI;
export function engineState(u,r=.55,l=1.85){const angle=u*TAU*2,phase=Math.min(3,Math.floor(((u%1)+1)%1*4)),pin=[r*Math.sin(angle),1.1+r*Math.cos(angle),0],pistonY=1.1+r*Math.cos(angle)+Math.sqrt(l*l-r*r*Math.sin(angle)**2);return {angle,phase,pin,pistonY,intake:phase===0?Math.sin((u% .25)*TAU*2)*.18:0,exhaust:phase===3?Math.sin((u%.25)*TAU*2)*.18:0,stroke:2*r};}
export function pressState(u,force=20,ratio=4){const travel=.9*(1-Math.cos(u*TAU))/2;return {travel,inputY:2.4-travel,outputY:1.65+travel/ratio,outputRadius:.48*Math.sqrt(ratio),pressure:force/2e-4,outputForce:force*ratio,inputMM:travel*40,outputMM:travel*40/ratio};}
export function motorState(t,f=50,slip=4){return {fieldAngle:TAU*f*t/100,rotorAngle:TAU*f*t/100*(1-slip/100),ns:60*f,nr:60*f*(1-slip/100),currents:[0,1,2].map(j=>Math.sin(TAU*f*t/100-j*TAU/3))};}

export const windingLayout=Array.from({length:6},(_,i)=>({angle:i*Math.PI/3+Math.PI/2,phase:[0,2,1,0,2,1][i],sign:i%2===0?1:-1}));

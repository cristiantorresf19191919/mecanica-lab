import {rectifier,minimumInput} from './rectifier-filter.mjs';

export function supplyMoment(values,u,shutdown){
  const m=rectifier(values,u);
  if(shutdown){
    // Settled unloaded bridge: an ideal reservoir retains the last peak.
    m.output=values[2]>0?Math.max(0,values[0]-2*values[1]):m.bare;
    m.margin=m.output-minimumInput;
    m.loadVoltage=m.current=m.bridgeCurrent=m.capCurrent=0;
    m.ripple=values[2]>0?0:Math.max(0,values[0]-2*values[1]);
    m.charge=m.output*values[2]*1e-6;
  }
  return {...m,values,u,shutdown,loss:(m.output-m.loadVoltage)*m.current};
}

export function cycle(values,shutdown=false){
  const samples=Array.from({length:241},(_,i)=>supplyMoment(values,i/240,shutdown));
  const watts=samples.slice(0,-1).reduce((sum,m)=>sum+m.loss,0)/240;
  return {samples,watts};
}

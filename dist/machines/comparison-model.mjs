import {createDual,commandDual,stepDual} from './dual-model.mjs';
import {traceSnapshot} from './trends-model.mjs';
export const comparedKeys=['x','y','i0','i1','i2','i3','q','qB','pressure','pressureOK','fault','state'];
export function differences(a,b){return comparedKeys.filter(k=>typeof a[k]==='number'?Math.abs(a[k]-b[k])>1e-8:a[k]!==b[k]);}
// Controlled experiment: same initial conditions and recipe; only one fault differs.
export function buildComparison(kind='pressure'){
 if(!['pressure','jam','sensor'].includes(kind))throw Error('Unknown comparison fault');
 const normal=createDual(),fault=createDual();normal.target=fault.target=1;
 commandDual(normal,'start');commandDual(fault,'start');
 const frames=[{normal:traceSnapshot(normal),fault:traceSnapshot(fault)}];
 let first=-1,alarm=-1,injection=-1;
 for(let i=1;i<=1500;i++){
  if(kind==='pressure'&&fault.time>=1){fault.lowPressure=true;if(injection<0)injection=i;}
  if(kind==='jam'&&fault.time>=1){fault.jamA=true;if(injection<0)injection=i;}
  if(kind==='sensor'&&fault.x>=1-1e-9){if(injection<0)injection=i;fault.disabledSensors.i1=Math.floor((i-injection)/7)%2===0;}
  stepDual(normal,2,2);stepDual(fault,2,2);
  const pair={normal:traceSnapshot(normal),fault:traceSnapshot(fault)};
  frames.push(pair);
  if(first<0&&differences(pair.normal,pair.fault).length)first=i;
  if(alarm<0&&fault.fault)alarm=i;
  if(normal.complete&&alarm>=0&&i>alarm+150)break;
 }
 return {kind,frames,first,alarm,injection};
}

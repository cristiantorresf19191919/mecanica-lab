import {TAU} from './model.mjs';
export const SCAN=.02;
export function createPLC(){return {time:0,x:0,q:false,i0:true,i1:false,state:'HOME',age:0,cycles:0,events:[],fault:false};}
export function stepPLC(s,stroke=2,dwell=.6,broken=false){
 s.time+=SCAN;s.age+=SCAN;
 // Plant moves under the PREVIOUS output. A scan then reads sensors, executes logic, writes Q.
 s.x=Math.max(0,Math.min(1,s.x+(s.q?1:-1)*SCAN/stroke));
 const i0=s.x<=1e-9,i1=s.x>=1-1e-9&&!broken;
 function log(message){s.events.unshift({t:s.time,message});s.events.length=Math.min(12,s.events.length);}
 if(i0!==s.i0)log('I0.0 · retraído = '+Number(i0));if(i1!==s.i1)log('I0.1 · extendido = '+Number(i1));s.i0=i0;s.i1=i1;
 const prev=s.state;
 if(s.state==='HOME'&&s.i0)s.state='WAIT_HOME';
 else if(s.state==='WAIT_HOME'&&s.age>=dwell)s.state='EXTEND';
 else if(s.state==='EXTEND'){if(s.i1)s.state='WAIT_END';else if(s.age>stroke+1)s.state='FAULT';}
 else if(s.state==='WAIT_END'&&s.age>=dwell){s.state='RETRACT';}
 else if(s.state==='RETRACT'){if(s.i0){s.state='WAIT_HOME';s.cycles++;}else if(s.age>stroke+1)s.state='FAULT';}
 if(prev!==s.state){s.age=0;log(prev+' → '+s.state);}
 s.fault=s.state==='FAULT';const q=s.state==='EXTEND'||s.state==='WAIT_END';if(q!==s.q)log('Q0.0 · bobina Y1 = '+Number(q));s.q=q;
 return s;
}
export function resetPLCFault(s){if(!s.i0||!s.fault)return false;s.state='WAIT_HOME';s.age=0;s.fault=false;s.events.unshift({t:s.time,message:'Rearme en posición retraída'});return true;}
export function plcFrame(s){const area=Math.PI*.04**2/4,advance=s.q;return {...s,advance,moving:advance?s.x<1:s.x>0,phase:advance?(s.i1?1:0):(s.i0?3:2),pA:advance?4:0,pB:advance?0:4,forceAdvance:4e5*area,forceReturn:3e5*area,positionMM:s.x*100,compressorAngle:s.time*TAU*1.2};}

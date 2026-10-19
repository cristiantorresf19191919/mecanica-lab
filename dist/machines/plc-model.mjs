import {ladderRows,ladderOutput} from './ladder-model.mjs';
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
 s.scan={time:s.time,state:prev,age:s.age,rows:ladderRows(s,stroke,dwell)};
 const transition=s.scan.rows.find(r=>r.active);
 if(transition){s.state=transition.next;if(transition.id==='05')s.cycles++;}
 if(prev!==s.state){s.age=0;log(prev+' → '+s.state);}
 s.fault=s.state==='FAULT';const q=ladderOutput(s);if(q!==s.q)log('Q0.0 · bobina Y1 = '+Number(q));s.q=q;
 return s;
}
export function resetPLCFault(s){if(!s.i0||!s.fault)return false;s.state='WAIT_HOME';s.age=0;s.fault=false;s.scan=null;s.events.unshift({t:s.time,message:'Rearme en posición retraída'});return true;}
export function plcFrame(s){const area=Math.PI*.04**2/4,advance=s.q;return {...s,advance,moving:advance?s.x<1:s.x>0,phase:advance?(s.i1?1:0):(s.i0?3:2),pA:advance?4:0,pB:advance?0:4,forceAdvance:4e5*area,forceReturn:3e5*area,positionMM:s.x*100,compressorAngle:s.time*TAU*1.2};}

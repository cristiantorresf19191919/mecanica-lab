import assert from 'node:assert/strict';
import {createShift,shiftAct,shiftState} from '../dist/bikes/shift-model.mjs';
for(let i=6;i<10;i++){
 const s=createShift('surprise',()=>i/10+.01);
 if(i<8){assert(!shiftState(s).aligned);const before=shiftState(s).gap;shiftAct(s,'adjust','trim',1);assert.equal(shiftState(s).gap,before);shiftAct(s,'adjust','trim',-1);while(Math.abs(s.b-1)>.01)shiftAct(s,'adjust','b',s.b<1?1:-1);}
 if(i===8){shiftAct(s,'select',null,1);const a=shiftState(s).error;shiftAct(s,'select',null,5);assert.notEqual(shiftState(s).error,a);assert.equal(shiftAct(s,'repair','hanger'),false);shiftAct(s,'inspect','hanger');shiftAct(s,'repair','hanger');assert(!s.hanger);}
 if(i===9){shiftAct(s,'select',null,2);shiftAct(s,'select',null,3);const a=shiftState(s).position;shiftAct(s,'select',null,4);shiftAct(s,'select',null,3);assert.notEqual(shiftState(s).position,a);shiftAct(s,'inspect','cable');shiftAct(s,'repair','cable');assert(!s.sticky);}
 for(const k of ['b','hanger','cable'])shiftAct(s,'inspect',k);shiftAct(s,'test','h');shiftAct(s,'test','l');for(let g=0;g<7;g++)shiftAct(s,'select',null,g);shiftAct(s,'verify');assert(s.done);
}
const s=createShift();shiftAct(s,'inspect','hanger');shiftAct(s,'repair','hanger');assert.equal(s.errors,1);assert.equal(Object.keys(s.checks).length,0);console.log('PASS B independence, hanger slope, cable hysteresis, inspect-before-repair, penalties and full verification for all new cases');

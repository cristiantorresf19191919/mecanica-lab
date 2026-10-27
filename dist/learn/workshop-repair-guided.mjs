import {newRepair,intervene,causes} from './workshop-repair-model.mjs';
import {repairRecommendation} from './workshop-repair-sequence.mjs';
export function newGuidedRepair(c){return {user:newRepair(c.repair),reference:newRepair(c.repair),order:repairRecommendation(c).recommended,phase:'question',rounds:[],hints:0,hinted:false};}
export const guidedScore=g=>Math.max(0,100-15*g.rounds.filter(r=>!r.useful).length-5*g.hints);
export function guidedRemaining(g){return g.order.filter(id=>!g.user.fixed.includes(id));}
export function guidedHint(g){if(g.phase!=='question'||g.hinted)return false;g.hints++;g.hinted=true;return true;}
export function chooseGuidedRepair(g,id){if(g.phase!=='question'||!['primary','alternate'].includes(id))return false;const recommended=guidedRemaining(g)[0];if(!recommended)return false;g.reference=structuredClone(g.user);intervene(g.reference,recommended);const useful=intervene(g.user,id);g.rounds.push({id,recommended,useful,hint:g.hinted});g.phase='feedback';return true;}
export function nextGuidedRepair(g){if(g.phase!=='feedback')return false;if(!guidedRemaining(g).length){g.phase='complete';return true;}g.phase='question';g.hinted=false;g.reference=structuredClone(g.user);return true;}

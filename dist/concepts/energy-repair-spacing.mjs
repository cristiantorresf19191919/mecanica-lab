import {createEnergySpacing} from './energy-spacing.mjs';
// Wrong interventions belong to the selected cause; premature checks to pending causes.
export function repairSpacingRows(rows){return rows.map(r=>({...r,exam:false,faults:[...new Set([...r.faults,...r.events.filter(e=>e.wrong&&e.choice).map(e=>e.choice)])],events:r.events.map(e=>e.wrong&&e.choice?{...e,targets:[e.choice]}:e)}));}
export function createRepairSpacing(storage){return createEnergySpacing(storage,{key:'mecanica.energy-repair-spacing.v1',preserveEarlyDue:true});}

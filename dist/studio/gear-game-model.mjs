export const motor = {rpm: 1200, torque: 12};
export const pitchModule = .085;
const meshEfficiency = .97;
export const modes = ['ringFixed','carrierFixed','sunFixed','locked'];
export const gearPairs = [[12,36],[18,30],[24,24],[30,18]];

const task = (es,en,rpm,torque,direction=0) => ({es,en,rpm,torque,direction});
export const levels = [
  {id:'lift',kind:'pair',title:['Sube la carga','Lift the crate'],copy:['El cabrestante necesita más par para levantar la caja. Cambia el piñón o la rueda y prueba la relación.','The winch needs more torque to lift the crate. Swap the pinion or driven gear and try the ratio.'],tasks:[task('Cabrestante','Winch',350,22)]},
  {id:'fan',kind:'pair',title:['Acelera el ventilador','Spin up the fan'],copy:['Aquí hacen falta revoluciones. Prueba una entrada grande y mira cuánto par queda en la salida.','This fan needs speed. Try a larger driver and watch how much torque remains at the output.'],tasks:[task('Ventilador','Fan',1800,5)]},
  {id:'axles',kind:'idler',title:['Encuentra el eje','Route the drive'],copy:['Lleva el giro al soporte superior y conserva el sentido del motor. Puedes insertar un piñón intermedio y mover el eje de salida.','Reach the upper mounting point and keep the motor’s direction. Insert an idler and move the output axle.'],tasks:[{...task('Soporte superior','Upper mount',500,14,1),mount:'upper'}]},
  {id:'compound',kind:'compound',title:['Multiplica en dos etapas','Compound the ratio'],copy:['Los dos piñones centrales comparten eje. Combina las dos reducciones para mover la prensa sin hacerla demasiado lenta.','The middle gears share a shaft. Combine two reductions to drive the press without slowing it too much.'],tasks:[task('Prensa','Press',370,32)]},
  {id:'planet',kind:'planet',title:['Bloquea la pieza correcta','Lock the right member'],copy:['Elige qué miembro del planetario queda fijo. Después cambia la configuración para invertir la salida.','Choose which planetary member to hold. Then change the configuration to reverse the output.'],tasks:[task('Arrastre hacia delante','Forward pull',240,38,1),task('Retorno en reversa','Reverse return',350,27,-1)]},
  {id:'manual',kind:'manual',title:['Conduce una caja manual','Drive a manual gearbox'],copy:['Abre el embrague, selecciona una marcha y vuelve a acoplar. Sube la rampa y cambia cuando el camino se abre.','Open the clutch, select a gear and engage it again. Climb the ramp and shift when the road opens up.'],tasks:[task('Rampa','Hill',350,31),task('Salida de curva','Corner exit',650,18),task('Recta','Straight',1700,6)]},
  {id:'auto',kind:'auto',title:['Deja cambiar a la automática','Let the automatic shift'],copy:['La caja usa un planetario con freno para la reducción y un embrague para la directa. Compara L, D y R con una carga cambiante.','This planetary transmission uses a brake for reduction and a clutch for direct drive. Compare L, D and R as the load changes.'],tasks:[task('Rampa','Hill',240,38,1),task('Recta','Straight',1000,10,1),task('Segunda rampa','Second hill',240,38,1)]}
];

export function initialConfig(kind) {
  return {driver:18,driven:24,idler:18,stageDriver:16,stageDriven:18,
    mount:'inline',gap:0,insert:false,sun:18,planet:18,mode:'locked',gear:0,clutch:false,range:'L'};
}

export function planetary(sun,planet,mode) {
  const ring = sun + 2*planet;
  const carrierReduction = sun/(sun+ring);
  const speeds = {
    ringFixed:{sun:1,ring:0,carrier:carrierReduction,output:carrierReduction,drive:'sun',takeoff:'carrier'},
    carrierFixed:{sun:1,ring:-sun/ring,carrier:0,output:-sun/ring,drive:'sun',takeoff:'ring'},
    sunFixed:{sun:0,ring:1,carrier:ring/(sun+ring),output:ring/(sun+ring),drive:'ring',takeoff:'carrier'},
    locked:{sun:1,ring:1,carrier:1,output:1,drive:'sun',takeoff:'carrier'}
  }[mode];
  return {...speeds,planet:speeds.carrier - sun/planet*(speeds.sun-speeds.carrier),ringTeeth:ring};
}

export function transmission(kind,c,task) {
  let speed=0, efficiency=meshEfficiency, mode=c.mode, stages=[], coupled=true;
  if (kind==='manual') {
    coupled=c.gear>0 && !c.clutch;
    if (c.gear>0) stages=[gearPairs[c.gear-1]];
    if(coupled) speed= -stages[0][0]/stages[0][1];
  } else if (kind==='planet' || kind==='auto') {
    if (kind==='auto') {
      mode=c.range==='R'?'carrierFixed':c.range==='L' || task.torque>motor.torque*.99?'ringFixed':'locked';
    }
    speed=planetary(c.sun,c.planet,mode).output;
    efficiency=mode==='locked'?.99:meshEfficiency**2;
  } else {
    coupled=c.gap===0;
    if(kind==='idler' && c.insert) stages=[[c.driver,c.idler],[c.idler,c.driven]];
    else if(kind==='compound') stages=[[c.driver,c.driven],[c.stageDriver,c.stageDriven]];
    else stages=[[c.driver,c.driven]];
    speed=coupled?stages.reduce((q,[input,output])=>-q*input/output,1):0;
    efficiency=meshEfficiency**stages.length;
  }
  const rpm=Math.abs(speed)*motor.rpm;
  const torque=speed?motor.torque*efficiency/Math.abs(speed):0;
  return {rpm,torque,speed,coupled,stages,mode};
}

export function testLoad(result,task,config) {
  if (!result.coupled) return 'open';
  if (task.mount && task.mount!==config.mount) return 'mount';
  if (task.direction && Math.sign(result.speed)!==task.direction) return 'direction';
  if (result.torque < task.torque) return 'torque';
  if (result.rpm < task.rpm) return 'rpm';
  return 'pass';
}

export const TAU=2*Math.PI;
export function calculate(id,type,a,b,t,on=true){
 const phase=TAU*a*t/100, result={phase,a,b,t,on};
 const metrics=(...x)=>{result.metrics=x;return result};
 if(type==='circuit'){result.i=on?a/b:0;return metrics(['Tensión',a,'V'],['Corriente',result.i,'A'],['Potencia',a*result.i,'W'])}
 if(type==='network'){result.req=on?2*b:b/2;return metrics(['Equivalente',result.req,'Ω'],['Corriente total',a/result.req,'A'],['Por resistencia',on?a/2:a,'V'])}
 if(type==='wave'){result.v=b*Math.sin(phase);return metrics(['Periodo',1000/a,'ms'],['Pico',b,'V'],['RMS',b/Math.SQRT2,'V'])}
 if(type==='three'){result.values=[0,1,2].map(i=>b*Math.SQRT2*Math.sin(phase-i*TAU/3));return metrics(['Fase RMS',b,'V'],['Línea RMS',b*Math.sqrt(3),'V'],['Suma instantánea',result.values.reduce((s,v)=>s+v,0),'V'])}
 if(type==='star'){result.vf=on?a/Math.sqrt(3):a;result.if=result.vf/b;result.il=on?result.if:Math.sqrt(3)*result.if;return metrics(['Carga por fase',result.vf,'V'],['Corriente de fase',result.if,'A'],['Corriente de línea',result.il,'A'])}
 if(type==='power'){result.phi=a*Math.PI/180;return metrics(['Activa',120*b*Math.cos(result.phi),'W'],['Reactiva',120*b*Math.sin(result.phi),'var'],['Aparente',120*b,'VA'])}
 if(type==='rectify')return metrics(['Frecuencia entrada',a,'Hz'],['Pulsos de salida',2*a,'Hz'],['Pico de salida',Math.max(0,b-1.4),'V']);
 if(type==='rc'){result.tau=a*b*1e-6;result.age=t%(5*result.tau);result.v=12*(on?1-Math.exp(-result.age/result.tau):Math.exp(-result.age/result.tau));return metrics(['Constante τ',result.tau,'s'],['Tiempo',result.age,'s'],['Condensador',result.v,'V'])}
 if(type==='pwm')return metrics(['Tensión media',a/100*b,'V'],['Tensión RMS',Math.sqrt(a/100)*b,'V'],['Potencia en 12 Ω',a/100*b*b/12,'W']);
 if(type==='magnet'){result.field=4e-7*Math.PI*b*a/.2;return metrics(['Corriente',a,'A'],['Amperio-vueltas',a*b,'A·v'],['Campo ideal',result.field*1000,'mT'])}
 if(type==='generator'){result.freq=a*b/120;result.angle=TAU*a/60*t/100;return metrics(['Giro mecánico',a,'rpm'],['Pares de polos',b/2,''],['Frecuencia',result.freq,'Hz'])}
 if(type==='motor'){result.ns=60*a;result.nr=result.ns*(1-b/100);result.fieldAngle=phase;result.rotorAngle=phase*(1-b/100);return metrics(['Campo, 2 polos',result.ns,'rpm'],['Rotor',result.nr,'rpm'],['Deslizamiento',b,'%'])}
 if(type==='gear'){result.ratio=a/16;return metrics(['Relación',result.ratio,':1'],['Salida',b/result.ratio,'rpm'],['Torque salida',2*result.ratio,'N·m'])}
 if(type==='relay'){result.active=on&&a>=18;return metrics(['Bobina',on?a/b:0,'A'],['Activación',result.active?1:0,''],['Carga independiente',result.active?12:0,'V'])}
 if(type==='efficiency')return metrics(['Entrada',a,'W'],['Útil',a*b/100,'W'],['Pérdidas',a*(1-b/100),'W']);
 if(type==='transformer'){result.v2=b*a/200;result.i2=result.v2/60;return metrics(['Secundario',result.v2,'V'],['Corriente secundaria',result.i2,'A'],['Corriente primaria',result.v2*result.i2/b,'A'])}
 if(type==='dcMotor'){result.e=.2*b;result.i=(a-result.e)/2;return metrics(['F.c.e.m.',result.e,'V'],['Armadura',result.i,'A'],['Torque',.2*result.i,'N·m'])}
 if(type==='stepper')return metrics(['Paso',360/b,'°'],['Posición',a*360/b,'°'],['Pulsos',a,'']);
 if(type==='measure')return metrics(['Longitud real',a,'mm'],['Lectura',Math.round(a/b)*b,'mm'],['Resolución',b,'mm']);
 if(type==='cart'){result.acc=id==='friction'?Math.max(0,a-b*2*9.81)/2:a/b;result.resist=id==='friction'?Math.min(a,b*2*9.81):0;result.age=t%4;result.x=.5*result.acc*result.age**2;return metrics(['Aceleración',result.acc,'m/s²'],['Velocidad',result.acc*result.age,'m/s'],[id==='friction'?'Rozamiento':'Posición',id==='friction'?result.resist:result.x,id==='friction'?'N':'m'])}
 if(type==='energy'){result.age=t%Math.sqrt(2*a/9.81);result.h=a-.5*9.81*result.age**2;return metrics(['Potencial',b*9.81*result.h,'J'],['Cinética',b*9.81*(a-result.h),'J'],['Total',b*9.81*a,'J'])}
 if(type==='piston')return metrics(['Presión',a/(b*1e-4)/1e5,'bar'],['Área',b,'cm²'],['Fuerza',a,'N']);
 if(type==='motion'){result.age=t%4;result.x=a*result.age+.5*b*result.age**2;result.v=a+b*result.age;return metrics(['Tiempo',result.age,'s'],['Posición',result.x,'m'],['Velocidad',result.v,'m/s'])}
 if(type==='vectors'){result.x=10+b*Math.cos(a*Math.PI/180);result.y=b*Math.sin(a*Math.PI/180);return metrics(['Componente x',result.x,'N'],['Componente y',result.y,'N'],['Resultante',Math.hypot(result.x,result.y),'N'])}
 if(type==='spring'){result.f=Math.sqrt(a/b)/TAU;result.x=.1*Math.cos(TAU*result.f*t);return metrics(['Natural',result.f,'Hz'],['Periodo',1/result.f,'s'],['Desplazamiento',result.x*1000,'mm'])}
 if(type==='gas')return metrics(['Volumen',a,'% inicial'],['Presión absoluta',b*100/a,'kPa'],['Producto relativo',b,'kPa·V₀']);
 if(type==='airpath'){result.out=id==='filter'?Math.max(0,a-b):Math.min(a,b);return metrics(['Entrada',a,'bar'],['Salida',result.out,'bar'],['Diferencia',a-result.out,'bar'])}
 if(type==='valve'||type==='cylinder'){result.area=Math.PI*(b/1000)**2/4;result.force=id==='throttle'?4e5*result.area:a*1e5*result.area;result.speed=id==='throttle'?a/60000/result.area:.05;return metrics(['Avance ideal',result.force,'N'],['Retorno ideal',result.force*.75,'N'],['Velocidad ilustrada',result.speed*1000,'mm/s'])}
 if(type==='atmosphere'){result.p=101.325*(1-2.25577e-5*a)**5.25588;return metrics(['Ambiente',result.p,'kPa abs'],['Interior',b,'kPa abs'],['Manométrica',b-result.p,'kPa'])}
 if(type==='sequence'){const cycle=2*a+b,age=t%cycle;result.stage=age<a?1:age<a+b?2:3;result.stroke=age<a?age/a:age<a+b?1:1-(age-a-b)/a;if(!on&&t>=a){result.stage=4;result.stroke=1}return metrics(['Estado',result.stage,''],['Posición',result.stroke*100,'%'],['Sensor fin',on&&result.stroke>.98?1:0,''])}
 if(type==='press'){result.stroke=(1-Math.cos(t))/2;return metrics(['Fuerza salida',a*b,'N'],['Carrera entrada',result.stroke*40,'mm'],['Carrera salida',result.stroke*40/b,'mm'])}
 if(type==='hydraulic'){result.relief=id==='pump'&&b>100;result.p=Math.min(b,100);return metrics(['Presión real',result.p,'bar'],['Potencia fluido',result.p*1e5*a/60000,'W'],['Caudal a actuador',result.relief?0:a,'L/min'])}
 if(type==='flow'){result.v1=a/60000/.0002;result.v2=a/60000/(b*1e-4);result.p2=100+.5*1000*(result.v1**2-result.v2**2)/1000;return metrics(['Entrada v₁',result.v1,'m/s'],['Garganta v₂',result.v2,'m/s'],['Garganta p₂',result.p2,'kPa man.'])}
 if(type==='tank')return metrics(['Incremento Δp',b*9.81*a/1000,'kPa'],['Profundidad',a,'m'],['Densidad',b,'kg/m³']);
 if(type==='engine'){result.angle=on?(t*a*720)%720:b;return metrics(['Cigüeñal',result.angle,'°'],['Vueltas por ciclo',2,''],['Tiempo',Math.floor(result.angle/180)+1,''])}
 if(type==='crank'){result.angle=t;result.position=a*Math.cos(t)+Math.sqrt(b*b-a*a*Math.sin(t)**2);return metrics(['Carrera',2*a,'mm'],['Posición desde eje',result.position,'mm'],['Ángulo',((t%TAU)*180/Math.PI),'°'])}
 if(type==='thermal')return metrics(['Calor transferido',a,'kW'],['Caudal másico',b,'kg/s'],['Incremento ΔT',a*1000/(b*4180),'K']);
 if(type==='differential')return metrics(['Rueda izquierda',a-b,'rpm'],['Rueda derecha',a+b,'rpm'],['Media',a,'rpm']);
 if(type==='brake'){result.remain=1-(t%5)/5;result.e=.5*b*(a/3.6)**2;return metrics(['Energía inicial',result.e/1000,'kJ'],['Cinética restante',result.e*result.remain**2/1000,'kJ'],['Calor disipado',result.e*(1-result.remain**2)/1000,'kJ'])}
 if(type==='conveyor'){result.age=t%(b/a+2);result.pos=result.age*a;return metrics(['Retardo nominal',b/a,'s'],['Distancia',b,'m'],['Velocidad',a,'m/s'])}
 if(type==='adc'){result.levels=2**b;result.code=Math.min(result.levels-1,Math.floor(a/5*result.levels));return metrics(['Código',result.code,''],['Escalón',5/result.levels*1000,'mV'],['Entrada',a,'V'])}
 if(type==='encoder'){result.angle=t*a/60*TAU;result.pulse=result.angle*b;return metrics(['Velocidad',a,'rpm'],['Cuentas/vuelta ×4',b*4,''],['Ángulo acumulado',result.angle*180/Math.PI,'°'])}
 if(type==='control')return metrics(['Referencia',id==='pi'?70:a,'mm'],['Kp',id==='pi'?a:b,''],['Ki',id==='pi'?b:0,'s⁻¹']);
 throw new Error('Unknown simulation '+id+' '+type);
}
export function controllerStep(state,ref,kp,ki,dt){const error=ref-state.y;const raw=kp*error+ki*state.integral;const u=Math.max(0,Math.min(100,raw));if(raw===u||(raw>100&&error<0)||(raw<0&&error>0))state.integral+=error*dt;state.y+=(u-state.y)*dt;state.u=u;return state;}

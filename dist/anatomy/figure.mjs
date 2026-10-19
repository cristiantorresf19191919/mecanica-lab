import * as k from './iso-kit.mjs';
import {model} from './model.mjs';
const kind=new URLSearchParams(location.search).get('kind')||'engine';
const names={physics:'Banco de fuerza y resorte',engine:'Dentro de un motor de cuatro tiempos',pneumatic:'Actuador neumático en corte',fluid:'La anatomía de una prensa',electric:'Electricidad sobre la mesa',electromechanical:'De la fuente a la carga'};
const P=k.fitProjection(k.boxCorners({x:-128,y:-67,w:256,d:134,r:5},-15,kind==='engine'?180:kind==='fluid'?140:55),620,430,{pad:24,azimuth:36,elevation:28});
const S=(x,y,w,d,z,h,tone='mid',lit=false)=>k.solidSvg(k.slabOf({x,y,w,d,r:Math.min(1.5,w/5,d/5)},z,h,P,3,.4),{tone,lit});
const L=(d,tone='lo',free=false)=>k.lineSvg(d,{tone,free});
const dot=(x,y,z)=>k.dotsSvg([k.iso([x,y,z],P)],{size:.55});
const bolt=(x,y,z)=>S(x-1.8,y-1.8,3.6,3.6,z,1,'hi')+dot(x,y,z+1);
const group=(id,body)=>`<g id="${id}">${body}</g>`;
const floor={x:-125,y:-62,w:250,d:124,r:6};
let base=`<path class="iso-halo" d="${k.haloOf(floor,-14,10,P)}"/>`;
for(const [x,y] of k.corners(floor,13).sort((a,b)=>k.depthOf([...a,0],P)-k.depthOf([...b,0],P)))base+=S(x-6,y-6,12,12,-14,5,'lo');
base+=S(-125,-62,250,124,-9,9,'lo');
base+=L(k.planOutline(k.insetPlan(floor,4),0,P),'faint');
for(const [x,y] of k.corners(floor,10))base+=bolt(x,y,0);
base+=S(-100,47,180,7,0,.8,'lo');
const ticks=k.topTicks(-98,78,4,5,47,.8,[2,7],P);base+=L(ticks.minor)+L(ticks.major,'mid');
base+=S(85,43,26,13,0,1,'mid');
base+=k.faceTextSvg(k.topMatrix([98,51],1,P),'LAB / 01',{size:3,anchor:'middle'});
let art='',dynamic=[];
function panel(x,y,w,d,z,h){let out=S(x,y,w,d,z,h);for(const [a,b]of k.corners({x,y,w,d,r:1},4))out+=bolt(a,b,z+h);return out;}
function vents(x,y,z,n=8){let out='';for(let i=0;i<n;i++)out+=S(x+i*4,y,1.4,12,z,.5,'lo');return out;}
if(kind==='physics'){
 art+=panel(-108,-30,18,58,0,22)+panel(94,-30,14,58,0,22);
 for(const y of [-21,18])art+=S(-90,y,184,4,4,4,'hi');
 for(const x of [-85,85])for(const y of [-21,18])art+=bolt(x,y,8);
 let carriage=panel(-18,-28,36,56,8,9)+S(-11,-17,22,34,17,23,'hi');
 for(const x of [-16,11])for(const y of [-22,18])carriage+=S(x,y,5,6,17,4,'mid');
 carriage+=vents(-9,-5,40,5);
 art+=group('carriage',carriage)+group('spring','')+group('springfront','');
 for(let i=0;i<8;i++)art+=S(-105+i*1.6,29,1,7,0,5,'lo');
}else if(kind==='engine'){
 art+=panel(-48,-22,96,58,0,13);
 // The missing front and side walls are intentional section cuts.
 art+=panel(-43,-23,86,6,13,137);
 for(const x of [-43,37])art+=S(x,-17,6,49,45,105,'mid');
 for(let i=0;i<10;i++)art+=S(-49,-25,98,3,53+i*7,2,'lo');
 art+=group('crank','')+group('rod','')+group('piston','');
 art+=panel(-48,-23,96,58,150,9);
 for(const x of [-24,16]){art+=group(x<0?'intake':'exhaust',S(x,-8,8,8,159,13,'hi')+S(x-4,-12,16,16,172,3,'hi'));}
 art+=S(-4,10,8,8,159,9,'hi',true);
 art+=S(-48,31,96,4,45,10,'lo');
 for(const x of [-40,-20,0,20,40])art+=bolt(x,33,55);
}else if(kind==='pneumatic'){
 art+=panel(-91,-51,46,18,0,11)+vents(-87,-48,11,9)+S(-78,-33,8,5,0,11,'hi');
 art+=panel(-105,-28,157,52,0,10);
 art+=S(-105,-28,157,6,10,42,'mid');
 art+=panel(-105,-22,10,46,10,42)+panel(42,-22,10,46,10,42);
 for(const y of [-19,15])art+=S(-95,y,137,3,48,4,'hi');
 for(const x of [-101,46])for(const y of [-19,18])art+=bolt(x,y,52);
 art+=group('air','')+group('actuator','');
 art+=S(-105,20,157,4,10,9,'mid');

}else if(kind==='fluid'){
 art+=panel(-108,-27,216,53,0,12);
 // Communicating liquid is visible in an open teaching section.
 art+=S(-102,-21,204,41,12,5,'lo');
 for(const [x,w]of [[-102,36],[24,72]]){
 art+=S(x,-26,w,5,12,103,'mid');
 art+=S(x,-21,4,42,12,103,'mid')+S(x+w-4,-21,4,42,12,103,'mid');
 art+=group(x<0?'smallLiquid':'largeLiquid','')+group(x<0?'smallPiston':'largePiston','');
 art+=S(x,21,w,4,12,13,'mid');
 for(const z of [20,40,60,80,100])art+=S(x+w-4,18,4,3,z,1,'hi');
 }
}else{
 art+=panel(-106,-29,56,56,0,30)+vents(-101,-22,30,11);
 art+=S(-98,0,40,19,30,2,'hi');
 art+=group('display',k.faceTextSvg(k.topMatrix([-78,12],32,P),'DC 0–12 V',{size:4,anchor:'middle'}));
 art+=panel(25,-27,75,54,0,5);
 for(let i=0;i<5;i++)for(let j=0;j<4;j++)art+=S(31+i*13,-21+j*12,2,2,5,.5,'lo');
 // Flat copper tracks on the board terminate at component pads.
 art+=L(k.onTop([[33,-15],[62,-15]],6,P),'hi');
 art+=S(48,-4,29,8,6,8,'hi',true);
 for(let i=0;i<4;i++)art+=S(52+i*6,-4,1.2,8,14,.4,'lo');
 for(const [x,y]of [[33,-15],[33,15],[85,-15],[85,15]])art+=bolt(x,y,6);
 art+=L(k.onTop([[-52,-15],[-30,-15],[-30,-42],[33,-42],[33,-15]],3,P),'hi');
 art+=L(k.onTop([[33,15],[33,37],[-30,37],[-30,15],[-52,15]],3,P),'hi');
 for(const [x,y]of [[-52,-15],[-52,15],[33,-15],[33,15]])art+=dot(x,y,3);
 art+=L(k.onTop([[62,15],[33,15]],6,P),'hi');
 art+=L(k.onTop([[62,-15],[62,-4]],6,P),'hi')+L(k.onTop([[62,4],[62,15]],6,P),'hi');
 art+=dot(62,-4,6)+dot(62,4,6);art+=group('charges','');
}
const svg=k.figureSvg({width:620,height:430,label:names[kind]||names.electric,body:[base,art]});
document.querySelector('#stage').innerHTML=svg;
document.querySelector('#title').textContent=names[kind]||names.electric;
const q=s=>document.querySelector(s),input=q('#position'),pause=q('#pause'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
q('#stroke-control').hidden=kind!=='pneumatic';q('#stroke').oninput=()=>draw();
let u=.25,target=u,playing=!reduced.matches,visible=false,time=0,last=0,raf=0;
q('#control-label').textContent=kind==='engine'?'Ángulo del ciclo':kind==='physics'?'Fuerza aplicada':kind==='pneumatic'?'Presión de alimentación':kind==='fluid'?'Carrera de entrada':'Tensión de la fuente';
function draw(){const m=model(kind,u);q('#readout').textContent=m.read;q('#phase').textContent=m.phase;q('#caption').textContent=m.caption;input.value=Math.round(u*1000);input.setAttribute('aria-valuetext',m.read);
 if(kind==='physics'){
 q('#carriage').setAttribute('transform',k.translateAlong(P,[m.travel,0,0]));
 const coil=k.coil(-90,-18+m.travel,[0,22],8,10,'x',P);
 q('#spring').innerHTML=L(coil.back,'mid');q('#springfront').innerHTML=L(coil.front,'hi');
 }else if(kind==='engine'){
 const z=78+m.travel, cx=m.crank[0],cz=30+m.crank[1];
 q('#crank').innerHTML=L(k.sideRing([0,0,30],22,'y',P),'mid')+L(k.segment([0,0,30],[cx,0,cz],P),'hi')+dot(cx,0,cz)+dot(0,0,30);
 q('#rod').innerHTML=L(k.segment([cx,0,cz],[0,0,z],P),'hi');
 q('#piston').innerHTML=S(-32,-15,64,44,z,12,'hi',true)+S(-33,-16,66,46,z+3,1,'lo')+S(-33,-16,66,46,z+8,1,'lo');
 const ph=Math.min(3,Math.floor(u*4));q('#intake').setAttribute('transform',k.translateAlong(P,[0,0,ph===0?-5:0]));q('#exhaust').setAttribute('transform',k.translateAlong(P,[0,0,ph===3?-5:0]));
 }else if(kind==='pneumatic'){
 const x=-70+70*(+q('#stroke').value/100);q('#air').innerHTML=S(-95,-21,x+95,40,10,35,'lo');
 q('#actuator').innerHTML=S(x,-21,7,40,10,35,'hi',true)+S(x+7,-2,111-x,7,25,7,'hi');
 }else if(kind==='fluid'){
 const a=81-m.travel,b=42+m.travel/4;
 q('#smallLiquid').innerHTML=S(-98,-21,28,42,17,a-17,'lo');q('#largeLiquid').innerHTML=S(28,-21,64,42,17,b-17,'lo');
 q('#smallPiston').innerHTML=S(-98,-21,28,42,a,6,'hi',true)+S(-88,-4,8,8,a+6,32,'hi')+S(-102,-15,36,30,a+38,4,'hi');
 q('#largePiston').innerHTML=S(28,-21,64,42,b,6,'hi')+S(56,-4,8,8,b+6,63,'hi')+panel(25,-22,70,44,b+69,9);
 }else{
 const pts=[];for(let i=0;i<9;i++){const x=-30+((i*12+time*u*28)%63);pts.push(k.iso([x,-42,3],P));}q('#charges').innerHTML=u>.001?k.dotsSvg(pts,{size:1.7,tone:'lit'}):'';
 }
}
function state(){pause.textContent=playing?'Pausar':'Animar';pause.setAttribute('aria-pressed',String(playing));}
function loop(t){raf=0;const dt=Math.min((t-last)/1000||0,.033);last=t;if(!visible)return;if(playing){time+=dt;target=kind==='engine'?(time/12)%1:(1-Math.cos(time*.55))/2;}u=(reduced.matches||(playing&&kind==='engine'))?target:u+(target-u)*(1-Math.exp(-dt/0.1));draw();if(playing||Math.abs(u-target)>.0001)raf=requestAnimationFrame(loop);}
function start(){if(!raf&&visible){last=performance.now();raf=requestAnimationFrame(loop);}}
input.oninput=()=>{playing=false;target=+input.value/1000;state();if(reduced.matches){u=target;draw()}else start()};pause.onclick=()=>{playing=!playing;time=kind==='engine'?u*12:Math.acos(1-2*u)/.55;state();start()};q('#reset').onclick=()=>{playing=false;u=target=.25;time=0;state();draw()};
reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;state();draw()}});
new IntersectionObserver(es=>{visible=es.at(-1).isIntersecting;if(visible)start();else if(raf){cancelAnimationFrame(raf);raf=0;}}).observe(q('#stage'));
state();draw();

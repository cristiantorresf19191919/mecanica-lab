import * as T from '../vendor/three.module.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {buildMachine} from '../machines/geometry.mjs';
import {mountEnergy3D} from '../concepts/energy-3d.mjs';
import {mountWorkshopBench} from '../learn/workshop-bench.mjs';
import {regulatorHeatRig, leverRig, gasRig, flowRig, bridgeRig, chamberForces} from './teaching-rigs.mjs';
import {bench} from '../studio/model.mjs';
export function mount(host,kind,id,lang){
if(kind==='gears'){const v=bench(host);let old=-1;return {draw(m){const k=m.values[0]/18-1;if(k!==old){v.setup(1,k);old=k}v.draw(m.theta)},cut(){}};}
if(kind==='opamp'||kind==='relief'){const v=mountEnergy3D(kind,{host,compact:true,label:kind,language:lang});if(!v)throw Error('WebGL unavailable');return {draw:m=>v.update(m),cut(){}};}
if(kind==='hydraulic' && id!=='flow'){const v=mountWorkshopBench(host,'hydraulics','Hydraulic cylinder');if(!v)throw Error('WebGL unavailable');return {draw:m=>v.draw(m,m.t),cut:x=>v.setCut(x)};}
const renderer=new T.WebGLRenderer({antialias:true,alpha:true});host.append(renderer.domElement);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.1,100),orbit=new OrbitControls(camera,renderer.domElement);scene.add(new T.HemisphereLight(0xffffff,0x4b6673,3));const light=new T.DirectionalLight(0xffedcd,3);light.position.set(4,8,6);scene.add(light);let machine=null;
if(['engine','press','pneumatic','motor'].includes(kind))machine=buildMachine(kind==='press'?'hydraulic':kind,scene);
const material=c=>new T.MeshStandardMaterial({color:c,metalness:.4,roughness:.35}),cyan=0x38d7ed,gold=0xf6ae58;
const mesh=(g,c,x=0,y=0,z=0)=>{const o=new T.Mesh(g,material(c));o.position.set(x,y,z);scene.add(o);return o;};const box=(x,y,z,w,h,d,c)=>mesh(new T.BoxGeometry(w,h,d),c,x,y,z);const cyl=(x,y,z,r,h,c)=>mesh(new T.CylinderGeometry(r,r,h,40),c,x,y,z);
let update=()=>{};
if(!machine){box(0,0,0,7,.2,4,0x233442);for(const x of [-3,3])for(const z of [-1.5,1.5]){cyl(x,.14,z,.08,.1,0xc6d6dc);cyl(x,-.2,z,.15,.3,0x111b20)}for(let j=0;j<25;j++)box(-2.8+j*.23,.12,1.7,.02,.02,j%5===0?.25:.12,0xa2b6bf);}
const tools = {scene, box, mesh, cyl};
const forces = kind === "pneumatic" ? chamberForces(scene) : null;
if(kind==='lever') update = leverRig(tools);
if(id==='flow') update = flowRig(tools);
if(kind==='thermal'){const plate=cyl(0,.65,0,1.2,.7,0x72899a);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(1.25*Math.cos(a),.65,1.25*Math.sin(a),.2,.8,.2,0x72899a)}const needle=box(2,1,0,.15,1,.15,gold);update=m=>{plate.material.color.setRGB(Math.min(1,m.temp/150),.4,.35);needle.scale.y=m.temp/100;needle.position.y=.2+m.temp/200;};}
if(kind==='gas') update = gasRig(tools);
if(id==='regulator-heat') update = regulatorHeatRig(tools,lang);
if(id==='rectifier') update = bridgeRig(tools, lang);
if(kind==='circuit' && id!=='rectifier'){
 box(-2,.6,0,1.2,1,1.4,0x526c7c);for(let i=0;i<8;i++)box(-2.45+i*.12,1.12,0,.035,.03,.8,0xb4c6ce);
 const resistor=box(1.8,.4,0,1,.4,.6,gold);for(let i=0;i<4;i++)box(1.45+i*.23,.61,0,.06,.02,.61,0x293947);
 const points=[[-2,.3,-1],[2,.3,-1],[2,.3,1],[-2,.3,1],[-2,.3,-1]].map(x=>new T.Vector3(...x)),path=new T.CatmullRomCurve3(points,false,'catmullrom',.02);mesh(new T.TubeGeometry(path,100,.04,8),cyan);for(const x of [-2,2])for(const z of [-1,1])cyl(x,.3,z,.1,.2,0xbbc9d1);
 const dots=Array.from({length:24},()=>mesh(new T.SphereGeometry(.06,8,8),gold));update=m=>{const travel=id==='ac'?(1-Math.cos(m.theta))*.18:m.u*(id==='ohm'?m.current/.012:1);dots.forEach((d,i)=>{d.position.copy(path.getPoint((i/24+travel)%1));d.visible=Math.abs(m.current)>1e-8;});resistor.material.emissive.setHex(Math.abs(m.current)>.01?0x663300:0x110800)};
}
let cut=true;machine?.setCut(true);new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const f=Math.max(1,1.15/camera.aspect)*(kind==='pneumatic'?1.05:1);if (id === "rectifier" || id === "regulator-heat") camera.position.set(0, 6.8*f, 4.5*f);
else camera.position.set(7*f,6*f,10*f);orbit.target.set(0,machine?1.8:.8,0);orbit.update();}).observe(host);
return {draw(m){if(machine){machine.update(m,0,m.u);forces?.(m);}else update(m);orbit.update();renderer.render(scene,camera)},cut(value){cut=value;machine?.setCut(cut)}};
}

import * as T from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {buildMachine} from '../machines/geometry.mjs';
import {engineState} from '../machines/model.mjs';
import {mountEnergy3D} from '../concepts/energy-3d.mjs';
function hydraulic(scene){
 const root=new T.Group();scene.add(root);const groups={},pick=[];const group=id=>{const g=new T.Group();root.add(g);groups[id]=g;return g;};
 const mesh=(geo,col,g,x,y,z)=>{const o=new T.Mesh(geo,new T.MeshStandardMaterial({color:col,metalness:.45,roughness:.35}));o.position.set(x,y,z);g.add(o);pick.push(o);return o;};
 const box=(g,x,y,z,w,h,d,c=0x80958b)=>mesh(new T.BoxGeometry(w,h,d),c,g,x,y,z);
 const cyl=(g,x,y,z,r,h,c=0xc7d2bc)=>{const o=mesh(new T.CylinderGeometry(r,r,h,48),c,g,x,y,z);o.rotation.z=Math.PI/2;return o;};
 const base=group('base');box(base,0,.1,0,8,.2,4,0x344d44);for(const x of [-3.5,3.5])for(const z of [-1.5,1.5])box(base,x,-.1,z,.3,.2,.3,0x243b33);
 const barrel=group('cylinder');for(const x of [-1.8,1.8]){box(barrel,x,1.5,0,.18,1.5,1.5);box(barrel,x,.6,0,.4,1.1,.8);for(const y of [1,2])for(const z of [-.5,.5])cyl(barrel,x,y,z,.055,.25);}
 const shell=(start)=>{const o=mesh(new T.CylinderGeometry(.67,.67,3.4,48,1,true,start,Math.PI),0x80958b,barrel,0,1.5,0);o.material.side=T.DoubleSide;o.rotation.z=Math.PI/2;return o;};shell(Math.PI/2);const cover=shell(-Math.PI/2);
 for(const y of [.9,2.1])for(const z of [-.6,.6])cyl(barrel,0,y,z,.035,3.8);
 const piston=group('piston');cyl(piston,0,1.5,0,.61,.18,0xc7d2bc);cyl(piston,0,1.5,0,.16,7,0xc7d2bc);for(const x of [-.06,.06]){const o=mesh(new T.TorusGeometry(.612,.024,10,48),0x243b33,piston,x,1.5,0);o.rotation.y=Math.PI/2;}
 const pipes=group('flow');for(const x of [-1.65,1.65]){const curve=new T.CatmullRomCurve3([new T.Vector3(x,1.5,.65),new T.Vector3(x,1.5,1.2),new T.Vector3(x,.45,1.3),new T.Vector3(x>0?2.7:-2.7,.45,1.3)]);mesh(new T.TubeGeometry(curve,32,.07,8,false),0x58a4aa,pipes,0,0,0);}
 const tank=group('tank');box(tank,-2.8,.65,.5,1.1,1,1.4,0x344d44);box(tank,-2.8,1.18,.5,1.12,.1,1.42);for(let i=0;i<6;i++)box(tank,-3.2+i*.16,1.25,.5,.035,.03,.7,0xc7d2bc);
 const pump=group('pump');cyl(pump,2.8,.7,.5,.4,.8);for(let i=0;i<10;i++)box(pump,2.5+i*.06,1.08,.5,.025,.06,.55,0x344d44);
 const leak=group('leak');const dots=Array.from({length:12},()=>mesh(new T.SphereGeometry(.045,10,10),0xe8ac63,leak,0,0,0));const seal=mesh(new T.TorusGeometry(.6,.032,10,48),0xe8ac63,leak,0,1.5,0);seal.rotation.y=Math.PI/2;
 const oilA=cyl(barrel,-.8,1.5,0,.58,1.4,0x58b8c7),oilB=cyl(barrel,.8,1.5,0,.58,1.4,0x58b8c7);for(const o of [oilA,oilB]){o.material.transparent=true;o.material.opacity=.2;o.material.depthWrite=false;}
 return {partCount:pick.length,setCut(v){cover.visible=!v;},select(id){for(const [key,g]of Object.entries(groups))g.traverse(o=>{if(o.isMesh)o.material.emissive.setHex(key===id?0x345a22:0);});},update(m,t){const x=-1.4+2.8*m.x;piston.position.x=x;seal.position.x=x;seal.visible=m.leak>0;const lenA=x+1.6,lenB=1.6-x;oilA.scale.y=lenA/1.4;oilA.position.x=-1.6+lenA/2;oilB.scale.y=lenB/1.4;oilB.position.x=x+lenB/2;dots.forEach((d,i)=>{const v=(t*.4+i/12)%1;d.visible=m.leak>0;d.position.set(x+(m.advance?1:-1)*(v-.5)*.7,1.5+.5*Math.cos(i*.8),.5*Math.sin(i*.8));});}};
}
export function mountWorkshopBench(host,kind,label){
 if(kind==='electronics'){const view=mountEnergy3D('opamp',{host,compact:true,label});if(!view)return null;return {...view,draw(m){view.update(m);},parts:()=>view.debug().parts};}
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.append(renderer.domElement);const scene=new T.Scene();scene.background=new T.Color(0xe8ecdf);scene.add(new T.HemisphereLight(0xffffff,0x73816c,3));const sun=new T.DirectionalLight(0xffefd3,3);sun.position.set(4,8,6);scene.add(sun);const camera=new T.PerspectiveCamera(38,1,.1,120),controls=new OrbitControls(camera,renderer.domElement);controls.minDistance=4;controls.maxDistance=35;const machine=kind==='hydraulics'?hydraulic(scene):buildMachine(kind==='mechanics'?'engine':'pneumatic',scene);let listener=null,receiving=false;const render=()=>renderer.render(scene,camera);
 controls.addEventListener('change',()=>{render();if(!receiving)listener?.({position:camera.position.toArray(),target:controls.target.toArray()});});
 new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const f=Math.max(1,1.1/camera.aspect)*(kind==='pneumatics'?1.3:1);camera.position.set(7*f,6*f,10*f);controls.target.set(0,kind==='mechanics'?2.4:1.5,0);controls.update();render();}).observe(host);
 machine.setCut(true);return {onView(fn){listener=fn;},getView(){return {position:camera.position.toArray(),target:controls.target.toArray()};},setView(v){receiving=true;camera.position.fromArray(v.position);controls.target.fromArray(v.target);controls.update();render();receiving=false;},setCut(v){machine.setCut(v);render();},select(id){machine.select(id);render();},parts:()=>machine.partCount,draw(m,t){if(kind==='mechanics'){const u=(m.turns??t*m.rpm/120*.15)%1;machine.update({...engineState(u),spark:m.spark,combustion:m.combustion},0,u);}else if(kind==='hydraulics')machine.update(m,t);else machine.update(m,0,t*.1);render();}};
}

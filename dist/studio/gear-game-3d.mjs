import * as T from '../vendor/three.module.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {gearPairs, planetary, pitchModule as moduleSize} from './gear-game-model.mjs';

const tau=2*Math.PI, radius=n=>n*moduleSize/2;
const blue=0x55ccff, amber=0xffb660, mint=0x56e2a5, silver=0x90aec7, navy=0x182c40;
const inv=a=>Math.tan(a)-a;
const pressure=Math.PI/9;
const point=(shape,r,a,first=false)=>shape[first?'moveTo':'lineTo'](r*Math.cos(a),r*Math.sin(a));

function outline(teeth,internal,shape){
  const pitch=radius(teeth), base=pitch*Math.cos(pressure);
  const root=pitch-1.14*moduleSize, tip=pitch+.84*moduleSize;
  const flank=r=>Math.PI/(2*teeth)-.018/teeth+inv(pressure)-inv(Math.acos(Math.min(1,base/r)));
  const levels=[root,...Array.from({length:6},(_,i)=>Math.max(root,base)+(tip-Math.max(root,base))*i/5)];
  for(let tooth=0;tooth<teeth;tooth++){
    const center=tau*tooth/teeth;
    point(shape,internal?2*pitch-root:root,center-Math.PI/teeth,tooth===0);
    for(const r of levels)point(shape,internal?2*pitch-r:r,center-flank(r));
    for(const r of [...levels].reverse())point(shape,internal?2*pitch-r:r,center+flank(r));
  }
  shape.closePath();
}
function circle(r,x=0,y=0){
  const path=new T.Path();path.absarc(x,y,r,0,tau,true);return path;
}

export function gearArena(host){
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.96;
  renderer.domElement.setAttribute('aria-label',host.dataset.label);
  host.append(renderer.domElement);
  const scene=new T.Scene(), camera=new T.OrthographicCamera(-5,5,3,-3,.1,100);
  camera.position.set(3,-5,13);
  const orbit=new OrbitControls(camera,renderer.domElement);
  orbit.enablePan=false;orbit.enableDamping=true;orbit.minZoom=.72;orbit.maxZoom=3.8;orbit.update();

  // Large light panels give the beveled teeth readable metallic reflections.
  const room=new T.Scene();room.background=new T.Color(0x465775);
  for(const [pos,size,power] of [[[0,2,6],4,2],[[-6,4,1],6,3],[[3,-5,2],3,2.6]]){
    const panel=new T.Mesh(new T.PlaneGeometry(size,size*.65),new T.MeshBasicMaterial({color:new T.Color(1,.95,.86).multiplyScalar(power)}));
    panel.position.set(...pos);panel.lookAt(0,0,0);room.add(panel);
  }
  const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(room).texture;pmrem.dispose();
  room.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  scene.add(new T.HemisphereLight(0xddefff,0x455f80,1.1));
  for(const [x,y,z,color,amount] of [[-5,4,6,0xffecd0,2.1],[3,-4,3,0x94d8ff,1.55]]){
    const light=new T.DirectionalLight(color,amount);light.position.set(x,y,z);scene.add(light);
  }

  let frame=new T.Group(), turn=[], extent=[9,6], focus=new T.Vector3(), view='orbit', angle=0, gearboxView=false;
  scene.add(frame);
  const mesh=(geometry,color,parent=frame,x=0,y=0,z=0,roughness=.31)=>{
    const o=new T.Mesh(geometry,new T.MeshStandardMaterial({color,roughness,metalness:.72}));
    parent.add(o);o.position.set(x,y,z);return o;
  };
  const block=(x,y,z,a,b,c,color,parent=frame)=>mesh(new T.BoxGeometry(a,b,c),color,parent,x,y,z,.43);
  function rod(x,y,z,r,length,color,parent=frame){
    const g=new T.CylinderGeometry(r,r,length,32);g.rotateX(Math.PI/2);
    return mesh(g,color,parent,x,y,z);
  }
  const band=(x,y,z,r,t,color,parent=frame)=>mesh(new T.TorusGeometry(r,t,8,80),color,parent,x,y,z);
  function wheel(n,x,y,z,color,rate,offset=0,parent=frame,internal=false){
    const r=radius(n), shape=new T.Shape(),g=new T.Group();
    parent.add(g);g.position.set(x,y,z);
    if(internal){shape.absarc(0,0,r+.26,0,tau,false);const hole=new T.Path();outline(n,true,hole);shape.holes.push(hole);}
    else{
      outline(n,false,shape);shape.holes.push(circle(.145));
      if(n>=18)for(let i=0;i<5;i++)shape.holes.push(circle(.15*r,.62*r*Math.cos(tau*i/5),.62*r*Math.sin(tau*i/5)));
    }
    const geom=new T.ExtrudeGeometry(shape,{depth:.29,bevelEnabled:true,bevelSegments:2,bevelSize:.008,bevelThickness:.014,curveSegments:64});
    mesh(geom,color,g);
    if(internal){band(0,0,.29,r+.20,.034,silver,g);rod(r+.16,0,.33,.047,.04,amber,g);}
    else{
      rod(0,0,.285,.22,.16,silver,g);band(0,0,.37,.13,.025,navy,g);rod(r*.83,0,.302,.042,.03,0xeaffff,g);
    }
    turn.push(a=>g.rotation.z=offset+a*rate);
    return g;
  }
  function support(x,y,z){
    rod(x,y,-1,.35,.18,navy);band(x,y,-.88,.26,.04,silver);rod(x,y,(z-.85)/2,.13,z+.85,silver);
  }
  function joint(x,y,z){
    focus.set(x,y,z+.18);
    const bead=rod(x,y,z+.39,.037,.028,0xeeffd3);
    bead.material.emissive.setHex(0x80a550);
  }
  function resize(){
    const w=host.clientWidth||1,h=host.clientHeight||1,aspect=w/h;
    const span=Math.max(extent[0]/aspect,extent[1])*(view==='mesh'?.56:1);
    camera.left=-span*aspect/2;camera.right=-camera.left;camera.top=span/2;camera.bottom=-camera.top;
    camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw(angle);
  }
  function setView(next){
    view=next;const target=view==='mesh'?focus:new T.Vector3(0,0,.1);
    orbit.target.copy(target);camera.zoom=1;
    const position=view==='front'?[0,0,14]:view==='mesh'?[.3,-.9,14]:gearboxView?[5,-10,9]:[3,-5,13];
    camera.position.copy(target).add(new T.Vector3(...position));
    orbit.update();resize();
  }
  function setup(kind,c,state){
    scene.remove(frame);frame.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
    frame=new T.Group();scene.add(frame);turn=[];gearboxView=kind==='manual';focus.set(0,0,.2);extent=[8.1,5.9];
    if(kind==='planet'||kind==='auto'){
      const p=planetary(c.sun,c.planet,state.mode);
      const color=name=>p.drive===name?blue:p.takeoff===name?amber:p[name]===0?silver:mint;
      const arm=radius(c.sun+c.planet);
      support(0,0,.42);
      wheel(c.sun,0,0,0,color('sun'),p.sun);
      wheel(p.ringTeeth,0,0,0,color('ring'),p.ring,0,frame,true);
      const carrier=new T.Group();frame.add(carrier);
      turn.push(a=>carrier.rotation.z=a*p.carrier);
      for(let i=0;i<3;i++){
        const direction=tau*i/3,x=arm*Math.cos(direction),y=arm*Math.sin(direction);
        wheel(c.planet,x,y,0,mint,p.planet-p.carrier,direction+Math.PI-Math.PI/c.planet,carrier);
        block(x/2,y/2,-.20,arm,.17,.15,color('carrier'),carrier).rotation.z=direction;
        rod(x,y,-.08,.115,.30,silver,carrier);
      }
      rod(0,0,-.14,.28,.22,color('carrier'),carrier);
      focus.set(radius(c.sun),0,.30);
      extent=[Math.max(6.3,radius(p.ringTeeth)*2+1.8),Math.max(5.4,radius(p.ringTeeth)*2+1.4)];
      const held=['sun','ring','carrier'].find(part=>p[part]===0);
      if(held){
        const brakeX=held==='ring'?-radius(p.ringTeeth)-.14:0;
        block(brakeX,0,-.47,.43,.56,.24,silver);
        block(brakeX,.27,-.27,.39,.14,.34,silver);
        block(brakeX,-.27,-.27,.39,.14,.34,silver);
      }else{
        // In direct drive the clutch locks two planetary members together.
        band(0,0,-.31,.39,.051,amber);
        band(0,0,-.43,.39,.051,blue);
      }
    }else if(kind==='manual'){
      const left=-radius(48)/2,right=-left;
      const active=c.gear-1, inputRate=c.clutch?0:1;
      support(left,0,2);support(right,0,2);
      rod(left,0,2.53,.65,.21,blue);
      rod(left,0,c.clutch?1.97:2.34,.54,.14,0xc99567);
      const wheelPlane=i=>1.40-i*.72;
      for(let i=0;i<gearPairs.length;i++){
        const [a,b]=gearPairs[i],z=wheelPlane(i),on=i===active;
        wheel(a,left,0,z,on?blue:0x59829a,inputRate);
        wheel(b,right,0,z,on?amber:0x71879a,-inputRate*a/b,Math.PI/b);
      }
      const slider=rod(right,0,active<0?.65:wheelPlane(active)+.42,.31,.17,c.clutch?silver:mint);
      band(right,0,slider.position.z+.1,.31,.025,amber);
      const output=new T.Group();output.position.set(right,0,2.34);frame.add(output);
      rod(0,0,0,.29,.28,state.coupled?amber:silver,output);
      rod(.21,0,.155,.039,.033,navy,output);
      turn.push(a=>output.rotation.z=state.speed*a);
      if(active>=0)joint(left+radius(gearPairs[active][0]),0,wheelPlane(active));
      extent=[6.8,6.3];
    }else{
      const middle=kind==='idler'&&c.insert;
      const compound=kind==='compound';
      const direction=c.mount==='upper'?Math.PI/3:c.mount==='lower'?-Math.PI/3:0;
      const polar=(d,a)=>[d*Math.cos(a),d*Math.sin(a)];
      const b=middle?c.idler:c.driven;
      const firstDistance=radius(c.driver+b);
      const bCenter=!middle&&!compound?polar(firstDistance+c.gap,direction):[firstDistance,0];
      const outputOffset=polar(radius((middle?c.idler:c.stageDriver)+(middle?c.driven:c.stageDriven))+c.gap,direction);
      const out=[bCenter[0]+outputOffset[0],bCenter[1]+outputOffset[1]];
      const centers=middle||compound?[[0,0],bCenter,out]:[[0,0],bCenter];
      const meanX=centers.reduce((sum,o)=>sum+o[0],0)/centers.length;
      const meanY=centers.reduce((sum,o)=>sum+o[1],0)/centers.length;
      const [A,B,C]=centers.map(([x,y])=>[x-meanX,y-meanY]);
      const firstAngle=middle||compound?0:direction;
      const rate=-c.driver/b;
      wheel(c.driver,...A,0,blue,1,firstAngle);
      wheel(b,...B,0,middle||compound?mint:amber,(middle||compound||state.coupled)?rate:0,firstAngle+Math.PI-Math.PI/b);
      support(...A,0);support(...B,compound?.78:0);
      if(compound)wheel(c.stageDriver,...B,.78,mint,rate,direction);
      if(C){
        wheel(middle?c.driven:c.stageDriven,...C,compound?.78:0,amber,state.speed,
          direction+Math.PI-Math.PI/(middle?c.driven:c.stageDriven)+(middle?(direction-Math.PI+Math.PI/b)*b/c.driven:0));
        support(...C,compound?.78:0);
      }
      if(state.coupled||C)joint(A[0]+radius(c.driver)*Math.cos(firstAngle),A[1]+radius(c.driver)*Math.sin(firstAngle),0);
      const maxRadius=radius(Math.max(c.driver,c.driven,middle?c.idler:0,compound?c.stageDriven:0));
      extent=[Math.max(5.5,Math.max(...centers.map(v=>v[0]))+2*maxRadius+1.45),Math.max(4.35,Math.abs(out[1]||0)*(C?1:0)+2*maxRadius+1.7)];
    }
    block(0,0,-1.18,extent[0]-.5,extent[1]-.55,.18,navy);
    for(const sign of [-1,1]){
      block(0,sign*(extent[1]-.82)/2,-1.054,extent[0]-.76,.027,.035,0x75a7c0);
      for(const side of [-1,1])rod(side*(extent[0]-.99)/2,sign*(extent[1]-1.12)/2,-1.03,.079,.052,silver);
    }
    setView(view);
  }
  function draw(a){angle=a;turn.forEach(fn=>fn(a));orbit.update();renderer.render(scene,camera);}
  new ResizeObserver(resize).observe(host);resize();
  return {setup,draw,setView};
}

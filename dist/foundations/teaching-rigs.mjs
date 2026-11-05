import * as T from '../vendor/three.module.js';

const cyan = 0x52d3e1, amber = 0xf6ae58, steel = 0x859baa, dark = 0x273745;
const point = (x, y, z) => new T.Vector3(x, y, z);

function label(scene, text, position) {
  const canvas = document.createElement('canvas');
  canvas.width = 144;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#172633';
  ctx.fillRect(0, 0, 144, 64);
  ctx.fillStyle = '#f5f5df';
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 72, 43);
  const sprite = new T.Sprite(new T.SpriteMaterial({map: new T.CanvasTexture(canvas), toneMapped: false, depthTest: false}));
  sprite.position.copy(position);
  sprite.scale.set(1.2, .53, 1);
  scene.add(sprite);
}

function segment(scene, start, end, radius, color) {
  const mesh = new T.Mesh(new T.CylinderGeometry(radius, radius, 1, 16),
    new T.MeshStandardMaterial({color, roughness: .45, metalness: .35}));
  scene.add(mesh);
  function align(a, b) {
    const direction = b.clone().sub(a);
    mesh.position.copy(a).lerp(b, .5);
    mesh.scale.y = direction.length();
    mesh.visible = direction.lengthSq() > 1e-9;
    if (mesh.visible) mesh.quaternion.setFromUnitVectors(point(0, 1, 0), direction.normalize());
  }
  align(start, end);
  return {mesh, align};
}

export function leverRig({scene, box, cyl}) {
  const pivot = point(-2, 1.18, 0);
  cyl(-2, .56, 0, .23, 1.08, steel);
  cyl(-2, 1.13, 0, .32, .14, dark);
  const arm = box(0, 1, 0, 4, .18, .3, steel);
  const direction = point(0, 0, 1);
  const arrow = new T.ArrowHelper(direction, pivot, 1, amber, .2, .15);
  scene.add(arrow);
  const axis = segment(scene, pivot, pivot, .015, amber);
  const distance = segment(scene, pivot, pivot, .043, cyan);
  const foot = cyl(0, pivot.y, 0, .07, .05, cyan);
  return m => {
    const [force, radius, degrees] = m.values, angle = degrees * Math.PI / 180;
    const tip = pivot.clone().add(point(8 * radius, 0, 0));
    direction.set(-Math.cos(angle), 0, Math.sin(angle));
    const nearest = tip.clone().addScaledVector(direction, pivot.clone().sub(tip).dot(direction));
    arm.scale.x = radius / .5;
    arm.position.x = -2 + 4 * radius;
    arrow.position.copy(tip);
    arrow.setDirection(direction);
    arrow.setLength(force / 100, Math.min(.25, force / 200), .14);
    axis.align(tip.clone().addScaledVector(direction, -.3), nearest.clone().addScaledVector(direction, .4));
    distance.align(pivot, nearest);
    foot.position.copy(nearest);
  };
}

export function gasRig({mesh, cyl}) {
  const shell = cyl(0, 1.5, 0, 1, 2.4, cyan);
  shell.material.transparent = true;
  shell.material.opacity = .12;
  shell.material.depthWrite = false;
  cyl(0, .32, 0, 1.08, .16, steel);
  const piston = cyl(0, 1.5, 0, .98, .12, steel);
  const rod = cyl(0, 2.4, 0, .09, 1.7, amber);
  const particles = Array.from({length: 36}, () => mesh(new T.SphereGeometry(.045, 8, 8), amber));
  // Reflect a constant-speed trajectory at each wall. Lateral bounds fit inside the circular bore.
  const bounce = (travel, width) => width - Math.abs((travel % (2 * width)) - width);
  return m => {
    const height = m.volume * 1.1;
    piston.position.y = .4 + height;
    rod.position.y = piston.position.y + .9;
    particles.forEach((particle, i) => {
      const space = height - .12;
      particle.position.set(
        bounce(i * .37 + m.u * 1.8, 1.24) - .62,
        .45 + bounce(i * .173 + m.u * (2 + i % 4 * .35), space),
        bounce(i * .29 + m.u * 1.5, 1.24) - .62
      );
    });
  };
}

export function flowRig({scene, cyl, box}) {
  const base = .42;
  cyl(0, .25, 0, 1.25, .3, steel);
  const bore = cyl(0, 1.67, 0, .68, 2.5, cyan);
  bore.material.transparent = true;
  bore.material.opacity = .13;
  bore.material.depthWrite = false;
  const oil = cyl(0, base, 0, .65, 1, cyan);
  const piston = cyl(0, base, 0, .66, .11, steel);
  const rod = cyl(0, base, 0, .09, 1.6, amber);
  box(-1.45, 1.67, 0, .12, 2.5, .1, steel);
  for (let tick = 0; tick <= 10; tick++) box(-1.35, base + tick / 4, 0, tick % 5 ? .13 : .24, .018, .08, amber);
  label(scene, '100 mm', point(-1.5, 3.15, 0));
  return m => {
    const radiusScale = Math.sqrt(m.values[1] / 20);
    for (const part of [bore, oil, piston]) part.scale.x = part.scale.z = radiusScale;
    const fill = 2.5 * m.x;
    oil.visible = fill > 0;
    oil.scale.y = Math.max(.001, fill);
    oil.position.y = base + fill / 2;
    piston.position.y = base + fill;
    rod.position.y = piston.position.y + .85;
  };
}

export function bridgeRig({scene, box, cyl, mesh}, lang) {
  const A = point(-2.35, .36, 0), B = point(2.35, .36, 0);
  const plus = point(0, .36, -1.4), minus = point(0, .36, 1.4);
  const branches = [[A, plus], [B, plus], [minus, A], [minus, B]].map(([from, to]) => {
    const wire = segment(scene, from, to, .045, steel);
    const body = segment(scene, from.clone().lerp(to, .36), from.clone().lerp(to, .64), .12, dark);
    segment(scene, from.clone().lerp(to, .58), from.clone().lerp(to, .61), .125, 0xdbe8e8);
    return {from, to, wire:wire.mesh, body:body.mesh};
  });
  for (const [node, text] of [[A,'AC A'],[B,'AC B'],[plus,'+'],[minus,'−']]) {
    cyl(node.x, node.y, node.z, .12, .28, steel);
    label(scene, text, node.clone().add(point(0, .45, 0)));
  }
  const load = box(0, .4, .58, .42, .25, .60, amber);
  const regulator = box(0,.65,-.65,.62,.54,.48,dark);
  const tab = box(0,.98,-.74,.57,.16,.13,steel);
  segment(scene,plus,point(0,.4,-.86),.05,steel);
  segment(scene,point(0,.4,-.44),minus,.05,amber);
  const groundPath=[point(-.28,.48,-.65),point(-.48,.48,-.65),point(-.48,.48,1.4),minus];
  groundPath.slice(1).forEach((end,i)=>segment(scene,groundPath[i],end,.025,steel));
  label(scene,'REG',point(0,1.28,-.65));
  label(scene,lang==='es'?'Carga':'Load',point(0,.85,.68));
  // Output voltage gauge, with a fixed target tick for observing dropout.
  const gauge=box(.55,.38,.58,.16,1,.16,amber);
  box(.55,1.13,.58,.31,.035,.27,steel);
  const x=2.95;
  const leads=[plus,minus].map(node=>{
    const path=[node,point(x,.36,node.z),point(x,.36,Math.sign(node.z)*.19),point(x,.67,Math.sign(node.z)*.19)];
    path.slice(1).forEach((end,i)=>segment(scene,path[i],end,.045,steel));
    return path;
  });
  cyl(x,1,0,.38,.78,dark);
  cyl(x,1.4,0,.37,.05,steel);
  const bands=Array.from({length:12},(_,i)=>cyl(x,.66+i*.061,0,.386,.04,steel));
  label(scene,'C',point(x,1.72,0));
  function stream(path,n,color){
    const dots=Array.from({length:n},()=>mesh(new T.SphereGeometry(.064,8,8),color));
    return (u,active,reverse=false)=>dots.forEach((dot,i)=>{
      dot.visible=active;if(!active)return;
      const q=((u*4+i/n)%1)*(path.length-1),j=Math.floor(q);
      const k=reverse?path.length-1-j:j;
      dot.position.copy(path[k]).lerp(path[k+(reverse?-1:1)],q-j);
      dot.position.y+=.1;
    });
  }
  const diodeStreams=branches.map(b=>stream([b.from,b.to],4,amber));
  const loadStream=stream([plus,minus],5,amber),capStreams=leads.map(path=>stream(path,7,cyan));
  return m=>{
    const active=m.input>=0?[0,3]:[1,2];
    branches.forEach(({wire,body},i)=>{
      const lit=m.bridgeCurrent>1e-9 && active.includes(i);
      wire.material.color.setHex(lit?amber:steel);
      body.material.emissive.setHex(lit?0x825018:0);
      diodeStreams[i](m.u,lit);
    });
    const regulated=m.enabled && m.margin>=0;
    regulator.material.color.setHex(!m.enabled?steel:regulated?0x368e88:0xb95334);
    tab.material.emissive.setHex(regulated?0x0c3330:0);
    gauge.scale.y=Math.max(.005,m.loadVoltage*.095);
    gauge.position.y=.37+gauge.scale.y/2;
    loadStream(m.u,m.current>1e-9);
    capStreams.forEach((run,i)=>run(m.u,Math.abs(m.capCurrent)>1e-8,i===0?m.capCurrent<0:m.capCurrent>0));
    const level=m.values[2]?m.output/Math.max(.001,m.values[0]-2*m.values[1]):0;
    bands.forEach((band,i)=>band.material.color.setHex(i+.5<=12*level?cyan:dark));
    load.material.emissive.setHex(m.current>0?0x50300b:0);
  };
}

export function chamberForces(scene) {
  const cap = new T.ArrowHelper(point(1, 0, 0), point(0, 0, 0), 1, cyan);
  const rod = new T.ArrowHelper(point(-1, 0, 0), point(0, 0, 0), 1, amber);
  scene.add(cap, rod);
  const area = Math.PI * .04 ** 2 / 4;
  function show(arrow, force, end, direction) {
    arrow.visible = force > 0;
    if (!arrow.visible) return;
    const length = force / 450;
    arrow.position.set(end - direction * length, 2.86, -.5);
    arrow.setLength(length, Math.min(.2, length / 3), .12);
  }
  return m => {
    const piston = .65 + 2.7 * m.x;
    show(cap, m.pA * 1e5 * area, piston - .06, 1);
    show(rod, m.pB * 1e5 * area * .75, piston + .06, -1);
  };
}

export function regulatorHeatRig({scene,box,cyl},lang) {
  const chip=box(0,.87,0,.91,.8,.32,dark);
  box(0,1.37,-.07,.86,.5,.12,steel);
  const sink=[box(0,1.10,-.23,1.42,1.20,.2,steel)];
  for(let i=0;i<9;i++) sink.push(box(-.63+i*.158,1.10,-.62,.07,1.20,.65,steel));
  const terminals=[-.31,0,.31].map(x=>point(x,.18,.25));
  terminals.forEach((v,i)=>segment(scene,v,point(v.x,.55,.05),.04,steel));
  const wire=(nodes,color)=>nodes.slice(1).forEach((end,i)=>segment(scene,nodes[i],end,.045,color));
  box(-2.05,.5,.15,1.0,.64,.96,dark);
  label(scene,'DC',point(-2.05,1.05,.15));
  box(1.95,.55,.45,.58,.4,1.0,amber);
  for(const z of [.18,.34,.68]) box(1.95,.55,z,.59,.41,.065,dark);
  label(scene,lang==='es'?'Carga':'Load',point(2,1.12,.5));
  wire([point(-1.57,.3,.05),point(-.31,.21,.05),terminals[0]],cyan);
  wire([terminals[2],point(.64,.2,-.22),point(1.95,.2,-.22),point(1.95,.5,.01)],amber);
  wire([point(1.95,.5,.92),point(1.95,.2,1.30),point(-2.05,.2,1.30),point(-2.05,.3,.62)],steel);
  wire([terminals[1],point(0,.18,1.30)],steel);
  const panel=document.createElement('canvas');panel.width=512;panel.height=112;
  const texture=new T.CanvasTexture(panel);
  const meter=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false,toneMapped:false}));
  meter.position.set(0,2.10,-.25);meter.scale.set(2.85,.63,1);scene.add(meter);
  const ctx=panel.getContext('2d'), cool=new T.Color(dark),hot=new T.Color(0xff5838);
  let previous='';
  return m=>{
    sink.forEach(fin=>fin.visible=m.sink);
    chip.material.color.lerpColors(cool,hot,Math.min(1,Math.max(0,(m.temperature-25)/100)));
    const reading=m.loss.toFixed(2)+' W    '+m.temperature.toFixed(1)+' °C';
    if(reading!==previous){
      ctx.fillStyle='#101e26';ctx.fillRect(0,0,512,112);
      ctx.font='bold 39px monospace';ctx.fillStyle='#fbd187';ctx.textAlign='center';
      ctx.fillText(reading,256,70);texture.needsUpdate=true;previous=reading;
    }
  };
}

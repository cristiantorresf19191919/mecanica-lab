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
  const load = box(0, .4, 0, .42, .25, .85, amber);
  segment(scene, plus, minus, .05, amber);
  label(scene, lang === 'es' ? 'Carga' : 'Load', point(0, .85, 0));
  const dots = Array.from({length: 18}, () => mesh(new T.SphereGeometry(.053, 10, 8), 0xffdc81));
  return m => {
    const forward = m.input >= 0;
    const active = forward ? [0,3] : [1,2];
    const conducts = m.output > 1e-8;
    branches.forEach(({wire, body}, i) => {
      const lit = conducts && active.includes(i);
      wire.material.color.setHex(lit ? amber : steel);
      body.material.emissive.setHex(lit ? 0x825018 : 0);
    });
    load.material.emissive.setHex(conducts ? 0x50300b : 0);
    const path = [forward ? A : B, plus, minus, forward ? B : A];
    dots.forEach((dot, i) => {
      dot.visible = conducts;
      const progress = ((m.u * 2 + i / dots.length) % 1) * 3;
      const section = Math.floor(progress);
      dot.position.copy(path[section]).lerp(path[section + 1], progress - section);
      dot.position.y += .15;
    });
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

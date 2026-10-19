import * as T from 'three';
export function plcGeometry(H){const {group,mesh,box,cyl,tube,bolt,updaters}=H;
 const sensors=group('sensors',[0,1.4,-.8]),lamps=[];
 for(const [j,x]of [.65,3.35].entries()){box(.18,.2,.3,'dark',sensors,[x,2.63,-.5]);box(.24,.035,.52,'steel',sensors,[x,2.53,-.5]);bolt(x,2.76,-.51,sensors);lamps.push(mesh(new T.SphereGeometry(.035,12,10),0x50654b,sensors,[x,2.72,-.33]));}
 const rack=group('plc',[0,1.3,0]),plc=new T.Group();rack.add(plc);plc.position.x=2.8;box(2.8,.14,1.2,'steel',plc,[.2,.38,1.6]);for(const x of [-1,1.4]){box(.18,.1,.9,'dark',plc,[x,.26,1.6]);for(const z of [1.2,2])bolt(x,.49,z,plc)}
 box(2.45,.09,.18,'light',plc,[.2,.49,1.65]);
 const lights=[];for(const [j,x]of [-.7,.05,.65,1.2].entries()){const w=j===0?.65:.48;box(w,1,.7,j===0?'dark':'steel',plc,[x,1.03,1.6]);box(w-.08,.36,.025,'light',plc,[x,1.17,1.96]);for(let k=0;k<5;k++)box(.025,.25,.025,'dark',plc,[x-w/2+.07+k*(w-.14)/4,1.45,1.97]);for(const y of [.67,.82]){for(let k=0;k<3;k++){cyl(.025,.035,'copper',plc,[x-.13+k*.13,y,1.98],'z');}}lights.push(mesh(new T.SphereGeometry(.048,12,12),0x56705c,plc,[x,1.17,2]));}
 // Label plates identify CPU, two input LEDs and the valve output without floating callouts.
 for(const [x,label]of [[-.7,'CPU RUN'],[.05,'I0.0'],[.65,'I0.1'],[1.2,'Q0.0']]){const can=document.createElement('canvas');can.width=256;can.height=80;const c=can.getContext('2d');c.fillStyle='#e9eedf';c.fillRect(0,0,256,80);c.fillStyle='#243b2d';c.font='bold 42px monospace';c.textAlign='center';c.fillText(label,128,56);const plate=new T.Mesh(new T.PlaneGeometry(.44,.14),new T.MeshBasicMaterial({map:new T.CanvasTexture(can)}));plate.position.set(x,1.3,1.986);plc.add(plate);}
 const wires=group('wiring');const lines=[];
 for(const [j,x]of [.65,3.35].entries()){lines.push(tube([[x,2.65,-.65],[x,2.9,-1],[x,3.05,-2.1],[j?3.45:2.85,3.05,-2.1],[j?3.45:2.85,1.8,-2.1],[j?3.45:2.85,1.7,1.2],[j?3.45:2.85,1.5,1.6]],.022,0x727bb1,wires));}
 lines.push(tube([[4,.8,1.96],[4,.6,2.3],[-2.5,.6,2.3],[-2.6,.9,1.1],[-2.34,.95,.9]],.027,0xc5995c,wires));
 updaters.push((m,e)=>{const vals=[true,m.i0,m.i1,m.q];lights.forEach((l,j)=>{l.material.color.setHex(vals[j]?(j===3?0xe9bc73:0x96d96a):0x405145);l.material.emissive.setHex(vals[j]?0x75a747:0);l.material.emissiveIntensity=vals[j]?.35:0});lamps.forEach((l,j)=>{l.material.color.setHex((j?m.i1:m.i0)?0xb6ed73:0x475c43);l.material.emissive.setHex((j?m.i1:m.i0)?0x82bb4b:0)});wires.visible=e<.02;lines.forEach((l,j)=>{l.material.color.setHex((j===0?m.i0:j===1?m.i1:m.q)?(j===2?0xefb75c:0xa6b6ff):0x667170)});});
}

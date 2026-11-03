import {shift} from './shift.mjs';
export function gearbox({root,gear,pin,box,band,mesh,turn,T},v,s,apart){
 const st=shift(v,s), steel=0x7b94a3,brass=0xd4a354,dark=0x405664,lit=0xffb653,cyan=0x60dbee;
 const color=(on,base)=>on?lit:base, x=-1.02,X=1.02, spread=apart?1.55:1;
 const z=i=>(i-1.5)*1.02*spread;
 const rotate=(o,rate)=>turn.push(a=>o.rotation.z=a*rate);
 const group=(x,z,rate)=>{const o=new T.Group();root.add(o);o.position.set(x,0,z);rotate(o,rate);return o};
 const studs=(o,count,r,h,sz,c)=>{for(let i=0;i<count;i++)pin(o,r*Math.cos(i*2*Math.PI/count),r*Math.sin(i*2*Math.PI/count),h,sz,.075,c)};
 const clutchZ=z(0)-1.2,delta=apart?.42:0,open=st.closed?0:.13;
 const fly=group(x,clutchZ-.42-delta,1);pin(fly,0,0,-.27,.22,.60,steel);pin(fly,0,0,0,.77,.20,color(s===0||s===3,steel));studs(fly,8,.61,-.11,.05,cyan);
 const disc=group(x,clutchZ-.27,st.input);pin(disc,0,0,0,.65,.09,color(s===3||s===4,0xa26f4e));band(disc,0,0,.05,.49,.035,brass);studs(disc,6,.36,.05,.055,steel);
 const plate=group(x,clutchZ-.15+open+delta,1);pin(plate,0,0,0,.71,.12,color(s===0||s===3,steel));studs(plate,8,.54,.09,.044,brass);
 const end=z(3)+.38;pin(root,x,0,(end+clutchZ-.27)/2,.135,end-clutchZ+.27,color(s===4,cyan));
 pin(root,X,0,.3,.13,2*z(3)+1.4,color(s===7,steel));
 for(let i=0;i<4;i++){
  const n=[12,18,24,30][i],active=i+1===v,q=-n/(48-n),dir=i%2?-1:1;
  gear(n,x,0,z(i),color(active&&s===5,active?cyan:dark),st.input);
  const wheel=gear(48-n,X,0,z(i),color(active&&s===5,active?steel:dark),q*st.input,Math.PI/(48-n));
  const face=dir>0?.24:0;
  const cone=new T.CylinderGeometry(dir>0?.21:.31,dir>0?.31:.21,.14,32);cone.rotateX(Math.PI/2);
  mesh(cone,color(active&&s===1,brass),wheel,0,0,face+dir*.075);
  studs(wheel,12,.32,face+dir*.055,.044,color(active&&s===6,steel));
 }
 for(let j=0;j<2;j++){
  const mid=(z(2*j)+z(2*j+1))/2+.11,selected=v>0&&Math.floor((v-1)/2)===j,dir=v%2?-1:1;
  const hub=group(X,mid,st.output);pin(hub,0,0,0,.27,.45,color(selected&&s===6,steel));studs(hub,12,.23,0,.055,steel);
  const travel=selected&&s>0?dir*(.51*spread-(s===1?.33:.20)):0;
  const sleeve=group(X,mid+travel,st.output);
  pin(sleeve,0,0,0,.38,.19,color(selected&&[2,6].includes(s),steel));band(sleeve,0,0,0,.38,.022,dark);
  for(const side of [-1,1]){const ring=group(X,mid+side*(.51*spread-.27),st.output);band(ring,0,0,0,.31,.045,color(selected&&s===1&&dir===side,brass))}
  const fork=mesh(new T.TorusGeometry(.412,.054,8,28,Math.PI),color(selected&&s===1,cyan),root,X,0,mid+travel);box(root,X,.57,mid+travel,.10,.34,.10,steel)
 }
 const flange=group(X,z(3)+.94,st.output);pin(flange,0,0,0,.36,.16,color(s===7,brass));studs(flange,4,.25,.1,.053,steel);
 box(root,0,-1.79,(clutchZ+end)/2,4.22,.14,end-clutchZ+2,0x283e4b);
 for(const [cx,zz] of [[x,clutchZ-.60],[X,end+.3]]){box(root,cx,-.96,zz,.47,1.5,.17,dark);band(root,cx,0,zz,.23,.07,steel)}
 const plane=v?z(v-1):0, side=v%2?1:-1;
 const target=!v?[X,.38,0]:[
  [x,.7,clutchZ-.42-delta],[X,.31,plane+(side>0?.24:0)+side*.14],
  [X,.37,plane+.11+side*.20],[x,.65,clutchZ-.27],[x,.13,z(0)-.38],
  [x+[12,18,24,30][v-1]*.085/2,0,plane+.22],[X,.32,plane+.11+side*.2],[X,.36,z(3)+.94]
 ][s];
 return new T.Vector3(...target);

}

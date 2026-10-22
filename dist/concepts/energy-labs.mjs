// Three instrument views; numerical readouts and moving marks use the lesson model.
export function drawEnergy(id,m,H){
 if(!['transformload','opamp','relief'].includes(id))return;
 const {ctx,text,line,box,circle,arrow,grid,wave,colors,green,white,muted,t}=H;
 const screw=(x,y)=>{circle(x,y,4,'#64776e',white,1);line([[x-2,y],[x+2,y]],white,1);};
 const plate=(x,y,w,h)=>{box(x+7,y+9,w,h,'#08191d',null);box(x,y,w,h,'#283e40',muted);for(const a of [x+10,x+w-10])for(const b of [y+10,y+h-10])screw(a,b);};
 const dots=(path,color,moving=true)=>{line(path,color,5);if(moving)for(let i=0;i<12;i++){const u=((t*.3+i/12)%1)*(path.length-1),j=Math.floor(u),f=u-j,p=path[j],q=path[Math.min(j+1,path.length-1)];circle(p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f,3,white,null);}};
 if(id==='transformload'){
 plate(55,100,400,320);box(112,139,282,224,'#50696a','#afbbb0',5);box(168,187,170,128,'#102127',muted,4);
 for(let j=0;j<11;j++){line([[119+j*2,146+j*2],[387-j*2,146+j*2]],'#70827b',1);line([[119+j*2,355-j*2],[387-j*2,355-j*2]],'#70827b',1);}
 for(const [x,color]of [[110,colors[0]],[337,colors[1]]]){box(x-8,183,68,138,'#6b4934',color);for(let i=0;i<15;i++){box(x-12,186+i*8,76,5,'#b98853',color,2);}for(const y of [178,326])circle(x+26,y,5,color,white);}
 const flux=Math.cos(m.angle);line([[198,164],[309,164],[365,164],[365,340],[140,340],[140,164],[198,164]],green,2,[7,5]);arrow(220,252,65*flux,0,green);text('FLUJO',250,285,15,green,'center');
 text('24 V RMS',145,395,17,colors[0],'center');text(m.vs.toFixed(1)+' V RMS',365,395,17,colors[1],'center');text('N₁',140,126,18,colors[0]);text('N₂ / N₁ = '+m.a,285,126,16,colors[1]);
 grid(510,105,430,275);const scale=Math.max(24,m.vs)*Math.SQRT2;wave(u=>24*Math.SQRT2*Math.sin(u*Math.PI*4+m.angle),colors[0],510,105,430,275,scale);wave(u=>m.vs*Math.SQRT2*Math.sin(u*Math.PI*4+m.angle),colors[1],510,105,430,275,scale);
 text('±'+scale.toFixed(1)+' V · instantánea',510,80,16,muted);text('Is = '+m.is.toFixed(2)+' A RMS · carga '+m.b+' Ω',510,417,18,white);text('P entrada = P salida = '+m.power.toFixed(1)+' W',510,450,18,green);text('EL FLUJO ACOPLA · NO HAY CABLE ENTRE BOBINAS',250,474,14,muted,'center');return ['Primario','Secundario','Flujo alterno'];
 }
 if(id==='opamp'){
 plate(55,100,400,320);
 // Board connector pins, IC package and feedback resistors.
 for(let i=0;i<8;i++){box(191,180+i*12,14,6,'#b7bb9f',null,1);box(300,180+i*12,14,6,'#b7bb9f',null,1);}
 box(205,170,95,120,'#152c32','#b5c2a7');circle(217,181,3,white,null);text('OP',251,219,25,white,'center');text('AMP',251,248,20,white,'center');text('+',218,272,18,green);text('−',218,203,18,colors[1]);
 line([[80,275],[191,275]],colors[0],3);line([[314,230],[422,230],[422,135],[145,135],[145,198],[191,198]],colors[1],3);box(249,125,70,20,'#8b815c',white,2);text('Rf',277,117,14,white);line([[145,198],[145,360]],colors[1],3);box(135,317,20,30,'#8b815c',white,2);line([[124,360],[166,360]],white,3);text('Rg 10 kΩ',177,352,15,muted);line([[250,170],[250,154]],green,3);text('±12 V',336,310,17,green);text('Vin',82,300,17,colors[0]);text('Vout',363,260,17,colors[1]);
 for(let i=0;i<6;i++){circle(83+i*16,389,3,'#819381',null);circle(345+i*16,389,3,'#819381',null);}
 grid(510,105,430,275);for(const sign of [-1,1])line([[510,242.5+sign*118],[940,242.5+sign*118]],'#78916a',2,[5,5]);wave(u=>m.b*Math.sin(u*Math.PI*4+m.angle),colors[0],510,105,430,275,12);wave(u=>Math.max(-12,Math.min(12,m.a*m.b*Math.sin(u*Math.PI*4+m.angle))),colors[1],510,105,430,275,12);
 text('+12 V / −12 V · límites de salida',510,82,16,green);text(m.clipped?'RECORTE: la salida alcanza sus rieles':'ZONA LINEAL: conserva la forma de onda',510,421,17,m.clipped?colors[2]:green);text('Vin ahora '+m.input.toFixed(2)+' V → '+m.output.toFixed(2)+' V',510,457,17,white);return ['Entrada','Salida','Rieles de alimentación'];
 }
 if(id==='relief'){
 plate(55,85,900,380);
 // Tank, pump, pressure manifold, relief spring and cylinder cutaway.
 box(90,350,180,85,'#203a43',colors[0]);for(let j=0;j<5;j++)line([[100,377+j*10],[259,377+j*10]],'#466c76',1);text('DEPÓSITO',180,421,17,white,'center');
 circle(180,265,35,'#536b5f',white);const ang=t*3;arrow(180,265,22*Math.cos(ang),22*Math.sin(ang),green,3);text('6 L/min',96,215,17,green);
 dots([[180,350],[180,300]],colors[0]);dots([[180,230],[180,165],[550,165]],colors[1]);
 circle(330,165,36,'#d2d6ba',muted);for(let j=0;j<=10;j++){const a=Math.PI*.8+j*Math.PI*1.4/10;line([[330+Math.cos(a)*27,165+Math.sin(a)*27],[330+Math.cos(a)*31,165+Math.sin(a)*31]],'#324b42',1);}const a=Math.PI*.8+m.p/100*Math.PI*1.4;arrow(330,165,22*Math.cos(a),22*Math.sin(a),'#344e3f',2);text(m.p.toFixed(0)+' bar',330,222,17,white,'center');
 box(520,125,330,110,'#1e3540',white);const x=550+m.x/0.5*240;box(526,131,x-521,98,'#557e8c',null,0);box(x,131,17,98,'#b8c2a0',white,1);box(x+17,173,902-x-17,15,'#a1b1a0',white,1);for(const y of [113,244]){line([[510,y],[860,y]],muted,5);for(let j=0;j<8;j++)screw(520+j*47,y);}text(m.a+' kN',889,151,18,colors[2],'center');arrow(915,180,-35,0,colors[2]);text(m.blocked?'CILINDRO DETENIDO':'AVANCE · 0,10 m/s',685,280,20,m.blocked?colors[2]:green,'center');
 dots([[445,165],[445,330],[270,330],[270,390]],m.blocked?colors[2]:muted,m.blocked);box(414,277,62,75,'#3b4c42',white);const spring=[];for(let j=0;j<=12;j++)spring.push([423+(j%2)*16,285+j*4]);line(spring,green,2);box(449,m.blocked?310:288,16,23,'#b4c99b',white,2);text('ALIVIO · '+m.b+' bar',600,349,20,green);text(m.blocked?'Q tanque = 6 L/min':'Q tanque = 0 L/min',600,384,18,white);text('Calor = '+m.heat+' W',600,418,18,m.blocked?colors[2]:muted);return ['Aspiración','Alimentación','Derivación / calor'];
 }
}

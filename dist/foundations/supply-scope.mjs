export function drawSupplyScope(canvas,samples,phase,peak){
  const width=Math.max(260,Math.round(canvas.clientWidth)),height=150;
  if(canvas.width!==width)canvas.width=width;
  const ctx=canvas.getContext('2d'),left=42,right=width-12;
  const max=Math.max(10,peak),y=v=>120-95*v/max,x=u=>left+u*(right-left);
  ctx.clearRect(0,0,width,height);ctx.font='11px monospace';ctx.fillStyle='#c5dce2';
  ctx.fillText(max+' V',2,25);ctx.fillText('9 V',2,y(9)+3);ctx.fillText('0 V',2,122);
  ctx.fillText('0 ms',left,143);ctx.fillText('10 ms',x(.5)-15,143);ctx.fillText('20 ms',right-34,143);
  function rule(x1,y1,x2,y2,color){
    ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }
  ctx.lineWidth=1;rule(left,120,right,120,'#526675');ctx.setLineDash([4,4]);
  rule(left,y(9),right,y(9),'#a1b4be');ctx.setLineDash([]);
  for(const [key,color] of [['output','#53dce9'],['loadVoltage','#f6ae58']]){
    ctx.lineWidth=2;ctx.strokeStyle=color;ctx.beginPath();
    samples.forEach((m,i)=>{if(i)ctx.lineTo(x(m.u),y(m[key]));else ctx.moveTo(x(m.u),y(m[key]));});ctx.stroke();
  }
  ctx.lineWidth=1;rule(x(phase),13,x(phase),125,'#fff');
}

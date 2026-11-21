const styles={
  brush:{scale:1,alpha:1,cap:'round'},
  pen:{scale:.34,alpha:1,cap:'round'},
  pencil:{scale:.38,alpha:.56,cap:'round'},
  marker:{scale:.9,alpha:.74,cap:'square'},
  highlighter:{scale:1.45,alpha:.26,cap:'square'},
  calligraphy:{scale:.82,alpha:1,cap:'butt'},
  crayon:{scale:1,alpha:.55,cap:'round'},
  eraser:{scale:1,alpha:1,cap:'round'}
};
export const isUtensil=name=>Object.hasOwn(styles,name);
export function paintStroke(ctx,from,to,{utensil,color,size,original}){
  const style=styles[utensil]??styles.brush;
  const radius=Math.max(1,size*style.scale)/2;
  const dx=to[0]-from[0],dy=to[1]-from[1],length=Math.hypot(dx,dy);
  ctx.save();
  if(utensil==='eraser'){
    ctx.translate(...from);
    ctx.rotate(Math.atan2(dy,dx));
    ctx.beginPath();
    ctx.arc(0,0,radius,Math.PI/2,Math.PI*1.5);
    ctx.arc(length,0,radius,-Math.PI/2,Math.PI/2);
    ctx.closePath();
    ctx.clip();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.drawImage(original(),0,0);
    ctx.restore();
    return;
  }
  ctx.strokeStyle=ctx.fillStyle=color;
  ctx.globalAlpha=style.alpha;
  ctx.lineCap=style.cap;
  ctx.lineWidth=radius*2;
  ctx.beginPath();
  if(utensil==='calligraphy'){
    const x=radius*.8,y=radius*.6;
    ctx.moveTo(from[0]-x,from[1]+y);
    ctx.lineTo(from[0]+x,from[1]-y);
    ctx.lineTo(to[0]+x,to[1]-y);
    ctx.lineTo(to[0]-x,to[1]+y);
    ctx.closePath();
    if(length) ctx.fill();
    else{ctx.lineWidth=2;ctx.stroke();}
  }else if(length){
    ctx.moveTo(...from);
    ctx.lineTo(...to);
    ctx.stroke();
  }else if(style.cap==='square'){
    ctx.fillRect(to[0]-radius,to[1]-radius,radius*2,radius*2);
  }else{
    ctx.arc(...to,radius,0,Math.PI*2);
    ctx.fill();
  }
  if(utensil==='crayon'){
    ctx.globalAlpha=.2;
    const particles=Math.max(3,Math.ceil(length/3));
    for(let i=0;i<particles;i++){
      const fraction=(i+.5)/particles;
      const drift=Math.sin((from[0]+from[1]+i)*19.3)*radius;
      ctx.fillRect(from[0]+dx*fraction+drift,from[1]+dy*fraction+Math.cos(i*13.3)*radius,1.6,1.6);
    }
  }
  ctx.restore();
}
export function originalSurface(pixels){
  let surface;
  return ()=>{
    if(!surface){
      surface=document.createElement('canvas');
      surface.width=pixels.width;
      surface.height=pixels.height;
      surface.getContext('2d').putImageData(pixels,0,0);
    }
    return surface;
  };
}

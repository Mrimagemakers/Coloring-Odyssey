export function drawCustomPage(ctx,design){
  let seed=2166136261;
  for(const char of design.seed){seed=Math.imul(seed^char.charCodeAt(0),16777619);}
  const random=()=>((seed=Math.imul(seed,1664525)+1013904223|0)>>>0)/4294967296;
  const {theme,detail}=design;
  const w=ctx.canvas.width,h=ctx.canvas.height,cx=w/2,cy=h/2;
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#182334';
  ctx.lineWidth=3;
  ctx.lineJoin='round';
  const shape=path=>{
    const closed=new Path2D(path);
    ctx.fill(closed);
    ctx.stroke(closed);
  };
  const oval=(x,y,rx,ry=rx)=>{
    ctx.beginPath();
    ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  const star=(x,y,r)=>shape(`M${x} ${y-r}q2 ${r-2} ${r} ${r}q${2-r} 2 ${-r} ${r}q-2 ${2-r} ${-r} ${-r}q${r-2} -2 ${r} ${-r}Z`);
  const bloom=(x,y,r,count)=>{
    ctx.save();
    ctx.translate(x,y);
    for(let i=0;i<count;i++){
      ctx.save();
      ctx.rotate(i*Math.PI*2/count);
      oval(0,-r,r*.33,r*.53);
      ctx.restore();
    }
    oval(0,0,r*.55);
    ctx.restore();
  };
  ctx.strokeRect(18,18,w-36,h-36);
  ctx.strokeRect(28,28,w-56,h-56);
  if(theme==='mandala'){
    const count=6+2*detail+2*Math.floor(random()*3);
    for(const r of [185,158,124,86,43]) oval(cx,cy,r);
    for(let i=0;i<count;i++){
      ctx.save();
      ctx.translate(cx,cy);
      ctx.rotate((i+random()*.16)*Math.PI*2/count);
      oval(0,-142,10+random()*4,12+random()*4);
      star(0,-102,12);
      oval(0,-62,9,14);
      ctx.restore();
    }
    bloom(cx,cy,23,5+detail);
  }else if(theme==='garden'){
    const count=3+detail;
    for(let i=0;i<count;i++){
      const x=80+i*560/(count-1),y=140+random()*128;
      shape(`M${x-4} ${y}h8V410h-8Z`);
      shape(`M${x} 340q-20-45-55-33q13 35 55 33Z`);
      shape(`M${x} 374q20-45 55-33q-13 35-55 33Z`);
      bloom(x,y,21+random()*12,5+Math.floor(random()*4));
    }
    oval(595,88,28);
    for(let i=0;i<3;i++)star(112+i*170,75+random()*18,9);
  }else if(theme==='space'){
    const x=220+random()*220,y=206+random()*50,r=70+random()*27;
    oval(x,y,r);
    oval(x-22,y-28,16);oval(x+32,y+21,24,15);oval(x-32,y+28,12);
    shape(`M${x-r-45} ${y+43}Q${x} ${y+64} ${x+r+45} ${y-3}Q${x+30} ${y+94} ${x-r-45} ${y+43}Z`);
    for(let i=0;i<8+detail*3;i++){
      const px=54+random()*(w-108),py=55+random()*(h-110);
      if(Math.hypot(px-x,py-y)>r+55) star(px,py,7+random()*10);
    }
    oval(110,333,39);oval(103,325,10);oval(122,345,8);
  }else{
    const cols=3+detail,rows=2+detail,cellW=(w-82)/cols,cellH=(h-82)/rows;
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const x=41+col*cellW,y=41+row*cellH;
      ctx.strokeRect(x,y,cellW,cellH);
      const r=Math.min(cellW,cellH)*.32;
      const mx=x+cellW/2,my=y+cellH/2;
      if(random()>.45){star(mx,my,r);oval(mx,my,r*.3);}
      else{oval(mx,my,r);bloom(mx,my,r*.55,4+((row+col)%3));}
    }
  }
  ctx.restore();
}

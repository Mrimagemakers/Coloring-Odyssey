export const zenPages=['Lotus Mandala','Moon Mandala','Petal Meditation','Balance Stones','Moonlit Cairn','River Pebbles','Bonsai Garden','Cloud Bonsai','Temple Bonsai','Tea at Dawn','Lotus Pond','Quiet Tea Room'];
export const seasonPages=['Spring Blossoms','Spring Rain','Spring Garden','Summer Sunshine','Summer Sail','Summer Picnic','Autumn Maple','Autumn Harvest','Autumn Lanterns','Winter Pines','Winter Cottage','Winter Snowflakes'];

export function drawZenBorder(ctx,w,h,inset){
  ctx.save();
  ctx.strokeStyle='#182334';
  ctx.lineWidth=2.4;
  ctx.strokeRect(4,4,w-8,h-8);
  ctx.strokeRect(inset,inset,w-2*inset,h-2*inset);
  const y=(inset+4)/2;
  const r=(inset-4)*.30;
  function bead(x,y){
    ctx.beginPath();
    ctx.moveTo(x,y-r);
    ctx.lineTo(x+r,y);
    ctx.lineTo(x,y+r);
    ctx.lineTo(x-r,y);
    ctx.closePath();
    ctx.stroke();
  }
  for(let x=inset;x<w-inset;x+=24){bead(x,y);bead(x,h-y);}
  for(let row=inset+12;row<h-inset;row+=24){bead(y,row);bead(w-y,row);}
  ctx.restore();
}

export function drawCalmPage(ctx,theme,page){
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,720,480);
  ctx.strokeStyle='#182334';
  ctx.lineWidth=3;
  ctx.lineJoin='round';
  const outline=path=>{
    const shape=new Path2D(path);
    ctx.fill(shape);
    ctx.stroke(shape);
  };
  const ellipse=(x,y,w,h=w)=>{
    ctx.beginPath();
    ctx.ellipse(x,y,w,h,0,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  const box=(x,y,w,h)=>outline(`M${x} ${y}h${w}v${h}h-${w}Z`);
  const jewel=(x,y,r)=>outline(`M${x} ${y-r}l${r} ${r}-${r} ${r}-${r}-${r}Z`);
  const petal=(x,y,r)=>outline(`M${x} ${y-r}Q${x+r} ${y} ${x} ${y+r}Q${x-r} ${y} ${x} ${y-r}Z`);
  const bloom=(x,y,r,count)=>{
    ctx.save();
    ctx.translate(x,y);
    for(let i=0;i<count;i++){
      ctx.save();
      ctx.rotate(i*2*Math.PI/count);
      ellipse(0,-r,r*.29,r*.49);
      ctx.restore();
    }
    ellipse(0,0,r*.55);
    ctx.restore();
  };
  const hill=(y,bend)=>outline(`M24 ${y}Q184 ${y-bend} 360 ${y}T696 ${y}V456H24Z`);
  const pine=(x,y,r)=>{
    box(x-r*.12,y-r*.24,r*.24,r*.38);
    outline(`M${x} ${y-r}L${x+r*.43} ${y-r*.52}H${x+r*.28}L${x+r*.59} ${y-r*.24}H${x+r*.36}L${x+r*.67} ${y}H${x-r*.67}L${x-r*.36} ${y-r*.24}H${x-r*.59}L${x-r*.28} ${y-r*.52}H${x-r*.43}Z`);
  };
  box(24,24,672,432);
  if(theme==='zen') drawZenBorder(ctx,720,480,24);
  const variation=page%3;
  const group=Math.floor(page/3);
  const stone=(x,y,w,h,tilt=0)=>{
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(tilt);
    outline(`M${-.95*w} ${.32*h}C${-1.18*w} ${-.2*h} ${-.61*w} ${-.9*h} ${-.18*w} ${-.97*h}C${.28*w} ${-1.04*h} ${.8*w} ${-.73*h} ${.98*w} ${-.26*h}Q${1.17*w} ${.35*h} ${.74*w} ${.69*h}Q${.08*w} ${1.02*h} ${-.63*w} ${.78*h}Q${-.88*w} ${.68*h} ${-.95*w} ${.32*h}Z`);
    outline(`M${-.86*w} ${.04*h}Q${-.37*w} ${.25*h} ${.08*w} ${-.08*h}T${.88*w} ${-.05*h}L${.9*w} ${.17*h}Q${.56*w} ${-.03*h} ${.06*w} ${.16*h}T${-.88*w} ${.25*h}Z`);
    ctx.restore();
  };
  const cloud=(x,y,w)=>{
    outline(`M${x} ${y}q${w*.12} -16 ${w*.28} -10q${w*.15} -26 ${w*.36} -7q${w*.15} -3 ${w*.22} 9q${w*.16} -1 ${w*.14} 8Z`);
  };
  const lantern=(x,y)=>{
    box(x-3,y+36,6,24);
    outline(`M${x-22} ${y+13}L${x} ${y-5}L${x+22} ${y+13}Z`);
    box(x-15,y+13,30,25);
    box(x-8,y+18,16,14);
    box(x-20,y+37,40,6);
  };
  const ripple=(x,y,w)=>outline(`M${x-w} ${y}Q${x} ${y-10} ${x+w} ${y}Q${x} ${y+10} ${x-w} ${y}Z`);
  if(theme==='zen'&&group===1){
    if(variation===0){
      ellipse(150,119,49);
      ellipse(150,119,34);
      cloud(235,106,118);
      cloud(478,136,127);
      outline('M24 298L134 185L202 229L290 148L435 277L511 176L696 293V456H24Z');
      outline('M24 373Q194 289 368 361T696 366V456H24Z');
      for(const [x,y,w,h,tilt] of [[360,385,123,33,.04],[368,336,91,29,-.07],[346,291,70,25,.09],[372,249,49,23,-.13]]) stone(x,y,w,h,tilt);
      lantern(92,303);
      lantern(620,297);
      for(const [x,y,w,h] of [[119,394,40,16],[550,403,44,18],[603,378,28,14]]) stone(x,y,w,h);
    }else if(variation===1){
      ellipse(360,130,72);
      outline('M354 77Q314 124 357 177Q306 166 308 127Q308 93 354 77Z');
      cloud(91,224,105);
      cloud(534,224,105);
      for(const [x,y,r] of [[92,96,8],[185,159,9],[529,119,11],[619,164,8],[569,70,6]]) jewel(x,y,r);
      outline('M24 319L184 237L261 280L397 219L543 279L696 235V456H24Z');
      for(const r of [182,151,117]) ellipse(360,390,r,r*.24);
      for(const [x,y,w,h,tilt] of [[357,370,101,32,-.07],[378,322,76,28,.12],[354,278,51,24,-.1],[372,240,32,21,.24]]) stone(x,y,w,h,tilt);
    }else{
      outline('M211 24H459Q548 94 472 167Q319 258 437 333Q570 398 513 456H233Q308 379 208 323Q89 255 202 173Q317 86 211 24Z');
      outline('M255 24H293Q386 92 250 181Q150 251 256 321Q356 386 269 456H251Q332 379 230 319Q118 254 224 177Q344 91 255 24Z');
      outline('M407 24H432Q517 98 443 165Q295 253 412 335Q524 409 480 456H455Q502 404 389 330Q270 250 421 163Q490 96 407 24Z');
      for(const [x,y,w] of [[358,51,26],[276,201,21],[313,274,19],[369,342,23],[421,400,19]]) ripple(x,y,w);
      const pebbles=[[321,80,40,19,.24],[389,129,38,17,-.38],[288,159,43,19,-.18],[240,224,31,21,.32],[322,238,47,22,-.18],[261,282,37,18,.19],[352,308,50,23,.4],[405,369,42,19,-.35],[331,418,32,16,.16],[434,425,37,17,-.24]];
      for(const [x,y,w,h,tilt] of pebbles) stone(x,y,w,h,tilt);
      for(const [x,y] of [[91,118],[609,139],[595,326],[103,379]]) bloom(x,y,23,6);
    }
    ctx.restore();
    return;
  }
  if(theme==='zen'&&group===0){
    const count=8+4*variation;
    for(const r of [188,160,119,77]) ellipse(360,240,r);
    for(let i=0;i<count;i++){
      ctx.save();
      ctx.translate(360,240);
      ctx.rotate(i*2*Math.PI/count);
      petal(0,-140,21);
      jewel(0,-101,14);
      ellipse(0,-174,5+variation);
      ctx.restore();
    }
    ellipse(360,240,62);
    bloom(360,240,38,6+variation);
    ellipse(360,240,12);
    for(const x of [103,617]){bloom(x,240,25,8);jewel(x,176,12);jewel(x,304,12);}
    for(const x of [84,636]) for(const y of [84,396]){jewel(x,y,24);jewel(x,y,13);}
  }else if(theme==='zen'){
    ellipse(360+variation*55,115,43);
    hill(330,52+variation*15);
    hill(405,27);
    if(group===2){
      cloud(116,136,98);
      cloud(490,145,106);
      lantern(159,313);
      lantern(556,312);
      outline('M328 347Q390 316 350 251Q289 230 273 190L299 182Q322 221 369 219Q411 194 430 155L456 164Q440 225 395 249Q427 301 389 347Z');
      for(let i=0;i<5;i++) ellipse(270+i*44,162+(i%2)*27+variation*8,43,24);
      outline('M244 336H476L441 415H279Z');
      box(241,332,238,19);
      box(295,370,130,20);
      for(const x of [320,360,400]) jewel(x,380,6);
    }else{
      cloud(115,151,109);
      cloud(514,156,105);
      for(const x of [155,565]){bloom(x,315,28,5+variation);ripple(x,387,45);ripple(x,410,31);}
      if(variation===1){
        for(const x of [298,360,422]) petal(x,318,58);
        outline('M246 352Q360 386 474 352Q449 411 360 416Q271 411 246 352Z');
      }else{
        ellipse(458,325,40,33);
        ellipse(457,325,20,16);
        outline('M265 288H459Q450 396 364 403Q277 398 265 288Z');
        ellipse(362,288,97,25);
        ellipse(362,291,76,13);
        for(const x of [330,362,394]) jewel(x,339,11);
        for(let i=0;i<3;i++) petal(326+i*36,226-i%2*15,18);
      }
    }
    for(const x of [95,625]) for(const y of [112,173,231]) jewel(x,y,7+variation);
  }else{
    ellipse(135+variation*193,111,43+group*3);
    hill(319,50);
    hill(402,46);
    if(group===0){
      for(let i=0;i<6;i++){
        const x=97+i*103,y=269+(i%2)*42;
        box(x-4,y,8,123);
        petal(x-16,y+65,15);
        bloom(x,y,23+variation*3,5+variation);
      }
      if(variation===1) for(const x of [92,246,411,590]) petal(x,192,18);
    }else if(group===1){
      if(variation===1){
        outline('M190 365H551L507 413H231Z');
        box(365,199,9,167);
        outline('M350 205V350H225Z');
        outline('M390 227L500 350H390Z');
      }else{
        for(let i=0;i<8;i++) jewel(105+i*72,194+(i%2)*22,11);
        ellipse(360,370,132,42);
        ellipse(360,370,89,24);
        for(const x of [311,360,409]) ellipse(x,368,15);
      }
    }else if(group===2){
      for(let i=0;i<5;i++){
        const x=105+i*125,y=307+i%2*50;
        if(variation===1){
          ellipse(x,y,42,31);
          ellipse(x,y,24,31);
          box(x-5,y-42,10,13);
        }else if(variation===2){
          box(x-27,y-35,54,65);
          box(x-17,y-25,34,45);
          ellipse(x,y-41,13,8);
        }else{
          outline(`M${x} ${y-55}l13 27 24-7-8 21 22 13-29 11 4 21-26-13-26 13 4-21-29-11 22-13-8-21 24 7Z`);
        }
      }
    }else{
      for(const [x,y,r] of [[106,370,95],[200,400,76],[541,378,90],[629,398,72]]) pine(x,y,r);
      if(variation===1){
        box(273,321,175,95);
        outline('M250 321L360 230L470 321Z');
        box(302,348,33,33);
        box(383,351,34,65);
      }else{
        for(const x of [274,360,446]) bloom(x,278+variation*23,26+variation*4,6);
      }
      for(const x of [97,228,498,620]) jewel(x,184+(x%3)*13,8);
    }
  }
  ctx.restore();
}

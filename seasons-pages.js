const pages=[
  // Spring Blossoms
  (d)=>{
    d.cloud(185,116,100);d.cloud(541,103,110);d.hill(355,66);
    d.path('M139 402Q227 337 310 260Q373 203 540 194L544 212Q432 226 378 268Q308 317 192 417Z');
    d.path('M273 292Q312 202 332 145L351 153Q333 226 308 268Z');
    d.path('M395 230Q474 169 496 119L510 126Q491 186 432 224Z');
    for(const [x,y,r] of [[287,187,26],[339,145,28],[377,202,20],[433,179,27],[495,124,28],[538,182,32],[569,227,24],[257,252,24],[206,314,22]])d.flower(x,y,r,5);
    for(const [x,y] of [[112,175],[573,305],[467,345],[607,137]])d.leaf(x,y,16,.6);
  },
  // Spring Rain
  (d)=>{
    d.cloud(154,111,156);d.cloud(509,115,160);
    for(const [x,y] of [[94,170],[150,230],[180,161],[554,178],[612,230],[637,154],[498,152],[107,302]])d.drop(x,y,13);
    d.oval(360,399,208,30);d.oval(360,398,147,17);
    d.path('M237 258Q240 148 360 123Q475 152 483 258Q454 230 429 258Q396 230 360 258Q324 230 291 258Q265 230 237 258Z');
    d.path('M291 258Q305 166 360 123Q412 166 429 258Q396 230 360 258Q324 230 291 258Z');
    d.path('M354 253H365V353Q365 389 335 389Q308 389 306 362H318Q319 377 335 377Q354 377 354 353Z');
    for(const [x,y] of [[124,388],[585,385],[649,412]])d.oval(x,y,25,8);
  },
  // Spring Garden
  (d)=>{
    d.oval(111,112,44);d.cloud(568,94,120);d.hill(345,63);
    for(const x of [90,155,220,500,565,630]){
      d.path(`M${x-13} 397V275l13-15 13 15V397Z`);
    }
    d.box(56,327,207,16);d.box(458,327,207,16);
    d.path('M320 414V295Q320 220 360 189Q400 220 400 295V414Z');
    d.path('M335 414V296Q335 238 360 218Q385 238 385 296V414Z');
    for(const [x,y,r] of [[279,290,21],[305,226,21],[360,187,26],[417,231,21],[443,288,22],[146,382,18],[557,382,18]])d.flower(x,y,r,6);
    d.butterfly(525,153,24);
  },
  // Summer Sunshine
  (d)=>{
    for(let i=0;i<16;i++){
      d.withTransform(360,173,i*Math.PI/8,()=>d.path('M-8 -89L0 -125L8 -89Z'));
    }
    d.oval(360,173,76);d.oval(360,173,57);
    d.cloud(139,157,111);d.cloud(567,154,108);d.hill(343,73);
    for(const [x,y,r] of [[108,376,24],[194,318,29],[275,387,26],[425,369,23],[518,313,32],[614,376,28]]){
      d.box(x-4,y,8,421-y);
      d.leaf(x-13,y+26,15,-.7);
      d.flower(x,y,r,8);
    }
  },
  // Summer Sail
  (d)=>{
    d.oval(565,111,52);d.cloud(130,129,137);d.cloud(334,101,104);
    d.hill(326,26);d.hill(389,19);
    d.path('M185 341H546L507 387H227Z');
    d.box(355,147,11,195);
    d.path('M344 162V325H212Z');d.path('M378 204L493 325H378Z');
    d.path('M366 151H435L414 168L435 183H366Z');
    for(const x of [265,315,365,415,465])d.oval(x,361,10);
    for(const [x,y] of [[96,355],[606,347],[145,412],[348,424],[572,409]])d.ripple(x,y,33);
  },
  // Summer Picnic
  (d)=>{
    d.cloud(164,116,122);d.hill(285,59);
    d.path('M99 390L176 260H553L622 390Z');
    for(let row=0;row<3;row++)for(let col=0;col<7;col++){
      const x=160+col*57,y=290+row*36;
      d.path(`M${x-row*10} ${y}h39l-9 27h-39Z`);
    }
    d.oval(282,348,76,36);d.oval(282,348,57,22);
    d.path('M227 341L282 282L330 343Q282 375 227 341Z');
    d.path('M247 339L282 302L306 339Q282 353 247 339Z');
    d.path('M389 332Q389 249 451 249Q510 249 511 332H496Q493 269 451 269Q406 269 403 332Z');
    d.path('M382 324H518L495 374H405Z');
    for(const x of [416,446,476])d.box(x,338,14,19);
  },
  // Autumn Maple
  (d)=>{
    d.cloud(151,151,112);d.cloud(553,132,125);d.hill(353,63);
    d.path('M270 426Q327 376 331 285Q309 250 263 217L279 201Q326 221 358 255Q382 213 438 169L452 185Q400 238 388 293Q388 377 441 425Z');
    d.path('M335 412Q366 350 361 282Q378 329 375 366Q374 392 394 418Z');
    for(const [x,y,r,a] of [[265,178,38,-.6],[309,136,38,.2],[367,161,46,.2],[425,120,39,-.3],[469,172,39,.48],[499,226,30,.5],[232,247,30,-.75],[148,313,25,.2],[553,310,29,.8],[479,386,20,-.2],[199,387,18,-.5]])d.maple(x,y,r,a);
  },
  // Autumn Harvest
  (d)=>{
    d.oval(151,112,44);d.hill(320,61);
    d.path('M297 316V202L360 144L424 202V316Z');
    d.path('M284 208L360 131L438 208H419L360 154L303 208Z');
    d.box(335,241,50,75);d.box(346,196,26,25);
    for(const [x,y,r] of [[124,359,36],[202,381,47],[304,381,34],[403,390,48],[519,368,38],[602,390,33]])d.pumpkin(x,y,r);
  },
  // Autumn Lanterns
  (d)=>{
    d.oval(360,134,67);d.oval(360,134,49);d.cloud(131,158,106);d.cloud(560,170,115);
    d.path('M74 98Q360 245 646 98V108Q360 258 74 110Z');
    for(const [x,y] of [[141,152],[242,185],[360,202],[478,185],[579,152]]){
      d.box(x-4,y,8,24);
      d.path(`M${x-20} ${y+28}q20-18 40 0v44q-20 18-40 0Z`);
      d.box(x-16,y+18,32,9);d.box(x-14,y+73,28,8);
      d.oval(x,y+50,9,19);
    }
    d.hill(391,44);
    for(const [x,y,a] of [[151,371,.5],[265,331,-.7],[350,398,.2],[464,347,.7],[592,384,-.4]])d.maple(x,y,22,a);
  },
  // Winter Pines
  (d)=>{
    d.oval(558,112,55);
    d.path('M24 305L165 173L265 251L374 145L570 296L696 210V456H24Z');
    d.path('M313 203L374 145L435 193L405 186L380 211L356 190L333 206Z');
    d.hill(385,58);
    for(const [x,y,r] of [[113,385,100],[229,365,82],[359,408,106],[496,364,74],[617,394,92]])d.pine(x,y,r);
    for(const [x,y] of [[96,111],[206,107],[300,143],[457,108],[637,176]])d.snow(x,y,15);
  },
  // Winter Cottage
  (d)=>{
    d.cloud(155,125,140);d.oval(554,120,46);d.hill(367,55);
    d.pine(141,377,109);d.pine(574,383,112);
    d.box(452,241,34,90);
    d.cloud(487,206,83);
    d.box(250,303,248,116);
    d.path('M224 310L365 199L524 312L507 332L366 228L241 331Z');
    d.path('M315 414V358Q343 325 371 358V414Z');
    d.box(409,343,59,43);d.box(433,343,10,43);d.box(409,359,59,9);
    d.oval(370,270,19);
    d.path('M311 419H372L416 456H259Z');
    d.snow(253,174,17);d.snow(542,229,21);
  },
  // Winter Snowflakes
  (d)=>{
    d.oval(360,240,165);d.oval(360,240,147);
    d.snow(360,240,113);
    for(const [x,y,r] of [[116,110,44],[604,110,44],[116,371,44],[604,371,44],[127,240,31],[593,240,31]])d.snow(x,y,r);
  }
];

export function drawSeasons(ctx,page){
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,720,480);
  ctx.strokeStyle='#182334';
  ctx.lineWidth=3;
  ctx.lineJoin='round';
  const path=value=>{
    const shape=new Path2D(value);
    ctx.fill(shape);
    ctx.stroke(shape);
  };
  const oval=(x,y,r,h=r)=>{
    ctx.beginPath();ctx.ellipse(x,y,r,h,0,0,Math.PI*2);ctx.closePath();ctx.fill();ctx.stroke();
  };
  const box=(x,y,w,h)=>path(`M${x} ${y}h${w}v${h}h-${w}Z`);
  const withTransform=(x,y,a,fn)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);fn();ctx.restore();};
  const leaf=(x,y,r,a)=>withTransform(x,y,a,()=>path(`M0 ${-r}Q${r} 0 0 ${r}Q${-r} 0 0 ${-r}Z`));
  const cloud=(x,y,w)=>path(`M${x-w/2} ${y}q${w*.12} -17 ${w*.31} -13q${w*.2} -27 ${w*.39} -3q${w*.15} -3 ${w*.3} 16q${-w*.07} 12 ${-w*.19} 12h${-w*.62}q${-w*.14} 0 ${-w*.19} -12Z`);
  const hill=(y,b)=>path(`M24 ${y}Q183 ${y-b} 360 ${y}T696 ${y}V456H24Z`);
  const ripple=(x,y,w)=>path(`M${x-w} ${y}Q${x} ${y-11} ${x+w} ${y}Q${x} ${y+11} ${x-w} ${y}Z`);
  const drop=(x,y,r)=>path(`M${x} ${y-r}q${r} ${r} ${r*.58} ${r*1.3}q${-r*.58} ${r*.9} ${-r*1.16} 0q${-r*.42} ${-r*.3} ${r*.58} ${-r*1.3}Z`);
  const flower=(x,y,r,n)=>{
    for(let i=0;i<n;i++)withTransform(x,y,i*Math.PI*2/n,()=>oval(0,-r*.69,r*.29,r*.48));
    oval(x,y,r*.38);
  };
  const maple=(x,y,r,a)=>withTransform(x,y,a,()=>{
    ctx.scale(r/42,r/42);
    path('M0-42L10-19L22-26L20-11L39-14L31 1L42 8L22 15L25 25L5 24V37H-5V24L-25 25L-22 15L-42 8L-31 1L-39-14L-20-11L-22-26L-10-19Z');
    path('M0-23L5 2L18 7L4 10L0 21L-4 10L-18 7L-5 2Z');
  });
  const pine=(x,y,r)=>withTransform(x,y,0,()=>{
    ctx.scale(r/90,r/90);
    box(-9,-5,18,22);
    path('M0-92L29-56H19L43-30H29L57 0H-57L-29-30H-43L-19-56H-29Z');
    path('M0-69L17-43H-17Z');
    path('M0-37L25-11H-25Z');
  });
  const snow=(x,y,r)=>{
    for(let i=0;i<6;i++)withTransform(x,y,i*Math.PI/3,()=>{
      ctx.scale(r/40,r/40);
      path('M-3-8V-22L-13-31L-9-35L-3-29V-41H3V-29L9-35L13-31L3-22V-8Z');
    });
    oval(x,y,r*.21);
  };
  const pumpkin=(x,y,r)=>{
    box(x-5,y-r-9,10,17);
    oval(x,y,r,r*.70);
    oval(x,y,r*.67,r*.70);
    oval(x,y,r*.31,r*.70);
  };
  const butterfly=(x,y,r)=>{
    for(const angle of [-.6,.6])withTransform(x,y,angle,()=>oval(0,-r,r*.38,r*.71));
    oval(x,y,r*.18,r*.76);
  };
  box(24,24,672,432);
  pages[page]({path,oval,box,withTransform,leaf,cloud,hill,ripple,drop,flower,maple,pine,snow,pumpkin,butterfly});
  ctx.restore();
}

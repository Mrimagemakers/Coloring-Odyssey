export const books=[
  ['Hue’s Got Flow','Hue Davis Jr.','#843291',['The Magic Pen','Midnight Mixtape','The Rooftop Mural']],
  ['Cosmic Coloring','Astronaut Carl Reed','#313584',['Saturn Flyby','Carl’s Space Helmet','Moon Base']],
  ['Underwater Adventure','Dr. Janice Miller','#126577',['Glowing Jellyfish','Shark Survey','Coral Garden']],
  ['Halloween Haunts','Ravenbrook','#603488',['Ravenbrook Clocktower','The Dark Manor','Pumpkin Moon']]
];
export function artwork(ctx,book,page){
  function shape(path,paint=true,width=4){
    const p=new Path2D(path);
    ctx.lineWidth=width;
    if(paint) ctx.fill(p);
    ctx.stroke(p);
  }
  function oval(x,y,rx,ry=rx){
    ctx.beginPath();
    ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
  }
  function box(x,y,w,h){shape('M'+x+' '+y+'h'+w+'v'+h+'h-'+w+'z');}
  function star(x,y,r){
    shape('M'+x+' '+(y-r)+'Q'+(x+4)+' '+(y-4)+' '+(x+r)+' '+y+'Q'+(x+4)+' '+(y+4)+' '+x+' '+(y+r)+'Q'+(x-4)+' '+(y+4)+' '+(x-r)+' '+y+'Q'+(x-4)+' '+(y-4)+' '+x+' '+(y-r)+'z',true,3);
  }
  function building(x,y,w,h){
    box(x,y,w,h);
    for(let a=x+11;a<x+w-14;a+=23) for(let b=y+16;b<y+h-24;b+=30) box(a,b,12,15);
  }
  ctx.save();
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,720,480);
  ctx.strokeStyle='#182334';
  ctx.lineJoin='round';
  ctx.lineCap='round';
  box(18,18,684,444);
  const sky=[[76,108,19],[149,67,20],[550,78,25],[640,151,19],[475,55,12]];
  if(book===0){
    oval(584,126,52);
    [[47,240,63,167],[115,181,69,226],[190,214,75,193],[477,254,58,153],[539,206,71,201],[614,254,59,153]].forEach(a=>building(...a));
    box(20,405,680,54);
    if(page===0){
      shape('M231 368L250 303 441 92Q459 76 475 92L502 116Q514 132 498 150L304 355Z');
      shape('M231 368L250 303 304 355ZM441 92L498 150M418 118L475 175M270 322L449 126',false);
      [[177,115,26],[321,110,21],[360,174,13],[565,300,26]].forEach(a=>star(...a));
    }else if(page===1){
      box(211,168,299,183);
      box(242,199,238,69);
      oval(294,233,22);oval(429,233,22);
      shape('M278 319L307 279H416L450 319Z');
      shape('M221 143H499L513 168H207Z');
      star(169,133,29);star(550,165,26);
    }else{
      box(176,139,367,232);
      shape('M193 346Q257 156 279 295Q294 370 346 185Q363 137 413 289Q433 359 523 166L523 346Z');
      star(281,196,29);star(456,215,24);
      shape('M219 319Q258 226 289 337M369 208Q379 222 397 278',false);
    }
  } else if(book===1){
    sky.forEach(a=>star(...a));
    star(91,326,30);star(635,351,28);
    if(page===0){
      oval(362,246,113);
      shape('M253 222C58 259 77 369 318 332C504 305 604 221 593 188C586 162 527 171 472 186L476 204C521 195 550 196 550 207C533 240 426 284 306 306C163 332 105 300 252 242Z');
      shape('M268 198Q361 155 451 188M255 228Q355 193 469 207M303 345Q370 352 430 321',false);
      oval(605,264,34);
    } else if(page===1){
      shape('M207 403Q218 327 280 309H440Q510 331 513 403Z');
      oval(360,228,113,113);
      shape('M286 196Q304 146 359 146Q425 146 444 194L435 270Q360 305 287 268Z');
      shape('M311 193Q348 161 382 171M303 216L329 196',false,3);
      box(309,332,104,52);
      oval(331,358,8);oval(366,358,8);oval(398,358,8);
    }else{
      shape('M20 351Q140 305 253 350T486 348T700 334V460H20Z');
      shape('M223 359C230 203 489 203 500 359Z');
      shape('M252 359C267 255 451 255 472 359Z');
      box(327,319,66,82);
      oval(178,400,36,12);oval(555,379,38,14);oval(608,424,27,10);
      shape('M360 241V145H425L408 169L425 192H360',false);
    }
  }else if(book===2){
    shape('M20 386Q151 339 269 395T504 381T699 379V460H20Z');
    [[84,128,22],[118,80,12],[615,159,23],[643,103,11],[546,303,15]].forEach(a=>oval(...a));
    if(page===0){
      for(const x of [290,327,365,403,438]) shape('M'+x+' 223q-35 45 -8 77t0 70q30 -25 18 -66t6 -81z',true,3);
      shape('M217 223C223 79 495 79 506 223Q480 250 456 225Q431 253 407 225Q381 253 358 225Q331 253 307 225Q281 253 258 225Q234 249 217 223Z');
      shape('M251 181Q313 128 369 151Q419 137 466 181',false);
    }else if(page===1){
      shape('M107 252L169 207L137 165Q257 208 317 183L353 118L390 177Q491 165 588 235L530 249Q481 317 340 271L294 307L306 258Q221 239 107 299L137 267Z');
      shape('M320 244Q421 274 530 249M386 209L383 232M399 210L396 233M412 211L409 234',false);
      oval(506,224,8);
      shape('M483 260l10 12 12-18m-37 12 8 12 12-15',false,3);
    }else{
      for(const [x,y] of [[188,391],[318,414],[486,399]]){
        shape('M'+x+' '+y+'q-26 -48 -75 -82q-14 -19 4 -24q38 18 53 33q-24 -59 -13 -91q12 -15 25 0q-4 35 22 81q9 -55 43 -79q19 0 16 18q-27 30 -27 85q23 -23 47 -18q13 10 2 23q-25 13 -46 54z');
      }
      shape('M374 172q84 -66 159 0l34 -28v56l-34 -28q-73 68 -159 0z');
      oval(422,167,7);
    }
  }else{
    oval(548,119,65);
    sky.slice(0,3).forEach(a=>star(...a));
    shape('M20 389Q160 355 302 398T700 384V460H20Z');
    if(page===0){
      box(287,166,146,253);
      shape('M269 168L358 62L452 168Z');
      oval(360,231,43);
      shape('M360 206V234L384 246',false);
      shape('M330 419V350Q360 304 390 350V419Z');
      for(const x of [299,402]) shape('M'+x+' 307v-32q8 -16 16 0v32z');
    }else if(page===1){
      box(231,219,263,183);
      shape('M209 219L361 106L521 219Z');
      shape('M232 219V143L259 87L283 143V219Z');
      shape('M439 219V143L467 87L493 143V219Z');
      shape('M327 402V322Q362 274 397 322V402Z');
      box(260,268,38,56);box(424,268,38,56);
      oval(361,178,21);
    }else{
      shape('M315 203L304 163L334 149L363 193L401 169L416 196L378 223Z');
      oval(360,295,140,100);
      shape('M314 219Q254 282 309 380M405 221Q464 284 410 380',false);
      shape('M274 280L313 242L338 290ZM382 288L405 242L444 280Z');
      shape('M274 311Q358 351 447 311Q419 367 361 367Q303 367 274 311Z');
    }
  }
  ctx.restore();
}
import {zenPages,seasonPages,drawCalmPage} from './calm-pages.js?v=1';

export const books=[
  ['Hue’s Got Flow','Hue Davis Jr.','#843291',['The Magic Pen','Midnight Mixtape','The Rooftop Mural']],
  ['Cosmic Coloring','Astronaut Carl Reed','#313584',['Saturn Flyby','Carl’s Space Helmet','Moon Base']],
  ['Underwater Adventure','Dr. Janice Miller','#126577',['Glowing Jellyfish','Shark Survey','Coral Garden']],
  ['Halloween Haunts','Ravenbrook','#603488',['Ravenbrook Clocktower','The Dark Manor','Pumpkin Moon']],
  ["Animals","Wildlife","#a83e55",["Duck Pond"]],
  ["Nature","Flowers and plants","#17694f",["Garden Bouquet"]],
  ["Fantasy","Magic and mythical worlds","#69418d",["Castle Above the Clouds"]],
  ["Vehicles","Cars and rides","#af6032",["Classic Coupe"]],
  ["Characters","Original portraits","#724d91",["The Roller-Skate Hero"]],
  ["Patterns","Geometric designs","#a6437d",["Sunburst Mandala"]],
  ["Zen","Mandala, bonsai, and quiet moments","#76604c",zenPages],
  ["Seasons","Spring through winter","#377268",seasonPages]
];

const extraPages=[
  [
    "Mallard Cove",
    "Fox Hollow",
    "Owl at Dusk",
    "Turtle Island",
    "Bunny Meadow",
    "Deer Crossing",
    "Bear Creek",
    "Otter Rapids",
    "Butterfly Marsh",
    "Wolf Ridge",
    "Swan Lake"
  ],
  [
    "Fern Grotto",
    "Poppy Fields",
    "Mushroom Circle",
    "Lotus Pool",
    "Sunflower Farm",
    "Cactus Bloom",
    "Iris Garden",
    "Wildflower Trail",
    "Rose Trellis",
    "Maple Grove",
    "Orchid Conservatory"
  ],
  [
    "Moon Gate",
    "Dragon Keep",
    "Crystal Citadel",
    "Fairy Village",
    "Wizard’s Observatory",
    "Cloud Bridge",
    "Mermaid Palace",
    "Phoenix Tower",
    "Unicorn Glade",
    "Enchanted Library",
    "Floating Fortress"
  ],
  [
    "Desert Rally",
    "Moon Rover",
    "Fire Engine",
    "City Tram",
    "Race Day",
    "Mountain Pickup",
    "Beach Buggy",
    "Delivery Van",
    "Vintage Racer",
    "Expedition Rig",
    "Midnight Cruiser"
  ],
  [
    "The Trail Guide",
    "The Space Cadet",
    "The Garden Keeper",
    "The Skate Captain",
    "The Sound Engineer",
    "The Ocean Explorer",
    "The Street Artist",
    "The Pilot",
    "The Inventor",
    "The Stage Star",
    "The Stargazer"
  ],
  [
    "Crystal Tessellation",
    "Petal Compass",
    "Orbit Rings",
    "Diamond Mosaic",
    "Kaleidoscope Bloom",
    "Ribbon Rosette",
    "Honeycomb Sun",
    "Star Quilt",
    "Lotus Spiral",
    "Prism Wheel",
    "Midnight Mandala"
  ]
];
extraPages.forEach((pages,index)=>books[index+4][3].push(...pages));
const linework=[
  [
    "M288 317L452 136M303 328L466 149M260 332L283 353M252 347L268 361\nM399 159l10 10 18-20-10-10zM333 231l10 10 18-20-10-10z\nM20 427H700M20 445H700M75 427v18m70-18v18m70-18v18m70-18v18m70-18v18m70-18v18m70-18v18m70-18v18m70-18v18",
    "M245 182h230v9H245zM251 244h21m-21 7h21m178-7h21m-21 7h21\nM307 279l14 40m15-40 8 40m16-40v40m17-40-2 40m19-40-8 40m19-40-12 40\nM230 331h119v9H230zM370 331h119v9H370z",
    "M186 151h347v209H186zM203 356v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10m28 10v-10\nM210 188q16-25 35 0q-15 25-35 0zM447 168q18-25 36 0q-18 25-36 0z"
  ],
  [
    "M305 168q50-22 107-5M263 215q98-42 194-16M308 350q65-3 121-35\nM156 348q38 9 96-1M371 318q93-23 162-60M487 195q30-6 51-3",
    "M260 200q19-58 62-71m76 0q48 17 66 69M272 276q90 75 177 0\nM291 315v25m139-25v25M264 342l-18 59m211-59 18 59\nM309 369h104M319 377h84M332 289q28 8 55 0",
    "M253 359h74m66 0h77M274 311h174m-160-15v61m25-77v76m93-76v76m25-60v61\nM340 328h40v60h-40zM360 328v60M73 415q28-25 65-5q-31 35-65 5zM528 425q19-13 44-3q-18 14-44 3z"
  ],
  [
    "M230 211Q366 177 495 211M256 218Q366 198 478 219M281 148Q366 106 443 152\nM283 229L274 247M315 231L311 248M353 233L348 254M392 233L385 253M427 235L423 251\nM78 421q23-34 47 0q-19 21-47 0zM571 414q21-38 51-2q-25 24-51 2z",
    "M177 230q56-12 107-8M177 275q62-30 124-24M326 187l28-53 19 45\nM350 264l-29 18M444 191q44 1 88 21M452 195l14 10-12 11-14-10z\nM62 404q26-18 49 0q-23 19-49 0zM575 424q27-27 47 0q-20 13-47 0z",
    "M468 135q-28 30 0 67M487 139q-20 31 0 55M514 154q-10 15 0 32\nM155 384q-26-42-56-53m48 6q-16-38-14-63M489 384q27-47 52-54m-44 2q14-49 36-64\nM76 433q18-28 43 0q-24 9-43 0zM570 420q42-29 75 0q-42 23-75 0z"
  ],
  [
    "M286 157H432M297 142H420M305 129H408M318 114H395M331 100H385\nM289 331h142M289 340h142M288 365h40m65 0h40M288 382h40m65 0h40\nM338 420v-66q23-37 44 0v66M360 349v70",
    "M235 236h256M235 249h256M235 344h89m76 0h92M235 364h89m76 0h92\nM276 268v56m-16-27h38M443 268v56m-19-27h38\nM341 402v-78q20-34 42 0v78M467 103v101M259 103v101",
    "M280 227q-69 80 8 136M438 224q72 81-7 142M337 208q-11 12-17 25m79-19 10 13\nM321 330l12 18 14-16m35 4 11 16 13-20M350 295l12-23 15 23z\nM325 188l10 10 11-14m40 9 10 12 11-15"
  ],
  [
    "M271 303q62 18 120 2M285 316q44 15 85 6M304 330q28 7 53 0\nM183 287q12 74 86 90M406 344q48-15 95-44\nM63 383q42-15 78 0m404 0q41-15 84 0M225 420q48-23 104 0m36 20q48-23 104 0"
  ],
  [
    "M273 360q85 28 176 0M275 378q85 28 170 0M280 399h163M283 416h157\nM296 389l12 9-12 9-12-9zM360 390l13 9-13 9-13-9zM422 389l12 9-12 9-12-9z\nM265 270l69 30m59-3 53-32"
  ],
  [
    "M294 182h132M294 200h132M294 218h132M295 251h130m-123 24h115m-121 17h128\nM339 222v-26q21-34 42 0v26zM360 194v28m-20-15h40\nM233 315h49m-50 19h50m151-19h57m-57 19h57M359 348v34"
  ],
  [
    "M112 327h28m-24 10h28m430-2h37m-36 11h33\nM247 326q59-46 106-46m28 25q62 23 110 23\nM277 242l28-32m-11 33 28-32m101 35 15-17m2 17 12-13\nM226 385l-9-10m-56 12 10-12m396 8-10-10m-54 9 12-11"
  ],
  [
    "M281 168q24-54 73-44q28 6 50-13M284 181q65-36 105-48M407 121q25-9 40 33m-27-21q25 22 26 46\nM300 243q10-7 18 0m83 0q10-7 20 0M356 236l-8 14h19\nM246 409l23-63m203 63-23-63M302 333q58 42 115 0M293 345q65 44 134 0"
  ],
  [
    "M45 240q34-59 68 0q-34 59-68 0zM607 240q34-59 68 0q-34 59-68 0z\nM100 240q32-46 64 0q-32 46-64 0zM555 240q32-46 64 0q-32 46-64 0z"
  ]
];
const accents=[[[134,120],[240,62],[581,60],[637,115],[92,175]],[[172,194],[194,398],[561,398],[108,208],[609,65]],[[144,152],[167,365],[607,251],[644,324],[71,318]],[[112,186],[211,115],[568,218],[632,286],[165,317]],[[138,114],[204,88],[517,126],[574,88],[319,133]],[[125,237],[157,310],[552,312],[586,245],[99,367]],[[121,221],[176,169],[596,214],[555,317],[152,302]],[[82,220],[218,121],[483,107],[622,206],[357,88]],[[146,160],[559,151],[129,308],[568,304],[605,366]],[[66,164],[653,165],[65,314],[653,314]]];

function drawExpandedScene(ctx,book,page,shape,oval,box,star){
  const theme=book-4;
  const variation=page-1;
  const center=350+(variation%3-1)*23;
  const diamond=(x,y,r)=>shape(`M${x} ${y-r}l${r} ${r}-${r} ${r}-${r}-${r}z`,false,2);
  const leaf=(x,y,size)=>shape(`M${x} ${y}q${size/2} -${size} ${size} 0q-${size/2} ${size} -${size} 0z`);
  const flower=(x,y,r,count)=>{
    for(let petal=0;petal<count;petal++){
      ctx.save();ctx.translate(x,y);ctx.rotate(petal*Math.PI*2/count);
      oval(0,-r*.75,r*.27,r*.6);
      ctx.restore();
    }
    oval(x,y,r*.32);
  };
  const hill=(y,crest)=>shape(`M20 ${y}Q180 ${y-crest} 340 ${y}T700 ${y}V460H20Z`);
  const reflection=(x,y,w)=>shape(`M${x} ${y}q${w/2} -10 ${w} 0q-${w/2} 10 -${w} 0z`,false,2);
  if(theme===5){
    for(let ring=3;ring>=0;ring--){
      const radius=40+ring*49;
      const count=6+2*((variation+ring*2)%7);
      oval(360,240,radius+21);
      for(let spoke=0;spoke<count;spoke++){
        ctx.save();ctx.translate(360,240);ctx.rotate((spoke+(ring%2)*.5)*Math.PI*2/count);
        if((ring+variation)%2) diamond(radius,0,13+ring*2);
        else leaf(radius-12,0,24+ring*2);
        ctx.restore();
      }
    }
    flower(360,240,24,6+variation%5);
    for(const x of [79,641]) for(const y of [80,400]) flower(x,y,26,5+variation%4);
    return;
  }
  oval(100+variation*46,91,30+variation%4*4);
  for(let i=0;i<6;i++) star(40+((i*117+variation*31)%630),49+(i%2)*62,5+(i+variation)%5);
  hill(340,50+variation%4*17);
  hill(391,30+variation%3*15);
  if(theme===0){
    const scale=1+(variation%4)*.08;
    ctx.save();ctx.translate(center,305);ctx.scale(scale,scale);
    const profiles=[
      'M-98 15Q-90-30-43-45L-65-88-6-61 38-77 52-35Q96-20 111 11L68 33Q12 58-41 38L-75 57-68 25Z',
      'M-87 30Q-114-2-81-43L-61-68-23-48 30-48 69-68 90-38Q120 13 81 40Q0 84-87 30Z',
      'M-112 12Q-108-43-45-51Q24-63 73-24L104-39 112-7 89 17Q51 51-9 38L-39 62-57 32Z',
      'M-98 26Q-91-9-46-36L-51-96Q-26-108-9-47L10-46Q25-114 49-90L34-35Q89-16 91 26Q48 70-98 26Z',
      'M-103 8Q-108-31-64-48L-72-87-44-65-32-102-20-59 36-52 52-91 66-66 89-73 74-38Q112-15 96 24Q31 74-44 40Z',
      'M-91 22Q-112-18-80-39Q-99-71-65-78Q-39-84-28-55Q0-68 37-54Q49-86 76-76Q106-63 85-37Q115-6 88 29Q0 83-91 22Z',
      'M-116 20Q-139-3-110-14L-67 2Q-33-48 33-39Q54-65 84-52Q119-42 116-9Q113 25 72 32Q38 63-47 45Z',
      'M0-30Q-52-92-100-64Q-143-25-72 0Q-133 35-82 64Q-40 69 0 26Q40 69 82 64Q133 35 72 0Q143-25 100-64Q52-92 0-30Z',
      'M-108 27Q-105-3-67-18L-38-72-2-38 38-71 58-31 112 3 78 35Q30 72-108 27Z'
    ];
    if(variation===0 || variation===10){
      shape('M-110 20Q-51-30 9 1Q-22-50 10-77Q46-108 68-75L97-66 68-54Q65-19 98 9Q51 62-39 53Z');
      oval(53,-73,4);
      shape('M-71 23Q-22 8 30 26Q-7 50-71 23Z',false,2);
    }else{
      shape(profiles[variation-1]);
      if(variation===8){
        oval(0,4,9,33);
        for(const x of [-69,-37,37,69]) oval(x,x%2?12:-22,12,8);
      }else{
        for(const x of [-30,33]){oval(x,-9,11,13);oval(x,-9,4,5);}
        oval(1,15,10,6);
        shape('M-20 31Q0 43 22 31',false,2);
      }
    }
    ctx.restore();
    for(let i=0;i<8;i++) reflection(32+i*82,412+i%2*24,31+variation%4*4);
  }else if(theme===1){
    for(let i=0;i<7;i++){
      const x=90+i*90, y=190+((variation*37+i*53)%125), r=18+(variation+i)%4*7;
      shape(`M${x} 420Q${x+18} 345 ${x} ${y}`,false,2);
      leaf(x-38,368-i%2*19,38);leaf(x,347-i%2*17,38);
      if(variation%3===0){oval(x,y,r,r*.65);for(let petal=0;petal<5;petal++)oval(x+(petal-2)*r*.35,y,r*.12,r*.22);}
      else flower(x,y,r,4+(variation+i)%6);
    }
  }else if(theme===2){
    for(let i=0;i<5;i++){
      const x=center-177+i*71, top=147+((i*49+variation*24)%91);
      box(x,top,57,380-top);
      shape(`M${x-8} ${top}l36 -${36+(i+variation)%4*11} 36 ${36+(i+variation)%4*11}z`);
      for(let y=top+22;y<349;y+=35){oval(x+28,y,8,12);shape(`M${x+7} ${y+17}h44`,false,2);}
      diamond(x+28,top-13,7);
    }
    shape(`M${center-39} 399V332Q${center} 263 ${center+39} 332V399Z`);
    for(let i=0;i<5;i++) diamond(center-96+i*48,425,12);
  }else if(theme===3){
    const roof=195+variation%4*12, wheel=38+variation%3*4;
    box(20,377,680,82);
    shape(`M78 346L110 293 205 265 264 ${roof}H${428+variation%4*15}L500 265 596 283 645 330 628 369H81Z`);
    shape(`M227 265L279 ${roof+14}H354V265ZM374 265V${roof+14}H421L476 265Z`);
    for(const x of [176,552]){oval(x,355,wheel);oval(x,355,20);flower(x,355,13,5);}
    for(let i=0;i<4;i++){box(251+i*55,312,40,11);diamond(278+i*53,288,9);}
    oval(108,323,15,9);oval(616,321,15,9);
    for(let i=0;i<6;i++) box(37+i*111,422,61,8);
  }else{
    const hair=variation%4;
    shape(`M${center-126} 417Q${center-102} 320 ${center-46} 304H${center+46}Q${center+102} 320 ${center+126} 417Z`);
    oval(center,240,72,90);
    if(hair===0){for(let i=0;i<7;i++) oval(center-60+i*20,153-i%2*13,22,25);}
    else if(hair===1){shape(`M${center-82} 214Q${center-82} 114 ${center} 124Q${center+81} 117 ${center+81} 212Q${center+2} 158 ${center-82} 214Z`);}
    else{box(center-78,153,156,29);oval(center,141,49,24);}
    for(const x of [center-27,center+27]){oval(x,238,13,10);oval(x,238,5);if(variation%2) oval(x,238,22,17);}
    shape(`M${center-20} 277Q${center} 288 ${center+20} 277Q${center} 308 ${center-20} 277Z`);
    flower(center,367,27,5+variation%6);
    for(const x of [center-91,center+91]) for(let i=0;i<3;i++) diamond(x,353+i*22,7);
  }
  for(const x of [51,669]) for(const y of [246,289,332]) diamond(x,y,8);
}

export function artwork(ctx,book,page){
  if(book>=10){
    drawCalmPage(ctx,book===10?'zen':'seasons',page);
    return;
  }
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
    for(let row=12;row<h;row+=12){
      shape('M'+x+' '+(y+row)+'h'+w,false,1.35);
      for(let col=10+((row/12)%2)*9;col<w;col+=19){
        shape('M'+(x+col)+' '+(y+row-12)+'v12',false,1.25);
      }
    }
    for(let a=x+11;a<x+w-14;a+=23) for(let b=y+16;b<y+h-24;b+=30){
      box(a,b,12,15);
      shape('M'+(a+6)+' '+b+'v15m-6-7h12',false,1.65);
    }
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
  }else if(book===3){
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
  if(book>=4 && page>0){
    drawExpandedScene(ctx,book,page,shape,oval,box,star);
    shape('M9 9H711V471H9Z',false,1.4);
    ctx.restore();
    return;
  }
  if(book===4){
    shape('M20 333Q85 302 151 333T281 333T411 333T541 333T699 333V460H20Z');
    shape('M162 285Q147 213 207 194Q265 181 287 250Q337 252 384 274Q442 266 511 229L493 280L532 290Q484 386 325 391Q204 390 162 285Z');
    shape('M160 244Q130 258 107 269Q120 289 167 274Z');
    oval(207,235,8);
    shape('M267 296Q339 305 414 296Q376 350 310 338Q280 330 267 296Z');
    for(const x of [77,592,639]) shape('M'+x+' 329v-106m0 89q-22-40-44-43m44 30q20-34 41-42',false,3);
    for(const x of [108,492,587]) shape('M'+x+' 418q28-13 54 0',false,3);
  }
  if(book===5){
    for(const [x,y] of [[216,178],[360,118],[508,177]]){
      shape('M'+x+' '+y+'L360 377',false,5);
      for(let i=0;i<7;i++){
        const a=i*Math.PI*2/7;
        ctx.save();ctx.translate(x,y);ctx.rotate(a);oval(39,0,31,18);ctx.restore();
      }
      oval(x,y,22);
    }
    shape('M355 314Q282 318 249 255Q314 258 355 314Z');
    shape('M366 312Q426 315 462 251Q401 254 366 312Z');
    shape('M264 350H456L438 441H282Z');
    box(252,334,216,24);
    star(113,122,25);star(598,132,26);

  }
  if(book===6){
    oval(552,110,55);
    [[95,98,17],[222,85,13],[477,58,16],[627,165,26]].forEach(a=>star(...a));
    box(228,257,264,126);
    box(294,157,132,226);
    shape('M275 160L360 69L445 160Z');
    for(const x of [228,432]){
      box(x,235,60,148);
      shape('M'+(x-9)+' 236l39-70 39 70z');
      oval(x+30,278,12,20);
    }
    shape('M333 383v-56q27-48 54 0v56z');
    shape('M134 404Q138 373 188 379Q208 343 255 371Q279 349 310 378Q357 349 391 378Q433 347 462 370Q513 342 538 380Q586 368 597 406Q577 438 360 439Q168 438 134 404Z');
  }
  if(book===7){
    box(20,369,680,90);
    shape('M112 310L158 271L218 258Q274 166 382 169Q449 169 510 252L561 264Q602 274 615 335L595 366H117Q92 355 112 310Z');
    shape('M234 256Q283 189 351 190V256Z M373 190Q440 197 486 256H373Z');
    oval(195,356,51);oval(535,356,51);oval(195,356,23);oval(535,356,23);
    oval(131,318,16,11);oval(592,307,16,11);
    shape('M367 270V347M384 285H418M246 344H481M42 419H143M290 419H429M553 419H674',false,4);
    star(124,142,25);star(558,123,27);
  }
  if(book===8){
    oval(360,214,91,107);
    shape('M275 199Q234 125 307 102Q340 62 393 98Q462 91 465 161L444 204Q413 197 404 150Q335 199 275 199Z');
    shape('M319 227Q336 214 351 227M369 227Q385 213 402 226',false);
    oval(336,234,6);oval(385,234,6);
    shape('M337 264Q359 281 386 263Q363 305 337 264Z');
    shape('M218 417Q239 327 312 306Q360 348 407 306Q481 327 501 417Z');
    star(360,380,24);star(177,230,25);star(540,223,28);
    shape('M270 413L286 357M451 413L435 357',false);
  }
  if(book===9){
    for(let ring=0;ring<3;ring++){
      const count=[16,12,8][ring], radius=[145,111,65][ring], length=[52,36,32][ring];
      for(let i=0;i<count;i++){
        ctx.save();
        ctx.translate(360,240);
        ctx.rotate((i+ring*.5)*Math.PI*2/count);
        shape('M'+(radius-length)+' 0Q'+radius+' -39 '+(radius+length)+' 0Q'+radius+' 39 '+(radius-length)+' 0Z');
        ctx.restore();
      }
    }
    oval(360,240,33);star(360,240,19);
    [[102,96,34],[617,96,34],[102,383,34],[617,383,34]].forEach(a=>star(...a));
  }
  // Fine contours and smaller enclosed regions sit inside each illustration.
  shape(linework[book][page],false,1.8);
  for(const [x,y] of accents[book]){
    if(book===2 || book===4){
      oval(x,y,10);
      oval(x+15,y-17,4);
    }else{
      shape('M'+x+' '+(y-10)+'l8 10-8 10-8-10z',false,1.6);
      shape('M'+x+' '+(y-5)+'l4 5-4 5-4-5z',false,1.3);
    }
  }
  if(book===0 && page===1){
    oval(294,233,10);
    oval(429,233,10);
  }
  if(book===1 && page===0){
    oval(605,264,23);
    oval(597,258,5);
    oval(612,272,6);
  }
  if(book===3 && page===0){
    for(let tick=0;tick<12;tick++){
      ctx.save();ctx.translate(360,231);ctx.rotate(Math.PI*tick/6);
      shape('M0 -37v7',false,2);
      ctx.restore();
    }
  }
  if(book===9){
    for(let i=0;i<24;i++){
      ctx.save();ctx.translate(360,240);ctx.rotate(Math.PI*i/12);
      shape('M190 0l14-7 14 7-14 7z',false,1.8);
      ctx.restore();
    }
  }
  // A second fine rule frames the artwork without touching the scene.
  shape('M9 9H711V471H9Z',false,1.4);
  ctx.restore();
}
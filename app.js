import {books,artwork} from './art.js';
const $=id=>document.getElementById(id);
const canvas=$('paper'), ctx=canvas.getContext('2d',{willReadFrequently:true});
const colors=['#914ff5','#c474fc','#ff6fae','#e93755','#ff7c45','#ffd565','#eced91','#9fd358','#39bc79','#08bdae','#4bc8ef','#4e78ef','#26377a','#8c5139','#182334','#ffffff'];
let book=0,page=0,mode='fill',history=[],stroke=null,texture,importId=0;
const edits=new Map(), imports=new Map();
const snapshot=()=>ctx.getImageData(0,0,720,480);
const refresh=()=>{if(texture) texture.needsUpdate=true;};
const key=()=>book+':'+page;
const title=()=>page===-1?imports.get(book)?.name:books[book][3][page];
const status=message=>{$('status').textContent=message;};
function chooseColor(color){
  $('color').value=color;
  for(const button of $('palette').children) button.setAttribute('aria-pressed',button.dataset.color===color);
}
for(const color of colors){
  const button=document.createElement('button');
  button.className='swatch';
  button.style.background=color;
  button.dataset.color=color;
  button.setAttribute('aria-label','Color '+color);
  button.onclick=()=>chooseColor(color);
  $('palette').append(button);
}
chooseColor(colors[0]);
const thumbnails=document.createElement('canvas');
thumbnails.width=720;
thumbnails.height=480;
books.forEach(([name,character,tint],i)=>{
  artwork(thumbnails.getContext('2d'),i,0);
  const button=document.createElement('button'), image=new Image(), label=document.createElement('strong'), credit=document.createElement('small');
  image.src=thumbnails.toDataURL();
  image.alt='';
  label.textContent=name;
  credit.textContent=character;
  button.style.setProperty('--tint',tint);
  button.append(image,label,credit);
  button.onclick=()=>{open(i,0);$('studio').scrollIntoView();};
  $('books').append(button);
});
function open(nextBook,nextPage,remember=true){
  ++importId;
  if(remember) edits.set(key(),snapshot());
  book=nextBook;
  page=nextPage;
  stroke=null;
  const [name,,,pages]=books[book];
  $('book-title').textContent=name;
  const options=pages.map((label,i)=>new Option(label,i));
  if(imports.has(book)) options.push(new Option(imports.get(book).name,-1));
  $('pages').replaceChildren(...options);
  $('pages').value=page;
  [...$('books').children].forEach((button,i)=>button.setAttribute('aria-pressed',i===book));
  const image=edits.get(key())??(page===-1?imports.get(book)?.pixels:null);
  if(image) ctx.putImageData(image,0,0);
  else artwork(ctx,book,page);
  history=[];
  $('undo').disabled=true;
  status(mode==='fill'?'Tap an enclosed area to fill it.':'Drag to paint.');
  refresh();
}
$('pages').onchange=event=>open(book,Number(event.target.value));
function checkpoint(){
  history.push(snapshot());
  if(history.length>16) history.shift();
  $('undo').disabled=false;
}
function undo(){
  if(!history.length) return;
  ctx.putImageData(history.pop(),0,0);
  $('undo').disabled=!history.length;
  refresh();
}
$('undo').onclick=undo;
for(const tool of ['fill','brush']) $(''+tool).onclick=()=>{
  mode=tool;
  for(const id of ['fill','brush']) $(id).setAttribute('aria-pressed',id===mode);
  status(mode==='fill'?'Tap an enclosed area to fill it.':'Drag to paint.');
};
$('color').oninput=event=>chooseColor(event.target.value);
function fill(x,y){
  const width=720,height=480;
  const start=Math.max(0,Math.min(width-1,Math.floor(x)))+width*Math.max(0,Math.min(height-1,Math.floor(y)));
  const image=snapshot(), pixels=image.data;
  const original=pixels.slice(start*4,start*4+3);
  const color=$('color').value.slice(1).match(/../g).map(hex=>parseInt(hex,16));
  if(original.every((value,i)=>value===color[i])) return;
  checkpoint();
  const queue=new Int32Array(width*height), seen=new Uint8Array(width*height);
  let first=0,last=0;
  function add(i){
    if(seen[i]) return;
    seen[i]=1;
    if(original.every((value,c)=>Math.abs(value-pixels[i*4+c])<=25)) queue[last++]=i;
  }
  add(start);
  while(first<last){
    const i=queue[first++], col=i%width;
    pixels.set(color,i*4);
    if(col) add(i-1);
    if(col<width-1) add(i+1);
    if(i>=width) add(i-width);
    if(i<width*(height-1)) add(i+width);
  }
  ctx.putImageData(image,0,0);
  refresh();
}
function point(event){
  const rect=canvas.getBoundingClientRect();
  return {x:(event.clientX-rect.left)*720/rect.width,y:(event.clientY-rect.top)*480/rect.height};
}
function draw(from,to){
  const size=Number($('size').value);
  ctx.strokeStyle=ctx.fillStyle=$('color').value;
  ctx.lineWidth=size;
  ctx.lineCap='round';
  ctx.beginPath();
  if(from===to){
    ctx.arc(to.x,to.y,size/2,0,Math.PI*2);
    ctx.fill();
  }else{
    ctx.moveTo(from.x,from.y);
    ctx.lineTo(to.x,to.y);
    ctx.stroke();
  }
  refresh();
}
canvas.onpointerdown=event=>{
  if(event.button!==0 || stroke) return;
  const at=point(event);
  if(mode==='fill'){fill(at.x,at.y);return;}
  checkpoint();
  canvas.setPointerCapture(event.pointerId);
  stroke={id:event.pointerId,at};
  draw(at,at);
};
canvas.onpointermove=event=>{
  if(stroke?.id!==event.pointerId) return;
  const at=point(event);
  draw(stroke.at,at);
  stroke.at=at;
};
canvas.onlostpointercapture=()=>{stroke=null;};
$('import').onchange=async event=>{
  const file=event.target.files[0];
  event.target.value='';
  if(!file) return;
  const request=++importId;
  try{
    const bitmap=await createImageBitmap(file);
    if(request!==importId){bitmap.close();return;}
    const surface=document.createElement('canvas');
    surface.width=720;
    surface.height=480;
    const paint=surface.getContext('2d');
    const ratio=Math.min(720/bitmap.width,480/bitmap.height);
    const width=bitmap.width*ratio,height=bitmap.height*ratio;
    paint.fillStyle='#fff';
    paint.fillRect(0,0,720,480);
    paint.drawImage(bitmap,(720-width)/2,(480-height)/2,width,height);
    bitmap.close();
    if(page!==-1) edits.set(key(),snapshot());
    edits.delete(book+':-1');
    imports.set(book,{name:file.name,pixels:paint.getImageData(0,0,720,480)});
    open(book,-1,false);
  }catch{if(request===importId) status('Could not open that image.');}
};
let gallery=[];
try{
  const value=JSON.parse(localStorage.getItem('coloring-odyssey-gallery')??'[]');
  if(Array.isArray(value)) gallery=value.filter(item=>typeof item?.image==='string' && item.image.startsWith('data:image/png;') && typeof item.title==='string');
}catch{}
function download(image,label){
  const anchor=document.createElement('a');
  anchor.href=image;
  anchor.download=label.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.png';
  anchor.click();
}
function showGallery(){
  $('gallery').replaceChildren();
  if(!gallery.length){
    const empty=document.createElement('p');
    empty.textContent='Save a coloring to display it here.';
    $('gallery').append(empty);
  }
  for(const item of gallery){
    const button=document.createElement('button'), image=new Image();
    image.src=item.image;
    image.alt='';
    button.append(image,item.title);
    button.setAttribute('aria-label','Download '+item.title);
    button.onclick=()=>download(item.image,item.title);
    $('gallery').append(button);
  }
}
$('save').onclick=()=>{
  const updated=[{image:canvas.toDataURL(),title:title()},...gallery].slice(0,16);
  try{localStorage.setItem('coloring-odyssey-gallery',JSON.stringify(updated));}
  catch{status('Could not save to this browser. Use Download PNG to keep your artwork.');return;}
  gallery=updated;
  showGallery();
  status('Saved to your gallery on this device.');
};
$('download').onclick=()=>download(canvas.toDataURL(),title());
showGallery();
open(0,0,false);

async function setupXR(){
  const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.xr.enabled=true;
  renderer.xr.setReferenceSpaceType('local');
  const stage=$('stage'), button=$('vr'), message=$('xr-status');
  stage.append(renderer.domElement);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(48,1,.01,30);
  const orbit=new THREE.Group(), desk=new THREE.Group();
  scene.add(orbit,desk);
  desk.visible=false;
  texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map:texture});
  const board=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1),material);
  board.position.set(0,.12,-1.85);
  desk.add(board);
  const print=new THREE.Mesh(new THREE.PlaneGeometry(1.74,1.16),material);
  print.position.z=.18;
  orbit.add(print);
  const rings=[];
  for(let i=0;i<6;i++){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.92+i*.125,.012,7,70),new THREE.MeshBasicMaterial({transparent:true,opacity:.9-i*.1}));
    ring.rotation.set(i*.33,i*.23,i*.21);
    rings.push(ring);
    orbit.add(ring);
  }
  const stars=Array.from({length:900},()=>Math.random()*15-7.5);
  const geom=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(stars,3));
  scene.add(new THREE.Points(geom,new THREE.PointsMaterial({size:.025,color:0xd7e4ff})));
  const targets=[];
  function control(label,color,x,y,width,action){
    const tile=document.createElement('canvas');
    tile.width=256;
    tile.height=84;
    const paint=tile.getContext('2d');
    paint.fillStyle=color;
    paint.fillRect(0,0,256,84);
    paint.fillStyle='#fff';
    paint.textAlign='center';
    paint.textBaseline='middle';
    paint.font='bold 39px sans-serif';
    paint.fillText(label,128,42);
    const map=new THREE.CanvasTexture(tile);
    map.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,.09),new THREE.MeshBasicMaterial({map}));
    mesh.position.set(x,y,-1.85);
    mesh.userData.action=action;
    desk.add(mesh);
    targets.push(mesh);
  }
  colors.forEach((color,i)=>control('',color,(i%8-3.5)*.145,i<8?-.46:-.57,.12,()=>chooseColor(color)));
  control('Undo','#35476e',-.51,-.7,.22,undo);
  control('Next page','#35476e',-.19,-.7,.33,()=>open(book,(page+1)%books[book][3].length));
  control('Next book','#35476e',.19,-.7,.33,()=>open((book+1)%books.length,0));
  control('Exit','#35476e',.51,-.7,.22,()=>renderer.xr.getSession()?.end());
  const ray=new THREE.Raycaster();
  for(let i=0;i<2;i++){
    const hand=renderer.xr.getController(i);
    const beam=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,0,-2.3)]),new THREE.LineBasicMaterial({color:0x93ead5}));
    hand.add(beam);
    hand.addEventListener('select',()=>{
      if(!renderer.xr.isPresenting) return;
      ray.setFromXRController(hand);
      const hit=ray.intersectObjects([board,...targets])[0];
      if(hit?.object===board) fill(hit.uv.x*720,(1-hit.uv.y)*480);
      else hit?.object.userData.action();
    });
    scene.add(hand);
  }
  function resize(){
    if(renderer.xr.isPresenting) return;
    renderer.setSize(stage.clientWidth,stage.clientHeight,false);
    camera.aspect=stage.clientWidth/Math.max(1,stage.clientHeight);
    camera.position.set(0,0,Math.max(4.1,3.6/camera.aspect));
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  renderer.setAnimationLoop(time=>{
    for(const ring of rings) ring.material.color.set(books[book][2]);
    if(!reduce.matches){
      orbit.rotation.y=Math.sin(time*.00055)*.28;
      rings.forEach((ring,i)=>{ring.rotation.z=i*.21+time*.0002;});
    }
    renderer.render(scene,camera);
  });
  if(!navigator.xr || !await navigator.xr.isSessionSupported('immersive-vr')){
    message.textContent='VR is available in a compatible headset browser over HTTPS.';
    return;
  }
  button.disabled=false;
  message.textContent='In VR, point at a color or an area and pull the trigger.';
  renderer.xr.addEventListener('sessionstart',()=>{
    orbit.visible=false;
    desk.visible=true;
    camera.position.set(0,0,0);
    scene.background=new THREE.Color('#0b1025');
  });
  renderer.xr.addEventListener('sessionend',()=>{
    orbit.visible=true;
    desk.visible=false;
    scene.background=null;
    resize();
    button.disabled=false;
  });
  button.onclick=async()=>{
    button.disabled=true;
    let session;
    try{
      session=await navigator.xr.requestSession('immersive-vr');
      await renderer.xr.setSession(session);
    }catch{
      if(session) await session.end().catch(()=>{});
      message.textContent='Could not enter VR. Try again from your headset browser.';
      button.disabled=false;
    }
  };
}
setupXR().catch(()=>{$('xr-status').textContent='The 3D preview is unavailable. You can still color on this screen.';});
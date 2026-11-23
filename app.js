import {books,artwork} from './art.js?v=distinct-seasons-1';
import {setupFriendWorlds} from './friend-worlds.js?v=6';
import {makeVRWorlds} from './vr-worlds.js?v=2';
import {bookAllowed,showShopLinks} from './player-mode.js?v=1';
import {drawZenBorder} from './calm-pages.js?v=4';
import {paintStroke,originalSurface} from './drawing-tools.js?v=1';
import {drawCustomPage} from './page-maker.js?v=1';
import {bookPages} from './book-pages.js';
import {categoryPages} from './category-pages.js?v=2';

import {colorRegion} from './fill-region.js?v=1';

const generatedTitles=['Owl and Rabbit','Sunflower Patch','Castle in the Clouds','Camper in the Pines','The Young Engineer','Star Quilt Rosette'];
const generatedIndexes=generatedTitles.map((title,i)=>{
  const pages=books[i+4][3];
  pages.push(title);
  return pages.length-1;
});
const sheetPromises=new Map();
const upgradedTiles={10:{0:6,6:7}};
const featuredTiles={10:[0,6]};
const detailCollections=[
  [11,8,['Cherry Blossom Footbridge','Snowbound Village']],
  [7,10,['Roadster at the Diner','Mountain Expedition Camper']],
  [8,12,['The Muralist','Marine Biologist at Sea']],
  [9,14,['Art Deco Rosette','Botanical Mandala']]
];
for(const [category,tile,titles] of detailCollections){
  const pages=books[category][3];
  const first=pages.length;
  upgradedTiles[category]={};
  featuredTiles[category]=[first,tile];
  titles.forEach((title,index)=>{
    upgradedTiles[category][pages.length]=tile+index;
    pages.push(title);
  });
}
// High-resolution featured pages (see category-pages.js), appended after the existing studio pages.
const featuredPages={};
for(const [category,{folder,titles}] of Object.entries(categoryPages)){
  const pages=books[category][3];
  featuredPages[category]={};
  titles.forEach((title,index)=>{
    featuredPages[category][pages.length]='./pages/categories/'+folder+'/'+String(index+1).padStart(2,'0');
    pages.push(title);
  });
}
const featuredPage=(book,page)=>featuredPages[book]?.[page];
const firstFeatured=book=>{
  const first=Object.keys(featuredPages[book]??{})[0];
  return first===undefined?undefined:Number(first);
};
// Featured pages lead the page grid and the page menu; everything else keeps its order.
function pageOrder(book){
  const all=[...Array(pageCount(book)).keys()];
  return [...all.filter(index=>featuredPage(book,index)),...all.filter(index=>!featuredPage(book,index))];
}
const artSheets=[
  {start:0,columns:3,path:'illustrated-collection.png'},
  {start:6,columns:2,path:'zen-seasons-art.png'},
  {start:8,columns:2,path:'seasons-vehicles-detail.png'},
  {start:12,columns:2,path:'characters-patterns-detail.png'}
];
const sheetFor=tile=>artSheets.findLast(sheet=>tile>=sheet.start);
const generatedPreviews=new Map();
function generatedTile(book,page){
  return upgradedTiles[book]?.[page]??(book>=4&&generatedIndexes[book-4]===page?book-4:-1);
}
function loadArtSheet(tile){
  const {path}=sheetFor(tile);
  if(!sheetPromises.has(path)){
    const sheet=new Image();
    sheet.src='./pages/'+path;
    const pending=sheet.decode().then(()=>sheet).catch(error=>{sheetPromises.delete(path);throw error;});
    sheetPromises.set(path,pending);
  }
  return sheetPromises.get(path);
}
function paintGeneratedTile(ctx,sheet,tile,size){
  const {columns,start}=sheetFor(tile);
  const index=tile-start;
  const w=sheet.naturalWidth/columns,h=sheet.naturalHeight/2;
  const zen=tile===6||tile===7;
  const margin=size*(zen?.085:.035);
  ctx.fillStyle='#fff';
  ctx.fillRect(0,0,size,size);
  ctx.drawImage(sheet,(index%columns)*w,Math.floor(index/columns)*h,w,h,margin,margin,size-2*margin,size-2*margin);
  if(zen) drawZenBorder(ctx,size,size,Math.round(size*.055));
}
function previewGeneratedTile(target,tile){
  loadArtSheet(tile).then(sheet=>{
    if(!generatedPreviews.has(tile)){
      const thumbnail=document.createElement('canvas');
      thumbnail.width=thumbnail.height=220;
      paintGeneratedTile(thumbnail.getContext('2d'),sheet,tile,220);
      generatedPreviews.set(tile,thumbnail.toDataURL('image/webp',.8));
    }
    target.src=generatedPreviews.get(tile);
  }).catch(()=>{});
}
const collections=books.map((_,index)=>bookPages[index]?.numbers??[]);
const pageCount=index=>books[index][3].length+collections[index].length;
const firstIllustration=index=>collections[index].length>1?books[index][3].length+1:0;
function sourcePage(index,selection){
  return collections[index][selection-books[index][3].length];
}
function bookPageUrl(index,number){
  return './pages/'+bookPages[index].folder+'/'+String(number).padStart(3,'0')+'.webp';
}
const $=id=>document.getElementById(id);
const canvas=$('paper'), ctx=canvas.getContext('2d',{willReadFrequently:true});
const colors=['#914ff5','#c474fc','#ff6fae','#e93755','#ff7c45','#ffd565','#eced91','#9fd358','#39bc79','#08bdae','#4bc8ef','#4e78ef','#26377a','#8c5139','#182334','#ffffff'];
let book=0,page=0,mode='fill',history=[],stroke=null,importId=0;
let updatePreview=()=>{};
const edits=new Map(), imports=new Map(), pdfs=new Map();
let loading=false, changed=false;
let fillBoundary=null, cleanSurface, originalPixels, designDraft;
const customPages=new Map();
let nextCustomPage=-2;
const snapshot=()=>ctx.getImageData(0,0,canvas.width,canvas.height);
const refresh=()=>updatePreview();
const key=()=>book+':'+page+(page===-1 && pdfs.has(book) ? ':'+pdfs.get(book).page : '');
const title=()=>customPages.get(page)?.name??(page===-1?imports.get(book)?.name:
  books[book][3][page]??(books[book][0]+' · '+(sourcePage(book,page)===2?'Color Test':'Book Page '+sourcePage(book,page))));
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
const printEditions=[["./covers/hues-got-flow.jpg","B0CFDKNZXZ"],["./covers/cosmic-coloring.jpg","B0CJ4FMXJN"],["./covers/underwater-adventure.jpg","B0CJ4KN1B2"],["./covers/halloween-haunts.jpg","B0CKS6DVFM"]];
books.forEach(([name,character,tint],i)=>{
  if(!bookAllowed(name)) return;
  artwork(thumbnails.getContext('2d'),i,0);
  const button=document.createElement('button'), image=new Image(), label=document.createElement('strong'), credit=document.createElement('small');
  image.src=thumbnails.toDataURL();
  image.alt='';
  image.loading='lazy';
  image.className='cover-linework';
  const cover=document.createElement('span');
  cover.className='collection-cover';
  cover.append(image);
  const original=sourcePage(i,firstIllustration(i));
  const print=printEditions[i];
  if(print){
    const front=new Image();
    front.alt='';
    front.loading='lazy';
    front.className='print-cover';
    front.src=print[0];
    front.onerror=()=>front.remove();
    cover.append(front);
  }else if(firstFeatured(i)!==undefined){
    image.src=featuredPage(i,firstFeatured(i))+'-thumb.webp';
  }else if(featuredTiles[i]){
    previewGeneratedTile(image,featuredTiles[i][1]);
  }else if(i>=4 && i<4+generatedIndexes.length){
    previewGeneratedTile(image,i-4);
  }else if(original){
    const preview=new Image();
    preview.alt='';
    preview.loading='lazy';
    preview.className='cover-original';
    preview.src=bookPageUrl(i,original);
    cover.append(preview);
  }
  label.textContent=name;
  credit.textContent=character+' · '+pageCount(i)+' pages';
  button.style.setProperty('--tint',tint);
  button.append(cover,label,credit);
  button.onclick=()=>{
    open(i,firstFeatured(i)??featuredTiles[i]?.[0]??generatedIndexes[i-4]??firstIllustration(i));
    $('studio').scrollIntoView();
  };
  const card=document.createElement('article');
  card.className='collection-card';
  card.append(button);
  if(print&&showShopLinks){
    const buy=document.createElement('a');
    buy.className='buy-book';
    buy.href='https://www.amazon.com/dp/'+print[1];
    buy.target='_blank';
    buy.rel='noopener noreferrer';
    buy.textContent='Buy on Amazon ↗';
    buy.setAttribute('aria-label','Buy '+name+' on Amazon');
    card.append(buy);
  }
  $('books').append(card);
});
const pageGrid=$('page-thumbnails');
const browseSize=8;
let browseOffset=0;
function showPageTiles(){
  const names=books[book][3];
  const total=pageCount(book);
  const order=pageOrder(book);
  const limit=Math.min(browseOffset+browseSize,total);
  $('tile-count').textContent=(browseOffset+1)+'–'+limit+' of '+total;
  $('tiles-back').disabled=browseOffset===0;
  $('tiles-forward').disabled=limit===total;
  const tiles=[];
  for(let position=browseOffset;position<limit;position++){
    const index=order[position];
    const button=document.createElement('button');
    button.type='button';
    const label=document.createElement('span');
    const number=sourcePage(book,index);
    label.textContent=names[index]??(number===2?'Color Test':'Book Page '+number);
    button.setAttribute('aria-pressed',String(index===page));
    const preview=new Image();
    preview.alt='';
    preview.loading='lazy';
    const tile=generatedTile(book,index);
    if(featuredPage(book,index)){
      preview.src=featuredPage(book,index)+'-thumb.webp';
    }else if(tile>=0){
      previewGeneratedTile(preview,tile);
    }else if(number){
      preview.src=bookPageUrl(book,number);
    }else{
      artwork(thumbnails.getContext('2d'),book,index);
      preview.src=thumbnails.toDataURL('image/webp',.65);
    }
    button.append(preview,label);
    button.onclick=()=>open(book,index);
    tiles.push(button);
  }
  pageGrid.replaceChildren(...tiles);
}
$('page-browser').addEventListener('toggle',()=>{if($('page-browser').open) showPageTiles();});
$('tiles-back').onclick=()=>{browseOffset-=browseSize;showPageTiles();};
$('tiles-forward').onclick=()=>{browseOffset+=browseSize;showPageTiles();};
function rememberArtwork(){
  if(!loading && !designDraft && changed) edits.set(key(),snapshot());
}
function fitPaper(width,height){
  if(canvas.width===width && canvas.height===height) return;
  canvas.width=width;
  canvas.height=height;
}
function setLoading(value){
  loading=value;
  $('save').disabled=value;
  $('download').disabled=value;
  $('share').disabled=value;
  $('design-edit').disabled=value;
  canvas.setAttribute('aria-busy',String(value));
}
async function open(nextBook,nextPage,remember=true){
  const request=++importId;
  if(designDraft) closeDesign();
  if(remember) rememberArtwork();
  changed=false;
  book=nextBook;
  page=nextPage;
  stroke=null;
  fillBoundary=null;
  const [name,,,pages]=books[book];
  $('book-title').textContent=name;
  const options=pages.map((label,i)=>new Option(label,i));
  const groups=[document.createElement('optgroup')];
  groups[0].label='Studio designs';
  groups[0].append(...options.filter((_,i)=>!featuredPage(book,i)));
  if(firstFeatured(book)!==undefined){
    const featured=document.createElement('optgroup');
    featured.label='Featured pages';
    featured.append(...options.filter((_,i)=>featuredPage(book,i)));
    groups.unshift(featured);
  }
  if(collections[book].length){
    const originals=document.createElement('optgroup');
    originals.label='Original book pages';
    collections[book].forEach((number,i)=>originals.append(new Option(number===2?'Color Test':'Book Page '+number,pages.length+i)));
    groups.push(originals);
  }
  $('pages').replaceChildren(...groups);
  if(imports.has(book)) $('pages').append(new Option(imports.get(book).name,-1));
  for(const [index,custom] of customPages) if(custom.book===book) $('pages').append(new Option(custom.name,index));
  $('pages').value=page;
  browseOffset=Math.floor(Math.max(0,pageOrder(book).indexOf(page))/browseSize)*browseSize;
  if($('page-browser').open) showPageTiles();
  updatePdfControls();
  [...$('books').querySelectorAll('.collection-card > button')].forEach((button,i)=>button.setAttribute('aria-pressed',i===book));
  const imported=page===-1?imports.get(book)?.pixels:null;
  const edit=edits.get(key());
  history=[];
  $('undo').disabled=true;
  $('previous').disabled=page<=0;
  $('next').disabled=page<0 || page>=pageCount(book)-1;
  setLoading(false);
  const original=sourcePage(book,page);
  if(customPages.has(page)){
    const custom=customPages.get(page);
    if(custom.pixels){
      fitPaper(custom.pixels.width,custom.pixels.height);
      ctx.putImageData(custom.pixels,0,0);
    }else{
      fitPaper(720,480);
      drawCustomPage(ctx,custom);
    }
  }else if(imported){
    fitPaper(imported.width,imported.height);
    ctx.putImageData(imported,0,0);
  }else if(featuredPage(book,page)){
    setLoading(true);
    status('Opening '+title()+'…');
    const art=new Image();
    art.src=featuredPage(book,page)+'.webp';
    try{
      await art.decode();
      if(request!==importId) return;
      fitPaper(art.naturalWidth,art.naturalHeight);
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,art.naturalWidth,art.naturalHeight);
      ctx.drawImage(art,0,0);
      setLoading(false);
    }catch{
      if(request===importId) status('Could not open this page. Choose another page or try again.');
      return;
    }
  }else if(generatedTile(book,page)>=0){
    setLoading(true);
    status('Opening '+title()+'…');
    const tile=generatedTile(book,page);
    try{
      const sheet=await loadArtSheet(tile);
      if(request!==importId) return;
      const size=tile>=8?850:650;
      fitPaper(size,size);
      paintGeneratedTile(ctx,sheet,tile,size);
      setLoading(false);
    }catch{
      if(request===importId) status('Could not open this page. Choose another page or try again.');
      return;
    }
  }else if(original){
    setLoading(true);
    status('Opening '+title()+'…');
    const scan=new Image();
    scan.src=bookPageUrl(book,original);
    try{
      await scan.decode();
      if(request!==importId) return;
      fitPaper(scan.naturalWidth,scan.naturalHeight);
      ctx.drawImage(scan,0,0);
      setLoading(false);
    }catch{
      if(request===importId) status('Could not open this page. Choose another page or try again.');
      return;
    }
  }else{
    fitPaper(720,480);
    artwork(ctx,book,page);
  }
  originalPixels=snapshot();
  fillBoundary=buildFillBoundary(originalPixels);
  cleanSurface=originalSurface(originalPixels);
  if(edit) ctx.putImageData(edit,0,0);
  status(mode==='fill'?'Tap an enclosed area to fill it.':'Drag to paint.');
  refresh();
}
$('pages').onchange=event=>open(book,Number(event.target.value));
$('previous').onclick=()=>open(book,page-1);
$('next').onclick=()=>open(book,page+1);
function checkpoint(){
  changed=true;
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
$('utensil').onchange=()=>$('brush').click();
$('page-maker').onsubmit=event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const name=String(data.get('title')).trim()||'My coloring page';
  const theme=String(data.get('theme'));
  const detail=Number(data.get('detail'));
  const seed=String(data.get('seed')).trim()||crypto.randomUUID();
  const index=nextCustomPage--;
  customPages.set(index,{name,theme,detail,seed,book});
  open(book,index);
  $('studio').scrollIntoView();
  status('Created “'+name+'”. Choose Fill or a drawing tool.');
};
function buildFillBoundary({data,width,height}){
  const ink=new Uint8Array(width*height);
  for(let i=0;i<ink.length;i++){
    const offset=i*4;
    ink[i]=data[offset+3]>127 &&
      0.2126*data[offset]+0.7152*data[offset+1]+0.0722*data[offset+2]<155;
  }
  const boundary=ink.slice();
  const maxGap=5;
  // Only original ink can anchor a bridge. Bridged pixels never extend it.
  for(const [dx,dy] of [[1,0],[0,1],[1,1],[-1,1]]){
    const step=dx+dy*width;
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        const start=y*width+x;
        if(!ink[start]) continue;
        const nextX=x+dx, nextY=y+dy;
        if(nextX<0 || nextX>=width || nextY>=height || ink[start+step]) continue;
        for(let distance=2;distance<=maxGap+1;distance++){
          const endX=x+dx*distance, endY=y+dy*distance;
          if(endX<0 || endX>=width || endY>=height) break;
          if(!ink[start+step*distance]) continue;
          for(let i=1;i<distance;i++) boundary[start+i*step]=1;
          break;
        }
      }
    }
  }
  return boundary;
}
function fill(x,y){
  if(loading||designDraft||!originalPixels) return;
  const image=snapshot();
  if(!colorRegion(image,fillBoundary,originalPixels.data,x,y,$('color').value)) return;
  checkpoint();
  ctx.putImageData(image,0,0);
  refresh();
}
function showDesignControls(editing){
  $('design-actions').hidden=!editing;
  $('design-edit').hidden=editing;
  for(const id of ['fill','brush','utensil','save','share','download','import']) $(id).disabled=editing;
}
function closeDesign(){
  const previous=designDraft;
  designDraft=null;
  stroke=null;
  ctx.putImageData(previous.painted,0,0);
  history=previous.history;
  changed=previous.changed;
  $('undo').disabled=!history.length;
  showDesignControls(false);
  refresh();
}
$('design-edit').onclick=()=>{
  if(loading||!originalPixels) return;
  designDraft={painted:snapshot(),history,changed};
  stroke=null;
  history=[];
  ctx.putImageData(originalPixels,0,0);
  $('undo').disabled=true;
  showDesignControls(true);
  status('Draw new outlines or erase sections. Save a design copy when ready.');
  refresh();
};
$('design-cancel').onclick=()=>{
  closeDesign();
  status('Returned to your coloring page.');
};
$('design-save').onclick=()=>{
  const pixels=snapshot();
  const name=(title()??'Coloring page')+' · Edited';
  const index=nextCustomPage--;
  customPages.set(index,{book,name,pixels});
  closeDesign();
  open(book,index);
  status('Design copy created. Fill now follows your edited outlines.');
};
function point(event){
  const rect=canvas.getBoundingClientRect();
  return {x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};
}
function draw(from,to){
  paintStroke(ctx,[from.x,from.y],[to.x,to.y],{
    size:Number($('size').value),
    color:designDraft?($('design-tool').value==='erase'?'#ffffff':'#182334'):$('color').value,
    utensil:designDraft?'brush':$('utensil').value,original:cleanSurface
  });
  refresh();
}
canvas.onpointerdown=event=>{
  if(event.button!==0 || stroke || loading) return;
  const at=point(event);
  if(mode==='fill'&&!designDraft){fill(at.x,at.y);return;}
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
function updatePdfControls(){
  const pdf=pdfs.get(book);
  const visible=page===-1 && Boolean(pdf);
  $('pdf-controls').hidden=!visible;
  $('pdf-controls').style.display=visible?'flex':'none';
  if(!visible) return;
  $('pdf-count').textContent=pdf.page+' / '+pdf.document.numPages;
  $('pdf-prev').disabled=pdf.page<=1;
  $('pdf-next').disabled=pdf.page>=pdf.document.numPages;
}
function whiteCanvas(){
  const surface=document.createElement('canvas');
  surface.width=720;
  surface.height=480;
  const paint=surface.getContext('2d');
  paint.fillStyle='#fff';
  paint.fillRect(0,0,720,480);
  return paint;
}
async function rasterPdf(documentPdf,number){
  const source=await documentPdf.getPage(number);
  const original=source.getViewport({scale:1});
  const viewport=source.getViewport({scale:Math.min(720/original.width,480/original.height)});
  const paint=whiteCanvas();
  const transform=[1,0,0,1,(720-viewport.width)/2,(480-viewport.height)/2];
  await source.render({canvasContext:paint,viewport,transform}).promise;
  return paint.getImageData(0,0,720,480);
}
async function turnPdf(offset){
  const pdf=pdfs.get(book);
  if(!pdf || page!==-1) return;
  const next=pdf.page+offset;
  if(next<1 || next>pdf.document.numPages) return;
  const request=++importId;
  try{
    const pixels=edits.get(book+':-1:'+next)??await rasterPdf(pdf.document,next);
    if(request!==importId) return;
    rememberArtwork();
    pdf.page=next;
    imports.set(book,{name:pdf.name+' · Page '+next,pixels});
    open(book,-1,false);
  }catch{if(request===importId) status('Could not open that PDF page.');}
}
$('pdf-prev').onclick=()=>turnPdf(-1);
$('pdf-next').onclick=()=>turnPdf(1);
$('import').onchange=async event=>{
  const file=event.target.files[0];
  event.target.value='';
  if(!file) return;
  const request=++importId;
  status('Opening '+file.name+'…');
  let documentPdf;
  try{
    let pixels;
    if(file.type==='application/pdf' || /\.pdf$/i.test(file.name)){
      const base='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/';
      const pdfjs=await import(base+'pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc=base+'pdf.worker.mjs';
      documentPdf=await pdfjs.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise;
      if(request!==importId){await documentPdf.destroy();return;}
      pixels=await rasterPdf(documentPdf,1);
    }else{
      const bitmap=await createImageBitmap(file);
      try{
        const paint=whiteCanvas();
        const ratio=Math.min(720/bitmap.width,480/bitmap.height);
        const width=bitmap.width*ratio,height=bitmap.height*ratio;
        paint.drawImage(bitmap,(720-width)/2,(480-height)/2,width,height);
        pixels=paint.getImageData(0,0,720,480);
      }finally{bitmap.close();}
    }
    if(request!==importId){if(documentPdf) await documentPdf.destroy();return;}
    if(page!==-1) rememberArtwork();
    for(const id of edits.keys()) if(id===book+':-1' || id.startsWith(book+':-1:')) edits.delete(id);
    pdfs.get(book)?.document.destroy().catch(()=>{});
    pdfs.delete(book);
    if(documentPdf) pdfs.set(book,{document:documentPdf,page:1,name:file.name});
    imports.set(book,{name:documentPdf?file.name+' · Page 1':file.name,pixels});
    open(book,-1,false);
  }catch{
    if(documentPdf) await documentPdf.destroy().catch(()=>{});
    if(request===importId){
      if(loading) await open(book,page,false);
      status('Could not open this file. Try a PDF, PNG, JPEG, or WebP.');
    }
  }
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
    const card=document.createElement('article');
    const share=document.createElement('button');
    share.type='button';
    share.textContent='Share PNG';
    share.setAttribute('aria-label','Share '+item.title);
    share.onclick=()=>shareArtwork(item.image,item.title,message=>{$('gallery-status').textContent=message;});
    card.append(button,share);
    $('gallery').append(card);
  }
}
function saveArtwork(image,label,report){
  const updated=[{image,title:label},...gallery].slice(0,16);
  try{localStorage.setItem('coloring-odyssey-gallery',JSON.stringify(updated));}
  catch{report('Could not save to this browser. Use Share PNG to keep a copy.');return;}
  gallery=updated;
  showGallery();
  report('Saved to your gallery on this device.');
}
async function shareArtwork(image,label,report){
  const filename=label.replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'.png';
  const bytes=Uint8Array.from(atob(image.split(',')[1]),character=>character.charCodeAt(0));
  const file=new File([bytes],filename,{type:'image/png'});
  try{
    if(navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:label});
      report('PNG shared.');
      return;
    }
  }catch(error){
    if(error.name==='AbortError') return;
  }
  download(image,label);
  report('PNG downloaded and ready to share.');
}
$('save').onclick=()=>saveArtwork(canvas.toDataURL(),title(),status);
$('share').onclick=()=>shareArtwork(canvas.toDataURL(),title(),status);
setupFriendWorlds({artwork,buildFillBoundary,saveArtwork,shareArtwork});
$('download').onclick=()=>download(canvas.toDataURL(),title());
showGallery();
open(0,firstIllustration(0),false);

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
  const worldPicker=$('vr-world');
  const setWorld=makeVRWorlds(THREE,scene);
  scene.add(orbit,desk);
  desk.visible=false;
  function pageTexture(){
    const map=new THREE.CanvasTexture(canvas);
    map.colorSpace=THREE.SRGBColorSpace;
    return map;
  }
  const material=new THREE.MeshBasicMaterial({map:pageTexture()});
  let textureWidth=canvas.width,textureHeight=canvas.height;
  updatePreview=()=>{
    if(textureWidth!==canvas.width || textureHeight!==canvas.height){
      material.map.dispose();
      material.map=pageTexture();
      textureWidth=canvas.width;
      textureHeight=canvas.height;
    }
    material.map.needsUpdate=true;
  };
  const board=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1),material);
  board.position.set(0,.12,-1.85);
  desk.add(board);
  const brush=new THREE.Group();
  const handle=new THREE.MeshStandardMaterial({color:0x673620,roughness:.36,metalness:.04});
  const gold=new THREE.MeshStandardMaterial({color:0xd7b38b,roughness:.22,metalness:.66});
  const bristles=new THREE.MeshStandardMaterial({color:0xb6804f,roughness:.87});
  const paint=new THREE.MeshStandardMaterial({color:0x26977e,roughness:.39});
  function brushSection(profile,surface){
    const points=profile.map(([radius,y])=>new THREE.Vector2(radius,y));
    const mesh=new THREE.Mesh(new THREE.LatheGeometry(points,48),surface);
    mesh.scale.z=.66;
    brush.add(mesh);
  }
  brushSection([[0,-1.31],[.09,-1.29],[.12,-1.2],[.145,-.7],[.2,-.2],[.22,.15],[.19,.4]],handle);
  brushSection([[.19,.37],[.23,.41],[.24,.47],[.235,.72],[.22,.78]],gold);
  brushSection([[.22,.76],[.26,.85],[.255,.99],[.215,1.14],[.14,1.3],[.06,1.39],[0,1.43]],bristles);
  brushSection([[.153,1.27],[.115,1.36],[.055,1.42],[0,1.46]],paint);
  for(const y of [.46,.70]){
    const seam=new THREE.Mesh(new THREE.TorusGeometry(.237,.016,12,48),gold);
    seam.rotation.x=Math.PI/2;
    seam.scale.y=.66;
    seam.position.y=y;
    brush.add(seam);
  }
  for(let i=0;i<48;i++){
    const angle=i*Math.PI/24;
    const strand=new THREE.BufferGeometry().setFromPoints([
      [.226,.773],[.263,.85],[.258,.99],[.218,1.14],[.144,1.29]
    ].map(([radius,y])=>new THREE.Vector3(Math.cos(angle)*radius,y,Math.sin(angle)*radius*.66)));
    brush.add(new THREE.Line(strand,new THREE.LineBasicMaterial({color:i%3?0x765138:0xf3d0a5,transparent:true,opacity:.48})));
  }
  brush.scale.setScalar(.81);
  brush.rotation.z=-.69;
  brush.position.z=.3;
  orbit.add(brush);
  scene.add(new THREE.HemisphereLight(0xffe5ff,0x62467d,2.3));
  const keyLight=new THREE.DirectionalLight(0xffdfbc,3.2);
  keyLight.position.set(2,4,5);
  scene.add(keyLight);
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
  control('Next page','#35476e',-.19,-.7,.33,()=>open(book,(page+1)%pageCount(book)));
  control('Next book','#35476e',.19,-.7,.33,()=>{
    const nextBook=(book+1)%books.length;
    open(nextBook,firstIllustration(nextBook));
  });
  control('Exit','#35476e',.51,-.7,.22,()=>renderer.xr.getSession()?.end());
  control('Change setting','#397365',0,-.85,.5,()=>{
    worldPicker.value=worldPicker.value==='0'?'1':'0';
    setWorld(true,Number(worldPicker.value));
  });
  const ray=new THREE.Raycaster();
  for(let i=0;i<2;i++){
    const hand=renderer.xr.getController(i);
    const beam=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,0,-2.3)]),new THREE.LineBasicMaterial({color:0x93ead5}));
    hand.add(beam);
    hand.addEventListener('select',()=>{
      if(!renderer.xr.isPresenting) return;
      ray.setFromXRController(hand);
      const hit=ray.intersectObjects([board,...targets])[0];
      if(hit?.object===board) fill(hit.uv.x*canvas.width,(1-hit.uv.y)*canvas.height);
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
    const aspect=canvas.width/canvas.height;
    board.scale.set(Math.min(1,aspect/1.5),Math.min(1,1.5/aspect),1);

    renderer.render(scene,camera);
  });
  if(!navigator.xr || !await navigator.xr.isSessionSupported('immersive-vr')){
    message.textContent='VR is available in a compatible headset browser over HTTPS.';
    return;
  }
  button.disabled=false;
  message.textContent='In VR, point and pull the trigger to color or change settings.';
  renderer.xr.addEventListener('sessionstart',()=>{
    orbit.visible=false;
    desk.visible=true;
    camera.position.set(0,0,0);
    setWorld(true,Number(worldPicker.value));
  });
  renderer.xr.addEventListener('sessionend',()=>{
    orbit.visible=true;
    desk.visible=false;
    setWorld(false,0);
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
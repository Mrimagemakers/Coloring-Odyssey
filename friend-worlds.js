import {paintStroke,isUtensil,originalSurface} from './drawing-tools.js?v=1';

import {colorRegion} from './fill-region.js?v=1';
import {kidMode} from './player-mode.js?v=1';

const worlds={
  studio:{title:'Art Studio',sheets:[['Blank canvas'],['The Artist’s Desk',5,0,0],['Butterfly Greenhouse',5,0,1],['Petal Patchwork',9,2,2]]},
  odyssey:{title:'Coloring Odyssey World',sheets:[['Hue’s Skyline Mural',0,2,3],['Carl’s Ringed Planet',1,0,4],['Janice’s Jellyfish Reef',2,0,5]]}
};

export function setupFriendWorlds({artwork,buildFillBoundary,saveArtwork,shareArtwork}){
  const $=id=>document.getElementById(id);
  const room=$('friend-room'), picker=$('room-sheet'), canvas=$('room-canvas');
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const {width,height}=canvas;
  const status=message=>{$('room-status').textContent=message;};
  const saveStatus=message=>{$('room-save-status').textContent=message;};
  const guests=new Set(), drafts=new Map();
  let world, sheet=0, boundary, peer, host, id, connecting=false, ready=true, generation=0, revision=0;
  let tool='brush', stroke, cleanSurface, paperPixels;
  let illustrations;
  const artSheet=new Image();
  artSheet.src='./pages/create-together-illustrations.png';
  const artReady=artSheet.decode().then(()=>{illustrations=artSheet;}).catch(()=>{});
  function drawIllustration(context,book,page,tile){
    if(!illustrations){artwork(context,book,page);return;}
    const tileWidth=illustrations.naturalWidth/3;
    const tileHeight=illustrations.naturalHeight/2;
    const size=height-24;
    context.fillStyle='#fff';
    context.fillRect(0,0,width,height);
    context.drawImage(illustrations,tile%3*tileWidth,Math.floor(tile/3)*tileHeight,tileWidth,tileHeight,
      (width-size)/2,(height-size)/2,size,size);
  }

  function reset(index){
    sheet=index;
    stroke=null;
    picker.value=String(sheet);
    const [,book,page,tile]=worlds[world].sheets[sheet];
    if(book===undefined){
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,width,height);
    }else drawIllustration(ctx,book,page,tile);
    const original=ctx.getImageData(0,0,width,height);
    boundary=buildFillBoundary(original);
    cleanSurface=originalSurface(original);
    paperPixels=original.data;
  }
  // Kid mode (under 13, from PenGame's age check): draw solo, no friend rooms.
  const soloMessage=kidMode?'Draw and color on your own canvas.':'Draw solo or start a friend room.';
  if(kidMode) $('room-host').hidden=true;
  function controls(){
    $('room-host').hidden=kidMode||Boolean(id||connecting);
    $('room-copy').hidden=!id||!ready;
    $('room-invite-label').hidden=!id||!ready;
    $('room-invite').value=id&&ready?inviteUrl():'';
    $('room-leave').hidden=!id&&!connecting;
    picker.disabled=connecting||Boolean(host);
    $('room-save').disabled=$('room-share').disabled=!ready;
  }
  function leave(message=soloMessage){
    generation++;
    const previous=peer;
    peer=host=id=null;
    guests.clear();
    connecting=false;
    ready=true;
    previous?.destroy();
    controls();
    status(message);
  }
  function openWorld(next){
    if(world===next) return;
    if(id||connecting){status('Leave the current room before switching worlds.');return;}
    if(world) drafts.set(world,{sheet,image:ctx.getImageData(0,0,width,height)});
    world=next;
    room.hidden=false;
    room.dataset.world=next;
    $('room-title').textContent=worlds[next].title;
    picker.replaceChildren(...worlds[next].sheets.map(([name],index)=>new Option(name,index)));
    const draft=drafts.get(next);
    reset(draft?.sheet??0);
    if(draft) ctx.putImageData(draft.image,0,0);
    for(const name of Object.keys(worlds)) $('world-'+name).setAttribute('aria-pressed',String(name===next));
    status(soloMessage);
    saveStatus('');
  }
  for(const [name,config] of Object.entries(worlds)){
    const cover=document.createElement('canvas');
    cover.width=width;
    cover.height=height;
    const button=$('world-'+name);
    const preview=button.querySelector('img');
    const [,book,page,tile]=config.sheets[name==='studio'?1:0];
    const showCover=()=>{
      drawIllustration(cover.getContext('2d'),book,page,tile);
      preview.src=cover.toDataURL('image/webp',.78);
    };
    showCover();
    artReady.then(showCover);
    button.onclick=async()=>{
      await artReady;
      openWorld(name);
      room.scrollIntoView({block:'start'});
    };
  }

  function fill(x,y,color){
    const image=ctx.getImageData(0,0,width,height);
    if(colorRegion(image,boundary,paperPixels,x,y,color)) ctx.putImageData(image,0,0);
  }
  function validPoint(p){
    return Array.isArray(p)&&p.length===2&&p.every(Number.isInteger)&&p[0]>=0&&p[0]<width&&p[1]>=0&&p[1]<height;
  }
  function apply(action){
    if(!action||!validPoint(action.from)||!validPoint(action.to)||typeof action.color!=='string'||
      !/^#[0-9a-f]{6}$/i.test(action.color)||!Number.isInteger(action.size)||action.size<2||action.size>45) return false;
    const {from,to,color,size}=action;
    if(action.tool==='fill'){fill(...to,color);return true;}
    if(action.tool!=='brush') return false;
    const utensil=action.utensil??'brush';
    if(!isUtensil(utensil)) return false;
    paintStroke(ctx,from,to,{size,color,utensil,original:cleanSurface});
    return true;
  }
  function send(link,message){
    if(!link?.open) return;
    try{link.send(message);}catch{link.close();}
  }
  function broadcast(message){
    for(const link of guests) send(link,message);
  }
  function submit(from,to){
    const action={from,to,tool,utensil:$('room-utensil').value,color:$('room-color').value,size:Number($('room-size').value)};
    const message={type:'draw',revision,action};
    if(host) send(host,message);
    else if(apply(action)) broadcast(message);
  }
  function point(event){
    const rect=canvas.getBoundingClientRect();
    return [Math.max(0,Math.min(width-1,Math.floor((event.clientX-rect.left)*width/rect.width))),
      Math.max(0,Math.min(height-1,Math.floor((event.clientY-rect.top)*height/rect.height)))];
  }
  canvas.onpointerdown=event=>{
    if(!ready||stroke||event.button!==0) return;
    const at=point(event);
    submit(at,at);
    if(tool==='brush'){
      canvas.setPointerCapture(event.pointerId);
      stroke={id:event.pointerId,at};
    }
  };
  canvas.onpointermove=event=>{
    if(stroke?.id!==event.pointerId||tool!=='brush') return;
    const at=point(event);
    if(at[0]===stroke.at[0]&&at[1]===stroke.at[1]) return;
    submit(stroke.at,at);
    stroke.at=at;
  };
  canvas.onlostpointercapture=()=>{stroke=null;};
  for(const name of ['brush','fill']) $('room-'+name).onclick=()=>{
    tool=name;
    for(const option of ['brush','fill']) $('room-'+option).setAttribute('aria-pressed',String(option===tool));
  };
  $('room-utensil').onchange=()=>$('room-brush').click();
  picker.onchange=()=>{
    revision++;
    reset(Number(picker.value));
    broadcast({type:'sheet',sheet,revision});
  };
  const title=()=>worlds[world].title+' · '+worlds[world].sheets[sheet][0];
  $('room-save').onclick=()=>saveArtwork(canvas.toDataURL(),title(),saveStatus);
  $('room-share').onclick=()=>shareArtwork(canvas.toDataURL(),title(),saveStatus);

  function hostStatus(){
    status(guests.size?(guests.size+1)+' artists on the shared canvas.':'Room ready. Copy your invite link to bring in friends.');
  }
  function addGuest(link,session){
    link.on('open',()=>{
      if(generation!==session||guests.size>=5){link.close();return;}
      guests.add(link);
      send(link,{type:'board',sheet,revision,image:canvas.toDataURL()});
      hostStatus();
    });
    link.on('data',message=>{
      if(guests.has(link)&&message?.type==='draw'&&message.revision===revision&&apply(message.action)) broadcast(message);
    });
    const remove=()=>{if(guests.delete(link)&&generation===session) hostStatus();};
    link.on('error',remove);
    link.on('close',remove);
  }
  function join(link,session){
    host=link;
    let queue=Promise.resolve();
    link.on('data',message=>{
      queue=queue.then(async()=>{
        if(generation!==session||!message) return;
        const validSheet=Number.isInteger(message.sheet)&&Boolean(worlds[world].sheets[message.sheet]);
        if(message.type==='board'&&connecting&&validSheet&&typeof message.image==='string'&&
           message.image.length<2200000&&message.image.startsWith('data:image/png;base64,')){
          const image=new Image();
          image.src=message.image;
          await image.decode();
          if(generation!==session) return;
          if(image.naturalWidth!==width||image.naturalHeight!==height) throw Error('Invalid canvas size');
          reset(message.sheet);
          ctx.drawImage(image,0,0);
          revision=message.revision;
          ready=true;
          connecting=false;
          controls();
          status('Connected. Draw together on the shared canvas.');
        }else if(ready&&message.type==='sheet'&&validSheet){
          revision=message.revision;
          reset(message.sheet);
        }else if(ready&&message.type==='draw'&&message.revision===revision) apply(message.action);
      }).catch(()=>{if(generation===session) leave('Could not load the room. Open the invite again to retry.');});
    });
    link.on('close',()=>{if(generation===session) leave('The friend room closed. Your artwork is still on the canvas.');});
    link.on('error',()=>{if(generation===session) leave('The connection dropped. Open the invite again to retry.');});
  }
  async function connect(invite){
    if(kidMode||connecting||id) return;
    const session=++generation;
    connecting=true;
    ready=!invite;
    controls();
    status(invite?'Connecting to your friend…':'Starting your friend room…');
    setTimeout(()=>{
      if(generation===session&&connecting) leave('Could not connect. Check that the host is online and try again.');
    },18000);
    try{
      const {Peer}=await import('https://cdn.jsdelivr.net/npm/peerjs@1.5.5/+esm');
      if(generation!==session) return;
      const code=invite??'odyssey-art-'+crypto.randomUUID();
      peer=invite?new Peer():new Peer(code);
      peer.on('error',()=>{if(generation===session) leave('Could not connect to the friend room. You can keep drawing solo.');});
      if(!invite) peer.on('connection',link=>addGuest(link,session));
      peer.on('open',()=>{
        if(generation!==session) return;
        id=code;
        if(invite) join(peer.connect(code,{reliable:true}),session);
        else{
          connecting=false;
          controls();
          hostStatus();
        }
      });
    }catch{
      if(generation===session) leave('Friend rooms are temporarily unavailable. You can keep drawing solo.');
    }
  }
  $('room-host').onclick=()=>connect();
  $('room-leave').onclick=()=>{
    leave();
    const url=new URL(location.href);
    url.searchParams.delete('friend');
    url.searchParams.delete('world');
    history.replaceState(null,'',url);
  };
  function inviteUrl(){
    const url=new URL(location.href);
    url.searchParams.set('world',world);
    url.searchParams.set('friend',id);
    url.searchParams.delete('pg_mode');
    url.hash='friend-room';
    return url.href;
  }
  $('room-copy').onclick=async()=>{
    const url=inviteUrl();
    try{
      await navigator.clipboard.writeText(url);
      status('Invite copied. Send the link to your friends.');
    }catch{$('room-invite').select();status('Select and copy the invite link.');}
  };
  const params=new URLSearchParams(location.search);
  const invite=params.get('friend'), requestedWorld=params.get('world');
  if(!kidMode&&/^odyssey-art-[0-9a-f-]{36}$/.test(invite??'')&&Object.hasOwn(worlds,requestedWorld)){
    artReady.then(()=>{
      openWorld(requestedWorld);
      room.scrollIntoView({block:'start'});
      connect(invite);
    });
  }
}

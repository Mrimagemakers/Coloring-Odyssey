import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.89.0/+esm';
const db=createClient('https://dzzczqyzplymlxseqrir.supabase.co',"sb_publishable_EyE23dwSD4FS1NqYolT0Zg_s3Sk8hAe",{auth:{storageKey:'coloring-odyssey-community'}});
const $=id=>document.getElementById(id);
const auth=$('community-auth'), editor=$('community-profile'), groups=$('community-group'), composer=$('community-post');
const notice=message=>{$('community-status').textContent=message;};
let user, profile, groupFilter='', refreshId=0;

function element(tag,text){
  const node=document.createElement(tag);
  if(text!==undefined) node.textContent=text;
  return node;
}
function button(label,action){
  const node=element('button',label);
  node.type='button';
  node.onclick=()=>perform(node,action);
  return node;
}
async function perform(target,action){
  target.disabled=true;
  notice('');
  try{await action();}
  catch(error){notice(error.message||'That action could not be completed. Try again.');}
  finally{target.disabled=false;}
}
async function result(query){
  const {data,error}=await query;
  if(error) throw error;
  return data;
}
function postCard(post,reacted){
  const card=element('article');
  card.append(element('h4',post.title),element('small',post.artist_profiles?.name??'Artist'));
  if(post.image){
    const art=element('img');
    art.src=post.image;
    art.alt=post.title;
    art.loading='lazy';
    card.append(art);
  }
  if(post.body) card.append(element('p',post.body));
  const actions=element('div');
  actions.className='row';
  const count=post.artist_reactions?.[0]?.count??0;
  if(profile){
    const liked=reacted.has(post.id);
    const like=button((liked?'♥':'♡')+' '+count,async()=>{
      const table=db.from('artist_reactions');
      await result(liked?table.delete().match({post_id:post.id,artist_id:profile.id}):table.insert({post_id:post.id,artist_id:profile.id}));
      await refresh();
    });
    like.setAttribute('aria-label',liked?'Remove appreciation':'Appreciate artwork');
    like.setAttribute('aria-pressed',String(liked));
    actions.append(like);
  }else actions.append(element('small','♥ '+count));
  if(user?.id===post.author_id){
    actions.append(button('Remove post',async()=>{
      if(!confirm('Remove this public post?')) return;
      await result(db.from('artist_posts').delete().eq('id',post.id));
      await refresh();
    }));
  }
  card.append(actions);
  return card;
}
async function refresh(){
  const request=++refreshId;
  const owner=user?.id;
  const fields='id,title,body,image,kind,author_id,group_id,artist_profiles!artist_posts_author_id_fkey(name),artist_reactions(count)';
  let art=db.from('artist_posts').select(fields).eq('kind','art');
  if(groupFilter) art=art.eq('group_id',groupFilter);
  const [own,artists,circles,memberships,artwork,blogs,reactions]=await Promise.all([
    owner?result(db.from('artist_profiles').select('*').eq('id',owner).maybeSingle()):null,
    result(db.from('artist_profiles').select('id,name,bio').order('name').limit(30)),
    result(db.from('artist_groups').select('id,name,description,owner_id').order('created_at',{ascending:false}).limit(30)),
    owner?result(db.from('artist_group_members').select('group_id').eq('artist_id',owner)):[],
    result(art.order('created_at',{ascending:false}).limit(12)),
    result(db.from('artist_posts').select(fields).eq('kind','blog').order('created_at',{ascending:false}).limit(10)),
    owner?result(db.from('artist_reactions').select('post_id').eq('artist_id',owner)):[],
  ]);
  if(request!==refreshId) return;
  profile=own;
  auth.hidden=Boolean(user);
  editor.hidden=!user;
  groups.hidden=composer.hidden=!profile;
  if(!editor.contains(document.activeElement)){
    editor.elements.name.value=profile?.name??'';
    editor.elements.bio.value=profile?.bio??'';
  }
  const memberCards=artists.map(artist=>{
    const card=element('article');
    card.append(element('strong',artist.name));
    if(artist.bio) card.append(element('p',artist.bio));
    return card;
  });
  $('community-members').replaceChildren(...(memberCards.length?memberCards:[element('p','Artist profiles will appear here.')]));
  const joined=new Set(memberships.map(row=>row.group_id));
  const options=composer.elements.group;
  const previous=options.value;
  options.replaceChildren(new Option('Community',''),...circles.filter(circle=>joined.has(circle.id)||circle.owner_id===owner).map(circle=>new Option(circle.name,circle.id)));
  if([...options.options].some(option=>option.value===previous)) options.value=previous;
  const circleCards=circles.map(circle=>{
    const card=element('article');
    card.append(element('strong',circle.name),element('p',circle.description));
    const actions=element('div');actions.className='row';
    actions.append(button('View group art',async()=>{groupFilter=circle.id;await refresh();location.hash='artist-feed';}));
    if(profile&&circle.owner_id!==owner){
      actions.append(button(joined.has(circle.id)?'Leave group':'Join group',async()=>{
        const table=db.from('artist_group_members');
        const row={group_id:circle.id,artist_id:owner};
        await result(joined.has(circle.id)?table.delete().match(row):table.insert(row));
        await refresh();
      }));
    }
    card.append(actions);
    return card;
  });
  $('community-groups').replaceChildren(...(circleCards.length?circleCards:[element('p','Member-created groups will appear here.')]));
  const filter=$('community-feed-filter');
  filter.replaceChildren();
  if(groupFilter) filter.append(element('span',circles.find(c=>c.id===groupFilter)?.name??'Group'),button('Show all artwork',async()=>{groupFilter='';await refresh();}));
  const reacted=new Set(reactions.map(row=>row.post_id));
  $('community-art').replaceChildren(...(artwork.length?artwork.map(post=>postCard(post,reacted)):[element('p','No artwork has been posted here yet.')]));
  $('community-blog').replaceChildren(...blogs.map(post=>postCard(post,reacted)));
}
auth.onsubmit=event=>{
  event.preventDefault();
  const {email,password}=Object.fromEntries(new FormData(auth));
  const credentials={email,password};
  perform(event.submitter,async()=>{
    if(event.submitter.value==='signup'){
      const redirect=new URL('./',location.href);
      redirect.hash='member-portal';
      await result(db.auth.signUp({...credentials,options:{emailRedirectTo:redirect.href}}));
      notice('Check your email for a confirmation link, then sign in.');
    }else{
      await result(db.auth.signInWithPassword(credentials));
      notice('Signed in.');
    }
    auth.reset();
  });
};
editor.onsubmit=event=>{
  event.preventDefault();
  perform(event.submitter,async()=>{
    const row=Object.fromEntries(new FormData(editor));
    await result(db.from('artist_profiles').upsert({id:user.id,name:row.name.trim(),bio:row.bio.trim()}));
    await refresh();
    notice('Profile saved.');
  });
};
$('community-signout').onclick=()=>perform($('community-signout'),async()=>{await result(db.auth.signOut());notice('Signed out.');});
groups.onsubmit=event=>{
  event.preventDefault();
  perform(event.submitter,async()=>{
    const row=Object.fromEntries(new FormData(groups));
    await result(db.from('artist_groups').insert({owner_id:user.id,name:row.name.trim(),description:row.description.trim()}));
    groups.reset();
    await refresh();
    notice('Group created.');
  });
};
async function prepareImage(file){
  if(!file.size) return null;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>20*1024*1024) throw Error('Choose a PNG, JPEG, or WebP image under 20 MB.');
  const bitmap=await createImageBitmap(file);
  try{
    const surface=document.createElement('canvas');
    const ratio=Math.min(1,850/Math.max(bitmap.width,bitmap.height));
    surface.width=Math.max(1,Math.round(bitmap.width*ratio));
    surface.height=Math.max(1,Math.round(bitmap.height*ratio));
    const draw=surface.getContext('2d');
    draw.fillStyle='#fff';
    draw.fillRect(0,0,surface.width,surface.height);
    draw.drawImage(bitmap,0,0,surface.width,surface.height);
    const image=surface.toDataURL('image/jpeg',.78);
    if(image.length>450000) throw Error('Choose a smaller image.');
    return image;
  }finally{bitmap.close();}
}
composer.onsubmit=event=>{
  event.preventDefault();
  perform(event.submitter,async()=>{
    const data=Object.fromEntries(new FormData(composer));
    const image=await prepareImage(data.image);
    if(data.kind==='art'&&!image) throw Error('Choose an artwork image to publish.');
    if(data.kind==='blog'&&!data.body.trim()) throw Error('Write your blog entry before publishing.');
    await result(db.from('artist_posts').insert({author_id:user.id,group_id:data.group||null,kind:data.kind,title:data.title.trim(),body:data.body.trim(),image}));
    composer.reset();
    groupFilter=data.kind==='art'?data.group:'';
    await refresh();
    notice('Published.');
  });
};
$('share-odyssey').onclick=()=>perform($('share-odyssey'),async()=>{
  const url=new URL('./',location.href).href;
  if(navigator.share){
    try{await navigator.share({title:'Coloring Odyssey',url});return;}
    catch(error){if(error.name==='AbortError') return;}
  }
  await navigator.clipboard.writeText(url);
  notice('Coloring Odyssey link copied.');
});
db.auth.onAuthStateChange((_event,session)=>{
  user=session?.user??null;
  setTimeout(()=>refresh().catch(()=>notice('The community could not load. Please refresh to try again.')),0);
});

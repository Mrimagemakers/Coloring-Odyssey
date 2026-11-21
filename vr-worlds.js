import {coverAllowed} from './player-mode.js?v=1';

export function makeVRWorlds(THREE,scene){
  const gallery=new THREE.Group(), garden=new THREE.Group();
  const material=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.65});
  const brass=material(0xc8a163,.45), plum=material(0x3b2649), wood=material(0x624530);
  const green=material(0x254d44), jade=material(0x4d7762), stone=material(0x6c7887);
  const glow=new THREE.MeshBasicMaterial({color:0xffd79c});
  function mesh(parent,geometry,surface,x,y,z){
    const object=new THREE.Mesh(geometry,surface);
    object.position.set(x,y,z);
    parent.add(object);
    return object;
  }
  function box(parent,w,h,d,surface,x,y,z){
    return mesh(parent,new THREE.BoxGeometry(w,h,d),surface,x,y,z);
  }
  box(gallery,14,.15,14,wood,0,-1.52,-3);
  box(gallery,14,5,.2,plum,0,.9,-5.4);
  for(const x of [-5,5]) box(gallery,.18,5,12,plum,x,.9,-1.5);
  for(let i=-5;i<=5;i++){
    box(gallery,.035,.012,12,brass,i*.85,-1.437,-2);
  }
  box(gallery,2.7,.12,.72,wood,0,-.9,-2.15);
  for(const x of [-1.12,1.12]) box(gallery,.13,.55,.15,wood,x,-1.17,-2.35);
  const loader=new THREE.TextureLoader();
  const editions=['hues-got-flow','cosmic-coloring','underwater-adventure','halloween-haunts'];
  const frameGeometry=new THREE.BoxGeometry(.98,1.24,.08);
  const coverGeometry=new THREE.PlaneGeometry(.85,1.1);
  editions.forEach((edition,index)=>{
    if(!coverAllowed(edition)) return;
    const x=(index-1.5)*1.55+Math.sign(index-1.5)*.68;
    mesh(gallery,frameGeometry,brass,x,.64,-5.22);
    const cover=mesh(gallery,coverGeometry,new THREE.MeshBasicMaterial({color:0xc1a789}),x,.64,-5.166);
    loader.load('./covers/'+edition+'.jpg',image=>{
      image.colorSpace=THREE.SRGBColorSpace;
      cover.material.color.setHex(0xffffff);
      cover.material.map=image;
      cover.material.needsUpdate=true;
    },undefined,()=>{});
    box(gallery,.32,.05,.14,glow,x,1.39,-5.12);
  });

  box(garden,17,.15,17,material(0x283b44),0,-1.52,-3);
  const pond=mesh(garden,new THREE.CircleGeometry(2.25,60),material(0x2a8d9a,.45),0,-1.435,-4.35);
  pond.rotation.x=-Math.PI/2;
  for(const r of [.66,1.15,1.63,2.16]){
    const ripple=mesh(garden,new THREE.TorusGeometry(r,.011,8,64),new THREE.MeshBasicMaterial({color:0x66c0c4}),0,-1.423,-4.35);
    ripple.rotation.x=Math.PI/2;
  }
  const moon=mesh(garden,new THREE.SphereGeometry(.62,30,24),new THREE.MeshBasicMaterial({color:0xffecc5}),2.9,2.35,-7.8);
  for(let i=0;i<16;i++){
    const side=i%2?1:-1;
    const x=side*(2.4+i%4*.56);
    const z=-2.6-Math.floor(i/2)*.63;
    const height=.95+i%3*.32;
    box(garden,.11,height,.11,wood,x,-1.45+height/2,z);
    mesh(garden,new THREE.ConeGeometry(.36+i%3*.12,height,9),i%2?green:jade,x,-1.43+height*.85,z);
  }
  for(const x of [-2.05,2.05]){
    box(garden,.14,.64,.14,stone,x,-1.11,-2.85);
    box(garden,.31,.25,.31,glow,x,-.72,-2.85);
    mesh(garden,new THREE.ConeGeometry(.31,.26,4),stone,x,-.48,-2.85);
  }
  for(let i=0;i<5;i++){
    const pebble=mesh(garden,new THREE.DodecahedronGeometry(.3),stone,(i-2)*.53,-1.35,-2.08-(i%2)*.25);
    pebble.scale.set(1.25,.37,1);
  }
  scene.add(gallery,garden);
  gallery.visible=garden.visible=false;
  return (active,index)=>{
    gallery.visible=active&&index===0;
    garden.visible=active&&index===1;
    scene.background=active?new THREE.Color(index===0?'#1b142c':'#142738'):null;
    moon.visible=garden.visible;
  };
}

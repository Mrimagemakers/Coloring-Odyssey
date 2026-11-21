export function colorRegion(image,boundary,paper,x,y,color){
  const {width,height,data}=image;
  const start=Math.max(0,Math.min(width-1,Math.floor(x)))+width*Math.max(0,Math.min(height-1,Math.floor(y)));
  if(!boundary||boundary[start]) return false;
  const rgb=data.slice(start*4,start*4+3);
  const target=color.slice(1).match(/../g).map(hex=>parseInt(hex,16));
  if(rgb.every((channel,i)=>channel===target[i])) return false;
  const queue=new Int32Array(width*height), seen=new Uint8Array(queue.length);
  const luma=offset=>.2126*paper[offset]+.7152*paper[offset+1]+.0722*paper[offset+2];
  const reference=Math.max(155,luma(start*4));
  let read=0,write=0;
  function add(i){
    if(seen[i]||boundary[i]) return;
    seen[i]=1;
    const offset=i*4;
    const shade=luma(offset)/reference;
    // Antialiased pixels follow the paper shading, even after recoloring.
    const nearSource=rgb.every((value,c)=>Math.abs(value-data[offset+c])<=28);
    const nearTint=shade>=.68&&shade<=1.18&&rgb.every((value,c)=>Math.abs(Math.min(255,value*shade)-data[offset+c])<=20);
    if(nearSource||nearTint) queue[write++]=i;
  }
  add(start);
  while(read<write){
    const i=queue[read++],col=i%width,offset=i*4;
    const tint=Math.min(1,luma(offset)/reference);
    for(let c=0;c<3;c++) data[offset+c]=Math.round(target[c]*tint);
    if(col) add(i-1);
    if(col<width-1) add(i+1);
    if(i>=width) add(i-width);
    if(i<queue.length-width) add(i+width);
  }
  return write>0;
}

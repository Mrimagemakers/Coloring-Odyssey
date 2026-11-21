for(const toolbar of document.querySelectorAll('[data-canvas-zoom]')){
  const canvas=document.getElementById(toolbar.dataset.canvasZoom);
  const viewport=canvas.parentElement;
  const out=toolbar.querySelector('[data-zoom-out]');
  const reset=toolbar.querySelector('[data-zoom-reset]');
  const plus=toolbar.querySelector('[data-zoom-in]');
  let factor=1;
  function update(center=false){
    const style=getComputedStyle(viewport);
    const padding=parseFloat(style.paddingLeft)+parseFloat(style.paddingRight);
    const width=Math.min(viewport.clientWidth-padding,canvas.width,innerHeight*.78*canvas.width/canvas.height);
    if(width<=0) return;
    viewport.classList.toggle('is-zoomed',factor>1);
    canvas.style.width=factor>1?Math.round(width*factor)+'px':'';
    reset.textContent=Math.round(factor*100)+'%';
    out.disabled=factor===1;
    plus.disabled=factor===3;
    if(center){
      viewport.scrollLeft=(viewport.scrollWidth-viewport.clientWidth)/2;
      viewport.scrollTop=(viewport.scrollHeight-viewport.clientHeight)/2;
    }
  }
  out.onclick=()=>{factor=Math.max(1,factor-.25);update(true);};
  plus.onclick=()=>{factor=Math.min(3,factor+.25);update(true);};
  reset.onclick=()=>{factor=1;update();};
  new ResizeObserver(()=>update()).observe(viewport);
  new MutationObserver(()=>update(true)).observe(canvas,{attributes:true,attributeFilter:['width','height']});
  update();
}
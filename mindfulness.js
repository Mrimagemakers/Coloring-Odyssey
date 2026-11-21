const $=id=>document.getElementById(id);
const activity=$('mind-activity'), output=$('mind-prompt'), step=$('mind-step');
const groups=[
 ['Choose one color that fits how you feel right now.','Fill one large shape. Notice its edges and the space around it.','Add a second color, then pause and notice what draws your eye.'],
 ['Pick a page with a pattern. Find one shape that repeats.','Color that shape each time it appears. Go at your own pace.','Look back over the page and notice how the repetition changes the image.'],
 ['Choose a place in the picture where you would like to rest.','Give that part of the picture one color and the space around it another.','Take a moment to look at the whole page. What detail would you keep?']
];
let index=0;
function render(){
  output.textContent=groups[Number(activity.value)][index];
  step.textContent='Step '+(index+1)+' of 3';
  $('mind-next').textContent=index===2?'Start over':'Next step';
}
activity.onchange=()=>{index=0;render();};
$('mind-next').onclick=()=>{index=(index+1)%3;render();};
render();
const breath=$('mind-breath'), circle=$('mind-orb'), phase=$('mind-phase');
let timers=[];
breath.onclick=()=>{
  const running=breath.getAttribute('aria-pressed')==='true';
  timers.forEach(clearTimeout);
  timers=[];
  breath.setAttribute('aria-pressed',String(!running));
  breath.textContent=running?'Start breathing guide':'Stop breathing guide';
  if(running){
    circle.dataset.phase='';
    phase.textContent='Breathe at your natural pace.';
    return;
  }
  function cycle(){
    circle.dataset.phase='inhale';
    phase.textContent='Breathe in gently';
    timers=[setTimeout(()=>{
      circle.dataset.phase='exhale';
      phase.textContent='Breathe out slowly';
    },4000),setTimeout(cycle,10000)];
  }
  cycle();
};
const journal=$('mind-notes'), noteStatus=$('mind-note-status'), noteKey='coloring-odyssey-private-reflection';
try{journal.value=localStorage.getItem(noteKey)??'';}catch{}
$('mind-save').onclick=()=>{
  try{localStorage.setItem(noteKey,journal.value);noteStatus.textContent='Reflection saved on this device.';}
  catch{noteStatus.textContent='This browser could not save your reflection.';}
};

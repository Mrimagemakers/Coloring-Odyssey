const button=document.getElementById('music-toggle');
const volume=document.getElementById('music-volume');
const status=document.getElementById('music-status');
const volumeKey='coloring-odyssey-music-volume';
const chords=[
  [45,52,59,60,64],
  [41,48,55,57,60],
  [48,55,62,64,67],
  [43,50,57,59,62]
];
const phrase=[
  [1.25,3],[3.75,4],[7.25,2],[9.5,3]
];
const chordLength=12;
let context,master,timer,suspendTimer,nextChord=0,chordIndex=0,playing=false,busy=false;
const voices=new Set();

try{
  const saved=localStorage.getItem(volumeKey);
  if(saved!==null&&/^\d+$/.test(saved)&&Number(saved)<=100) volume.value=saved;
}catch{}

function level(){
  return (Number(volume.value)/100)**1.6*.52;
}
function tone(note,start,hold,attack,release,amplitude,type){
  const oscillator=context.createOscillator();
  const envelope=context.createGain();
  oscillator.type=type;
  oscillator.frequency.value=440*2**((note-69)/12);
  envelope.gain.setValueAtTime(0,start);
  envelope.gain.linearRampToValueAtTime(amplitude,start+attack);
  envelope.gain.setValueAtTime(amplitude,start+hold);
  envelope.gain.linearRampToValueAtTime(0,start+hold+release);
  oscillator.connect(envelope).connect(master);
  voices.add(oscillator);
  oscillator.onended=()=>{
    voices.delete(oscillator);
    oscillator.disconnect();
    envelope.disconnect();
  };
  oscillator.start(start);
  oscillator.stop(start+hold+release+.05);
}
function schedule(){
  if(nextChord<context.currentTime) nextChord=context.currentTime+.08;
  while(nextChord<context.currentTime+2){
    const chord=chords[chordIndex%chords.length];
    chord.forEach((note,index)=>{
      tone(note,nextChord+index*.16,9.5,2.2,4.2,index===0?.105:.045,'sine');
    });
    phrase.forEach(([offset,index])=>{
      tone(chord[index]+12,nextChord+offset,1.1,.19,2.5,.035,'sine');
    });
    nextChord+=chordLength;
    chordIndex++;
  }
}
function render(){
  button.setAttribute('aria-pressed',String(playing));
  button.textContent=playing?'♫ Pause music':'♫ Play music';
}
button.addEventListener('click',async()=>{
  if(busy) return;
  if(playing){
    playing=false;
    clearInterval(timer);
    master.gain.setTargetAtTime(0,context.currentTime,.06);
    suspendTimer=setTimeout(()=>{
      for(const voice of voices) voice.stop();
      context.suspend().catch(()=>{});
    },320);
    render();
    return;
  }
  busy=true;
  status.textContent='';
  clearTimeout(suspendTimer);
  try{
    if(!context){
      const Audio=window.AudioContext??window.webkitAudioContext;
      if(!Audio) throw Error('Audio unavailable');
      context=new Audio();
      master=context.createGain();
      master.gain.value=0;
      master.connect(context.destination);
    }
    await context.resume();
    for(const voice of voices) voice.stop();
    nextChord=context.currentTime+.06;
    master.gain.setTargetAtTime(level(),context.currentTime,.18);
    playing=true;
    schedule();
    timer=setInterval(schedule,500);
  }catch{
    playing=false;
    status.textContent='Music could not start in this browser.';
  }finally{
    busy=false;
    render();
  }
});
volume.addEventListener('input',()=>{
  try{localStorage.setItem(volumeKey,volume.value);}catch{}
  if(playing) master.gain.setTargetAtTime(level(),context.currentTime,.06);
});

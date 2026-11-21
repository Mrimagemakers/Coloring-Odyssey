// PenGame Publishing's Games Pass opens this game with ?pg_mode=kid (players
// under 13) or ?pg_mode=teen (13 to 17), from the age check on its own site.
// The mode is kept for this browser tab so a reload doesn't lose it.
//
// Kid mode switches off everything that could collect a child's information or
// put them in touch with strangers: the Artist Community (email sign-up, posts,
// groups), friend rooms (shared canvas over PeerJS), and shop links. It also
// hides the Halloween Haunts collection, whose pages show zombies, skulls and
// horror faces. Teen mode hides shop links.
const KEY='pg-mode';
const MODES=['kid','teen'];

function readMode(){
  const asked=new URLSearchParams(location.search).get('pg_mode');
  try{
    if(MODES.includes(asked)) sessionStorage.setItem(KEY,asked);
    const kept=sessionStorage.getItem(KEY);
    return MODES.includes(kept)?kept:null;
  }catch{
    return MODES.includes(asked)?asked:null;
  }
}

export const playerMode=readMode();
export const kidMode=playerMode==='kid';
export const showShopLinks=!playerMode;

// Collections, by title in art.js, that kid mode leaves out.
const kidHiddenBooks=new Set(['Halloween Haunts']);
// Print-edition covers, by file name in ./covers, that kid mode leaves out.
const kidHiddenCovers=new Set(['halloween-haunts']);
export const bookAllowed=title=>!(kidMode&&kidHiddenBooks.has(title));
export const coverAllowed=name=>!(kidMode&&kidHiddenCovers.has(name));

if(kidMode){
  for(const node of document.querySelectorAll('#community, nav a[href="#community"]')) node.remove();
  document.documentElement.dataset.pgMode='kid';
}

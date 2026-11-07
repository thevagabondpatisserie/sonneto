/** One planar gesture: pull the folder out, fan its papers, gather them on return. */
export function folderFrames(from:string):Keyframe[]{
 return [{transform:from+' rotate(-9deg)',opacity:.65},{transform:'translate(0,0) scale(1) rotate(1.5deg)',opacity:1,offset:.78},{transform:'translate(0,0) scale(1) rotate(0)',opacity:1}];
}
export function unfoldPapers(root:HTMLElement,reduced:boolean){
 return Array.from(root.querySelectorAll<HTMLElement>('.movable-paper')).map((node,i)=>{
 const end=getComputedStyle(node).transform;
 return node.animate([{transform:`translate(${50-i*65}px,75px) rotate(${10-i*8}deg) scale(.82)`,opacity:.2},{transform:end,opacity:1}],{duration:reduced?0:820,delay:reduced?0:220+i*120,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
 });
}

/** A bounded choreography: move the folder, unfold its cover, then lay out papers. */
export const motionNames=['Rút ngang','Lật bìa','Xòe giấy','Nhấc khỏi tủ','Xoay trên bàn','Mở từ giữa'];
export function folderFrames(kind:number,from:string):Keyframe[]{
 const starts=[ 'translateX(80vw) rotate(-9deg) scale(.82)', 'perspective(1800px) rotateY(-65deg) rotateZ(-5deg) scale(.8)', 'translateY(18vh) rotate(-14deg) scale(.65)', from, 'translateX(-35vw) translateY(12vh) rotate(-32deg) scale(.65)', 'perspective(1800px) rotateX(48deg) scale(.65)' ];
 return [{transform:starts[kind],opacity:.15},{transform:'translate(0,0) rotate(0deg) scale(1)',opacity:1}];
}
export function unfoldPapers(root:HTMLElement,kind:number,reduced:boolean){
 const nodes=Array.from(root.querySelectorAll<HTMLElement>('.layered-video,.lesson-list,.recipe-card,.lesson-heading'));
 const directions=[[-100,20,-12],[80,55,9],[-45,90,-8],[0,-70,6],[110,40,17],[0,80,-5]];
 return nodes.map((node,i)=>{
  const [x,y,angle]=directions[(kind+i)%directions.length];
  return node.animate([{transform:`perspective(1200px) translate(${x}px,${y}px) rotate(${angle}deg) rotateX(12deg) scale(.88)`,opacity:0},{transform:'translate(0,0) rotate(0) scale(1)',opacity:1}],{duration:reduced?0:720,delay:reduced?0:300+i*95,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
 });
}

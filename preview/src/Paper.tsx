import {useRef,useState,type ReactNode,type CSSProperties} from 'react';
/** Drag only the grip: scrolling, links, video controls and text selection stay native. */
export function Paper({name,kind,children,arranged,reset,onScatter}:{name:string;kind:string;children:ReactNode;arranged:boolean;reset:number;onScatter:()=>void}){
 const ref=useRef<HTMLDivElement>(null),drag=useRef<{id:number;x:number;y:number;dx:number;dy:number}|null>(null);
 const [offset,setOffset]=useState({x:0,y:0,reset});
 const xy=offset.reset===reset?offset:{x:0,y:0,reset};
 const raise=()=>{const el=ref.current;if(!el)return;const siblings=Array.from(el.parentElement!.querySelectorAll<HTMLElement>('.movable-paper'));el.style.zIndex=String(Math.max(3,...siblings.map(e=>Number(e.style.zIndex)||3))+1)};
 function move(x:number,y:number){const el=ref.current;if(!el)return;const board=el.closest('.paper-board')!.getBoundingClientRect();const width=el.offsetWidth,height=el.offsetHeight;setOffset({x:Math.max(-el.offsetLeft+8,Math.min(x,board.width-el.offsetLeft-width-8)),y:Math.max(-el.offsetTop+8,Math.min(y,board.height-el.offsetTop-height-8)),reset})}
 return <div ref={ref} className={'movable-paper paper-'+kind} data-arranged={arranged} style={{'--drag-x':xy.x+'px','--drag-y':xy.y+'px'} as CSSProperties} onPointerDownCapture={raise} onFocusCapture={raise}>
 <button className="paper-grip" aria-label={'Di chuyển '+name} title="Kéo để di chuyển; dùng phím mũi tên khi đang chọn" onPointerDown={e=>{if(e.button!==0)return;raise();drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,dx:xy.x,dy:xy.y};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;if(Math.abs(e.clientX-d.x)+Math.abs(e.clientY-d.y)>3)onScatter();move(d.dx+e.clientX-d.x,d.dy+e.clientY-d.y)}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}} onLostPointerCapture={()=>{drag.current=null}} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();onScatter();raise();move(xy.x+(e.key==='ArrowRight'?12:e.key==='ArrowLeft'?-12:0),xy.y+(e.key==='ArrowDown'?12:e.key==='ArrowUp'?-12:0))}}><span aria-hidden="true">⠿</span>{name}</button>
 <div className="paper-content">{children}</div></div>
}

import {folderFrames,unfoldPapers} from './motion';
import {Paper} from './Paper';
import {useEffect,useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
const asset=(path:string)=>import.meta.env.BASE_URL+path;
const iconPaths={"back": "M9 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H9 M14 11l-4 4 4 4 M10 15h8", "open": "M3 8V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7 M7 13h10 M13 9l4 4-4 4", "search": "M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", "download": "M12 3v12 M7 10l5 5 5-5 M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4", "close": "M6 6l12 12 M18 6L6 18", "plus": "M5 12h14 M12 5v14", "minus": "M5 12h14", "fit": "M9 3H4a1 1 0 0 0-1 1v5 M15 3h5a1 1 0 0 1 1 1v5 M21 15v5a1 1 0 0 1-1 1h-5 M9 21H4a1 1 0 0 1-1-1v-5", "save": "M5 3h12l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1 M7 3v6h9V3 M7 21v-8h10v8", "play": "M9 5l11 7-11 7Z", "notes": "M7 3h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M9 8h6 M9 12h6 M9 16h4", "ingredients": "M4 8h16v2a8 8 0 0 1-16 0V8Z M8 4h8 M12 2v6"} as const;
function Icon({name}:{name:keyof typeof iconPaths}){return <svg className="sonneto-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={iconPaths[name]}/></svg>}
const topics=[
 {name:'Bắt đầu từ đây',sub:'Những điều căn bản',color:'#870854',title:'Căn bếp đầu tiên',desc:'Làm quen nguyên liệu, cân đong và chiếc lò của bạn.',lesson:'Hiểu một công thức',notes:['Đọc trọn công thức trước khi bắt đầu.','Cân nguyên liệu vào từng âu riêng.','Làm nóng lò, chuẩn bị khuôn và dụng cụ.'],tip:'Một chiếc cân chính xác sẽ giúp bạn hơn rất nhiều mẹo nhỏ.'},
 {name:'Bánh quy & cookies',sub:'Một chút giòn',color:'#f4772a',title:'Niềm vui vừa một miếng',desc:'Viền giòn, ruột mềm. Khám phá cách bơ và đường thay đổi một chiếc cookie.',lesson:'Bơ và nhiệt độ',notes:['Bơ mềm giữ được vết ấn nhưng chưa chảy.','Đường nâu và đường trắng cho kết cấu khác nhau.','Bột nghỉ lạnh giúp bánh giữ dáng khi nướng.'],tip:'Chỉ thay đổi một yếu tố trong mỗi lần thử để biết điều gì tạo ra khác biệt.'},
 {name:'Bánh bông lan',sub:'Nhẹ như mây',color:'#008a78',title:'Bắt đầu từ một chiếc trứng',desc:'Giữ lại những bọt khí nhỏ, làm nên một chiếc bánh thật nhẹ.',lesson:'Bọt khí và sự nhẹ tay',notes:['Âu và phới phải sạch, không dính chất béo khi đánh lòng trắng.','Quan sát chóp trứng, không chỉ nhìn thời gian.','Trộn bột nhẹ từ dưới lên, dừng khi vừa hòa quyện.'],tip:'Kết cấu bắt đầu trong âu trộn, trước cả khi chiếc bánh vào lò.'},
 {name:'Tart & những lớp vỏ',sub:'Trái cây theo mùa',color:'#ee302c',title:'Một lớp vỏ, nhiều biến tấu',desc:'Vỏ giòn, kem mượt, trái cây tươi. Ba kết cấu trong một miếng bánh.',lesson:'Giữ lớp vỏ giòn',notes:['Giữ bơ lạnh khi trộn bột vỏ.','Để bột nghỉ trước khi cán và lót khuôn.','Đợi vỏ nguội hẳn trước khi cho kem.'],tip:'Một lớp chocolate mỏng có thể giúp ngăn ẩm giữa vỏ tart và nhân.'},
 {name:'Chocolate',sub:'Đậm một chút',color:'#70217e',title:'Một thế giới đậm đà',desc:'Cùng một nguyên liệu, nhiều cách tan chảy và kết tinh.',lesson:'Làm việc với chocolate',notes:['Dụng cụ sạch và khô hoàn toàn.','Đun cách thủy nhẹ, tránh hơi nước vào âu.','Đọc tỷ lệ cacao và hướng dẫn của nhà sản xuất.'],tip:'Đừng vội tăng nhiệt. Chocolate cần sự kiên nhẫn.'},
 {name:'Bánh mì & men',sub:'Chờ bột lớn lên',color:'#2454df',title:'Nhịp chậm trong căn bếp',desc:'Nhào, nghỉ, gấp và chờ. Học cách cảm nhận một khối bột.',lesson:'Quan sát khối bột',notes:['Độ ẩm và nhiệt độ ảnh hưởng tốc độ lên men.','Chạm nhẹ để cảm nhận độ đàn hồi.','Ghi lại thời gian, nhiệt độ và kết quả từng mẻ.'],tip:'Đồng hồ là gợi ý. Khối bột mới là thứ bạn cần quan sát.'},
 {name:'Kem & trang trí',sub:'Chạm nét cuối',color:'#c7448b',title:'Dấu ấn của đôi tay',desc:'Một mặt bánh phẳng. Một đường kem gọn. Một cách hoàn thiện của riêng bạn.',lesson:'Đánh kem vừa tới',notes:['Làm lạnh kem, âu và phới trước khi đánh.','Dùng tốc độ vừa để dễ quan sát.','Dừng máy kiểm tra khi vân kem bắt đầu rõ.'],tip:'Đánh quá tay rất nhanh, hãy dừng trước khi bạn nghĩ mình cần dừng.'},
 {name:'Sổ tay trong bếp',sub:'Những điều nhỏ',color:'#2454df',title:'Mỗi mẻ bánh, một điều mới',desc:'Giữ lại những điều học được. Mẻ bánh sau bắt đầu từ những ghi chú hôm nay.',lesson:'Ghi chép một mẻ bánh',notes:['Ghi nguyên liệu và định lượng thực tế.','Ghi nhiệt độ lò, thời gian và cỡ khuôn.','Chụp mặt cắt bánh sau khi nguội và so với lần trước.'],tip:'Không có mẻ bánh vô ích, nếu bạn biết mình vừa học được điều gì.'}
];
const sampleIngredients=[['Sữa tươi','250 g'],['Lòng đỏ trứng','60 g'],['Đường','50 g'],['Gelatin lá','8 g'],['Kem tươi 35%','400 g'],['Vani','1 trái']];

function LessonDesk({topic,id,fullMotion}:{topic:typeof topics[number];id:number;fullMotion:boolean}) {
 const [learning,setLearning]=useState(false);
 const [arranged,setArranged]=useState(false),[reset,setReset]=useState(0);
 const paperProps={arranged,reset,onScatter:()=>setArranged(false)};
 function arrange(){setArranged(v=>!v);setReset(v=>v+1)}
 const [tab,setTab]=useState(0);
 const pocket=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{if(!learning||!pocket.current)return;const a=pocket.current.animate([{transform:'translateX(26px) rotate(2deg)',opacity:.25},{transform:'none',opacity:1}],{duration:!fullMotion&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:420,easing:'cubic-bezier(.16,1,.3,1)'});return()=>a.cancel()},[tab,learning]);
 const [note,setNote]=useState('');
 const [saveStatus,setSaveStatus]=useState('');
 const [videoURL,setVideoURL]=useState('');
 const [videoError,setVideoError]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>()=>{if(videoURL)URL.revokeObjectURL(videoURL)},[videoURL]);
 useEffect(()=>{try{setNote(localStorage.getItem('sonneto-note-'+id)||'')}catch{}},[id]);
 const text='SONNETO — GHI CHÚ THỰC HÀNH MẪU\n'+topic.name+'\nMousse vani\n\n'+note+'\n\nNội dung minh họa; chưa phải tài liệu khóa học chính thức.';
 function changeMode(next:boolean){setLearning(next);requestAnimationFrame(()=>{(next?pocket.current:document.querySelector<HTMLElement>('.paper-video .paper-grip'))?.focus({preventScroll:true});if(!next)document.querySelector('.paper-video .paper-content')?.scrollTo({top:0})})}
 return <div className={'lesson-desk approved-desk '+(learning?'learning-mode':'folder-mode')}>
  <div className="lesson-heading"><span className="eyebrow">BÀI THỰC HÀNH MẪU / 04</span><h3 ref={heading} tabIndex={-1}>{learning?'Đổ mousse và lắp nhân':'Từng lớp một, cùng làm nên bánh.'}</h3><p>{learning?'Học chậm một chút. Làm chắc từng lớp.':'Khám phá bố cục bài học với công thức mẫu mousse vani.'}</p>{learning&&<button className="back-to-folder" onClick={()=>changeMode(false)}><Icon name="back"/>Về hồ sơ</button>}</div>
  <div className="board-tools"><button onClick={arrange}>{arranged?'Xòe giấy':'Xếp giấy ngay ngắn'}</button><span>Kéo thanh tên để sắp giấy · Bấm nền để xếp lại</span></div><div className="paper-switcher" aria-label="Chọn tờ giấy">{[['video','Bài học'],['list','Mục lục'],['recipe','Công thức']].map(([kind,label])=><button key={kind} onClick={()=>{const el=document.querySelector<HTMLElement>('.paper-'+kind);if(el){const papers=Array.from(document.querySelectorAll<HTMLElement>('.movable-paper'));el.style.zIndex=String(Math.max(...papers.map(p=>Number(p.style.zIndex)||3))+1);el.querySelector<HTMLButtonElement>('.paper-grip')?.focus({preventScroll:true})}}}>{label}</button>)}</div><div className="paper-board" data-arranged={arranged} onClick={e=>{if(e.target===e.currentTarget)arrange()}}><Paper kind="video" name="Bài học" {...paperProps}><div className="lesson-main">
   <div className="layered-video"><span className="video-tab">HỒ SƠ BÀI HỌC / 04</span><div className="video-paper">
    <div className="video-frame">{videoURL?<video key={videoURL} controls playsInline preload="metadata" poster={asset('anh/9280.jpg')} src={videoURL} onError={()=>setVideoError(true)}/>:<img src={asset('anh/9280.jpg')} alt="Học viên Sonneto thực hành lắp bánh trong khuôn"/>}{!videoURL&&<div className="video-empty"><span>VIDEO BÀI HỌC</span><p>Chờ video chính thức từ Sonneto</p></div>}</div>
    {videoError&&<p role="alert">Không phát được file này. Hãy thử video MP4 tương thích.</p>}
    <div className="video-caption"><h3>Trộn kem và đổ lớp đầu</h3><span>SONNETO / BÀN HỌC</span></div>
   </div></div>
   <details className="video-demo"><summary>Thử với video trên thiết bị</summary><label>Chọn video để kiểm bố cục (không tải lên máy chủ)<input type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){setVideoError(false);setVideoURL(URL.createObjectURL(f))}}}/></label></details>
   {!learning&&<button className="start-lesson" onClick={()=>changeMode(true)}><Icon name="play"/>Vào học bài mẫu</button>}
   <div className="resource-pocket" hidden={!learning}>
    <div className="pocket-tabs" role="tablist" aria-label="Tài liệu bài học">{['Nguyên liệu','Các bước','Ghi chú'].map((v,i)=><button key={v} role="tab" id={'tab-'+i} aria-selected={tab===i} aria-controls="pocket-panel" tabIndex={tab===i?0:-1} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;setTab(next);document.getElementById('tab-'+next)?.focus()}}} onClick={()=>setTab(i)}>{v}</button>)}</div>
    <section ref={pocket} id="pocket-panel" role="tabpanel" aria-labelledby={'tab-'+tab} tabIndex={0}>{tab===0?<><h3>Nguyên liệu</h3><div className="ingredient-sheet"><span className="eyebrow">MOUSSE VANI / 1 MẺ MẪU</span><dl>{sampleIngredients.map(([name,amount])=><div key={name}><dt>{name}</dt><dd>{amount}</dd></div>)}</dl><small>Dữ liệu mẫu; chưa phải công thức khóa học chính thức.</small></div></>:tab===1?<><h3>Từng bước thực hành</h3><ol>{['Ngâm gelatin trong nước đá 10 phút.','Nấu sữa, lòng đỏ và đường tới 82°C.','Cho gelatin vào, để nguội còn 30°C.','Trộn kem đánh bông, đổ lớp mousse thứ nhất.','Lắp nhân dâu, đổ lớp mousse thứ hai.','Làm phẳng mặt, cấp đông 4 giờ.'].map(n=><li key={n}>{n}</li>)}</ol><p className="desk-tip">Phần nền bánh và nhân dâu thuộc bài học khác. Các bước trên là nội dung mẫu từ Sonneto.</p></>:<><label htmlFor="baking-note">Mẻ bánh hôm nay dạy bạn điều gì?</label><textarea id="baking-note" value={note} onChange={e=>{setNote(e.target.value);setSaveStatus('')}} placeholder="Nhiệt độ lò, kết cấu, điều muốn thử lần sau…"/><button className="save-note" onClick={()=>{try{localStorage.setItem('sonneto-note-'+id,note);setSaveStatus('Đã lưu trên thiết bị này.')}catch{setSaveStatus('Không lưu được trên thiết bị. Bạn có thể tải ghi chú bên dưới.')}}}><Icon name="save"/>Lưu ghi chú</button><p role="status">{saveStatus}</p><a className="note-download" href={'data:text/plain;charset=utf-8,'+encodeURIComponent(text)} download="Sonneto-ghi-chu.txt">Tải ghi chú <Icon name="download"/></a></>}</section>
   </div>
  </div>
  </Paper><Paper kind="list" name="Mục lục" {...paperProps}>
   <details className="lesson-list" open={!learning}><summary>Trong hồ sơ này <span>4 bài mẫu</span></summary><ol>{['Chọn khuôn & nguyên liệu','Bông lan joconde','Nhân dâu và gel'].map((name,i)=><li key={name}><span>0{i+1}</span><div>{name}<small>Chưa có nội dung trong bản thử</small></div></li>)}<li className="current"><span>04</span><button onClick={()=>changeMode(true)}>Đổ mousse & lắp nhân<small>Mở bài mẫu</small></button></li></ol></details>
   </Paper><Paper kind="recipe" name="Công thức" {...paperProps}><a className="recipe-card" href={asset('cong-thuc/mousse-vani-mau.txt')} download="Sonneto-mousse-vani-mau.txt"><span>PHIẾU CÔNG THỨC</span><h3>Mousse vani</h3><p>Định lượng và trình tự thực hành.<br/>Tài liệu mẫu · TXT</p><b>Tải công thức <Icon name="download"/></b></a>
   </Paper></div><p className="desk-disclaimer">Bản thử giao diện. Video, tài liệu và quyền học thật sẽ được nối qua hệ thống Sonneto.</p>

 </div>
}
export default function Home(){
 const [fullMotion,setFullMotion]=useState(false);
 const systemReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const [selected,setSelected]=useState<number|null>(null);const [hover,setHover]=useState<number|null>(null);const [query,setQuery]=useState('');const [search,setSearch]=useState(false);const [ready,setReady]=useState(false);const [,setFocusPaper]=useState(false);const zoom=1;const [closing,setClosing]=useState(false);
 const frames=useRef<Keyframe[]>([]);
 const stage=useRef<HTMLDivElement>(null);const dialog=useRef<HTMLDialogElement>(null);const origin=useRef<DOMRect|null>(null);const opener=useRef<HTMLButtonElement|null>(null);const busy=useRef(false);const animation=useRef<Animation|null>(null);
 const reduced=()=>!fullMotion&&systemReduced;
 function open(i:number,el:HTMLButtonElement){if(busy.current)return;origin.current=el.getBoundingClientRect();opener.current=el;setSelected(i);setReady(false);setClosing(false);setFocusPaper(false)}
 const choreography=useRef<Animation[]>([]);
 useLayoutEffect(()=>{
  if(selected===null)return;const d=dialog.current,s=stage.current;if(!d||!s)return;
  d.showModal();d.focus({preventScroll:true});d.scrollTop=0;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  const r=s.getBoundingClientRect(),o=origin.current;
  const from=o?`translate(${o.left-r.left}px,${o.top-r.top}px) scale(${o.width/r.width},${Math.max(o.height,110)/r.height})`:'scale(.3)';
  frames.current=folderFrames(from);busy.current=true;
  const a=s.animate(frames.current,{duration:reduced()?0:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
  choreography.current=[a,...unfoldPapers(s,reduced())];
  Promise.all(choreography.current.map(a=>a.finished)).then(()=>{choreography.current.forEach(a=>a.cancel());busy.current=false;setReady(true)}).catch(()=>{});
  return()=>{choreography.current.forEach(a=>a.cancel());document.body.style.overflow=previous;busy.current=false};
 },[selected]);
 function close(){
  if(busy.current||selected===null)return;const s=stage.current;if(!s)return;
  busy.current=true;setClosing(true);setReady(false);
  choreography.current.forEach(a=>a.cancel());
  const sheets=Array.from(s.querySelectorAll<HTMLElement>('.movable-paper'));
  const gather=sheets.map((el,i)=>el.animate([{transform:getComputedStyle(el).transform,opacity:1},{transform:`translate(${(1-i)*30}px,30px) rotate(${(i-1)*6}deg) scale(.92)`,opacity:0}],{duration:reduced()?0:280,delay:reduced()?0:i*45,fill:'both'}));
  const target=opener.current?.getBoundingClientRect(),rect=s.getBoundingClientRect();
  const back=target?`translate(${target.left-rect.left}px,${target.top-rect.top}px) scale(${target.width/rect.width},${Math.max(target.height,110)/rect.height}) rotate(-9deg)`:'scale(.3)';
  const a=s.animate([{transform:'none',opacity:1},{transform:back,opacity:.4}],{duration:reduced()?0:550,delay:reduced()?0:280,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'});
  choreography.current=[...gather,a];
  a.finished.then(()=>{dialog.current?.close();setSelected(null);setHover(null);busy.current=false;opener.current?.focus({preventScroll:true})}).catch(()=>{busy.current=false});
 }
 const c=selected===null?null:topics[selected];
 return <div className="sonneto" data-full-motion={fullMotion}><div className={'overview '+(selected!==null?'receding':'')} inert={selected!==null}>
 <header className="nav"><nav><button onClick={()=>{setQuery('');setSearch(false)}}>Khám phá</button><button onClick={()=>{setSearch(!search)}}>Tìm công thức <Icon name="search"/></button></nav><a href="/" className="wordmark"><img src={asset('brand/sonneto-logo-white.png')} alt="Sonneto Pâtisserie Lab" width="657" height="267"/></a><span className="nav-note">Một chút bột. Một chút vui.</span></header>
 <main><section className="motion-audition" aria-label="Bản thử chuyển động"><div><b>SONNETO / MOTION 2D / BÀN GIẤY</b><p>{systemReduced&&!fullMotion?'Thiết bị đang giảm chuyển động. Bật motion để xem bìa và giấy mở theo lớp.':'Bấm một hồ sơ. Kéo, xếp và mở từng tờ giấy trên bàn.'}</p></div><button aria-pressed={fullMotion} onClick={()=>setFullMotion(!fullMotion)}>{fullMotion?'Theo cài đặt thiết bị':'Bật motion đầy đủ'}</button></section><section className="intro"><p className="kicker">TỦ CÔNG THỨC SONNETO</p><h1>Mở một ngăn. <br/>Học một món bánh.</h1><div className="intro-end"><span>Những điều muốn thử, cất ở đây.</span><span>Bấm để mở hồ sơ <Icon name="open"/></span></div>{search&&<label className="search">Tìm theo tên hoặc nguyên liệu<input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Bơ, chocolate, bánh mì…"/></label>}</section>
 <section className="archive" aria-label="Các ngăn công thức" onMouseLeave={()=>setHover(null)}>{topics.map((t,i)=>{if(query&&!`${t.name} ${t.desc}`.toLowerCase().includes(query.toLowerCase()))return null;const h=hover!==null&&i>hover?110:0;return <button key={t.name} className={'folder '+(hover===i?'lift':'')} style={{'--folder':t.color,'--shift':`${h}px`,'--idx':i} as CSSProperties} onMouseEnter={()=>{if(window.matchMedia('(hover:hover)').matches)setHover(i)}} onBlur={()=>setHover(null)} onClick={e=>open(i,e.currentTarget)} aria-label={`Mở ${t.name}`}><span className="folder-tab">{t.name}</span><span className="folder-body"><span className="folder-no">0{i+1}<br/>SONNETO</span><span className="folder-copy"><strong>{t.title}</strong><span>{t.desc}</span><b>Mở bài học <Icon name="open"/></b></span><span className="folder-edge">{t.sub}<br/>BỘ SƯU TẬP</span></span></button>})}{!topics.some(t=>`${t.name} ${t.desc}`.toLowerCase().includes(query.toLowerCase()))&&<p className="empty">Chưa thấy ngăn này. Thử một tên bánh khác nhé.</p>}</section>
<footer><span>Học bằng cách làm. Nhớ bằng đôi tay.</span><span>Bàn giấy 2D · Nội dung minh họa</span></footer></main></div>
 <dialog tabIndex={-1} ref={dialog} className={'workspace '+(ready?'ready ':'')+(closing?'closing':'')} onCancel={e=>{e.preventDefault();close()}} aria-label={c?.name||'Hồ sơ'}>{c&&<><div className="workspace-nav"><button onClick={close} disabled={!ready}><Icon name="back"/>Về tủ công thức</button><span>Sonneto / {c.name}</span><button onClick={close} disabled={!ready} aria-label="Đóng hồ sơ"><Icon name="close"/></button></div><div className="scene" ref={stage} style={{'--folder':c.color} as CSSProperties}><div className="scene-title"><span>HỒ SƠ 0{selected!+1}</span><h2>{c.name}</h2></div><div className="desk-camera" style={{'--zoom':zoom} as CSSProperties}><LessonDesk key={selected} id={selected!} topic={c} fullMotion={fullMotion}/></div><span className="side-label">{c.name}</span></div></>}</dialog></div>
}

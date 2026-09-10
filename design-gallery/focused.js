const modes=[
 {file:'rested',name:'Legged locomotion',label:'Simulation'},
 {file:'wholebody',name:'Whole-body locomotion',label:'Simulation'},
 {file:'wholebodyall',name:'Whole-body motion study',label:'Simulation'},
 {file:'real_t1',name:'Physical Booster T1',label:'Real robot'}
];
const paths={play:'<path d="m9 5 10 7-10 7Z"/>',pause:'<path d="M9 5v14M15 5v14"/>',mute:'<path d="M11 4 6 8H3v8h3l5 4ZM16 9l5 6m0-6-5 6"/>',sound:'<path d="M11 4 6 8H3v8h3l5 4Zm4 4c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>'};
function svg(name){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+paths[name]+'</svg>';}
function timestamp(seconds){if(!Number.isFinite(seconds))return '0:00';return Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0');}
function updatePlayState(player){
 const video=player.querySelector('video'),playing=!video.paused;
 player.dataset.playing=String(playing);
 player.querySelectorAll('[data-play]').forEach(b=>{b.setAttribute('aria-label',playing?'Pause demonstration':'Play demonstration');b.innerHTML=svg(playing?'pause':'play');});
 const comparison=player.closest('.comparison');
 if(comparison){const anyPlaying=[...comparison.querySelectorAll('video')].some(v=>!v.paused);const button=comparison.querySelector('[data-compare]');button.setAttribute('aria-pressed',String(anyPlaying));button.innerHTML=svg(anyPlaying?'pause':'play')+'<span>'+(anyPlaying?'Pause both':'Play both')+'</span>';}
}
function loadPlayer(player){
 const video=player.querySelector('video');
 if(!video.getAttribute('src')){video.src=video.dataset.source;video.load();}
 return video;
}
function playPlayer(player){
 const video=loadPlayer(player);
 player.querySelector('.player-error').hidden=true;
 return video.play().catch(error=>{if(error.name!=='AbortError'&&error.name!=='NotAllowedError')player.querySelector('.player-error').hidden=false;});
}
function setClip(player,file,label,resume=false){
 const video=player.querySelector('video');video.pause();
 video.removeAttribute('src');video.dataset.source='../images/research/'+file+'.mp4';video.poster='assets/'+file+'.jpg';video.load();
 video.setAttribute('aria-label',label+' robot demonstration');
 player.querySelector('[data-player-label]').textContent=label;
 player.querySelector('input').value=0;player.querySelector('[data-time]').textContent='0:00';
 player.querySelector('.player-error').hidden=true;player.querySelector('.player-error a').href=video.dataset.source;
 updatePlayState(player);if(resume)playPlayer(player);
}
const videoObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:0}):null;
function initPlayer(player){
 if(player.dataset.bound)return;
 player.dataset.bound='true';player.dataset.enhanced='true';
 const video=player.querySelector('video');video.controls=false;
 video.addEventListener('play',()=>{
  const group=player.closest('.comparison');
  document.querySelectorAll('video').forEach(v=>{if(v!==video&&(!group||v.closest('.comparison')!==group))v.pause();});updatePlayState(player);
 });
 video.addEventListener('pause',()=>updatePlayState(player));
 video.addEventListener('timeupdate',()=>{player.querySelector('input').value=Number.isFinite(video.duration)&&video.duration>0?100*video.currentTime/video.duration:0;player.querySelector('[data-time]').textContent=timestamp(video.currentTime);});
 video.addEventListener('error',()=>{if(video.getAttribute('src'))player.querySelector('.player-error').hidden=false;});
 player.querySelector('input').addEventListener('input',function(){if(Number.isFinite(video.duration))video.currentTime=this.value*video.duration/100;});
 videoObserver?.observe(video);
}
document.querySelectorAll('[data-player]').forEach(initPlayer);
function positionIndicator(switcher){
 const selected=switcher.querySelector('button[aria-pressed="true"]');
 if(!selected||!switcher.offsetWidth)return;
 const indicator=switcher.querySelector('.indicator');
 indicator.style.width=selected.offsetWidth+'px';indicator.style.transform='translateX('+selected.offsetLeft+'px)';
}
function refreshIndicators(){document.querySelectorAll('.switch').forEach(positionIndicator);}
if('ResizeObserver' in window){const observer=new ResizeObserver(entries=>entries.forEach(e=>positionIndicator(e.target)));document.querySelectorAll('.switch').forEach(el=>observer.observe(el));}
function chooseMode(viewer,index){
 const mode=modes[index];if(!mode)return;
 viewer.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mode)===index)));
 const player=viewer.querySelector('[data-player]');if(player)setClip(player,mode.file,mode.label,!player.querySelector('video').paused);
 const caption=viewer.querySelector('[data-caption]');if(caption)caption.textContent=mode.name+' · '+mode.label;
 viewer.querySelectorAll('.switch').forEach(positionIndicator);
}
document.querySelectorAll('[data-accordion-mode]').forEach(details=>details.addEventListener('toggle',()=>{
 if(!details.open)return;
 const owner=details.closest('[data-viewer]');
 owner.querySelectorAll('details').forEach(other=>{if(other!==details)other.open=false;});
 chooseMode(owner,Number(details.dataset.accordionMode));
}));
document.addEventListener('click',event=>{
 const play=event.target.closest('[data-play]');
 if(play){const player=play.closest('[data-player]');const v=player.querySelector('video');v.paused?playPlayer(player):v.pause();}
 const mute=event.target.closest('[data-mute]');
 if(mute){const video=mute.closest('[data-player]').querySelector('video');video.muted=!video.muted;mute.setAttribute('aria-label',video.muted?'Unmute demonstration':'Mute demonstration');mute.innerHTML=svg(video.muted?'mute':'sound');}
 const full=event.target.closest('[data-fullscreen]');
 if(full){const player=full.closest('[data-player]');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else if(player.requestFullscreen)player.requestFullscreen().catch(()=>{});else player.querySelector('video').webkitEnterFullscreen?.();}
 const mode=event.target.closest('[data-mode]');
 if(mode)chooseMode(mode.closest('[data-viewer]'),Number(mode.dataset.mode));
 const compare=event.target.closest('[data-compare]');
 if(compare){const players=[...compare.closest('.comparison').querySelectorAll('[data-player]')];const playing=players.some(p=>!p.querySelector('video').paused);players.forEach(player=>{const video=loadPlayer(player);if(playing)video.pause();else{video.currentTime=0;playPlayer(player);}});}
 const demo=event.target.closest('[data-demo-tab]');
 if(demo){const group=demo.closest('.switch');group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===demo)));positionIndicator(group);demo.closest('.controls-demo').querySelector('[data-demo-caption]').textContent=demo.textContent.trim()+' selected.';}
 const scroll=event.target.closest('[data-scroll]');
 if(scroll){const track=scroll.closest('.preview').querySelector('.projects.horizontal');track.scrollBy({left:Number(scroll.dataset.scroll)*track.clientWidth*.65,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 const detail=event.target.closest('[data-project]');if(detail)openProject(Number(detail.dataset.project));
});

const previews=[...document.querySelectorAll('.preview')];
let category='research';const selection={research:'R1',projects:'P1',controls:'B1',context:'C1'};
const nav=document.getElementById('variants');
function showPreview(id){
 const chosen=document.getElementById(id);if(!chosen?.classList.contains('preview'))return;
 category=chosen.dataset.category;selection[category]=id;
 previews.forEach(p=>{p.hidden=p!==chosen;if(p.hidden)p.querySelectorAll('video').forEach(v=>v.pause());});
 document.querySelectorAll('.categories button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
 nav.replaceChildren();
 const options=previews.filter(p=>p.dataset.category===category);nav.style.setProperty('--count',options.length);
 options.forEach(p=>{const button=document.createElement('button');button.setAttribute('aria-pressed',String(p===chosen));const code=document.createElement('span');code.textContent=p.id;button.append(code,document.createTextNode(p.dataset.name));button.addEventListener('click',()=>showPreview(p.id));nav.append(button);});
 nav.hidden=options.length===1;
 document.getElementById('preview-name').textContent=chosen.dataset.name;
 document.getElementById('preview-note').textContent=chosen.dataset.note;
 document.getElementById('preview-id').textContent=id;
 try{history.replaceState(null,'','#'+id);}catch(e){}
 requestAnimationFrame(refreshIndicators);
}
document.querySelectorAll('.categories button').forEach(b=>b.addEventListener('click',()=>showPreview(selection[b.dataset.category])));
document.getElementById('phone-toggle').addEventListener('click',function(){const phone=document.getElementById('stage').classList.toggle('phone');this.setAttribute('aria-pressed',String(phone));this.querySelector('span').textContent=phone?'Desktop width':'Phone width';requestAnimationFrame(refreshIndicators);});
document.getElementById('accent-toggle').addEventListener('click',function(){const neutral=document.documentElement.classList.toggle('neutral-accent');this.setAttribute('aria-pressed',String(neutral));this.textContent=neutral?'Lavender accent':'Neutral accent';});

const projects=[
 {name:'TurtleBot SLAM',description:'SLAM and autonomous mapping on a TurtleBot platform.',file:'fastslam.jpg'},
 {name:'TIAGo manipulation',description:'Manipulation with the TIAGo Steel platform in Gazebo. This is an illustrative preview; replace it with your own project footage.',file:'manipulation.svg'},
 {name:'RRT motion planning',description:'Sampling-based, collision-free path planning. This is an illustrative preview; replace it with your own planning animation.',file:'planning.svg'}
];
const dialog=document.getElementById('project-dialog');
function openProject(index){
 const item=projects[index];if(!item)return;
 document.getElementById('dialog-title').textContent=item.name;
 const body=document.getElementById('dialog-body');body.replaceChildren();
 if(index===0){
  const original=document.querySelector('#R1 [data-player]');const copy=original.cloneNode(true);delete copy.dataset.bound;copy.dataset.playing='false';body.append(copy);initPlayer(copy);setClip(copy,'fastslam','TurtleBot SLAM');
 }else{const image=document.createElement('img');image.src='assets/'+item.file;image.alt=item.name+' illustrative preview';body.append(image);}
 const p=document.createElement('p');p.textContent=item.description;body.append(p);dialog.showModal();
}
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>dialog.querySelectorAll('video').forEach(v=>v.pause()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const initial=location.hash.slice(1);showPreview(previews.some(p=>p.id===initial)?initial:'R1');
document.fonts?.ready.then(refreshIndicators);

import {initialState,normalize,layouts,allSlots,robots,mediaManifest} from './catalog.js';
import {guided,studio,collection,showcase} from './views.js';
import {icon} from './icons.js';

let state=initialState();
const views={guided,studio,collection,showcase};
const app=document.getElementById('app'),evidence=document.getElementById('evidence-dialog');
const urlKeys=['layout','topic','robot','controller','configuration','environment','retargetEnvironment','policyEnvironment','direction','display','secondRobot','compareScope'];
const hashValues=new URLSearchParams(location.hash.slice(1));
urlKeys.forEach(key=>{if(hashValues.has(key))state[key]=hashValues.get(key);});
normalize(state);
let videoObserver;
if('IntersectionObserver' in window)videoObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:0});
function stopVideos(){document.querySelectorAll('video').forEach(v=>{v.pause();videoObserver?.unobserve(v);});}
function focusDescription(){
 const el=document.activeElement;
 if(el?.matches('button[data-set]'))return {property:el.dataset.set,value:el.dataset.value,tag:'button'};
 if(el?.matches('select[data-set]'))return {property:el.dataset.set,tag:'select'};
 return null;
}
function render(){
 const focus=focusDescription();stopVideos();normalize(state);
 const layout=layouts.find(l=>l.id===state.layout);
 document.getElementById('option-title').textContent=layout.name;
 document.getElementById('option-copy').textContent=layout.description;
 document.getElementById('option-use').textContent=layout.use;
 document.getElementById('layout-options').innerHTML=layouts.map((l,i)=>`<button class="option-button" data-layout="${l.id}" aria-pressed="${state.layout===l.id}"><small>0${i+1}</small>${l.name}</button>`).join('');
 app.innerHTML=views[state.layout](state);
 if(state.drawer){
  document.getElementById('evidence-content').innerHTML=guided(state,{drawer:true});
  if(!evidence.open)evidence.showModal();
 }else{if(evidence.open)evidence.close();document.getElementById('evidence-content').replaceChildren();}
 initPlayers();refreshGroupButtons();
 if(focus){
  const scope=state.drawer?evidence:app;
  const match=[...scope.querySelectorAll(`${focus.tag}[data-set]`)].find(el=>el.dataset.set===focus.property&&(focus.tag==='select'||el.dataset.value===focus.value));
  match?.focus({preventScroll:true});
 }
 const params=new URLSearchParams();urlKeys.forEach(key=>params.set(key,state[key]));
 try{history.replaceState(null,'','#'+params.toString());}catch(e){}
}
function setState(patch){state={...state,...patch};render();}
function formatTime(time){if(!Number.isFinite(time))return '0:00';return Math.floor(time/60)+':'+String(Math.floor(time%60)).padStart(2,'0');}
function playbackScope(button){return button.closest('.studio-body')||button.closest('.page')||button.closest('#app');}
function refreshGroupButtons(){
 document.querySelectorAll('[data-play-group-button]').forEach(button=>{
  const videos=[...playbackScope(button).querySelectorAll('video')];
  const playing=videos.some(v=>!v.paused);
  button.disabled=!videos.length;button.setAttribute('aria-pressed',String(playing));
  button.innerHTML=icon(playing?'pause':'play')+(playing?'Pause clips':'Play available clips');
 });
}
function updatePlayer(video){
 const body=video.closest('.media-body'),playing=!video.paused;body.dataset.playing=String(playing);
 body.querySelectorAll('[data-play]').forEach(button=>{button.innerHTML=icon(playing?'pause':'play');button.setAttribute('aria-label',playing?'Pause video':'Play video');});refreshGroupButtons();
}
function ensureSource(video){if(!video.getAttribute('src')){video.src=video.dataset.source;video.load();}}
function playVideo(video){
 ensureSource(video);video.closest('.media-body').querySelector('.media-error').hidden=true;
 return video.play().catch(error=>{if(!['AbortError','NotAllowedError'].includes(error.name))video.closest('.media-body').querySelector('.media-error').hidden=false;});
}
function initPlayers(){
 document.querySelectorAll('.media-body video').forEach(video=>{
  const body=video.closest('.media-body');
  video.addEventListener('play',()=>{
   const group=video.closest('[data-play-group]');
   document.querySelectorAll('video').forEach(other=>{if(other!==video&&(!group||other.closest('[data-play-group]')!==group))other.pause();});updatePlayer(video);
  });
  video.addEventListener('pause',()=>updatePlayer(video));
  video.addEventListener('timeupdate',()=>{body.querySelector('input').value=Number.isFinite(video.duration)&&video.duration>0?video.currentTime/video.duration*100:0;body.querySelector('time').textContent=formatTime(video.currentTime);});
  video.addEventListener('error',()=>{if(video.getAttribute('src'))body.querySelector('.media-error').hidden=false;});
  body.querySelector('input').addEventListener('input',function(){if(Number.isFinite(video.duration))video.currentTime=this.value*video.duration/100;});
  videoObserver?.observe(video);
 });
}
document.addEventListener('click',event=>{
 const layout=event.target.closest('[data-layout]');if(layout){setState({layout:layout.dataset.layout,drawer:false});return;}
 const control=event.target.closest('button[data-set]');if(control){setState({[control.dataset.set]:control.dataset.value});return;}
 const play=event.target.closest('[data-play]');if(play){const v=play.closest('.media-body').querySelector('video');v.paused?playVideo(v):v.pause();return;}
 const group=event.target.closest('[data-play-group-button]');
 if(group){const videos=[...playbackScope(group).querySelectorAll('video')];const stop=videos.some(v=>!v.paused);videos.forEach(v=>{if(stop)v.pause();else{ensureSource(v);v.currentTime=0;playVideo(v);}});return;}
 const full=event.target.closest('[data-fullscreen]');if(full){const body=full.closest('.media-body');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else if(body.requestFullscreen)body.requestFullscreen().catch(()=>{});else body.querySelector('video').webkitEnterFullscreen?.();return;}
 const enter=event.target.closest('[data-enter]');
 if(enter){const target=enter.dataset.enter;setState({drawer:true,topic:target==='robots'?'locomotion':target,robot:'t1',controller:target==='robots'?'wholebody':'legged',display:'focus'});return;}
 const close=event.target.closest('[data-close]');if(close){if(close.dataset.close==='evidence-dialog')setState({drawer:false});else document.getElementById(close.dataset.close).close();return;}
 if(event.target.closest('[data-map]')||event.target.closest('#open-map'))document.getElementById('map-dialog').showModal();
 const accent=event.target.closest('[data-accent]');if(accent){document.body.classList.toggle('red',accent.dataset.accent==='red');document.querySelectorAll('[data-accent]').forEach(b=>b.setAttribute('aria-pressed',String(b===accent)));}
});
document.addEventListener('change',event=>{const select=event.target.closest('select[data-set]');if(select)setState({[select.dataset.set]:select.value});});
document.getElementById('phone').addEventListener('click',function(){const phone=document.getElementById('canvas').classList.toggle('phone');this.setAttribute('aria-pressed',String(phone));this.textContent=phone?'Desktop preview':'Phone preview';});
evidence.addEventListener('close',()=>{if(state.drawer){state.drawer=false;render();}});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
window.researchPreview={getState:()=>({...state}),setState,allSlots,robots,mediaManifest};
render();

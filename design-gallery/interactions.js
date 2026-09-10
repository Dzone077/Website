/* Local-only interactions shared by complete pages and component specimens. */
document.addEventListener('click',function(event){
 const tab=event.target.closest('[data-clip]');
 if(tab){
  const owner=tab.closest('[data-viewer]');
  if(!owner)return;
  owner.querySelectorAll('[data-clip]').forEach(b=>b.setAttribute('aria-pressed',String(b===tab)));
  const video=owner.querySelector('video');
  const caption=owner.querySelector('[data-caption]');
  if(caption)caption.textContent=tab.dataset.caption||tab.textContent.trim();
  if(video){
   document.querySelectorAll('video').forEach(v=>v.pause());
   video.poster='assets/'+tab.dataset.clip+'.jpg';
   video.src='../images/research/'+tab.dataset.clip+'.mp4';
   video.play().catch(()=>{});
  }
 }
 const compare=event.target.closest('[data-compare]');
 if(compare){
  const videos=compare.closest('.research').querySelectorAll('video');
  const stop=compare.getAttribute('aria-pressed')==='true';
  compare.setAttribute('aria-pressed',String(!stop));
  compare.textContent=stop?'Play both ↗':'Pause both Ⅱ';
  videos.forEach(v=>{if(stop)v.pause();else{v.currentTime=0;v.play().catch(()=>{});}});
 }
 const button=event.target.closest('.button-demo .tabs button');
 if(button){button.closest('.tabs').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}
});
document.addEventListener('play',function(event){
 if(event.target.tagName!=='VIDEO')return;
 const comparison=event.target.closest('.comparison');
 document.querySelectorAll('video').forEach(v=>{if(v!==event.target&&(!comparison||v.closest('.comparison')!==comparison))v.pause();});
},true);
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();}),{threshold:0});
 document.querySelectorAll('video').forEach(v=>observer.observe(v));
}

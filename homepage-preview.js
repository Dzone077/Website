/* A few homepage interactions; the complete research viewer is kept separately. */
document.querySelectorAll('.home-player').forEach(player=>{
 const video=player.querySelector('video');
 player.dataset.ready='true';video.controls=false;
 player.querySelector('.home-play').addEventListener('click',()=>{
  video.controls=true;
  video.play().catch(()=>{video.controls=true;});
 });
 video.addEventListener('play',()=>{
  player.dataset.playing='true';
  document.querySelectorAll('.home-player video').forEach(other=>{if(other!==video)other.pause();});
 });
 video.addEventListener('pause',()=>player.dataset.playing='false');
});
document.querySelectorAll('[data-home-clip]').forEach(button=>button.addEventListener('click',()=>{
 const block=button.closest('.home-media'),video=block.querySelector('video');
 const resume=!video.paused;video.pause();video.controls=false;
 block.querySelector('.home-player').dataset.playing='false';
 video.src=button.dataset.homeClip;video.poster=button.dataset.homePoster;
 video.setAttribute('aria-label',button.textContent.trim()+' locomotion preview');video.load();
 block.querySelectorAll('[data-home-clip]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 if(resume){video.controls=true;video.play().catch(()=>{});}
}));
document.querySelectorAll('[data-home-fullscreen]').forEach(button=>button.addEventListener('click',()=>{
 const player=button.closest('.home-media').querySelector('.home-player');
 if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
 else if(player.requestFullscreen)player.requestFullscreen().catch(()=>{});
 else player.querySelector('video').webkitEnterFullscreen?.();
}));
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:0});
 document.querySelectorAll('.home-player video').forEach(v=>observer.observe(v));
}
document.querySelectorAll('.collapsible[data-target]').forEach(button=>{
 const content=document.querySelector(button.dataset.target);if(!content)return;
 button.setAttribute('aria-expanded',String(content.classList.contains('in')));
 button.addEventListener('click',()=>{const open=content.classList.toggle('in');content.hidden=!open;button.setAttribute('aria-expanded',String(open));});
});

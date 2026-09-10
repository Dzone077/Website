const categoryDescriptions={
 directions:['Complete directions','Eight complete personal websites. Scroll inside a preview, or open a direction at full size. Each includes research, projects, experience, education, activities, distinctions, and contact.'],
 introductions:['Introductions & identity','Eight different compositions for your name, portrait, short biography, and contact links.'],
 research:['Research windows','Eight different ways to frame, navigate, and compare your actual robot footage. Tabs and video controls work.'],
 projects:['Selected projects','Six arrangements for earlier work: a typographic index, a mosaic, a catalogue, a horizontal strip, and more.'],
 experience:['Experience','Five alternatives to large institutional logo rows, with different treatments of dates and hierarchy.'],
 education:['Education','Four restrained approaches to qualifications, institutions, dates, and supporting detail.'],
 activities:['Academic activities','Four ways to show team contributions and mentoring with their own visual rhythm.'],
 distinctions:['Distinctions','Four treatments using the GPA and KTH grade supplied in your context. Competition participation stays under activities.'],
 headings:['Headings & navigation','Six section-heading systems and four navigation styles. Look at rules, numbering, alignment, and spacing.'],
 buttons:['Buttons & tabs','Ten control families. Click the tabs to compare selected and unselected states; the links lead to your real resources.'],
 footers:['Contact & closing','Four ways to close the page, from a small colophon to a generous contact section.']
};
let saved=new Set();try{saved=new Set(JSON.parse(localStorage.getItem('duarte-design-shortlist-v1')||'[]'));}catch(e){}
let current='directions',onlySaved=false;
const cards=[...document.querySelectorAll('.study-card')];
function render(){
 let count=0;
 cards.forEach(card=>{const visible=(onlySaved?saved.has(card.id):card.dataset.category===current);card.hidden=!visible;if(visible)count++;const b=card.querySelector('.save');b.setAttribute('aria-pressed',String(saved.has(card.id)));b.textContent=saved.has(card.id)?'★':'☆';b.setAttribute('aria-label',(saved.has(card.id)?'Unsave ':'Save ')+card.dataset.name);});
 document.querySelectorAll('[data-category-filter]').forEach(b=>b.setAttribute('aria-pressed',String(!onlySaved&&b.dataset.categoryFilter===current)));
 document.getElementById('collection-title').textContent=onlySaved?'Your shortlist':categoryDescriptions[current][0];
 document.getElementById('collection-description').textContent=onlySaved?'Mix sections across directions. Export this list to share the exact designs you like.':categoryDescriptions[current][1];
 document.getElementById('visible-count').textContent=count+' studies';
 document.getElementById('saved-toggle').textContent='★ '+saved.size;
 document.getElementById('saved-toggle').setAttribute('aria-pressed',String(onlySaved));
 document.getElementById('empty').hidden=count!==0;
 document.getElementById('recommendation').hidden=onlySaved||current!=='directions';
 document.querySelector('.study-grid').classList.toggle('compact',['buttons','headings','distinctions','footers'].includes(current)&&!onlySaved);
 document.querySelectorAll('.study-card[hidden] video').forEach(v=>v.pause());
}
document.querySelectorAll('[data-category-filter]').forEach(button=>button.addEventListener('click',()=>{current=button.dataset.categoryFilter;onlySaved=false;history.replaceState(null,'','#'+current);render();}));
document.querySelectorAll('.save').forEach(button=>button.addEventListener('click',()=>{const id=button.closest('.study-card').id;saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('duarte-design-shortlist-v1',JSON.stringify([...saved]));}catch(e){}render();}));
document.getElementById('saved-toggle').addEventListener('click',()=>{onlySaved=!onlySaved;render();});
document.getElementById('width-toggle').addEventListener('click',function(){const mobile=document.querySelector('.gallery-main').classList.toggle('mobile-preview');this.setAttribute('aria-pressed',String(mobile));this.textContent=mobile?'Desktop width':'Phone width';});
const dialog=document.getElementById('selection-dialog');
document.getElementById('export').addEventListener('click',()=>{document.getElementById('selection-text').value='Duarte Santos — website design shortlist\n\n'+(cards.filter(c=>saved.has(c.id)).map(c=>c.id+' · '+c.dataset.name).join('\n')||'No saved designs yet. Use the star beside any example.');dialog.showModal();});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
document.getElementById('copy-list').addEventListener('click',async function(){const field=document.getElementById('selection-text');try{await navigator.clipboard.writeText(field.value);this.textContent='Copied';setTimeout(()=>this.textContent='Copy list',1800);}catch(e){field.focus();field.select();this.textContent='Selected — press Ctrl/Cmd+C';}});
const hash=location.hash.slice(1);if(categoryDescriptions[hash])current=hash;render();

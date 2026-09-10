import {robots,robot,topics,environments,supportedEnvironments,configurationName,titleFor,makeSlot,mediaFor} from './catalog.js';
import {icon} from './icons.js';
export function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const thesis='https://dzone077.github.io/Project-Page/';
function segment(property,items,current,classes=''){
 return `<div class="segmented ${classes}" role="group" aria-label="${esc(propertyLabels[property]||property)}">${items.map(([value,label,ic])=>`<button data-set="${property}" data-value="${value}" aria-pressed="${value===current}">${ic?icon(ic):''}${label}</button>`).join('')}</div>`;
}
const propertyLabels={controller:'Controller type',configuration:'Arm configuration',environment:'Playback environment',direction:'Stair direction',display:'Display mode',retargetEnvironment:'Retargeting simulator',policyEnvironment:'Trained policy environment'};
function environmentItems(keys){return keys.map(key=>[key,environments[key]]);}
function robotSelect(s,property='robot',label='Robot',stacked=false){
 const choices=robots.filter(r=>property!=='secondRobot'||r.id!==s.robot);
 return `<label class="field ${stacked?'stacked':''}"><span>${label}</span><select data-set="${property}" aria-label="${label}">${choices.map(r=>`<option value="${r.id}" ${r.id===s[property]?'selected':''}>${r.name}</option>`).join('')}</select></label>`;
}
function topicNav(s,type='chapter'){
 const details={locomotion:['robot','Legged & whole body'],reference:['motion','Source → robot → policy'],terrain:['terrain','Ascent & descent']};
 if(type==='family')return `<nav class="family-nav" aria-label="Research topics">${Object.entries(topics).map(([key,name])=>`<button data-set="topic" data-value="${key}" aria-pressed="${s.topic===key}">${name}</button>`).join('')}</nav>`;
 if(type==='sidebar')return `<nav class="sidebar-nav" aria-label="Research topics">${Object.entries(topics).map(([key,name])=>`<button data-set="topic" data-value="${key}" aria-pressed="${s.topic===key}">${icon(details[key][0])}${name}</button>`).join('')}</nav>`;
 return `<nav class="chapter-nav" aria-label="Research topics">${Object.entries(topics).map(([key,name])=>`<button class="chapter-button" data-set="topic" data-value="${key}" aria-pressed="${s.topic===key}"><span class="chapter-icon">${icon(details[key][0])}</span><span><strong>${name}</strong><small>${details[key][1]}</small></span>${icon('chevron').replace('<svg','<svg class="chapter-arrow"')}</button>`).join('')}</nav>`;
}
export function media(slot,{minimal=false}={}){
 const asset=mediaFor(slot),r=robot(slot.robot);
 const title=slot.name,detail=slot.detail;
 let body;
 if(asset){
  body=`<video muted loop playsinline preload="none" poster="${esc(asset.poster)}" data-source="${esc(asset.src)}" aria-label="${esc(asset.sample?'Unassigned T1 layout sample':`${r.name} ${title} ${detail}`)}"></video><span class="media-badge">${asset.sample?'T1 sample · not assigned':esc(r.name)}</span><button class="play-overlay" data-play aria-label="Play ${asset.sample?'layout sample':'video'}">${icon('play')}</button><div class="media-controls"><button data-play aria-label="Play video">${icon('play')}</button><time>0:00</time><input type="range" min="0" max="100" step="0.1" value="0" aria-label="Video progress"><button data-fullscreen aria-label="Expand video">${icon('expand')}</button></div><p class="media-error" hidden>Could not play this clip. <a href="${esc(asset.src)}" target="_blank" rel="noopener">Open video ↗</a></p>`;
 }else{
  const glyph=slot.stage==='source'?'human':slot.stage==='retargeted'?'motion':slot.stage==='terrain'?'terrain':'robot';
  body=`<div class="media-empty"><span class="empty-icon">${icon(glyph)}</span><strong>${esc(slot.stage==='source'?'Source recording':r.name)}</strong><p>Footage not linked</p><span class="empty-monogram" aria-hidden="true">${slot.stage==='source'?'':esc(r.short)}</span></div>`;
 }
 const sampleText=asset?.sample?'Layout sample; condition not yet matched':asset?'Matched recording':'Unassigned footage slot';
 return `<figure class="media-frame ${slot.environment==='real'?'accent-frame':''}" data-slot="${esc(slot.key)}" data-robot="${slot.robot}" data-stage="${slot.stage}" data-environment="${slot.environment||''}"><div class="media-body" data-playing="false">${body}</div>${minimal?'':`<figcaption class="media-meta"><div><strong>${esc(title)}</strong><small>${sampleText}</small></div><span class="meta-detail">${esc(detail)}</span></figcaption>`}</figure>`;
}
function displaySwitch(s){return segment('display',[['focus','Focus','focus'],['compare','Compare','grid']],s.display,'compact icons');}
function controllerControl(s){if(s.topic!=='locomotion'||s.robot!=='t1')return '';return `<div class="controller-row">${segment('controller',[['legged','Legged locomotion'],['wholebody','Whole body']],s.controller)}</div>`;}
function configurationControl(s){return s.topic==='locomotion'&&s.robot==='t1'&&s.controller==='legged'?segment('configuration',[['rested','Rested arms'],['raised','Raised arms']],s.configuration):'';}
function descriptionFor(s){
 if(s.topic==='reference')return 'Keep the original motion, its retargeting, and the learned behaviour directly connected.';
 if(s.topic==='terrain')return `Compare ascent and descent on ${robot(s.robot).name}, in MuJoCo and Isaac.`;
 if(s.controller==='legged')return 'Choose an arm configuration, then inspect the same policy across simulators and deployment.';
 return 'One whole-body configuration, with the available simulator and deployment recordings.';
}
function referenceView(s){
 const steps=[['01','Source motion',makeSlot(s,{stage:'source'}),null],['02','Retargeted motion',makeSlot(s,{stage:'retargeted',environment:s.retargetEnvironment}),'retargetEnvironment'],['03','Trained policy',makeSlot(s,{stage:'policy',environment:s.policyEnvironment}),'policyEnvironment']];
 return `<div class="reference-flow">${steps.map(([n,name,slot,property],i)=>`<section class="flow-step"><div class="flow-heading"><span class="step-number">${n}</span><h4>${name}</h4>${i<2?icon('right'):''}</div>${media(slot)}${property?segment(property,environmentItems(property==='retargetEnvironment'?['mujoco','isaac']:supportedEnvironments(s)),s[property],'compact'):'<p class="flow-fixed">Original motion · no simulator</p>'}</section>`).join('')}</div><div class="flow-note"><p><strong>The source stays fixed.</strong> Simulator choices apply to the retargeting and policy windows separately.</p>${s.robot==='t1'?'<span>Real deployment is available for the trained policy.</span>':'<span>Simulation only for this embodiment.</span>'}</div>`;
}
function singleExperiment(s){
 if(s.topic==='reference')return referenceView(s);
 const config=configurationControl(s);
 const direction=s.topic==='terrain'?segment('direction',[['ascent','Ascent'],['descent','Descent']],s.direction):'';
 const context=config||direction||`<span class="label-value"><strong>${robot(s.robot).name}</strong> · Whole-body policy</span>`;
 let content;
 if(s.display==='compare'){
  const keys=supportedEnvironments(s);
  content=`<div class="comparison-grid" style="--columns:${keys.length}" data-play-group>${keys.map(environment=>media(makeSlot(s,{environment}))).join('')}</div><div class="comparison-footer"><p>Compare environments for the same condition. Sample clips show placement; final recordings are not assumed to be time-aligned.</p><button class="button" data-play-group-button>${icon('play')}Play available clips</button></div>`;
 }else{
  content=`<div class="focus-window">${media(makeSlot(s))}</div><div class="viewer-footer"><p class="viewer-caption"><strong>${robot(s.robot).name}</strong> · ${s.topic==='terrain'?(s.direction==='ascent'?'Ascent':'Descent'):configurationName(s)}</p>${segment('environment',environmentItems(supportedEnvironments(s)),s.environment,'accent')}</div>`;
 }
 return `<div class="experiment-controls"><div class="group">${context}</div>${displaySwitch(s)}</div>${content}`;
}
export function guided(s,{drawer=false}={}){
 return `<section class="page guided"><header class="page-heading"><div><span class="overline">Master’s thesis · Humanoid robotics</span><h2>Humanoid locomotion & control.</h2><p>Controllers, reference motion, and terrain across simulation and hardware.</p></div><a class="quiet-link" href="${thesis}" target="_blank" rel="noopener">Thesis project ${icon('arrow')}</a></header>${topicNav(s)}<div class="experiment-heading"><div><h3>${titleFor(s)}</h3><p>${descriptionFor(s)}</p></div>${robotSelect(s)}</div>${controllerControl(s)}${singleExperiment(s)}<div class="context-row"><span>${s.topic==='reference'?'Source, retargeting, and learned policy remain separate evidence.':s.topic==='terrain'?'Terrain recordings are available in MuJoCo and Isaac for every robot.':'Real deployment is available for Booster T1. Other embodiments have simulation footage.'}</span><button class="quiet-link" data-map style="border:0;background:none;padding:0">View collection structure ${icon('arrow')}</button></div></section>`;
}
function matrix(columns,rows){
 return `<p class="matrix-scroll-hint" style="display:none">Scroll horizontally to keep the comparison columns aligned.</p><div class="matrix-scroll"><div class="matrix ${columns.length===2?'two-columns':''}" style="--columns:${columns.length}" data-play-group><div></div>${columns.map(c=>`<div class="column-name ${c==='Real robot'?'real':''}">${c}</div>`).join('')}${rows.map(row=>`<div class="row-name">${row.name}${row.sub?`<small>${row.sub}</small>`:''}</div>${row.slots.map(slot=>slot?media(slot):'<div class="unavailable">Not applicable<br>Simulation stage</div>').join('')}`).join('')}</div></div>`;
}
function studioMatrix(s){
 if(s.compareScope==='robots'){
  const rs=[s.robot,s.secondRobot];
  if(s.topic==='reference'){
   const rows=[['Source','source'],['Retargeted','retargeted'],['Policy','policy']].map(([name,stage])=>({name,sub:stage==='source'?'Original motion':environments[s.environment],slots:rs.map(robotId=>makeSlot(s,{robotId,stage,environment:s.environment==='real'?'mujoco':s.environment}))}));
   return matrix(rs.map(id=>robot(id).name),rows);
  }
  return matrix(['MuJoCo','Isaac'],rs.map(id=>({name:robot(id).name,sub:s.topic==='terrain'?(s.direction==='ascent'?'Ascent':'Descent'):'Whole body',slots:['mujoco','isaac'].map(environment=>makeSlot({...s,controller:'wholebody'},{robotId:id,environment}))})));
 }
 if(s.topic==='reference'){
  const keys=supportedEnvironments(s);
  const strip=`<div class="source-strip">${media(makeSlot(s,{stage:'source'}))}<div><h3>Original reference motion</h3><p>The source recording is separate from the simulator comparison below.</p></div></div>`;
  return strip+matrix(keys.map(k=>environments[k]),[{name:'Retargeted',sub:'Motion transfer',slots:keys.map(environment=>environment==='real'?null:makeSlot(s,{stage:'retargeted',environment}))},{name:'Policy',sub:'Learned control',slots:keys.map(environment=>makeSlot(s,{stage:'policy',environment}))}]);
 }
 if(s.topic==='terrain')return matrix(['MuJoCo','Isaac'],['ascent','descent'].map(direction=>({name:direction==='ascent'?'Ascent':'Descent',sub:robot(s.robot).short,slots:['mujoco','isaac'].map(environment=>makeSlot(s,{direction,environment}))})));
 const keys=supportedEnvironments(s);
 if(s.compareScope==='configurations')return matrix(keys.map(k=>environments[k]),['rested','raised'].map(configuration=>({name:configuration==='rested'?'Rested arms':'Raised arms',sub:'Legged policy',slots:keys.map(environment=>makeSlot(s,{configuration,environment}))})));
 return matrix(keys.map(k=>environments[k]),[{name:s.controller==='legged'?configurationName(s):'Whole body',sub:robot(s.robot).short,slots:keys.map(environment=>makeSlot(s,{environment}))}]);
}
export function studio(s){
 const canLegged=s.robot==='t1'&&s.topic==='locomotion'&&s.compareScope!=='robots';
 let scopeItems=s.topic==='terrain'?[['directions','Ascent vs descent'],['robots','Two robots']]:[['environments','Across environments'],['robots','Two robots']];
 if(s.topic==='locomotion'&&s.robot==='t1'&&s.controller==='legged')scopeItems.unshift(['configurations','Both arm configurations']);
 const extras=s.compareScope==='robots'?`${robotSelect(s,'secondRobot','Compare with')}${s.topic==='terrain'?segment('direction',[['ascent','Ascent'],['descent','Descent']],s.direction,'compact'):s.topic==='reference'?segment('environment',environmentItems(['mujoco','isaac']),s.environment==='real'?'mujoco':s.environment,'compact'):''}`:s.topic==='locomotion'&&s.controller==='legged'&&s.compareScope!=='configurations'?configurationControl(s):'';
 return `<section class="studio"><aside class="studio-sidebar"><div class="studio-wordmark">Research collection<span>Compare conditions</span></div>${topicNav(s,'sidebar')}<div class="sidebar-fields">${robotSelect(s,'robot','Embodiment',true)}${canLegged?`<div><span class="control-label" style="display:block;margin-bottom:7px">Controller</span>${segment('controller',[['legged','Legged'],['wholebody','Whole body']],s.controller)}</div>`:''}</div><p class="sidebar-caption">A column is an environment.<br>A row is a configuration, motion stage, direction, or robot.</p></aside><div class="studio-body"><header class="studio-header"><div><span class="overline">${topics[s.topic]}</span><h2>Compare the evidence.</h2><p>${robot(s.robot).name}${s.compareScope==='robots'?' × '+robot(s.secondRobot).name:''}</p></div><button class="button" data-play-group-button>${icon('play')}Play available clips</button></header><div class="studio-settings"><label class="field"><span>Comparison</span><select data-set="compareScope">${scopeItems.map(([value,name])=>`<option value="${value}" ${s.compareScope===value?'selected':''}>${name}</option>`).join('')}</select></label>${extras}</div>${studioMatrix(s)}<div class="comparison-footer"><p>${s.compareScope==='robots'?'Robot comparisons use shared simulation conditions. Physical deployment remains in the T1 environment comparison.':'The column layout stays fixed for direct visual comparison. “Not applicable” marks a stage without real deployment.'}</p></div><p class="provenance">T1 samples are not yet matched to these conditions. Final comparison recordings should use a common command, viewpoint, and playback rate where possible.</p></div></section>`;
}
export function collection(s){
 const r=robot(s.robot);
 return `<section class="page collection"><header class="page-heading"><div><span class="overline">Cross-embodiment study</span><h2>One collection. Every robot.</h2><p>Inspect whole-body policies, reference-motion transfer, and stair behaviour for each embodiment.</p></div><span class="label-value">MuJoCo · Isaac${s.robot==='t1'?' · Real T1':''}</span></header><nav class="robot-shelf" aria-label="Choose robot">${robots.map(item=>`<button class="robot-tile ${item.short.length>4?'long':''}" data-set="robot" data-value="${item.id}" aria-pressed="${s.robot===item.id}"><span class="robot-code">${item.short}</span><span class="maker">${item.maker}</span><span class="tile-dot" aria-hidden="true"></span></button>`).join('')}</nav><div class="collection-title"><div><h3>${r.name}</h3><p>${r.real?'Simulation and physical deployment':'Simulation footage in MuJoCo and Isaac'}</p></div><span class="platform-code">${r.short.length>4?'PAL':r.short}</span></div>${topicNav(s,'family')}<div class="experiment-heading"><div><h3>${s.topic==='locomotion'?(s.controller==='legged'?'Legged locomotion':'Whole-body policy'):s.topic==='reference'?'Source → retargeting → policy':'Terrain-aware ascent and descent'}</h3></div></div>${controllerControl(s)}${singleExperiment(s)}<p class="capability-note">${s.robot==='t1'?'T1 includes both legged arm configurations, a whole-body policy, reference-motion experiments, and terrain footage.':'This robot includes whole-body locomotion, reference-motion transfer, and both stair directions. No physical deployment footage.'}</p></section>`;
}
export function showcase(s){
 return `<section class="showcase"><header class="showcase-heading"><div><span class="overline">Selected research</span><h2>Humanoid locomotion & control.</h2><p>Controllers, motion transfer, and terrain behaviour. Open a study to explore the recordings and comparisons.</p></div><a class="quiet-link" href="${thesis}" target="_blank" rel="noopener">Full thesis project ${icon('arrow')}</a></header><article class="showcase-lead"><div class="lead-copy"><span class="overline">Booster T1</span><h3>From legged control to whole-body motion.</h3><p>Two arm configurations, a whole-body controller, and reference-motion experiments, across simulation and real deployment.</p><div class="lead-chips"><span>MuJoCo</span><span>Isaac</span><span>Real robot</span></div><button class="button primary" data-enter="locomotion">Explore the controllers ${icon('arrow')}</button></div><div class="lead-visual"><img src="../design-gallery/assets/wholebodyall.jpg" alt="Existing Booster T1 motion-study preview"><span class="sample-tag">T1 layout sample</span></div></article><div class="showcase-secondary"><article class="research-card"><div class="card-visual"><div class="robot-lineup">${robots.map(r=>`<span>${r.short}</span>`).join('')}</div></div><div class="card-copy"><span class="overline">Cross-embodiment study</span><h3>Across different humanoids.</h3><p>Whole-body policies, reference motion, and retargeting across seven robot morphologies.</p><div class="card-bottom"><span>MuJoCo · Isaac</span><button class="button" data-enter="robots">Explore robots ${icon('arrow')}</button></div></div></article><article class="research-card"><div class="card-visual"><div class="terrain-art" aria-hidden="true"><svg viewBox="0 0 360 110"><path d="M15 92h60V72h65V52h65V32h65V12h75M15 100h330"/><path class="accent-path" d="M35 70C56 43 82 42 107 50S154 26 175 31s48-23 73-18M215 83c-19-21-39-20-57-16s-44-19-61-13"/></svg></div><span class="art-label">Schematic preview</span></div><div class="card-copy"><span class="overline">Terrain-aware locomotion</span><h3>Ascent. Descent. Every robot.</h3><p>Inspect each stair direction and compare the behaviour in both simulators.</p><div class="card-bottom"><span>MuJoCo · Isaac</span><button class="button" data-enter="terrain">Explore terrain ${icon('arrow')}</button></div></div></article></div><footer class="showcase-footer"><p>The homepage gives a concise overview. Each viewer opens the full research collection.</p><button class="quiet-link" data-enter="reference" style="border:0;background:none;padding:0">Follow the reference-motion sequence ${icon('arrow')}</button></footer></section>`;
}

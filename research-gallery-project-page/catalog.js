/* Exact footage hierarchy supplied by Duarte. Files remain unassigned until matched. */
export const robots=[
 {id:'t1',name:'Booster T1',short:'T1',maker:'Booster',real:true},
 {id:'k1',name:'Booster K1',short:'K1',maker:'Booster',real:false},
 {id:'g1',name:'Unitree G1',short:'G1',maker:'Unitree',real:false},
 {id:'kangaroo',name:'PAL Kangaroo',short:'Kangaroo',maker:'PAL Robotics',real:false},
 {id:'gr3',name:'Fourier GR3',short:'GR3',maker:'Fourier',real:false},
 {id:'a3',name:'AgiBot A3',short:'A3',maker:'AgiBot',real:false},
 {id:'dr02',name:'Deep Robotics DR02',short:'DR02',maker:'Deep Robotics',real:false}
];
export const environments={mujoco:'MuJoCo',isaac:'Isaac',real:'Real robot'};
export const topics={locomotion:'Locomotion',reference:'Reference motion',terrain:'Stair locomotion'};
export const layouts=[
 {id:'guided',name:'Guided research',short:'Guided',description:'Lead with the research question. Keep robot and controller choices close to the footage.',use:'Recommended for the thesis page'},
 {id:'studio',name:'Comparison workspace',short:'Compare',description:'Keep the conditions aligned. Inspect configurations, simulators, and robots side by side.',use:'For detailed comparison'},
 {id:'collection',name:'Robot collection',short:'By robot',description:'Choose an embodiment first, then explore its locomotion, motion transfer, and terrain results.',use:'For the morphology study'},
 {id:'showcase',name:'Showcase + evidence viewer',short:'Showcase',description:'A compact research overview. Open each study to explore the full collection without leaving the page.',use:'Recommended for the homepage'}
];
export function initialState(){return {layout:'guided',topic:'locomotion',robot:'t1',controller:'legged',configuration:'rested',environment:'mujoco',retargetEnvironment:'mujoco',policyEnvironment:'mujoco',direction:'ascent',display:'focus',secondRobot:'g1',compareScope:'configurations',drawer:false};}
export function normalize(s){
 const allowed={layout:['guided','studio','collection','showcase'],controller:['legged','wholebody'],configuration:['rested','raised'],environment:['mujoco','isaac','real'],retargetEnvironment:['mujoco','isaac'],policyEnvironment:['mujoco','isaac','real'],direction:['ascent','descent'],display:['focus','compare'],compareScope:['configurations','environments','robots','directions']};
 for(const [key,values] of Object.entries(allowed))if(!values.includes(s[key]))s[key]=initialState()[key];
 if(!robots.some(r=>r.id===s.robot))s.robot='t1';
 if(!robots.some(r=>r.id===s.secondRobot))s.secondRobot='g1';
 if(!topics[s.topic])s.topic='locomotion';
 if(s.robot!=='t1'){s.controller='wholebody';if(s.environment==='real')s.environment='mujoco';if(s.policyEnvironment==='real')s.policyEnvironment='mujoco';}
 if(s.topic==='terrain'&&s.environment==='real')s.environment='mujoco';
 if(!['mujoco','isaac'].includes(s.retargetEnvironment))s.retargetEnvironment='mujoco';
 if(s.secondRobot===s.robot)s.secondRobot=robots.find(r=>r.id!==s.robot).id;
 if(s.layout==='studio'&&s.compareScope==='robots')s.controller='wholebody';
 if(s.compareScope==='configurations'&&(s.robot!=='t1'||s.controller!=='legged'||s.topic!=='locomotion'))s.compareScope='environments';
 if(s.topic==='terrain'&&!['directions','robots'].includes(s.compareScope))s.compareScope='directions';
 if(s.topic!=='terrain'&&s.compareScope==='directions')s.compareScope='environments';
 return s;
}
export function robot(id){return robots.find(r=>r.id===id);}
export function supportedEnvironments(s){return s.robot==='t1'&&s.topic!=='terrain'?['mujoco','isaac','real']:['mujoco','isaac'];}
export function configurationName(s){return s.controller==='legged'?(s.configuration==='raised'?'Raised arms':'Rested arms'):'Whole-body policy';}
export function titleFor(s){if(s.topic==='reference')return 'From reference motion to learned control.';if(s.topic==='terrain')return 'Stair ascent and descent.';return s.controller==='legged'?'Legged locomotion. Two configurations.':'Whole-body locomotion.';}
export function makeSlot(s,{stage,environment,robotId,configuration,direction}={}){
 const r=robotId||s.robot,env=environment||s.environment;
 let key,name,detail;
 if(s.topic==='reference'){
  stage=stage||'policy';
  if(stage==='source'){key=`${r}/reference/source`;name='Source motion';detail='Original motion recording';}
  else{key=`${r}/reference/${stage}/${env}`;name=stage==='retargeted'?'Retargeted motion':'Trained policy';detail=environments[env];}
 }else if(s.topic==='terrain'){
  const d=direction||s.direction;key=`${r}/terrain/${d}/${env}`;name=d==='ascent'?'Stair ascent':'Stair descent';detail=environments[env];stage='terrain';
 }else{
  const controller=r==='t1'?s.controller:'wholebody';
  const config=controller==='legged'?(configuration||s.configuration):'default';
  key=`${r}/locomotion/${controller}/${config}/${env}`;name=controller==='legged'?(config==='raised'?'Raised arms':'Rested arms'):'Whole-body policy';detail=environments[env];stage='policy';
 }
 return {key,robot:r,environment:stage==='source'?null:env,stage,name,detail};
}
/* Key -> {src, poster}. Intentionally no guessed simulator/configuration mappings. */
export const mediaManifest={};
export function mediaFor(slot){
 if(mediaManifest[slot.key])return {...mediaManifest[slot.key],sample:false};
 if(slot.robot==='t1'&&slot.stage==='policy'){
  const file=slot.environment==='real'?'real_t1':'wholebodyall';
  return {src:`../images/research/${file}.mp4`,poster:`../design-gallery/assets/${file}.jpg`,sample:true};
 }
 return null;
}
export function allSlots(){
 const entries=[];
 for(const r of robots){
  const s={...initialState(),robot:r.id,controller:'wholebody'};
  for(const env of supportedEnvironments(s))entries.push(makeSlot(s,{environment:env}));
  if(r.id==='t1')for(const configuration of ['rested','raised'])for(const environment of ['mujoco','isaac','real'])entries.push(makeSlot({...s,controller:'legged'},{configuration,environment}));
  s.topic='reference';entries.push(makeSlot(s,{stage:'source'}));
  for(const environment of ['mujoco','isaac'])entries.push(makeSlot(s,{stage:'retargeted',environment}));
  for(const environment of supportedEnvironments(s))entries.push(makeSlot(s,{stage:'policy',environment}));
  s.topic='terrain';for(const direction of ['ascent','descent'])for(const environment of ['mujoco','isaac'])entries.push(makeSlot(s,{direction,environment}));
 }
 return entries;
}

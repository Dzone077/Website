"""Generate the focused research/project styling comparison, no dependencies."""
from pathlib import Path
from html import escape

ROOT=Path(__file__).resolve().parent
PROJECT='https://dzone077.github.io/Project-Page/#locomotion'
ICONS={
 'arrow':'<path d="M7 17L17 7M7 7h10v10"/>',
 'right':'<path d="M5 12h14m-5-5 5 5-5 5"/>',
 'chevron':'<path d="m9 6 6 6-6 6"/>',
 'left':'<path d="m15 6-6 6 6 6"/>',
 'play':'<path d="m9 5 10 7-10 7Z"/>',
 'pause':'<path d="M9 5v14M15 5v14"/>',
 'expand':'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 'sound':'<path d="M11 4 6 8H3v8h3l5 4Zm4 4c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
 'mute':'<path d="M11 4 6 8H3v8h3l5 4ZM16 9l5 6m0-6-5 6"/>',
 'robot':'<rect x="5" y="7" width="14" height="12" rx="4"/><path d="M12 7V3m-3 9h.01M15 12h.01M9 16h6M2 11v4m20-4v4"/>',
 'motion':'<path d="M4 18c3-12 6-12 9-4s5 3 7-7M4 6h4M2 10h3"/>',
 'layers':'<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
 'walk':'<circle cx="14" cy="4" r="2"/><path d="m10 22 2-7-3-4m-5 1 5-4 4 1 3 4h4m-7-4-1 6 6 6"/>',
 'file':'<path d="M13 3H5v18h14V9Zm0 0v6h6M8 13h8M8 17h5"/>',
 'phone':'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 'monitor':'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4M8 21h8"/>',
 'plus':'<path d="M12 5v14M5 12h14"/>',
 'close':'<path d="m6 6 12 12M18 6 6 18"/>',
 'check':'<path d="m5 12 4 4L19 6"/>',
 'github':'<path d="M9 19c-5 2-5-3-7-3m14 6v-4c0-1-.3-2-1-2.5 3-.4 6-1.5 6-6.5 0-1.5-.5-2.5-1.5-3.5.2-1 .2-2-.2-3-1.3 0-2.6.6-3.8 1.4a13 13 0 0 0-7 0C7.3 3.6 6 3 4.7 3c-.4 1-.4 2-.2 3C3.5 7 3 8 3 9.5c0 5 3 6.1 6 6.5-.7.5-1 1.5-1 2.5V22"/>',
}
def icon(name):return f'<svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>'
MODES=[('Legged','rested','Legged locomotion','Legged control in simulation.','walk'),('Whole body','wholebody','Whole-body locomotion','Whole-body control in simulation.','robot'),('Motion study','wholebodyall','Whole-body motion study','Comparing whole-body motion in simulation.','motion'),('Real robot','real_t1','Physical Booster T1','Locomotion deployed on the physical T1.','layers')]
def actions():
 return f'<div class="actions"><a class="pill primary" href="{PROJECT}" target="_blank" rel="noopener">{icon("file")}Project page</a><a class="pill" href="../images/research/real_t1.mp4" target="_blank" rel="noopener">{icon("play")}Real robot</a></div>'

def player(clip='wholebodyall',compact=False,label='Simulation'):
 return f'''<div class="player" data-player data-compact="{str(compact).lower()}" data-playing="false"><video controls muted playsinline loop preload="none" poster="assets/{clip}.jpg" data-source="../images/research/{clip}.mp4" aria-label="{escape(label)} robot demonstration"></video><span class="poster-label"><i></i><span data-player-label>{label}</span></span><button class="player-button" data-play aria-label="Play demonstration">{icon('play')}</button><div class="player-controls"><button data-play aria-label="Play demonstration">{icon('play')}</button><span class="time" data-time>0:00</span><input type="range" min="0" max="100" step="0.1" value="0" aria-label="Video progress"><button data-mute aria-label="Unmute demonstration">{icon('mute')}</button><button data-fullscreen aria-label="View fullscreen">{icon('expand')}</button></div><p class="player-error" hidden>Video could not load. <a href="../images/research/{clip}.mp4">Open the video directly ↗</a></p></div>'''

def switch(kind='',demo=False):
 modes=MODES[:3] if demo else MODES
 return f'<div class="switch {kind}" role="group" aria-label="Choose a demonstration"><span class="indicator" aria-hidden="true"></span>'+''.join(f'<button {"data-demo-tab" if demo else "data-mode"}="{i}" aria-pressed="{str(i==2).lower()}">{icon(ic)}{label}</button>' for i,(label,_,_,_,ic) in enumerate(modes))+'</div>'

def title(text='Learning-based humanoid locomotion',buttons=True):
 return f'<div class="title-row"><div><span class="eyebrow">Master’s thesis</span><h3 class="research-title">{text}</h3><p class="research-copy">Legged and whole-body control, from simulation to the physical Booster T1.</p></div>{actions() if buttons else ""}</div>'

def caption():
 return f'<div class="caption-row"><p class="caption" data-caption>Whole-body motion study · Simulation</p><a class="subtle-link" href="{PROJECT}" target="_blank" rel="noopener">Explore the research {icon("arrow")}</a></div>'

def research(style):
 if style=='floating':
  body=title(buttons=False)+switch('centered')+f'<div class="media-rim">{player()}</div>'+caption()
 elif style=='side-panel':
  choices=''.join(f'<button class="side-choice" data-mode="{i}" aria-pressed="{str(i==2).lower()}"><span class="choice-icon">{icon(ic)}</span><span><strong>{name}</strong><small>{"Physical deployment" if i==3 else "Simulation"}</small></span><i class="selected-dot" aria-hidden="true"></i></button>' for i,(name,_,_,_,ic) in enumerate(MODES))
  body=f'<div><span class="eyebrow">Master’s thesis</span><h3 class="research-title">Learning-based humanoid locomotion</h3><p class="research-copy">Explore the controllers and their deployment on T1.</p><div class="side-choices" role="group" aria-label="Choose a controller">{choices}</div><a class="pill primary" href="{PROJECT}" target="_blank" rel="noopener">Project page {icon("arrow")}</a></div><div>{player()}<p class="caption" data-caption>Whole-body motion study · Simulation</p></div>'
 elif style=='comparison':
  body=title('Simulation and the real robot',False)+f'<div class="compare-grid"><figure class="compare-tile">{player("wholebodyall",True,"Simulation")}<figcaption><strong>Whole-body motion</strong><span>Simulation</span></figcaption></figure><figure class="compare-tile accent-tile">{player("real_t1",True,"Physical T1")}<figcaption><strong>Physical deployment</strong><span>Booster T1</span></figcaption></figure></div><div class="compare-footer"><p class="caption">Independent recordings. Play together to compare the movement.</p><button class="pill primary" data-compare aria-pressed="false">{icon("play")}<span>Play both</span></button></div>'
 elif style=='filmstrip':
  thumbs=''.join(f'<button class="thumb-button" data-mode="{i}" aria-pressed="{str(i==2).lower()}"><img src="assets/{file}.jpg" alt="{name} preview" loading="lazy"><span>{name}{icon("check")}</span></button>' for i,(name,file,*_) in enumerate(MODES))
  body=title(buttons=False)+f'<div class="main-display">{player()}</div><div class="thumb-strip" role="group" aria-label="Choose video">{thumbs}</div>'+caption()
 elif style=='bento':
  body=f'<div class="title-row"><div><h3 class="research-title">Research</h3><p class="research-copy">Humanoid locomotion, control, and autonomous service robots.</p></div></div><div class="bento-grid"><article class="bento-card main-study"><div class="bento-copy"><span class="eyebrow">Master’s thesis</span><h3>Humanoid locomotion</h3><p>Learning-based whole-body control.</p></div>{player()}<div class="bento-bottom"><small>Whole-body motion study</small><a class="subtle-link" href="{PROJECT}" target="_blank" rel="noopener">Project {icon("arrow")}</a></div></article><article class="bento-card supporting-study tinted"><div><span class="eyebrow">Physical deployment</span><h3>On the real T1.</h3><p>From simulation to hardware.</p><a class="subtle-link" href="../images/research/real_t1.mp4" target="_blank" rel="noopener">Watch {icon("arrow")}</a></div><img src="assets/real_t1.jpg" alt="Physical Booster T1" loading="lazy"></article><article class="bento-card supporting-study"><div><span class="eyebrow">FOMO-HODOR</span><h3>Humanoid service robotics</h3><p>Joint Lisbon–Austin research.</p><a class="subtle-link" href="https://irsgroup.isr.tecnico.ulisboa.pt/fomo-hodor/" target="_blank" rel="noopener">Project {icon("arrow")}</a></div><img src="assets/receptionist-web.jpg" alt="Service robot demonstration" loading="lazy"></article></div>'
 else:
  entries=''.join(f'<details data-accordion-mode="{i}" {"open" if i==2 else ""}><summary>{name}{icon("plus")}</summary><p>{desc}</p><a class="subtle-link" href="{PROJECT}" target="_blank" rel="noopener">View thesis section {icon("arrow")}</a></details>' for i,(name,_,_,desc,_) in enumerate(MODES))
  body=f'<div><span class="eyebrow">Master’s thesis</span><h3 class="research-title">One study.<br>Different ways of moving.</h3><p class="research-copy">Choose a controller to see its demonstration.</p><div class="study-accordion">{entries}</div></div><div>{player()}<p class="caption" data-caption>Whole-body motion study · Simulation</p></div>'
 return f'<div class="research {style}" data-viewer>{body}</div>'

PROJECTS=[('TurtleBot SLAM','Mapping & estimation','SLAM and autonomous mapping on a TurtleBot.','fastslam.jpg','Video available'),('TIAGo manipulation','Planning & manipulation','Manipulation with TIAGo Steel in Gazebo.','manipulation.svg','Course project'),('RRT motion planning','Motion planning','Sampling-based, collision-free path planning.','planning.svg','Course project')]
def project_media(i):
 name,_,_,file,_=PROJECTS[i]
 return f'<div class="project-media"><img src="assets/{file}" alt="{name+ (" illustrative preview" if i else " demonstration")}" loading="lazy">'+('<span class="illustration">Illustrative preview</span>' if i else '')+'</div>'

def project_card(i,row=False):
 name,category,desc,_,status=PROJECTS[i]
 copy=f'<div class="project-copy"><span class="project-category">{category}</span><h3>{name}</h3><p>{desc}</p>'
 button=f'<button class="round" data-project="{i}" aria-label="Open {name}">{icon("arrow")}</button>'
 if row:return f'<article class="project-row">{project_media(i)}{copy}</div>{button}</article>'
 return f'<article class="project-card">{project_media(i)}{copy}<div class="project-foot"><span>{status}</span>{button}</div></div></article>'

def projects(style):
 arrows=f'<div class="scroll-controls"><button class="round" data-scroll="-1" aria-label="Previous projects">{icon("left")}</button><button class="round" data-scroll="1" aria-label="Next projects">{icon("chevron")}</button></div>' if style=='horizontal' else ''
 header=f'<div class="title-row"><div><h3 class="projects-title">Selected projects</h3><p class="projects-description">Earlier work in mapping, manipulation, and motion planning.</p></div>{arrows}</div>'
 return header+f'<div class="projects {style}">'+''.join(project_card(i,style=='rows') for i in range(3))+'</div><p class="project-note">TurtleBot footage is from your project. The manipulation and RRT illustrations are placeholders for your own results.</p>'

def controls(style):
 return f'<div class="title-row"><div><h3 class="research-title">Buttons & selection</h3><p class="research-copy">The same actions, with a different balance of fill, outline, and emphasis.</p></div></div><div class="controls-demo {style}"><div class="control-row"><div class="control-label">Project links<small>Primary and secondary action</small></div>{actions()}</div><div class="control-row"><div class="control-label">Video selector<small>Click to try the selected state</small></div>{switch(demo=True)}</div><div class="control-row"><div class="control-label">Secondary links<small>For the details beneath a video</small></div><div class="actions"><a class="subtle-link" href="{PROJECT}" target="_blank" rel="noopener">View thesis section {icon("arrow")}</a><a class="pill neutral" href="https://github.com/Dzone077" target="_blank" rel="noopener">{icon("github")}GitHub</a></div></div><p class="control-sample-note" data-demo-caption>Motion study selected.</p></div>'

def context():
 return '<div class="context"><section class="context-section"><h2 class="section-heading">Research</h2>'+research('floating')+f'<article class="service-feature"><img src="assets/receptionist-web.jpg" alt="FOMO-HODOR service robot demonstration" loading="lazy"><div><span class="eyebrow">ISR-Lisboa × UT Austin</span><h3>Humanoid domestic robotics</h3><p>Navigation, manipulation, and interaction for autonomous service tasks.</p><a class="subtle-link" href="https://irsgroup.isr.tecnico.ulisboa.pt/fomo-hodor/" target="_blank" rel="noopener">FOMO-HODOR {icon("arrow")}</a></div></article></section><section class="context-section">'+projects('cards')+'</section></div>'

STUDIES=[
 ('research','R1','Floating switch','A separate capsule selector and a softly framed video. Closest to the reference’s architecture module.','floating'),
 ('research','R2','Side selector','Descriptions and modes sit beside the video, keeping the visual in one stable window.','side-panel'),
 ('research','R3','Paired comparison','Two equally sized recordings; a faint accent frame distinguishes the real robot.','comparison'),
 ('research','R4','Visual filmstrip','Thumbnail selectors make the available demonstrations visible before you click.','filmstrip'),
 ('research','R5','Featured grid','One large research window with two compact supporting studies.','bento'),
 ('research','R6','Expandable study','A compact list reveals the explanation and updates the adjacent video.','accordion-layout'),
 ('projects','P1','Equal cards','Consistent image proportions, quiet captions, and a small circular detail button.','cards'),
 ('projects','P2','Featured + compact','A larger lead project paired with two compact horizontal entries.','featured'),
 ('projects','P3','Scrollable gallery','Wide project cards with a visible next item, scroll snapping, and arrow controls.','horizontal'),
 ('projects','P4','Compact rows','Small visual previews, aligned text, and clear detail actions.','rows'),
 ('controls','B1','Filled + outline','Reference-inspired capsule buttons and a sliding accent selection.','filled'),
 ('controls','B2','Quiet outlines','A fine outline for the primary action and a tinted selected tab.','outlined'),
 ('controls','B3','Neutral segments','A charcoal primary button and a white selected segment on a soft grey track.','monochrome'),
 ('controls','B4','Text + underline','A softly tinted action with a minimal moving underline for navigation.','understated'),
 ('context','C1','Research + selected projects','Floating research selector, a compact service-robot entry, and equal project cards together.','context'),
]
previews=[]
for category,id,name,note,style in STUDIES:
 fn={'research':research,'projects':projects,'controls':controls}.get(category)
 body=fn(style) if fn else context()
 previews.append(f'<section class="preview" id="{id}" data-category="{category}" data-name="{name}" data-note="{escape(note,quote=True)}" {"" if id=="R1" else "hidden"}>{body}</section>')
nav=''.join(f'<button data-category="{key}" aria-pressed="{str(i==0).lower()}">{label}</button>' for i,(key,label) in enumerate([('research','Research'),('projects','Selected projects'),('controls','Buttons & tabs'),('context','Together')]))
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research & projects — styling studies</title><link rel="stylesheet" href="focused.css"><script src="focused.js" defer></script></head><body><header class="app-header"><div class="app-top"><span class="app-brand">Duarte Santos · Styling studies</span><a class="reference" href="https://inessousa11.github.io/person-reid-website/" target="_blank" rel="noopener">Design reference {icon('arrow')}</a></div><h1>Research & selected projects.</h1><p>Clean media windows, useful selectors, and a consistent layout. Compare the examples below, then see a combination in “Together”.</p></header><div class="nav-shell"><div class="nav-bar"><nav class="categories" aria-label="Example categories">{nav}</nav><div class="utilities"><button class="utility" id="accent-toggle" aria-pressed="false">Neutral accent</button><button class="utility" id="phone-toggle" aria-pressed="false">{icon('phone')}<span>Phone width</span></button></div></div></div><main class="app-main"><div class="variant-nav" id="variants" role="group" aria-label="Choose layout"></div><div class="preview-meta"><div><h2 id="preview-name">Floating switch</h2><p id="preview-note">A separate capsule selector and a softly framed video.</p></div><span class="preview-id" id="preview-id">R1</span></div><div class="stage" id="stage">{''.join(previews)}</div><footer class="app-foot"><span>Try the selectors, play the footage, and open project details.</span><a href="../index.html">Current homepage {icon('arrow')}</a></footer></main><dialog class="detail-dialog" id="project-dialog"><div class="dialog-top"><h2 id="dialog-title">Project</h2><button class="round" id="close-dialog" aria-label="Close project details">{icon('close')}</button></div><div class="dialog-body" id="dialog-body"></div></dialog><noscript><style>.preview[hidden]{{display:block!important}}.variant-nav,.utilities{{display:none}}</style></noscript></body></html>'''
(ROOT/'index.html').write_text(html)
print(f'Built focused gallery: {len(STUDIES)} views (6 research, 4 projects, 4 control families, 1 combined section).')

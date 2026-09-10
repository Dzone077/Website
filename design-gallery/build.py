"""Build the static, dependency-free design gallery. Run from any directory."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent
PROJECT = 'https://dzone077.github.io/Project-Page/#locomotion'
BIO = "I work on humanoid locomotion, robot learning, and control at ISR-Lisboa. I am a Master's student in Electrical and Computer Engineering at Instituto Superior Técnico."
CLIPS = [('Legged', 'rested', 'Legged locomotion · simulation'), ('Whole body', 'wholebody', 'Whole-body locomotion · simulation'), ('Study', 'wholebodyall', 'Whole-body study · simulation'), ('Real T1', 'real_t1', 'Booster T1 · physical robot')]

def portrait():
    return '<img class="portrait" src="../images/DuarteSantos.jpg" alt="Duarte Santos" loading="lazy">'

def links(buttons=False):
    c = ' class="btn primary"' if buttons else ''
    return f'<div class="linkrow"><a{c} href="mailto:duartefariasantos@gmail.com">Email ↗</a><a href="../data/Duarte-CV.pdf" target="_blank" rel="noopener">CV</a><a href="https://github.com/Dzone077" target="_blank" rel="noopener">GitHub</a><a href="https://www.linkedin.com/in/duarte-santos-9a1386272/" target="_blank" rel="noopener">LinkedIn</a></div>'

def video(clip='rested', label=None):
    return f'<div class="media"><video class="demo-video" controls muted loop playsinline preload="none" poster="assets/{clip}.jpg" src="../images/research/{clip}.mp4" aria-label="{escape(label or clip)}"></video>{f"<span class=media-label>{label}</span>" if label else ""}</div>'

def tabs():
    return '<div class="tabs" role="group" aria-label="Choose locomotion demonstration">'+''.join(f'<button type="button" data-clip="{file}" data-caption="{caption}" aria-pressed="{str(i==0).lower()}">{name}</button>' for i,(name,file,caption) in enumerate(CLIPS))+'</div>'

def hero(style):
    intro=f'<div class="micro">Duarte Santos / Robotics research</div><h1>Duarte Santos</h1><p class="bio">{BIO}</p>{links()}'
    if style=='split':
        content=f'<div>{intro}</div>{portrait()}'
    elif style=='masthead':
        content=f'<div class="topline micro"><span>Lisbon, Portugal</span><span>Robotics / ISR-Lisboa</span></div><h1>Duarte Santos.</h1><div class="bio-grid"><div><p class="bio">{BIO}</p>{links()}</div>{portrait()}</div>'
    elif style=='centered':
        content=portrait()+intro
    elif style=='dossier':
        content=f'<aside class="dossier-left">{portrait()}<div class="micro">Researcher<br>ISR-Lisboa<br>Lisbon, PT</div></aside><div class="dossier-main">{intro}</div>'
    elif style=='typehero':
        content=f'<div class="micro">Humanoid robotics · Learning · Control</div><h1>Duarte<span>Santos.</span></h1><p class="bio">{BIO}</p>{links(True)}'
    elif style=='margin-note':
        content=f'<aside class="margin-label micro">Personal research notebook</aside><div>{portrait()}<div class="micro">Instituto Superior Técnico</div><h1>Duarte<br>Santos</h1><p class="bio">{BIO}</p>{links()}</div>'
    elif style=='workspace':
        content=f'<div class="worktop micro"><span>DS / research workspace</span><span>Lisbon, PT</span></div><div class="bio-grid"><div><h1>Duarte Santos</h1><p class="bio">{BIO}</p></div>{portrait()}</div>{links()}'
    else:
        content=f'<div class="micro">Robotics, in motion</div><h1>Duarte Santos</h1><p class="bio">{BIO}</p>{links()}<div class="strip">{portrait()}<img src="assets/real_t1.jpg" alt="Physical Booster T1" loading="lazy"><img src="assets/receptionist-web.jpg" alt="Service robot demonstration" loading="lazy"></div>'
    return f'<section class="hero pad {style}">{content}</section>'

def research(style):
    head='<div class="research-head"><div class="micro">M.Sc. thesis / Humanoid locomotion</div><h3 class="research-title">Learning to move,<br>from simulation to T1.</h3><p class="research-desc">Legged and whole-body control, with validation on the physical Booster T1.</p></div>'
    caption='<p class="video-caption" data-caption>Legged locomotion · simulation</p>'
    if style=='comparison':
        body=head+'<div class="comparison-grid"><figure>'+video('wholebody','01 / Simulation')+'<figcaption><span>Whole-body controller</span><span>Simulation</span></figcaption></figure><figure>'+video('real_t1','02 / Real robot')+'<figcaption><span>Physical Booster T1</span><span>Real robot</span></figcaption></figure></div><div class="compare-actions"><button class="btn" data-compare aria-pressed="false">Play both ↗</button><small>Independent recordings; playback starts together.</small></div>'
    elif style=='chapter':
        body=f'<div><div class="chapter-no">01.</div>{head}{tabs()}<div class="linkrow"><a href="{PROJECT}" target="_blank" rel="noopener">Read the project ↗</a></div></div><div>{video()}{caption}</div>'
    elif style=='contact-sheet':
        sheet=''.join(f'<button data-clip="{file}" data-caption="{cap}" aria-pressed="{str(i==0).lower()}"><img src="assets/{file}.jpg" alt="{cap}" loading="lazy"><span>0{i+1} / {name}</span></button>' for i,(name,file,cap) in enumerate(CLIPS))
        body=head+f'<div class="sheet">{sheet}</div><div class="sheet-preview">{video()}</div>'+caption
    elif style=='rail':
        body=head+tabs()+video()+caption
    else:
        body=head+('<div style="height:20px"></div>' if style not in ['floating','cinema'] else '')+video()+tabs()+caption
    return f'<article class="research {style}" data-viewer>{body}</article>'

PROJECTS=[('TurtleBot SLAM','Mapping & estimation','assets/fastslam.jpg','TurtleBot mapping demonstration'),('TIAGo manipulation','Planning & manipulation','assets/manipulation.svg','Illustrative manipulation diagram; not project footage'),('RRT motion planning','Sampling-based planning','assets/planning.svg','Illustrative RRT diagram; not project output')]
def projects(style):
    items=[]
    for i,(name,desc,src,alt) in enumerate(PROJECTS):
        img=f'<img src="{src}" alt="{alt}" loading="lazy">'
        copy=f'<div><div class="micro">0{i+1} / Selected project</div><h3>{name}</h3><p>{desc}</p></div>'
        if style=='accordion':
            items.append(f'<details {"open" if i==0 else ""}><summary>{name}</summary><div class="accordion-content">{img}<p>{desc}. '+('Video from the project.' if i==0 else 'Illustrative preview pending project footage.')+'</p></div></details>')
        elif style=='index':
            items.append(f'<article class="project-unit"><span class="project-number">0{i+1}</span>{img}{copy}<span class="index-arrow" aria-hidden="true">↗</span></article>')
        else:
            items.append(f'<article class="project-unit">{img}{copy}</article>')
    return f'<div class="projects {style}">'+''.join(items)+'</div>'

EXPERIENCE=[('2025 — present','Humanoid locomotion research','ISR-Lisboa · Instituto Superior Técnico','Learning-based locomotion and whole-body control for humanoid robots.','isr_logo.jpeg'),('2025 — present','FOMO-HODOR','ISR-Lisboa × UT Austin','Humanoid domestic robotics and autonomous task execution.','University_of_Texas_at_Austin_seal.svg.png'),('2025 — present','SocRob@Home','ISR-Lisboa','Navigation, manipulation, and interaction on service robots.','socrob_home_logo.png')]
def experience(style):
    items=[]
    for date,title,org,desc,logo in EXPERIENCE:
        content=f'<div><h3>{title}</h3><div class="org">{org}</div><p>{desc}</p></div>'
        if style=='logos':
            content=f'<img src="../images/{logo}" alt="" loading="lazy"><div><time>{date}</time>{content}</div>'
        else: content=f'<time>{date}</time>'+content
        items.append('<article class="entry">'+content+'</article>')
    return f'<div class="experience {style}">'+''.join(items)+'</div>'

EDUCATION=[('IST','M.Sc. Electrical & Computer Engineering','2023 — expected 2026','Instituto Superior Técnico · Lisbon'),('KTH','Exchange studies','2024 — 2025','Systems, Control and Robotics · Stockholm'),('IST','B.Sc. Electrical & Computer Engineering','2020 — 2023','Instituto Superior Técnico · Lisbon')]
def education(style):
    return f'<div class="education {style}">'+''.join(f'<article class="entry"><div class="school">{school}</div><div><time>{date}</time><h3>{degree}</h3><p>{detail}</p></div></article>' for school,degree,date,detail in EDUCATION)+'</div>'

ACTIVITIES=[('Teamwork','SocRob@Home','Service-robot development and RoboCup@Home preparation.'),('Collaboration','LisTex United','Joint Lisbon–Austin work on humanoid domestic robots.'),('Mentoring','Humanoid simulation','Technical guidance on a student research internship.'),('Integration','euROBIN preparation','Contributions to manipulation and systems-integration hackathons.')]
def activities(style):
    items=[]
    for i,(tag,title,desc) in enumerate(ACTIVITIES):
        lead=f'<span class="activity-icon" aria-hidden="true">{["↗","⇄","+","⌘"][i]}</span>' if style=='chips' else f'<div class="micro">{tag}</div>'
        items.append(f'<article class="activity-entry">{lead}<div><h3>{title}</h3><p>{desc}</p></div></article>')
    return f'<div class="activities {style}">'+''.join(items)+'</div>'

def distinctions(style):
    return f'<div class="distinctions {style}"><div class="distinction"><strong>18.3 / 20</strong><span>M.Sc. GPA · Instituto Superior Técnico</span></div><div class="distinction"><strong>Grade A</strong><span>Maximum grade · KTH exchange</span></div></div>'

def heading(style):
    if style=='numbered': content='<span class="big-no">02</span><div><div class="micro">Selected work</div><h2>Research</h2></div>'
    elif style=='side-label': content='<div class="micro">Index / 02</div><div><h2>Research</h2><p class="subcopy">Humanoid locomotion & robot learning</p></div>'
    elif style=='centered': content='<div class="micro">Selected investigations</div><h2>Research</h2><p class="subcopy" style="margin:10px auto 0">Humanoid locomotion & robot learning</p>'
    else: content='<h2>Research</h2><span class="micro">Selected work / 02</span>' if style in ['ruled','block'] else '<h2>Research</h2>'
    return f'<div class="heading-demo {style}">{content}</div>'

def nav(style):
    return f'<nav class="nav-demo {style}" aria-label="Example site navigation"><a href="swiss.html">DS.</a><a href="swiss.html#research">Research</a><a href="swiss.html#projects">Projects</a><a href="swiss.html#experience">About</a><a href="../data/Duarte-CV.pdf">CV ↗</a></nav>'

def buttons(style):
    btns=f'<div class="linkrow"><a class="btn primary" href="{PROJECT}" target="_blank" rel="noopener">Project page <span aria-hidden="true">↗</span></a><a class="btn" href="../data/Duarte-CV.pdf" target="_blank" rel="noopener">Read CV <span aria-hidden="true">↓</span></a></div>'
    ts='<div class="tabs" role="group" aria-label="Example tab styling">'+''.join(f'<button aria-pressed="{str(i==0).lower()}">{name}</button>' for i,name in enumerate(['Legged','Whole body','Real robot']))+'</div>'
    return f'<div class="button-demo {style}">{btns}{ts}</div>'

def footer(style):
    if style=='colophon': content='<div><div class="micro">Duarte Santos</div><p>Robotics research · Lisbon, Portugal</p></div>'+links()
    elif style=='invitation': content='<div class="micro">Contact</div><h2>Let’s talk robotics.</h2><p>For research questions and collaboration.</p><a href="mailto:duartefariasantos@gmail.com">duartefariasantos@gmail.com ↗</a>'
    elif style=='split': content='<div><div class="micro">Get in touch</div><h2>Duarte Santos</h2><p>ISR-Lisboa · Instituto Superior Técnico</p></div>'+links(True)
    else: content='<div class="monogram">DS</div><div class="micro">Duarte Santos / Lisbon</div>'+links()
    return f'<footer class="footer-demo {style}">{content}</footer>'

DIRECTIONS=[
 ('swiss','Swiss research journal','Strong typography, vermilion accents, open research panels, and ruled date columns.','masthead','open','index','ledger','ruled','bulletin','lines','colophon',['#faf9f5','#22221f','#c4482c']),
 ('botanical','Quiet botanical','Soft green, a personal portrait, rounded research frames, and a fine experience timeline.','split','soft','triptych','timeline','paired','notes','tiles','invitation',['#fbfcf8','#3f613d','#d9e1d2']),
 ('blueprint','Robotics blueprint','A gridded introduction, instrument-like viewer, numbered controls, and crisp information rows.','dossier','rail','accordion','ledger','ruled','chips','lines','split',['#f5f9fe','#165ea3','#123756']),
 ('paper','Field notebook','Warm paper, serif typography, chapter-style research, and dates set into the margins.','margin-note','chapter','catalogue','margin','transcript','margin','footnotes','stamp',['#faf5e9','#846344','#362e26']),
 ('night','After-hours laboratory','Deep green-charcoal, pale mint controls, large cinema windows, and compact research notes.','workspace','cinema','mosaic','cards','paired','chips','band','split',['#17231f','#afe0c4','#3a4c40']),
 ('gallery','Motion gallery','Centered identity, generous white space, paired demonstrations, and an image-led project strip.','centered','comparison','filmstrip','logos','route','bulletin','lines','colophon',['#ffffff','#545179','#e3dfe8']),
 ('cobalt','Cobalt studio','Oversized name, saturated blue, floating media controls, and an asymmetric project grid.','typehero','floating','mosaic','cards','paired','notes','tiles','invitation',['#ffffff','#294ce1','#edf1ff']),
 ('archive','Robotics archive','A photographic introduction, a research contact sheet, catalogue rows, and understated annotations.','photo-strip','contact-sheet','catalogue','margin','transcript','margin','footnotes','stamp',['#f4f2ef','#744a49','#d5ceca'])
]

def section(title,body,id,sub=''):
    return f'<section class="full-section" id="{id}"><div class="sectiontitle"><h2>{title}</h2><small>{sub}</small></div>{body}</section>'

def complete(d):
    theme,name,desc,hs,rs,ps,es,eds,acs,ds,fs,_=d
    navigation='<nav class="page-nav" aria-label="Main navigation"><a href="#top">Duarte Santos</a><a href="#research">Research</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a href="../data/Duarte-CV.pdf">CV ↗</a></nav>'
    service='<article class="service-row"><img src="assets/receptionist-web.jpg" alt="Humanoid service-robot demonstration" loading="lazy"><div><div class="micro">FOMO-HODOR / ISR-Lisboa × UT Austin</div><h3>Humanoid domestic robotics</h3><p>Navigation, manipulation, and interaction for autonomous service tasks.</p><div class="linkrow"><a href="https://irsgroup.isr.tecnico.ulisboa.pt/fomo-hodor/" target="_blank" rel="noopener">Project website ↗</a><a href="../images/research/receptionist-web.mp4" target="_blank" rel="noopener">Watch demonstration ↗</a></div></div></article>'
    content=navigation+hero(hs)+section('Research',research(rs)+service,'research','Locomotion / Control / Robot learning')+section('Selected projects',projects(ps),'projects','Mapping, manipulation, planning')+section('Experience',experience(es),'experience')+section('Education',education(eds),'education')+'<div class="two-sections">'+section('Academic activities',activities(acs),'activities')+section('Distinctions',distinctions(ds),'distinctions')+'</div><div id="contact">'+footer(fs)+'</div>'
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{name} — Duarte Santos</title><link rel="stylesheet" href="designs.css"><script src="interactions.js" defer></script></head><body class="fullpage"><div class="specimen {theme}" id="top"><a class="back-gallery" href="index.html">← Design gallery · {name}</a><main class="page-shell">{content}</main></div></body></html>'

CARDS=[]
def add(category,id,name,note,theme,body):
    CARDS.append(f'<article class="study-card" id="{id}" data-category="{category}" data-name="{escape(name,quote=True)}"><div class="study-head"><div><h3 class="study-name"><code>{id}</code>{name}</h3><p class="study-note">{note}</p></div><button class="save" aria-label="Save {escape(name,quote=True)}" aria-pressed="false">☆</button></div><div class="study-frame"><div class="specimen {theme}"><div class="component-wrap">{body}</div></div></div></article>')

for i,d in enumerate(DIRECTIONS):
    theme,name,note,*_=d
    (ROOT/(theme+'.html')).write_text(complete(d))
    swatches=''.join(f'<i style="background:{color}"></i>' for color in d[-1])
    CARDS.append(f'<article class="study-card" id="D{i+1:02}" data-category="directions" data-name="{name}"><div class="study-head"><div><h3 class="study-name"><code>D{i+1:02}</code>{name}</h3><p class="study-note">{note}</p></div><button class="save" aria-label="Save {name}" aria-pressed="false">☆</button></div><div class="study-frame"><div class="preview-browser"><span class="browser-dots"><i></i><i></i><i></i></span><span>duarte santos / {theme}</span><a href="{theme}.html" target="_blank" rel="noopener">Open ↗</a></div><div class="direction-preview"><iframe src="{theme}.html" title="{name} complete page preview" loading="lazy"></iframe></div></div><div class="direction-links"><a href="{theme}.html" target="_blank" rel="noopener">Open complete page ↗</a><a href="{theme}.html#research" target="_blank" rel="noopener">Research section ↗</a><span class="swatches" aria-hidden="true">{swatches}</span></div></article>')

INTRO=[('masthead','Newspaper masthead','Large name, small portrait, a strong horizontal rule.','swiss'),('split','Portrait & short introduction','Balanced split with a soft rectangular portrait.','botanical'),('centered','Centered identity','A small circular portrait and generous breathing room.','gallery'),('dossier','Research dossier','A narrow identity rail beside the introduction.','blueprint'),('typehero','Typographic signature','Your name becomes the composition; cobalt adds one decisive accent.','cobalt'),('margin-note','Notebook margin','A rotated margin label, small portrait, and serif text.','paper'),('workspace','Research workspace','Monospace metadata and a compact framed portrait.','night'),('photo-strip','Photographic introduction','A strip of portrait and actual robot imagery sets the tone.','archive')]
for i,(style,name,note,theme) in enumerate(INTRO):add('introductions',f'I{i+1:02}',name,note,theme,hero(style))
RESEARCH=[('open','Open figure','Underlined tabs and no outer card. Closest to a research publication.','swiss'),('soft','Inset segmented viewer','Soft corners and a raised active tab inside a tinted track.','botanical'),('rail','Instrument panel','Vertical mode selection and a tightly framed display.','blueprint'),('cinema','Cinema window','A dark, wide viewer with a dedicated control shelf.','night'),('comparison','Paired evidence','Two independent recordings with a shared start/pause control.','gallery'),('chapter','Research chapter','Large chapter number, explanation on the left, motion on the right.','paper'),('contact-sheet','Contact sheet','Four visual selectors; choosing a thumbnail updates the larger player.','archive'),('floating','Floating control dock','A tab bar bridges the video and its caption.','cobalt')]
for i,(style,name,note,theme) in enumerate(RESEARCH):add('research',f'R{i+1:02}',name,note,theme,research(style))
PROJ=[('triptych','Three-column studies','Fine rules, equal thumbnails, and concise captions.','botanical'),('index','Typographic project index','Small images, numbered rows, and generous alignment.','swiss'),('mosaic','Asymmetric mosaic','One large feature with two supporting tiles.','cobalt'),('filmstrip','Horizontal filmstrip','Wide images that scroll and snap; useful when space is limited.','gallery'),('accordion','Expandable project list','Open a project to see its visual and short explanation.','blueprint'),('catalogue','Alternating catalogue','A more editorial rhythm, with images alternating sides.','paper')]
for i,(style,name,note,theme) in enumerate(PROJ):add('projects',f'P{i+1:02}',name,note+' Manipulation and RRT images are illustrative.',theme,projects(style))
EXPS=[('timeline','Fine-line timeline','Small markers and a continuous vertical rule.','botanical'),('ledger','Academic ledger','A fixed date column, thin rules, and a strong first divider.','swiss'),('cards','Research appointment cards','A larger primary appointment with two secondary panels.','night'),('margin','Dates in the margin','Serif role titles with quiet dates to the left.','paper'),('logos','Small institutional marks','Consistently sized logos support the text hierarchy.','gallery')]
for i,(style,name,note,theme) in enumerate(EXPS):add('experience',f'E{i+1:02}',name,note,theme,experience(style))
EDS=[('paired','Institution panels','Large school abbreviations, compact qualification details.','botanical'),('ruled','Qualification register','Clear institution column with full-width horizontal rules.','blueprint'),('transcript','Paper transcript','A lightly tinted document with dashed separators.','paper'),('route','Academic route','Hollow markers connect institutions and dates.','gallery')]
for i,(style,name,note,theme) in enumerate(EDS):add('education',f'U{i+1:02}',name,note,theme,education(style))
ACS=[('notes','Research notes','A two-column collection of lightly tinted notes.','botanical'),('bulletin','Activity bulletin','Small category labels alongside each contribution.','swiss'),('chips','Compact activity panels','Simple symbols and slim bordered rows.','night'),('margin','Editorial contributions','Large serif titles and quiet category labels.','paper')]
for i,(style,name,note,theme) in enumerate(ACS):add('activities',f'A{i+1:02}',name,note,theme,activities(style))
DIST=[('tiles','Qualification tiles','Emphasized grades with small contextual labels.','botanical'),('lines','Restrained distinction rows','A simple line and aligned supporting text.','swiss'),('band','Inset distinction band','A single tinted strip with an internal divider.','night'),('footnotes','Academic footnotes','Small monospace labels, no large metric styling.','archive')]
for i,(style,name,note,theme) in enumerate(DIST):add('distinctions',f'Q{i+1:02}',name,note,theme,distinctions(style))
HEADS=[('ruled','Rule & title','A strong upper rule creates a clear section boundary.','swiss'),('numbered','Chapter number','A large, quiet number gives the page an editorial sequence.','paper'),('side-label','Margin index','A small left column organizes the larger heading.','blueprint'),('tabbed','Underlined section','A decisive baseline accent with minimal extra detail.','cobalt'),('centered','Gallery heading','Centered serif typography and a small overline.','gallery'),('block','Color chapter band','A full-width accent block for occasional major transitions.','night')]
for i,(style,name,note,theme) in enumerate(HEADS):add('headings',f'H{i+1:02}',name,note,theme,heading(style))
for i,(style,name,theme) in enumerate([('line','Simple masthead navigation','swiss'),('capsule','Soft navigation capsule','botanical'),('index','Monospace index bar','blueprint'),('dock','Compact navigation dock','cobalt')]):add('headings',f'N{i+1:02}',name,'Navigation links open the corresponding section of the Swiss direction.',theme,'<div class="pad">'+nav(style)+'</div>')
BTNS=[('underline','Underlined text','Clean links with a selected-tab baseline.','swiss'),('segment','Inset segments','A white active tab inside a soft background track.','botanical'),('square','Precision outlines','Square corners, monospace labels, and thin blue rules.','blueprint'),('pill','Quiet capsules','Fully rounded buttons without exaggerated size.','paper'),('tint','Tinted surfaces','Color carries the state; borders stay almost invisible.','cobalt'),('bracket','Bracket links','Text-like controls with a technical punctuation detail.','night'),('offset','Printed offset','A small solid offset shadow adds tactile character.','swiss'),('icon','Circular arrow detail','An arrow medallion gives each link a clear endpoint.','gallery'),('folder','Folder tabs','Connected tabs make the active panel feel like a document.','archive'),('quiet','Dot selection','Plain text controls and a single active-state dot.','botanical')]
for i,(style,name,note,theme) in enumerate(BTNS):add('buttons',f'B{i+1:02}',name,note,theme,buttons(style))
FOOTS=[('colophon','Academic colophon','A small closing signature and aligned links.','swiss'),('invitation','Generous contact block','An understated tinted surface with a prominent email link.','botanical'),('split','Split contact','Identity and links share a strong horizontal composition.','night'),('stamp','Personal closing mark','A simple initials circle and centered contact links.','paper')]
for i,(style,name,note,theme) in enumerate(FOOTS):add('footers',f'F{i+1:02}',name,note,theme,footer(style))

CATEGORIES=[('directions','Full pages'),('introductions','Introductions'),('research','Research'),('projects','Projects'),('experience','Experience'),('education','Education'),('activities','Activities'),('distinctions','Distinctions'),('headings','Headings & nav'),('buttons','Buttons'),('footers','Contact')]
navigation=''.join(f'<button data-category-filter="{key}" aria-pressed="{str(i==0).lower()}">{label}</button>' for i,(key,label) in enumerate(CATEGORIES))
HTML='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duarte Santos — Design atlas</title><link rel="stylesheet" href="gallery.css"><link rel="stylesheet" href="designs.css"><script src="interactions.js" defer></script><script src="gallery.js" defer></script></head><body>
<header class="gallery-header"><div class="gallery-top"><span>Duarte Santos / Design atlas</span><a href="../index.html">Current website ↗</a></div><h1>One researcher.<br><em>Many ways to see the work.</em></h1><div class="gallery-intro"><p>A collection of complete visual directions and individual section studies. Explore the tabs below, try the controls, and star the pieces you like. Each direction uses your own portrait and robot footage. The complete pages show how a visual language carries through the whole site.</p><div class="gallery-stats"><div><strong>08</strong><span>Directions</span></div><div><strong>63</strong><span>Section studies</span></div><div><strong>11</strong><span>Collections</span></div></div></div></header>
<div class="toolbar"><div class="toolbar-inner"><nav class="category-nav" aria-label="Design categories">NAVIGATION</nav><div class="toolbar-actions"><button class="utility" id="width-toggle" aria-pressed="false">Phone width</button><button class="utility" id="saved-toggle" aria-pressed="false" aria-label="Show saved designs">★ 0</button><button class="utility" id="export">Export shortlist</button></div></div></div>
<main class="gallery-main"><div class="collection-head"><div><h2 id="collection-title">Complete directions</h2><p id="collection-description">Eight complete personal websites.</p></div><span class="collection-count" id="visible-count">8 studies</span></div><div class="study-grid">CARDS<div class="empty" id="empty" hidden>No saved designs yet. Star any example to build your shortlist.</div></div><aside class="recommendation" id="recommendation"><b>Suggested starting points:</b> Swiss research journal for the strongest academic restraint; Quiet botanical for a softer personal page; Robotics blueprint for a distinct engineering character. Field notebook and Motion gallery explore more editorial directions. Cobalt studio is the boldest option. You can mix sections: save an introduction, a research viewer, a project layout, and a button family.</aside></main>
<footer class="gallery-footer">Static design studies · The original homepage is unchanged · No external fonts or libraries · The two course-project diagrams are illustrative previews, not experimental results.</footer>
<dialog class="selection-dialog" id="selection-dialog"><h2>Your design shortlist</h2><p>Copy these identifiers into our conversation so we can combine the exact sections you prefer.</p><textarea id="selection-text" aria-label="Saved design list" readonly></textarea><div class="dialog-actions"><button class="utility" id="close-dialog">Close</button><button class="utility" id="copy-list">Copy list</button></div></dialog>
<noscript><p style="padding:30px">JavaScript is disabled. All examples are listed below their collection; complete page links still work.</p></noscript></body></html>'''
HTML=HTML.replace('NAVIGATION',navigation).replace('CARDS',''.join(CARDS))
(ROOT/'index.html').write_text(HTML)
print(f'Built {len(DIRECTIONS)} complete pages and {len(CARDS)-len(DIRECTIONS)} component studies ({len(CARDS)} examples total).')

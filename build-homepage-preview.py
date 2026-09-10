"""Show the compact research section inside the actual homepage, without publishing."""
from pathlib import Path
import re

root=Path(__file__).resolve().parent
source=(root/'index.html').read_text()
fragment=(root/'homepage-research-fragment.html').read_text()
start=source.index('          <div class="research-heading-row">')
end=source.index('          <hr class="soft">',start)
source=source[:start]+fragment+'\n'+source[end:]
source=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',source)
source=source.replace('<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">','')
source=source.replace('<title>Duarte Santos</title>','<title>Duarte Santos — Homepage preview</title>')
source=source.replace('</head>','  <link rel="stylesheet" href="homepage-preview.css">\n  <script src="homepage-preview.js" defer></script>\n</head>')
bar='<div class="preview-bar"><span>Homepage preview</span><nav aria-label="Preview navigation"><a href="#research">Research</a><a href="#selected-projects">Selected projects</a><a href="research-gallery-project-page/index.html">Saved project-page viewer ↗</a></nav></div>'
source=source.replace('<body class="bg_colour">','<body class="bg_colour homepage-preview">\n'+bar)
source=source.replace('<table <table border=0','<table border=0')
(root/'homepage-preview.html').write_text(source)
print('Built homepage-preview.html using the existing homepage and a compact research section.')

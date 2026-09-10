# Research & selected projects — styling studies

Open `index.html` in a browser. This focused comparison follows the user's
reference: https://inessousa11.github.io/person-reid-website/

The current entry point replaces the broad design atlas with one consistent
visual system for media windows, buttons, selectors, and project layouts.

- **R1–R6:** floating selector, side selector, paired comparison, visual
  filmstrip, featured grid, expandable study.
- **P1–P4:** equal cards, featured project with compact entries, horizontal
  gallery, compact rows.
- **B1–B4:** filled/outline, quiet outlines, neutral segments, text/underline.
- **C1:** research and selected projects together.

Selectors, video playback, progress, mute, fullscreen, project detail dialogs,
paired playback, and gallery navigation are functional. The toolbar includes
phone width and a neutral accent. No external fonts or JavaScript libraries.

Manipulation and RRT diagrams are labeled illustrative previews. Other stills
and videos come from the user's existing media. Comparison videos are
independent recordings, not phase-aligned experimental trials.

Edit `build-focused.py`, then run `python3 design-gallery/build-focused.py` from
the repository root to regenerate `index.html`. The current implementation uses
`focused.css` and `focused.js`. Older standalone studies and their generator
remain separate from this entry point.

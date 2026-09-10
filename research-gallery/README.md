# Research collection options

Open `index.html` directly in a browser. The four functional options share the
same footage hierarchy and condition-dependent controls:

1. Guided research: topic, controller/configuration, robot, environment.
2. Comparison workspace: configurations, motion stages, robots, or terrain
   directions in a matrix of comparable conditions.
3. Robot collection: embodiment first, then topic and recording.
4. Homepage showcase: three concise entries open a full evidence viewer.

## The collection

| Study | Robot | Conditions | Recordings |
|---|---|---|---|
| Legged locomotion | T1 | Rested arms, raised arms | MuJoCo, Isaac, real |
| Whole-body locomotion | T1 | One configuration | MuJoCo, Isaac, real |
| Whole-body locomotion | Other six | One configuration each | MuJoCo, Isaac |
| Reference motion | All seven | Source, retargeted, trained policy | Source separately; retargeting in MuJoCo/Isaac; policy in MuJoCo/Isaac and T1 real |
| Terrain | All seven | Ascent, descent | MuJoCo, Isaac |

The user confirmed the expanded footage collection is not in this workspace.
`catalog.js` therefore leaves `mediaManifest` empty. Existing T1 clips appear
only as explicitly marked layout samples. Other robots and unverified stages
have unassigned frames. Do not map a sample to a specific condition without
checking the recording.

Populate `mediaManifest` with `{src, poster}` by the keys produced by `allSlots()`.
The manifest distinguishes source motion from retargeting and policy output.
If multiple source motions are later added, extend each reference key with a
motion identifier rather than merging their recordings.

## Colors

- UT Austin burnt orange: `#BF5700`, verified against
  https://brand.utexas.edu/identity/color/
- ISR-inspired red: `#961B2F`, sampled from the dominant red in the local
  `images/isr_logo.jpeg`, not claimed as an official brand specification.

Use one accent at a time. The frames and secondary controls remain neutral.

## Editing

Edit `catalog.js`, `views.js`, `app.js`, `icons.js`, or `research.css`.
Run `python3 research-gallery/build.py` to regenerate `bundle.js`. The classic
bundle allows direct file opening without a server or external dependencies.

The source motion stays independent of simulator selection. Real deployment
is offered only for T1 locomotion and its reference-trained policy. Comparing
robots uses shared simulation conditions. Starting videos together does not
assert phase or experimental alignment.

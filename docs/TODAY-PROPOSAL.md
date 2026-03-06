# Build Proposal - 2026-03-06

## Research Sources
- r/InternetIsBeautiful hot: 3D Cash Timer (https://3dcashtimer.com/) standing out for upgrading a stale UI concept to 3D physics; StreamGrid Twitch guide (https://streamgrid.win) as useful real-time data tool; LocalSquash (https://localsquash.com/) client-side media tool showing demand for browser power.
- r/creativecoding hot: \"Physics based node wires\" (https://v.redd.it/m748ydi7xtmg1) – real-time node connections with tension physics; \"My audio-reactive geometry system\" (https://v.redd.it/j8u74gmx8gmg1) – mic-driven deformations; Xbox controller synth with visuals.
- r/generative hot: Particle flow turbulent noise, tensor mesh, fractal curves – emphasis on fluid/procedural motion.
- Recent HN/InternetIsBeautiful: Interactive explainers like billionaire wealth (but we shipped vortex yesterday), music timelines.
- Recent ships: 03-05 billionaire wealth vortex (data/viz), 03-03 GLSL node forge (technical shaders), 03-02 fractal wavetable (generative audio), 03-01 GPU murmuration (physics flocks), so rotating away from viz/shaders/audio flocks to interactive game/physics.

## Idea: Sonic Wire Forge
**Category:** Game/interactive (with depth and replayability)
**One-liner:** Drag nodes to build physics wire networks that vibrate and resonate to your microphone input, forging stable structures or chaotic symphonies.
**Technical Stack:** Three.js + Ammo.js (Bullet physics WebAssembly), WebAudio API (mic FFT real-time), GLSL shaders for wire glow/vibration effects.
**Inspired by:** r/creativecoding \"Physics based node wires\" + \"My audio-reactive geometry system\" – combines node physics tension with mic-driven reactivity for emergent gameplay.

**Description:** Click/drag to spawn pinned or free nodes, auto-connecting spring wires simulate tension/damping. Plug in mic – low freqs pump bass waves along wires, highs spark node flares. Goal: Build resonant structures (harps, bridges) that \"sing\" without collapsing, or unleash chaos for visual spectacle. Physics emergent: waves propagate, nodes cluster/swing, colors shift by freq bands. Replayable challenges: survive earthquakes (random forces), tune to specific songs.

**Target audience:** Creative coders on Reddit/Twitter, music producers, physics sim fans – they'll share clips of insane mic-reactive builds going viral.

**Key features:**
- Real-time microphone FFT analysis driving wire tensions, node displacements, shader intensities (WebAudio AnalyserNode).
- Realistic physics joints/springs for 100+ nodes (Ammo.js collision detection, stable stacking).
- Procedural wire meshs with glowing GLSL shaders distorting by audio amplitude.
- Interactive modes: Free build, stability challenges (timer + forces), song tuner (upload audio file fallback).
- Export: Screenshot, animated GIF capture, shareable seed/state URL.
- Mic permission graceful fallback to tone generator.

**The hook:** Screenshot a glowing wire harp pulsing to your voice dropping beats – \"AI built a physics instrument you control with sound.\" Instant Twitter/Reddit bait.

**Wow Test Results:**
1. Stop scrolling? YES – mic reactivity + physics chaos grabs instantly, hypnotic yet controllable.
2. Developer would share? YES – showcases WebAssembly physics + WebAudio mastery, forkable code appeal.
3. Technical boundary pushed? YES – real-time audio-to-physics coupling with stable 60fps WebGL sim (Ammo.js heavy lift).
4. Different from this week? YES – Interactive node game vs static GLSL forge, audio synth, flocking particles, wealth viz.

### Scout Notes
The physics node wires post jumped out – simple concept but endless emergent potential when mic-driven. Paired with audio-reactive geo, it screams replayability: stable vs collapse gameplay loop. Excited for Ammo.js challenge (heavy but doable nightly build), pushes beyond canvas to full 3D physics. This captures today's hot physics+audio vibe without rehashing recent ships. Will make devs go \"how's that running smooth in browser?\"

---

## Build Spec (Sage)

**Verdict:** APPROVED (REVISED)

**Changes from proposal:**
1. **Replacing Three.js + Ammo.js with Canvas2D + custom Verlet integration.** Ammo.js is a 2.5MB WASM bundle requiring async loading — fragile in a single-file build and adds 400ms+ startup lag. Custom Verlet spring physics is ~100 lines of math, runs at 60fps for 200+ nodes, and actually demonstrates more algorithmic mastery than dropping in a physics engine. Canvas2D with layered glow strokes achieves better visual results for wire rendering than Three.js wire meshes.
2. **Richer audio routing:** Spec defines exact FFT band → physics parameter mappings so every part of the frequency spectrum does something visually distinct.
3. **Added resonance detection system:** When the structure's estimated oscillation frequency locks to a mic frequency band, trigger visual cascade — this is the money shot for screenshots.
4. **Replaced GIF export with canvas snapshot** (simpler, reliable, still shareable).

**Estimated JS complexity:** 650–900 lines

---

### Visual Design

- **Background:** `#0a0a0f` solid — deep black with a blue tint
- **Grid:** Dot grid, 40px spacing, dots `rgba(60,80,120,0.25)` — subtle depth, not distracting
- **Wire color by tension:**
  - Rest (0–30% max tension): `#00e5aa` (electric teal)
  - Moderate (30–70%): `#ff9500` (hot orange) — blend via interpolation
  - Critical (70–95%): `#ff2244` (alarm red)
  - Snap threshold: wire briefly flashes `#ffffff` then disappears
- **Wire glow rendering technique:** Draw each wire 4 times per frame:
  - Pass 1: width 14px, `rgba(color, 0.04)` — outer halo
  - Pass 2: width 7px, `rgba(color, 0.12)` — mid bloom
  - Pass 3: width 3px, `rgba(color, 0.55)` — inner glow
  - Pass 4: width 1px, `rgba(color, 1.0)` — core line
  - Multiply widths and alpha by `1 + audioAmplitude * 0.8` for audio reactivity
- **Node colors:**
  - Free node: `#4488ff` fill, `rgba(68,136,255,0.3)` glow ring, 10px radius
  - Pinned node (anchor): `#ddcc00` fill, `rgba(220,200,0,0.4)` glow ring, 12px radius — square shape
  - Resonating node: pulse animation 8px→16px radius, color cycles `#00ffaa → #ff00aa` at 4Hz
- **Particles:** Spark bursts at nodes when resonance triggers — 8–16 small dots with radial velocity, fade over 600ms
- **UI panel:** Bottom-center HUD, `rgba(10,10,20,0.85)` bg, 1px `rgba(80,120,200,0.4)` border, `border-radius: 8px` — shows: Mode label, Wire count, Resonance meter, Mic level bar
- **Typography:** `JetBrains Mono, monospace` via Google Fonts CDN — 11px for labels, 14px for mode name

---

### UX Flow

1. **Page loads** → canvas fills viewport, dot grid appears, a pre-built "harp" seed structure renders: 5 pinned nodes anchored at top in a row, 8 free nodes hanging below forming a triangular web. Wires glow electric teal at rest. Bottom HUD shows "FREE BUILD MODE" and "Click mic to activate."

2. **Mic activation** → User clicks the microphone button (center of HUD). Browser prompts for permission. On grant: wires immediately begin breathing — a gentle sine wave propagates along them even in silence. Mic level bar in HUD flickers to life. This "alive even in silence" behavior uses a tiny 0.01 amplitude sine sweep to keep the physics visible.

3. **Building** → Left-click empty canvas: spawns a free node with brief scale-in animation (0.3s). New node auto-connects to the 2 nearest existing nodes via spring wires. Right-click: spawns a pinned anchor (square, gold). Drag any node: smooth mouse follow. The immediate wire physics feedback (wires stretch, sag, spring back) tells users the system is alive.

4. **Resonance discovery** → When the user talks, sings, plays music — bass frequencies pump the global spring stiffness, mid frequencies inject transverse wave impulses along individual wires, highs flash node sparkles. When a sub-network's natural oscillation period (computed from wire lengths and node masses) comes within 15% of a dominant mic frequency, those nodes glow pink→cyan cycling and emit spark particles. The HUD resonance meter climbs. This is the "wow" moment — structures that are physically tuned to your voice glow brightest.

5. **Chaos mode** → Press `Q` to trigger an "earthquake" — all free nodes receive random radial impulse forces (magnitude 100–400px/s²) for 2 seconds. Structures collapse, wires snap, nodes scatter. Users rebuild. Replayability hook.

6. **Power user discovery** → `D` key toggles debug overlay showing: node velocity vectors, wire stress bars, FFT band assignments, natural frequency estimate per wire segment. Developers will screenshot this. `S` saves a JSON seed to clipboard for sharing structures. `L` loads a seed from clipboard.

---

### Technical Architecture

- **Rendering:** Canvas2D — `ctx.globalCompositeOperation = 'screen'` for additive wire blending (critical: wires at intersections bloom together naturally with screen blend mode)
- **Animation loop:** `requestAnimationFrame`, target 60fps. Physics substeps: 4 per frame (prevents instability at higher forces). Delta-time capped at 33ms to prevent spiral-of-death on tab blur/refocus.
- **State management:**
  ```
  nodes[]        — {x, y, px, py, vx, vy, pinned, mass, resonating}
  wires[]        — {a, b, restLength, stiffness, damping, stress, age}
  audioState     — {enabled, analyser, dataArray, bands: {sub,bass,mid,high,presence}}
  particles[]    — {x, y, vx, vy, life, maxLife, color}
  simState       — {mode, earthquakeTimer, globalAmplitude, resonanceScore}
  ```
- **Key algorithms:**
  - **Verlet integration per free node:**
    ```
    ax = forceX / node.mass
    ay = (forceY + gravity) / node.mass
    nx = node.x + (node.x - node.px) * damping + ax * dt²
    ny = node.y + (node.y - node.py) * damping + ay * dt²
    node.px = node.x; node.py = node.y
    node.x = nx; node.y = ny
    ```
  - **Spring constraint per wire (Hooke's law with stretch limiting):**
    ```
    dx = nodeB.x - nodeA.x
    dy = nodeB.y - nodeA.y
    dist = sqrt(dx²+dy²)
    stretch = (dist - wire.restLength) / wire.restLength
    wire.stress = clamp(abs(stretch), 0, 1)
    if stretch > 2.5: snap wire (remove from wires[])
    force = wire.stiffness * (dist - wire.restLength)
    apply force along (dx/dist, dy/dist) to each node (±)
    ```
  - **FFT band extraction:** 256-bin AnalyserNode, split into 4 bands:
    - Sub-bass: bins 1–6 (20–100Hz) → `audioState.bands.sub` → modulates global spring stiffness ×(1 + sub×2)
    - Bass: bins 7–25 (100–400Hz) → `audioState.bands.bass` → injects transverse impulse on all wires proportional to bass amplitude (perpendicular to wire axis, magnitude up to ±80px/s²)
    - Mid: bins 26–100 (400–2000Hz) → `audioState.bands.mid` → modulates node glow radius and wire core brightness
    - High: bins 101–200 (2000–8000Hz) → `audioState.bands.high` → triggers sparkle particle bursts at nodes above threshold (0.3)
  - **Natural frequency estimation per wire segment:**
    `f_natural ≈ (1/(2*L)) * sqrt(tension/linearDensity)` simplified as `f_approx = stiffness / (restLength * avgMass * 2π)` — compute per wire, compare to dominant FFT bin frequency, set `wire.resonating = true` if within 15%
  - **Wire wave animation:** Each wire has `wavePhase` float, incremented each frame by `bassAmplitude * 0.15`. Wire is drawn as a quadratic Bezier with control point offset perpendicular to wire axis by `sin(wavePhase) * bassAmplitude * wireLength * 0.12` — creates visible transverse wave propagation along wires.

- **Performance:**
  - Object pool for particles (fixed 200-element array, reuse slots)
  - Wire snap check only every 3rd frame (cheap optimization)
  - Skip glow passes 1+2 on wires with stress < 0.1 (they're barely visible anyway)
  - Max nodes: 80, max wires: 200 — soft cap with UI feedback at limit

- **Input handling:**
  - Mouse down on empty canvas → if distance to nearest node > 30px: begin node-spawn drag (shows preview ghost node)
  - Mouse down on existing node (within 20px) → enter drag-node mode
  - Mouse up → finalize placement, auto-connect to 2 nearest nodes (skip if already > 3 connections on target)
  - Right-click → spawn pinned anchor node
  - Touch: treat first touch as mouse, two-finger pinch reserved (no action, prevent default zoom)

---

### Interactions Detail

- **Left-click (empty):** Ghost node preview tracks mouse → release places free node → scale-in animation (0→10px, 200ms ease-out) → auto-connect wires appear with grow animation (length 0→full, 150ms)
- **Left-click (on node):** Node "grabs" — follows mouse exactly, all connected wires stretch in real-time, physics paused for that node while dragged → release: node resumes physics with velocity = (currentPos - prevPos) / dt (throw physics)
- **Right-click:** Spawns pinned square anchor at exact position, no drag — immediate placement
- **Mouse move (no button):** Hover within 25px of node: node glows brighter (radius × 1.4), cursor changes to grab — affordance hint
- **`Q` key:** Earthquake — all free nodes receive random radial impulse, HUD flashes "QUAKE!" in red, camera shakes (translate canvas ±4px for 500ms using sin wave)
- **`C` key:** Clear all nodes/wires → smooth fade-out over 400ms → pre-built harp seed respawns
- **`D` key:** Toggle debug overlay — velocity vectors (yellow arrows), stress bars above each wire, FFT band display in corner
- **`S` key:** Serialize current node/wire layout to JSON → copy to clipboard → HUD briefly shows "Seed copied!"
- **`L` key:** Paste and deserialize seed from clipboard → replace current layout

---

### Edge Cases

- **Mobile (no mic typically):** Full touch support — tap to place, tap-hold to drag. If `AudioContext` blocked (mobile autoplay policy), show "Tap anywhere to unlock audio" overlay. Without mic, use a built-in tone generator: 80Hz sine at 0.3 amplitude simulating bass input, keeping physics alive for demo.
- **Performance on slow device:** Monitor frame time. If average dt > 25ms over 10 frames, drop from 4 physics substeps to 2, reduce max particles to 50, skip wire glow passes 1+2 entirely. Show "⚡ Lite mode" in corner.
- **WebAudio blocked:** `try/catch` around `AudioContext` creation and `.getUserMedia()`. On failure: fallback to internal 80Hz + 440Hz tone generator at reduced amplitude. Display "🎤 Mic unavailable — using tone" in HUD.
- **Empty state (before any interaction):** Pre-built harp structure provides immediate visual payoff. Wires do a subtle idle breathing animation (±3% amplitude, 2Hz) so the page is never static on load.
- **Wire snap cascade:** If >10 wires snap in one frame (e.g., overloaded collapse), cap snap processing at 10/frame and queue the rest — prevents frame stutter from DOM operations.

---

### Sage Notes

Scout's instinct is right — mic-reactive spring physics is a genuinely shareable combination that hasn't been done well in the browser. I killed the Ammo.js dependency not to dumb it down but to make it better: a hand-crafted Verlet spring sim that GLM can tune precisely is more impressive than a black-box physics engine, and it'll load instantly instead of waiting on a 2.5MB WASM bundle. The resonance detection is the centerpiece — the moment when a user hums and their wire structure lights up because it's physically tuned to their voice is the screenshot moment that drives sharing. The screen blend mode on wire drawing is non-negotiable: don't let GLM swap it for `source-over` or the glow intersections won't bloom. The pre-built harp seed on load is critical — an empty canvas is a graveyard; the simulation must be alive and beautiful from frame one.

**Files to create:**
- `content/daily/2026-03-06-sonic-wire-forge.md`
- `public/builds/2026-03-06-sonic-wire-forge/index.html`

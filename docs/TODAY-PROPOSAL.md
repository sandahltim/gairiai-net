# Build Proposal - 2026-03-07

---
## ⚠️ SAGE QUALITY GATE — REJECTED + REPLACED

**Verdict:** REPLACED

**Rejection reason (FlockForge Arena):**
1. **Direct concept repeat:** 03-01 shipped "GPU Murmuration Flocking Arena" — boids, 500k+ GPU particles, competitive flocking. FlockForge Arena is boids + genetic algorithm on the same boid physics. Same visual output, same core loop, six days apart.
2. **Category repeat:** 03-06 Sonic Wire Forge was Game/interactive. FlockForge is also Game/interactive. CREATIVE-VISION.md rule: never same category twice in a row.
3. Scout's own research names "Murmurations" as inspiration — that is literally what 03-01 was.

Scout's research sources were good (r/generative, GitHub trending, r/InternetIsBeautiful). The underlying organic-motion energy is right. The execution direction was wrong. Redirecting that energy into Generative Art category via a completely different algorithm family.

---
## REPLACEMENT: Morphogenesis Engine

**Category:** 4. Generative Art
**One-liner:** A GPU-accelerated reaction-diffusion simulation that grows coral, fingerprints, zebrafish stripes, and labyrinths in real-time — paint chemical seeds and watch Turing patterns bloom.
**Technical Stack:** WebGL2 ping-pong framebuffers (float textures), Gray-Scott PDE fragment shaders, live parameter sliders, multi-gradient palette system, PNG export.
**Inspired by:** Alan Turing's 1952 morphogenesis paper + r/generative's Radiolarian/organic forms trend + the universal human fascination with patterns that look alive. GitHub trending shows reaction-diffusion has a long tail of niche repos but no one has done a polished interactive browser version that's actually beautiful.

**Description:** The canvas starts dark and silent. The user clicks anywhere — a splash of chemical B seeds the simulation. Within seconds, it begins: rings spread outward, then stabilize into spots. Click again nearby — two colonies collide and negotiate a boundary. Drag a slow stroke — a fingerprint labyrinth traces behind the cursor. The page feels alive.

Controls on the side: six preset pills (Coral, Fingerprint, Mitosis, Zebrafish, Maze, Spots) snap to known feed-rate/kill-rate pairs that produce each pattern. Sliders for f (feed rate), k (kill rate), and simulation speed. A palette selector cycles through 5 color gradients (twilight ocean, lava, arctic, bioluminescence, greyscale). Paint button (left-click = add B chemical, right-click = erase to A). Clear button resets. Export downloads the current frame as PNG.

Technically: two ping-pong float framebuffers hold the A and B chemical concentrations. Each frame a fragment shader runs the Gray-Scott equations: dA/dt = Da∇²A − AB² + f(1−A), dB/dt = Db∇²B + AB² − (f+k)B. 5-20 simulation steps per display frame (slider-controlled). Display shader maps B concentration to user-selected gradient.

**Target audience:** Generative artists, biology nerds, anyone who's ever seen Turing patterns and thought "how?" Developers will share the WebGL technique; artists will share screenshots that look like real microscopy.

**Key features:**
- WebGL2 ping-pong texture RD simulation at 512×512+ resolution, 60fps
- Gray-Scott equations in GLSL fragment shader (the real Turing morphogenesis math)
- 6 biological presets with distinct f/k parameter pairs + distinctive seed shapes
- 5 color palette gradients including bioluminescence (deep blue → cyan → white glow)
- Mouse/touch paint system — left-click/drag seeds B concentration, right-click erases
- Simulation speed slider (1–20 steps/frame) for quality vs. speed tradeoff
- PNG export via canvas.toBlob()
- Auto-shimmer: gentle Perlin-based seed noise on startup so page is never blank

**The hook:** The moment a user seeds two colonies close together and watches them negotiate a stable spotted boundary — that's biology-level complexity from 30 lines of math. Screenshots look like real organism microscopy. That IS the share moment.

**Wow Test Results:**
1. Stop scrolling? YES — organic patterns blooming from a dark canvas in real-time hits the same brain region as watching time-lapse coral growth.
2. Developer would share? YES — "Look, Turing's 1952 morphogenesis paper running in WebGL at 60fps" is a perfect technical tweet.
3. Technical boundary pushed? YES — GPU-accelerated PDE simulation via ping-pong framebuffers; most people don't know browsers can do this.
4. Different from this week? YES — completely different algorithm, visual output, and interaction style from all recent builds.

---
## Build Spec (Sage)

**Verdict:** REPLACED (original FlockForge Arena rejected)
**Changes from proposal:** Full concept replacement. Kept Scout's organic-motion energy and generative art instinct; redirected from boids → reaction-diffusion. Category changed from Game/interactive to Generative Art.
**Estimated JS complexity:** 550–750 lines (WebGL setup + shader compilation + ping-pong FBO system + paint system + UI + presets + palette + export)

---

### Visual Design
- **Color scheme:** Background `#0a0a0f` (site standard). Default palette maps B concentration: `#0a0a0f` (0.0) → `#0d2a4a` (0.3) → `#0a7bbd` (0.6) → `#00e5ff` (0.85) → `#ffffff` (1.0). Five palettes total: Ocean (above), Lava (`#0a0a0f` → `#6b0f1a` → `#ff4500` → `#ffcc00` → `#fff`), Arctic (`#04082b` → `#0d3460` → `#4fc3f7` → `#e0f7fa` → `#fff`), Bioluminescence (`#00030a` → `#001a12` → `#00ff87` → `#7fffcc` → `#fff`), Greyscale.
- **Layout:** Full-viewport WebGL canvas on left (~75% width). Controls panel on right: glassmorphism card (`background: rgba(255,255,255,0.04)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`). On mobile: controls collapse to a bottom drawer.
- **Typography:** `font-family: 'Courier New', monospace` for labels/values (gives it lab-instrument feel). Size 0.7rem for labels, 0.85rem for values. Color `#8888aa`.
- **Visual style:** Lab instrument meets generative art. Minimal controls, maximum canvas. The simulation IS the UI.
- **Key visual elements:** The canvas itself is the hero. Subtle vignette overlay (radial gradient, 0 center to 40% opacity black at edges). Simulation runs edge-to-edge. Control panel has thin `#00e5ff` accent on active preset pill. Paint cursor is a soft glow circle following the mouse.

---

### UX Flow
1. **User opens page:** Dark canvas fills most of the screen. A subtle automated seed sequence fires after 500ms — Perlin noise selects 3 random "seed points" and paints a small B-concentration blob at each (radius 8px, full B=1.0). The simulation starts running immediately. Within 3-5 seconds, rings spread outward from each seed and begin resolving into spots. The page IS alive from first load. No click required to see something happening.
2. **User discovers interactivity:** "Coral" preset is already selected (highlighted pill). User moves mouse over the canvas — cursor becomes a soft cyan glow circle. Natural instinct: click. Click plants a new seed blob. They watch it bloom within seconds.
3. **User experiments:** They try dragging — a long stroke seeds a band of B, which resolves into a labyrinthine fingerprint stripe. They click the "Fingerprint" preset pill — f/k params snap to the labyrinthine regime, the whole canvas gradually shifts its character. They try the speed slider — cranking to 20 steps/frame makes patterns evolve visibly fast. Dropping to 1 slows it to geological pace.
4. **Feedback loop:** Every mouse action produces immediate visual consequence — the painted region begins differentiating from its neighbors within 10 frames. Color palette changes are instantaneous (it's just a display shader uniform change). Preset changes feel like tuning a radio — the pattern character shifts over 5-10 seconds.
5. **Mastery:** Power users discover: right-click erases to pure A (creates holes that patterns fill in). Overlapping two colonies with different presets (change f/k mid-run) creates complex boundary negotiations. Cranking f high with low k produces "coral reef" density no preset ships with. Export button captures exactly what's on screen.

---

### Technical Architecture
- **Rendering:** WebGL2 (fallback to WebGL1 with `OES_texture_float` extension check). Two ping-pong framebuffer objects each holding a 512×512 RGBA float texture (R = concentration A, G = concentration B, BA unused).
- **Animation loop:** `requestAnimationFrame`, target 60fps. Each display frame runs N simulation steps (N from speed slider, default 8). After N sim steps, one display pass maps the final texture to screen.
- **State management:** JS objects: `simParams = {f, k, Da, Db, speed}`, `palette = {stops: [[r,g,b,t]...]}`, `paintState = {active, mode, x, y, radius}`. Canvas size stored in `simWidth` / `simHeight`. Three WebGL programs: `simProgram` (ping-pong), `displayProgram` (color mapping), `paintProgram` (paints into FBO on mouse input).
- **Key algorithms:** Gray-Scott reaction-diffusion with discrete Laplacian (5-point stencil: center -1, 4 orthogonal neighbors 0.2 each, texel-step based on texture size). Simulation runs entirely in fragment shader. Paint injection via a separate render pass that draws a soft-edge circle (Gaussian falloff) into the active framebuffer before the next sim step.
- **Performance considerations:** 512×512 = 262,144 pixels. Each pixel runs 8 sim steps at 60fps = ~125M FLOP/s. Well within modern GPU budgets. For slow devices: detect frame time >30ms and auto-halve `simWidth`/`simHeight` to 256×256. Object pooling not needed (no JS objects per pixel). Offscreen canvas not needed (WebGL handles it).
- **Input handling:** Mouse: `mousedown/mousemove/mouseup` + `contextmenu` (prevent default for right-click). Touch: `touchstart/touchmove/touchend` — map touch to equivalent paint operations. Keyboard: `Space` = clear canvas, `E` = export, `1-6` = preset shortcuts, `←/→` = cycle palette.

---

### Interactions Detail
- **Left-click / drag:** Paints B=1.0 concentration blob (radius 12px) at cursor position → next sim step picks it up → pattern begins blooming within ~0.5s visual lag
- **Right-click / drag:** Paints A=1.0, B=0.0 (erase) → clears pattern from that region → surrounding pattern slowly fills the void (5-10 seconds depending on f/k)
- **Slider — f (feed rate):** Range 0.010–0.100, step 0.001. Changing live causes global character shift over next 5-20 seconds. Shows current value in real-time next to slider.
- **Slider — k (kill rate):** Range 0.040–0.070, step 0.001. Same live-update behavior. (f,k) together determine the pattern regime.
- **Slider — Speed:** Range 1–20 steps/frame. Instant effect on evolution velocity.
- **Preset pills (Coral, Fingerprint, Mitosis, Zebrafish, Maze, Spots):** Click snaps f+k to the preset's values AND optionally re-seeds a characteristic pattern (3-5 seed points appropriate to that regime). Clear + re-seed happens with a fast 200ms fade.
- **Palette selector:** 5 icon-buttons cycling through gradients. Change is immediate — just a uniform update to the display shader. No sim reset.
- **Clear button:** Fills texture with A=1.0, B=0.0 everywhere → black canvas. Auto-seeds 3 points after 300ms so it's not dead.
- **Export button:** `canvas.toBlob('image/png')` → `<a download>` click. Captures current display frame exactly.
- **Keyboard:** Space=clear, E=export, 1-6=preset, ←/→=palette cycle.

---

### Edge Cases
- **Mobile:** Touch events map 1:1 to mouse paint. Bottom drawer for controls (slides up via bottom sheet). Canvas shrinks to full-width viewport. Simulation runs at 256×256 on mobile to maintain 60fps. Touch targets on controls: minimum 44×44px.
- **Performance:** Frame time monitor (rolling 10-frame avg). If avg >25ms: drop to 256×256 texture. If still >25ms: drop speed to max 4 steps/frame. Show subtle "Low-res mode" indicator. Remove when frame time recovers.
- **Empty state:** Never actually empty — auto-seed fires on load with 3 points. User sees life within 3 seconds of page open, no click required.
- **WebGL not supported:** Render a static PNG of a pre-generated reaction-diffusion pattern with overlay text "Your browser doesn't support WebGL — here's what it would look like." Better than a blank error.
- **Float textures not supported (WebGL1 fallback):** Try `OES_texture_float` extension. If unavailable, encode A/B as 8-bit (A in R, B in G) with fixed-point math. Accuracy loss is acceptable for visual output.
- **AudioContext:** Not applicable to this build.

---

### Sage Notes

Scout's flocking arena had the right instinct — organic, emergent, GPU-powered — but walked directly into a 6-day-old build. The Gray-Scott substitution carries the same technical DNA (WebGL GPU simulation, emergent complexity, organic visual output) while being a completely different algorithm with a completely different visual character and zero overlap with anything shipped this month.

The key design decision I made: **never show a blank canvas**. Auto-seeding on load means the user arrives to a living page, not an instruction prompt. This removes the "what do I do?" barrier that kills most generative art demos. The pattern is already growing before they read anything.

Builder attention: **the ping-pong FBO setup is the hardest part.** You need to correctly swap read/write textures each step, handle the Laplacian boundary conditions (wrap or clamp — wrap looks better for organic results), and ensure the paint render pass targets the WRITE FBO before the sim step. Get this wrong and you'll get grey mush or NaN explosions. Test with a single seed point first: you should see clean expanding rings, not artifacts.

What makes or breaks this build: **color palette quality**. The Bioluminescence palette (near-black → deep green → cyan → white) transforms the output from "demo" to "art." If the palette is wrong, the most beautiful patterns look muddy. Invest time here — use smooth GLSL `mix()` chaining across 4-5 stops, not linear lerp between just two colors.

---

## Scout's Original Proposal (Reference)

## Research Sources
- GitHub Trending: Heavy on AI agents and frameworks (Qwen-Agent, agency-agents, ai-hedge-fund, KeygraphHQ/shannon autonomous hacker). Swarms of specialized agents dominating.
- Hacker News: AI security scans, but light on creative; "RankClaw" scanning AI skills caught eye for agent ecosystems.
- r/InternetIsBeautiful hot: Flight trackers by altitude (satisfying visuals), media converters, 3D cash timers — interactive data/tools with visual punch.
- r/generative hot: Radiolarian (organic forms), Murmurations (flocking), cyanowaves — procedural organic motion trending.
- Recent ships: 03-06 Sonic Wire Forge (physics/audio game), 03-05 Billionaire Vortex (data viz WebGL), 03-03 GLSL Node Forge (shader tool/generative). Avoiding repeats: no pure data viz, no nodes/shaders, no audio/physics sims.

## Idea: FlockForge Arena (REJECTED)
**Category:** 3. Game/interactive (with depth and replayability)
**One-liner:** Evolve bird-like AI swarms in a real-time competitive arena — breed behaviors, watch flocks battle for territory via emergent flocking + genetics.
**Technical Stack:** WebGL2 instanced particles (10k+ birds), boid flocking algorithm, simple genetic algorithm (mutation/selection per round), collision physics, territory heatmaps.
**Inspired by:** r/generative's Murmurations (flocking visuals) + GitHub's agent swarms (Qwen-Agent/agency-agents) — humans love watching emergent AI battles; flight tracker colors for altitude/score layers.

**Description:** Start with a flock of 500 colorful particles representing your swarm. Tweak 6 behavior sliders (cohesion, separation, alignment, aggression, speed bias, color morph) to define DNA. Hit PLAY — your flock spawns in a foggy circular arena against 2-3 rival swarms (procedurally varied DNA). Flocks flock, dodge, chase glowing food pellets and rival birds using classic boid rules + your DNA params. Kill rivals to grow your flock; hold territory center for bonus multipliers. After 60s, top flock's DNA auto-mutates slightly + breeds with survivors for next round. 5-round tournament with escalating arena hazards (winds, predators). Mobile drag orbits camera; keyboard for god-mode nudges.

**Target audience:** Creative coders, AI/game devs, procedural art fans — they'll obsess over tweaking DNA for "god flocks," share replay gifs of insane emergent patterns (toroidal swarms, kamikaze raids).

**Key features:**
- Real-time WebGL boid sim: 10k particles at 60fps via instanced rendering + GPU compute for forces.
- 6-DNA editor: Sliders mutate post-round; viz DNA as radial gene wheel.
- Emergent competition: Flocks steal food/gems from rivals, density-based territory scoring.
- Replay camera: Auto-cinematic replays of best moments (zoom on clashes, slow-mo evolutions).
- Share/export: DNA seeds + final heatmap PNG; embed replay video gen.
- Hazards rounds: Wind vortices, shrinking arena, predator particles.

**The hook:** That moment when your tweaked hyper-aggressive flock spirals into a death-vortex that shreds rivals — pure screenshot/gif gold for #creativecoding Twitter.

**Wow Test Results:**
1. Stop scrolling? YES — hypnotic flocks + evolution races grab eyes instantly like murmurations but playable.
2. Developer would share? YES — "I evolved this insane swarm strat" with replay GIF; devs love boids+GA browser demos.
3. Technical boundary pushed? YES — GPU-accelerated boids + real-time GA selection on 10k agents client-side; rare in single-file builds.
4. Different from this week? YES — Game/arena battles vs recent physics wires, data vortex, shader nodes.

### Scout Notes
GitHub's agent swarm hype + r/generative's murmurations screamed "make it interactive + competitive" — nobody's doing evolvable boid battles in-browser at scale. Beats static viz or tools because endless replay tweaking + sharing DNA creates virality loops. Most excited by GA viz challenge: mutating flocks visually emerge patterns humans never design (e.g. rotating phalanxes). Forge can nail instanced WebGL + boid GPU pass; this passes Wow harder than safe utils.

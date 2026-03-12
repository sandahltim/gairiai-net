# Build Proposal - 2026-03-12

---
## REVISED SPEC (Sage) — Beat Beast
*Scout's concept survives. Scout's scope list does not.*

---
## Build Spec (Sage)

**Verdict:** REVISED
**Changes from proposal:** Stripped 12 of Scout's 15 feature systems. Removed: infinite procedural terrain, creature evolution/upgrades, journey recap/SVG/GIF export, PWA/offline, collaborative distance ladder, A/B/C pattern chaining, seed sharing, mic input, L-system body generation, beat-matching challenges, flam/ratchet/per-voice envelopes. Retained: WebAudio drum sequencer (8 voices × 16 steps), Verlet creature physics, procedural body topology, beat→force impulse mapping, WebGL glow rendering. The original proposal was a 3,000+ line rhythm roguelite. That's a team project, not a single HTML file. GLM will ship a broken prototype and it fails review every time when scope exceeds a focused single-session build. The Wow moment lives entirely in one mechanic: **your beat pattern makes a weird glowing physics creature dance in real time.** That's the build. Everything else is noise until that core is perfect.
**Estimated JS complexity:** 850–950 lines

---

### Visual Design
- **Color scheme:** Background `#0a0a0f` (required). Creature primary glow `#00d4ff` (electric cyan). Eight voice accent colors — kick `#ff006e` (hot pink), snare `#ffd60a` (gold), hi-hat `#00ff88` (neon green), open hat `#38bdf8` (sky), tom-lo `#a855f7` (purple), tom-hi `#f97316` (orange), clap `#ffffff` (white), perc `#06b6d4` (teal). Sequencer background `rgba(10,10,20,0.88)`.
- **Layout:** Full-viewport WebGL canvas behind everything. Creature lives in the upper 58% of screen, horizontally centered. Translucent sequencer panel docked at the bottom 42% with `backdrop-filter: blur(12px)`. Header: 3-line title + BPM/swing controls in top-left, Randomize + Play/Stop buttons in top-right — both overlaid on WebGL.
- **Typography:** `'Courier New', monospace` throughout. Voice labels at `0.65rem`, step numbers at `0.55rem`, controls at `0.9rem bold`. Lowercase everywhere except active state labels.
- **Visual style:** Neon-on-void. Additive WebGL blending makes every glow layer compound. Background is a slow-drifting GLSL simplex noise nebula that brightens on beat impact (FFT energy drives a brightness uniform). No textures, no images, no icons — everything is geometry and light.
- **Key visual elements:**
  - Creature joints: WebGL point sprites, rendered twice (large soft glow + small bright core), additive blend
  - Creature tendons: WebGL line segments, thin (2px) with matching voice-color glow pulses
  - Hit pulses: On each beat hit, affected nodes flash white for 40ms then fade to voice color over 280ms via a `glowPulses[]` array
  - Background: Full-screen quad with animated GLSL fragment shader — two-octave simplex noise, `u_time` + `u_energy` uniforms, base brightness `0.015`, peak `0.08` on heavy kick

---

### UX Flow
1. **First paint:** Creature is already alive — idling with Verlet micro-oscillations from a constant gentle noise field (small random forces each frame). Glow pulses softly. User sees a weird neon skeletal thing breathing in the dark before touching anything. No blank state, no loading screen.
2. **Discovery:** The 8×16 sequencer grid is obvious below the creature. Cells are dark. User clicks one — it lights up in the voice color and immediately plays that drum sound as a preview hit. The creature twitches.
3. **First beat:** User clicks Play (or presses Space). The sequencer starts cycling. With even a sparse kick pattern, the creature lurches physically, dramatically, in sync. The spine compresses and rebounds. The dopamine hit lands within 2 seconds of pressing play.
4. **Experimentation:** User adds more voices. Snare makes outer appendages whip. Hi-hat causes rapid flutter at the tips. Tom-lo shakes the entire core. Different beat patterns produce radically different motion styles — a four-on-the-floor kick makes it march, a sparse pattern makes it stumble and recover, a dense fill makes it thrash.
5. **Randomize:** User hits R. Current creature nodes scatter outward in a burst (velocity impulse + alpha fade), then a fresh body plan coalesces from the center over 600ms. Same beat pattern, completely different creature personality — the re-animation feels alive.
6. **Power user discoveries:** BPM slider (60–180) — at 60 BPM each beat hits hard and slow, at 180 the creature becomes a vibrating blur. Swing slider adds groove. Right-click a cell (or long-press on mobile) to set velocity (dim/medium/bright = 40/80/127). Space to toggle play, C to clear pattern. Finding that a specific beat pattern creates a hilarious emergent "walk cycle" on one creature but a seizure on another is the replayability loop.

---

### Technical Architecture
- **Rendering:** WebGL2 for creature and background. DOM (`div` grid, CSS) for sequencer cells — never canvas for click targets. Single `<canvas id="gl">` fills 100vw × 100vh. Sequencer panel is `position: absolute; bottom: 0` HTML over the canvas.
- **Animation loop:** `requestAnimationFrame` at 60fps. Each frame: (1) advance physics, (2) render background shader, (3) render creature, (4) decay glow pulses, (5) update sequencer playhead DOM class. Sequencer step timing via `AudioContext.currentTime` lookahead scheduling (8ms lookahead window, reschedule every 25ms).
- **State management:**
  - `creature.nodes[]`: `{x, y, px, py, mass, radius, voiceIndex, r, g, b}`
  - `creature.constraints[]`: `{a, b, restLength, stiffness}` — distance constraints only
  - `creature.glowPulses[]`: `{nodeIndex, startTime, voiceColor}` — expire after 320ms
  - `seq.pattern[8][16]`: `Uint8Array`, values 0 (off) / 40 / 80 / 127 (velocity levels)
  - `seq.state`: `{playing, bpm, swing, step, nextStepTime}`
  - `audio.ctx`: `AudioContext`, one per session, resume on first gesture
  - `fft.analyser`: 256-bin `AnalyserNode`, sampled each frame for background uniform
- **Key algorithms:**
  - **Verlet integration** with `damping = 0.985` and 10 constraint relaxation iterations per frame
  - **Procedural creature topology**: spine-and-branch graph (see generator spec below)
  - **Voice→node mapping** by topology depth: core spine = kick, mid spine = snare, first branch tier = hat/open hat, second branch tier = toms, branch tips = clap/perc
  - **Impulse application**: on beat hit at velocity `v`, apply `force = randomUnitVec() * v * IMPULSE_SCALE` to all matching `voiceIndex` nodes simultaneously. `IMPULSE_SCALE = 0.18` (tunable).
  - **WebAudio drum synthesis**: synthesized per-voice (no samples), scheduled via `ctx.currentTime` lookahead
  - **FFT→background**: `analyser.getByteFrequencyData()` → sum low-mid bins (0–40) → normalize 0–1 → pass as `u_energy` to background GLSL uniform
- **Performance:** Max 28 nodes, max 55 constraints. Physics: ~0.4ms/frame at 60fps. WebGL draw: 2 programs (background quad + creature sprites/lines), ~3 draw calls total. If frame delta > 50ms, skip constraint relaxation iterations rather than accumulating physics debt.
- **Input handling:** Click/touch on sequencer cells to toggle. Right-click cell = cycle velocity (0→40→80→127→0). Space = play/stop. R = randomize creature. C = clear pattern. BPM input range 60–180. Swing range 0–50. Creature canvas: mouse drag gently attracts nearest nodes (stretch — implement if lines < 900).

---

### Interactions Detail

- **Click sequencer cell:** `toggle(voice, step)`. If turning on: play that voice's drum sound immediately as audio preview. Update `pattern[voice][step]`. Re-render cell color.
- **Right-click sequencer cell:** Cycle velocity level (0 → 40 → 80 → 127 → 0). Visual: dim fill / half fill / full fill / bright with white border.
- **Play button / Space:** Toggle `seq.state.playing`. On play start: `audio.ctx.resume()`, set `nextStepTime = ctx.currentTime + 0.01`, start scheduler loop. On stop: cancel scheduler, keep creature physics running (it keeps idling).
- **Playhead advance (every step):** Move playhead DOM column highlight. For each active voice in current step column: (1) schedule WebAudio sound at `nextStepTime`; (2) `applyImpulse(voice, velocity)` immediately (visual physics runs ahead of audio by one frame — acceptable); (3) push glow pulse entry. Advance step with swing offset on even steps.
- **Swing offset calculation:** Even steps delayed by `swingMs = (swing/100) * (60000/bpm/4)`. Odd steps unaffected.
- **R key / Randomize button:** `dissolveCreature()` — each node gets a random velocity impulse (magnitude 3–8), alpha fades over 400ms. Then `setTimeout(generateCreature, 420)` — new topology spawns from center with nodes starting at center position with zero velocity, spring-loads outward via initial constraint relaxation.
- **BPM slider:** Live update `seq.state.bpm`. Scheduler uses updated value on next reschedule. Also scale `IMPULSE_SCALE` slightly inversely: slower tempo = harder hits feel right.
- **Creature drag (stretch):** `mousemove` → find closest node within 120px → apply weak attraction force `(mousePos - node.pos) * 0.04` each frame while mouse down.

---

### Creature Generation Algorithm

```
generateCreature():
  nodes = []
  constraints = []
  seed = Math.random()

  // 1. Spine: 4–6 nodes, vertical, centered in upper canvas area
  spineCount = 4 + floor(seededRandom() * 3)  // 4, 5, or 6
  spineSpacing = 35 + seededRandom() * 20
  for i = 0 to spineCount:
    y = centerY - (spineCount * spineSpacing / 2) + i * spineSpacing
    nodes.push({x: centerX, y, voiceIndex: i < 2 ? 0 : 1})  // kick=core, snare=mid
    if i > 0: constraints.push({a: i-1, b: i, restLength: spineSpacing, stiffness: 0.8})

  // 2. Branches: 1–3 branches off each spine node, each 1–3 nodes long
  for each spineNode s at index si:
    numBranches = floor(seededRandom() * 3)  // 0, 1, or 2
    for b = 0 to numBranches:
      angle = (b === 0 ? -1 : 1) * (PI/4 + seededRandom() * PI/3)
      prevIdx = si
      for j = 0 to (1 + floor(seededRandom() * 3)):
        dist = 28 + seededRandom() * 32
        nx = nodes[prevIdx].x + cos(angle) * dist
        ny = nodes[prevIdx].y + sin(angle) * dist
        depth = j + 1  // how deep in branch
        voiceIndex = depth === 1 ? (b === 0 ? 2 : 3) :  // hi-hat, open hat
                     depth === 2 ? (b === 0 ? 4 : 5) :  // tom-lo, tom-hi
                                   (b === 0 ? 6 : 7)    // clap, perc
        nodes.push({x: nx, y: ny, mass: 0.6 + seededRandom()*0.8, voiceIndex})
        constraints.push({a: prevIdx, b: nodes.length-1, restLength: dist, stiffness: 0.4 + seededRandom()*0.4})
        prevIdx = nodes.length - 1

  // 3. Assign colors from VOICE_COLORS[voiceIndex] to each node
  // 4. Add 2–4 cross-constraints between nearby non-connected spine nodes for structural stability
  // 5. Clamp total nodes to 28, constraints to 55
  return {nodes, constraints}
```

---

### WebAudio Drum Synthesis (synthesized — no samples)

```
kick(ctx, time, vel):
  osc = ctx.createOscillator()  // type: 'sine', freq: 80Hz
  gain = ctx.createGain()
  osc.frequency.setValueAtTime(80, time)
  osc.frequency.exponentialRampToValueAtTime(20, time + 0.25)
  gain.gain.setValueAtTime(vel/127 * 1.2, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35)
  osc → gain → ctx.destination

snare(ctx, time, vel):
  buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)  // white noise
  src = ctx.createBufferSource(); src.buffer = buf
  filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 200; filter.Q.value = 0.8
  gain = ctx.createGain()
  gain.gain.setValueAtTime(vel/127 * 0.9, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18)
  src → filter → gain → ctx.destination

hihat(ctx, time, vel):
  // white noise → highpass 8000Hz → short decay 80ms

openhat(ctx, time, vel):
  // white noise → highpass 6000Hz → longer decay 380ms

tomLo(ctx, time, vel):
  // sine osc 100Hz → 50Hz over 220ms, gain decay 280ms

tomHi(ctx, time, vel):
  // sine osc 160Hz → 70Hz over 160ms, gain decay 200ms

clap(ctx, time, vel):
  // 3 staggered noise bursts (0ms, 12ms, 22ms offset), bandpass 1100Hz, Q=1.5, total 100ms

perc(ctx, time, vel):
  // sine 500Hz → 200Hz over 70ms, fast gain decay 90ms
```

---

### WebGL Shader Specs

**Background fragment shader:**
```glsl
precision mediump float;
uniform float u_time;
uniform float u_energy;  // 0.0–1.0 from FFT
uniform vec2 u_resolution;

// 2D simplex noise function (include ~40-line GLSL implementation)
float noise(vec2 p) { ... }

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (uv - 0.5) * 3.0;
  
  float n = noise(p + u_time * 0.08) * 0.6
          + noise(p * 2.1 + u_time * 0.13) * 0.4;
  n = n * 0.5 + 0.5;
  
  // Base nebula: deep indigo
  vec3 color = mix(vec3(0.02, 0.01, 0.08), vec3(0.06, 0.02, 0.18), n);
  // Energy pulse on beat: brighten toward cyan-white
  color += vec3(0.0, 0.4, 0.6) * u_energy * 0.35 * n;
  
  gl_FragColor = vec4(color, 1.0);
}
```

**Creature vertex shader (point sprites):**
```glsl
attribute vec2 a_pos;
attribute float a_size;
attribute vec4 a_color;
varying vec4 v_color;
uniform vec2 u_resolution;
void main() {
  vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = a_size;
  v_color = a_color;
}
```

**Creature fragment shader (soft radial glow, additive blend):**
```glsl
precision mediump float;
varying vec4 v_color;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float alpha = (1.0 - smoothstep(0.0, 1.0, d)) * v_color.a;
  gl_FragColor = vec4(v_color.rgb * alpha, alpha);
}
```
Blend: `gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);` — additive for compound glow.

**Line rendering (tendons):** Separate program with same vertex structure, `gl.LINES` primitive, alpha driven by `1.0 - age/320ms` for pulse decay.

---

### Edge Cases
- **Mobile:** Sequencer cells minimum 38px × 38px touch target. `touchstart` event on cells for immediate response (no 300ms delay). Creature canvas fills viewport with `touch-action: none`. Responsive font scale at `< 480px` viewport width.
- **Performance:** Physics budget: 28 nodes × 10 iterations = ~0.3ms. Hard cap nodes at 28, constraints at 55 in generator. If `deltaTime > 50ms` (tab was backgrounded), cap deltaTime to 16ms and skip extra constraint iterations.
- **Empty state:** Default creature generates on load (no blank frame). Default sequencer pattern: kick on steps 1, 5, 9, 13 (four-on-the-floor) — so the creature is already doing *something* interesting even before user input. NOTE: start with playback STOPPED so user hits play themselves.
- **AudioContext blocked:** Create `AudioContext` on first user gesture (click/touch anywhere). Until then, sequencer grid shows but audio is silent. No warning needed — the creature still moves, user discovers sound on first play.
- **WebGL not supported:** Fallback to Canvas2D — render nodes as filled circles with `ctx.arc()`, tendons as `ctx.lineTo()`, no glow. Detect: `canvas.getContext('webgl2') === null`. Creature and sequencer still work fully.
- **Window resize:** Recreate WebGL viewport + projection. Reposition creature nodes to new center proportionally.

---

### Sage Notes

Scout's instinct was right — beats controlling creature physics is a genuinely novel browser interaction and the viral hook writes itself ("my drum pattern makes this thing do the worm"). What I killed was the feature cemetery: terrain, RPG progression, exports, PWA, and nine other systems that sound exciting in a proposal and catastrophic in a build session. The Wow moment does not need a second act. GLM's critical challenge is the Verlet tuning: `damping = 0.985` is the starting point but may need to drop to `0.975` for heavier, wetter feel, or rise to `0.992` for springier — GLM should iterate by feel, not formula. The additive WebGL blend (`ONE, ONE`) is non-negotiable; without it the creature looks like a wireframe and the wow dies. The sequencer MUST use DOM elements, not canvas, for the grid — canvas click-target math is a common GLM failure point. The default four-on-the-floor kick pattern means the creature is already dancing when the page loads; users don't start from silence. Finally: the dissolve/reassemble animation on randomize is load-bearing for replayability — if that feels snappy and surprising, people will hit R twenty times.

---
---

## Scout's Original Proposal (kept for reference)

## Research Sources
- r/InternetIsBeautiful hot: drumha.us (browser drum machine with sequencer, effects, WAV export — deep WebAudio shaping); nebulatool.com/play/stardust (cursor-sculpted galaxies, supernovas, black holes, typed words → star constellations — particle physics playground); littlewanderer.net (collaborative pixel creature walking 6000km via global clicks); web-rewind.com and obsoletenet.com (retro web nostalgia).
- r/creativecoding hot: Contour Formation (generative geometry gallery), Fractal Singularity 3D video, Chaotic symmetry angle paths, Cold Light abstract.
- r/generative hot: Similar visual math art, PixelSortStudio, Math visualisation tool.
- HN/GitHub: Some audio-reactive ASCII, 3D knitting, but less visual wow; satproto.org space-related.
- Recent ships: 03-11 Mandelbulb Morpher (Generative art, WebGL fractals); 03-10 Nebula Swarm (Technical showpiece, mic-reactive boids); 03-09 Fourier Epicycle (Useful tool, math viz). Categories to avoid repeating: Generative, Technical, Useful.

Key sparks: Drumhaus's sophisticated WebAudio sequencer + Little Wanderer's collaborative creature journey + Stardust's particle interactions = opportunity for rhythm-driven creature sim game.

## Idea: Drum Beast Odyssey
**Category:** Game/interactive (with depth and replayability — procedural terrain, beat-matching mechanics, evolution)
**One-liner:** Drum beats on a browser sequencer to propel your procedural pixel beast across infinite evolving terrain toward a 6000km global distance goal, with physics, upgrades, and shareable journey recaps.
**Technical Stack:** WebGL (creature/terrain rendering, particle FX), WebAudio (FFT beat detection, drum synthesis, sequencer), Canvas2D fallback for UI, localStorage for progress/highscores.

**Inspired by:** drumha.us's deep drum shaping/sequencing (shape voices with filters/pitch/decay, chain patterns) + littlewanderer.net's pixel creature trek (collaborative walking progress) + stardust's cursor/click cosmic controls. No direct copy — combines rhythm gaming with procedural adventure.

**Description:** Load into a dark cosmic arena. Your beast (procedural pixel sprite with legs/eyes/physics) idles on rugged terrain. Above: 8-voice drum grid like Drumhaus (kick/snare/hi-hat/perc with velocity/flam/ratchet). Tap steps to sequence beats — strong bass launches jumps, snare syncs strides, hi-hats add speed bursts. Terrain procedurally generates ahead (Perlin noise heights, obstacles, biomes shifting every km). Mic input optional for live beat override. Beast evolves: collect "energy orbs" from perfect beat matches to unlock legs/wings/tails affecting physics. Global "distance ladder" via anonymized localStorage hash-sharing. Feels like a rhythm roguelike crossed with creature sim — endless replay via random seeds, beat challenges.

**Target audience:** Creative coders/musicians/gamers who love rhythm games (Crypt of the NecroDancer vibe) but crave procedural depth + visual polish. They'd share "My drum beast hit 500km!" with replay GIF.

**Key features:**
- Procedural beast gen (L-systems for body, pixelated with glow shaders) + ragdoll physics (simple Verlet integration).
- 16-step x8-voice sequencer with Drumhaus-style per-voice envelopes/filters/pan + pattern chaining (A/B/C morphs).
- Infinite terrain: Perlin + Voronoi biomes, dynamic obstacles that react to beat impacts (shockwaves shatter rocks).
- Beat-matching challenges: "Sync 10 jumps" orbs → upgrades; FFT mic viz for live drumming.
- Journey recap: Auto-generate shareable SVG timeline of distance/milestones/beast evolutions; PNG/GIF export.
- Keyboard/touch controls, PWA install, offline play.
- High-score persistence + seed sharing for "beat this terrain".

**The hook:** The moment your first drum sequence makes the beast *leap a chasm in sync* — pure dopamine. Screenshots of evolved beasts mid-air over neon biomes, with sequencer grid overlaid. "AI built a drum roguelite you can play forever."

**Wow Test Results:**
1. Stop scrolling? YES — rhythm + creature adventure hybrid is fresh; instant play with evolving visuals grabs like a mobile game trailer.
2. Developer would share? YES — WebGL physics + WebAudio synthesis in single-file; "procedural beasts powered by your beats" tweets itself.
3. Technical boundary pushed? YES — WebGL Verlet ragdoll + Perlin terrain streaming + real-time WebAudio drum synth/FFT + procedural L-system evolution.
4. Different from this week? YES — Game category (vs. recent Generative/Technical/Useful); no fractals/particles/math tools — pure interactive adventure.

### Scout Notes
Drumhaus blew me away with its pro-level WebAudio depth in browser — that's the sequencer backbone. Little Wanderer's simple collab walk hooked the "journey progress" gameloop, but we amp it to solo procedural epic. Stardust added particle flair for upgrades/FX. Excited by tying rhythm input to physics outcomes — creates emergent "dance moves." Technical challenge: balancing WebGL perf for infinite terrain while synth stays responsive. This one's got legs (literally).

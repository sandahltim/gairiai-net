# Build Proposal - 2026-03-10

> **SAGE REVISION NOTE:** Concept approved with modifications. Renamed from "Sonic Nebula Forge" to **"Nebula Swarm"** to avoid clash with 03-06 Sonic Wire Forge. GIF/MP4 export cut (scope creep — distracts from core). Spatial hash grid added as non-negotiable performance requirement. See full BUILD SPEC below.

---

## Research Sources
- r/InternetIsBeautiful hot: Parametric pattern generator (solidvents.com - vector grills export), Scroll Speedometer (5s thumb scroll test), Double Pendulum Playground (interactive physics), Electricity 20-year forecast tool, Postcard Atlas (electronic postcards).
- r/creativecoding hot: Realtime Audioreactive Pointclouds (PF available), Interactive Footer, Self-decorating code, ODE music & social dynamics, Mondrian-style art.
- r/generative hot: Julia set, Maelstrom fractal video, Chaotic symmetry angle paths, Contour paper-art, Norm-5 Fractal curve.
- HN: Double Pendulum, parametric tools trending.
- Recent ships: 03-09 Fourier Epicycle Sculptor (math vis), 03-08 Ant Wars Arena (game sim), 03-07 Morphogenesis Engine (bio generative), 03-06 Sonic Wire Forge (audio?), 03-05 Billionaire Wealth Vortex (data viz). Avoiding repeats: no math vis, no games, no bio sims. Recent has some audio? But pushing further with visuals.

Cool finds: Audioreactive pointclouds grabbed me - real-time mic/FFT driving 3D particles. Double pendulum chaos sims popular. Parametric generators useful/bookmarkable.

## Idea: Sonic Nebula Forge
**Category:** 1. Technical showpiece (physics, WebGL, audio synthesis)
**One-liner:** Real-time microphone-reactive particle nebula that morphs shapes, flocks, and explodes to your voice or music — sculpt cosmic clouds with sound.
**Technical Stack:** WebAudio API (FFT analysis, microphone input), Three.js/WebGL (10k+ GPU point cloud with custom shaders), Cannon.js (loose physics/flocking), procedural noise (Perlin/curl for nebula organic flow).

**Inspired by:** r/creativecoding's "Realtime Audioreactive Pointclouds" — taking mic-reactive particles to nebula-scale with physics swarms and shader glow/trails, plus upload audio support.

**Description:** Load the page, grant mic access, speak/sing/play music nearby — watch 20k particles burst into a swirling nebula, frequency bands controlling density/clustering (bass clumps core, highs scatter sparks), amplitude driving explosion/implosion waves. Sliders tweak flock behavior, shader params (glow intensity, trail length), FFT smoothing. Export animated GIF of your session. Not just viz — emergent flocking creates alien lifeforms from your voice.

**Target audience:** Creative coders, musicians, VJs, procedural art fans — they'd embed it in streams or share clips saying "AI made my screams into galaxies."

**Key features:**
- Real-time FFT spectrum → particle position/velocity/color (bass=deep purples cluster, treble=fiery sparks fly).
- Flocking sim (separation/alignment/cohesion) biased by audio bands for organic morphs.
- Custom GLSL vertex/fragment shaders for nebula glow, distortion, motion blur trails.
- Mic + drag-drop audio file upload (WebAudio decode).
- Physics impulses from beat detection (peaks trigger swarm bursts).
- Real-time scope + spectrum overlay, export GIF/MP4.
- Responsive — scales to mobile for live performances.

**The hook:** Record yourself yelling lyrics, particles swarm into demonic shapes; hum a melody, serene galaxy blooms. People screenshot/share the hypnotic chaos: "My voice summoning nebulae in browser??"

**Wow Test Results:**
1. Stop scrolling? YES — instant mic-reactive particles exploding grabs eyes like fireworks.
2. Developer would share? YES — WebAudio+WebGL+physics stack showcases bleeding-edge perf (60fps 20k pts).
3. Technical boundary pushed? YES — GPU-accelerated FFT-driven flocking shaders, beat-reactive physics in <1s load.
4. Different from this week? YES — No audio-reactive 3D since Sonic Wire Forge (wireframe only); this is full nebula swarm, post-ant-wars/no math vis.

### Scout Notes
r/creativecoding's audioreactive pointclouds lit me up — basic pts, but imagine scaling to nebula with flocking/physics? Paired with double pendulum chaos vibe but audio-driven. Beats recent math/bio sims; pure sensory explosion devs screenshot. Tech challenge: optimize 20k pt cloud for mobile + shader audio mapping. I'm buzzing — this screams viral Twitter clip.

---

## Build Spec (Sage)

**Verdict:** REVISED
**Build name:** Nebula Swarm
**Changes from proposal:**
- Renamed from "Sonic Nebula Forge" → "Nebula Swarm" (too close to 03-06 "Sonic Wire Forge")
- GIF/MP4 export CUT — scope creep, detracts from core experience, adds ~200 lines of unreliable boilerplate
- Spatial hash grid for boids ADDED as explicit requirement (non-negotiable for 20k particles at 60fps)
- Cannon.js dependency REMOVED — no external physics lib needed, boids + impulses are pure JS math
- Ambient no-mic mode REQUIRED — page must be visually beautiful before any permissions are granted
- Precise GLSL shader algorithms specified below

**Estimated JS complexity:** ~900–1100 lines

---

### Visual Design

- **Background:** `#0a0a0f` (required site standard)
- **Bass cluster core:** gradient `#3b0764` → `#7c3aed` (deep violet/purple — heavy, gravitational)
- **Mid-range ribbons:** `#0f766e` → `#14b8a6` (teal — flowing, connective)
- **High-freq sparks:** `#ea580c` → `#fbbf24` (orange-gold — hot, scattered)
- **Glow bloom tint:** `#c026d3` (magenta, additive)
- **UI chrome:** `rgba(255,255,255,0.06)` glassmorphism panels, `1px solid rgba(255,255,255,0.10)` border, `backdrop-filter: blur(12px)`
- **Spectrum overlay bar:** bottom-center, 12px tall, `rgba(0,0,0,0.4)` bg, bar colors mirror particle band colors

**Layout:** Full-viewport Three.js canvas (`position: fixed; inset: 0`). Two collapsible glassmorphism control panels — one left edge (flock params), one right edge (visual params). Both collapse to a thin `[ ⚙ ]` strip on hover. Spectrum/scope overlay anchored to bottom-center, 300px wide, always visible. "NEBULA SWARM" wordmark top-left in `0.65rem` monospace `#ffffff30`.

**Typography:** `system-ui`, `font-size: 0.72rem`, `letter-spacing: 0.08em`, `color: rgba(255,255,255,0.55)` for UI labels. No headers competing with the art.

**Visual style:** Dark cosmic — deep space nebula aesthetic. Particles render with additive blending (`THREE.AdditiveBlending`) so density creates natural luminosity. Point sizes range 1.5–5px based on velocity magnitude. Soft circular points (fragment shader alpha falloff from center).

**Key visual elements:**
- 20,000 Three.js `Points` with `BufferGeometry` + custom `ShaderMaterial`
- Additive blending accumulates glow naturally at particle density clusters
- `THREE.UnrealBloomPass` at `strength: 1.2`, `radius: 0.4`, `threshold: 0.1`
- Chromatic aberration pass (simple `vec2` UV offset in fragment shader, ±0.003)
- Particle trails via `MeshBasicMaterial` plane with `opacity: 0.03` overdraw each frame (cheap "motion blur" accumulation)
- Camera slowly auto-orbits at 0.05 rad/s unless user has touched it

---

### UX Flow

1. **First impression (0 permission required):** Page loads to a gently drifting cosmic nebula — 20k particles in ambient mode driven by curl noise + low-amplitude Perlin breathing. Three soft violet/teal clusters slowly orbit a common center. Looks stunning before any interaction. Bottom center: `🎤 Click to activate microphone` pulsing softly.
2. **Mic activation:** User clicks anywhere or the mic button. `getUserMedia` prompt fires. On grant, particles immediately respond to ambient room sound — even light background noise causes visible turbulence.
3. **Discovery:** User speaks/claps/plays music. Bass frequencies cause the violet core to contract and pulse. Treble scatters orange sparks outward in jets. Beat peaks send a radial shockwave impulse through all particles. The reaction is instant and legible.
4. **Exploration:** User finds the left panel (hover/tap) — `Cohesion`, `Separation`, `Alignment`, `Turbulence` sliders. Cranking Cohesion makes tight black-hole clusters; maxing Separation creates explosive spray. Right panel has `Bloom`, `Trail Length`, `Point Size`, `Color Preset` (3 themes: Cosmic, Inferno, Arctic).
5. **Power user / mastery:** Keyboard shortcuts (shown in tiny tooltip on `?` keypress). Press `C` for chaos mode — flock weights randomly perturb every 1.5s, particles form alien shapes. Drag audio file onto canvas to switch from mic to file mode. Press `R` to reset particles to sphere shell. Click anywhere to send a burst impulse from cursor.

---

### Technical Architecture

**Rendering:** Three.js r165+ WebGL (no WebGPU — must work on all browsers)
- `THREE.Points` with `BufferGeometry`
- `THREE.ShaderMaterial` with custom GLSL vertex + fragment shaders
- `THREE.EffectComposer` → `THREE.RenderPass` → `THREE.UnrealBloomPass` → custom `ChromaticAberrationPass`
- Post-processing target: 2× MSAA off (particles don't need it), bloom threshold tuned so only cluster density lights up

**Animation loop:**
```
requestAnimationFrame loop:
  1. Read FFT → audioData[1024] (Uint8Array from AnalyserNode)
  2. Extract band energies: bass[0–3], mid[4–20], treble[21–100]
  3. Beat detection: compare current energy vs rolling avg (spectral flux)
  4. Update boids (spatial hash → neighbor lookup → separation/alignment/cohesion forces)
  5. Apply curl noise field to each particle (lookup from pre-computed 256×256 table)
  6. Apply audio-derived forces: bass → centripetal pull to core, treble → radial scatter
  7. If beat detected: apply radial impulse (position += normalize(pos) * beatStrength)
  8. Upload position Float32Array to GPU via geometry.attributes.position.needsUpdate = true
  9. Upload per-particle color/size data similarly
  10. composer.render()
```
Target: 60fps on MacBook Pro class hardware, 30fps acceptable on mobile.

**State management:**
```javascript
// Core particle state — all Float32Arrays for GPU upload
positions: Float32Array(20000 * 3)    // xyz world coords
velocities: Float32Array(20000 * 3)   // xyz velocity
colors: Float32Array(20000 * 3)       // rgb per-particle (band assignment)
sizes: Float32Array(20000)             // point size driven by velocity magnitude
bandAssign: Uint8Array(20000)          // 0=bass, 1=mid, 2=treble (determines flock group)

// Audio state
analyser: AnalyserNode               // FFT size 2048
fftData: Uint8Array(1024)
bassEnergy: number                   // 0–1 normalized
midEnergy: number
trebleEnergy: number
beatDetected: boolean
beatHistory: Float32Array(30)        // rolling window for spectral flux

// Spatial hash (boids)
hashGrid: Map<string, number[]>      // cell key → particle indices
CELL_SIZE: 15                        // world units, tune for density

// Curl noise
noiseTable: Float32Array(256*256*2)  // pre-computed 2D curl vectors, sampled by xz
noiseOffset: {x: 0, z: 0}           // drifts slowly over time for animated flow
```

**Key algorithms:**

1. **Boids (Separation / Alignment / Cohesion)** — Standard Reynolds boids with spatial hash grid for O(n) neighbor lookup:
   - Rebuild hash grid each frame (fast — just bucket 20k points into cells)
   - Neighbor radius: 12 world units
   - Forces weighted by audio band energy: bass cohesion boosted 3× when bassEnergy > 0.6, treble separation boosted 2× when trebleEnergy > 0.5
   - Each of 3 flock groups (bass/mid/treble particles) runs independent boids, plus a weak cross-group attraction to the global centroid

2. **Curl Noise (background flow field):**
   - Pre-compute 256×256 table: sample Perlin noise at `(x, z)` and `(x+ε, z+ε)`, take finite-difference gradient, rotate 90° for curl
   - Each frame: add `curlVector * curlStrength` to velocity
   - `noiseOffset` drifts at 0.02/frame for animated flow evolution
   - Result: particles spiral and swirl even with no audio input

3. **Beat Detection (spectral flux):**
   - Each frame compute `currentEnergy = sum(fftData[0..20])²`
   - Compare to `rollingAvg = mean(beatHistory[last 30 frames])`
   - If `currentEnergy > rollingAvg * 1.5` AND `beatCooldown === 0`: fire beat event
   - Beat event: apply `velocity += normalize(position - centroid) * 18.0` to all particles within 30 units of centroid
   - `beatCooldown = 12` frames (prevents double-trigger on sustained bass)

4. **GLSL Vertex Shader:**
```glsl
uniform float uBassEnergy;
uniform float uTime;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;
  // Point size: base 2.0, scaled by velocity magnitude encoded in aSize, boosted by bass
  gl_PointSize = aSize * (2.0 + uBassEnergy * 3.0);
  // Slight wobble displacement on vertex (subtle, <0.5 units)
  vec3 pos = position + vec3(
    sin(uTime * 0.7 + position.y * 0.1) * 0.3,
    0.0,
    cos(uTime * 0.5 + position.x * 0.1) * 0.3
  ) * uBassEnergy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  // Alpha: near camera = more opaque
  float depth = gl_Position.z / gl_Position.w;
  vAlpha = clamp(1.0 - depth * 0.3, 0.4, 1.0);
}
```

5. **GLSL Fragment Shader:**
```glsl
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Soft circular point — distance from center
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float dist = length(uv);
  if (dist > 1.0) discard;
  // Soft falloff — bright core, fade edges
  float alpha = (1.0 - dist * dist) * vAlpha;
  // Inner glow ring
  float glow = smoothstep(0.6, 0.0, dist) * 0.6;
  gl_FragColor = vec4(vColor + glow, alpha * 0.85);
}
```

**Performance considerations:**
- `bufferSubData` equivalent via Three.js `attributes.needsUpdate = true` (no full buffer reallocation)
- Spatial hash rebuilt from scratch each frame — faster than incremental update for this density
- Mobile LOD: detect `window.devicePixelRatio > 1.5 && /Mobi/.test(navigator.userAgent)` → reduce to 8k particles, disable bloom (use simple `MeshBasicMaterial` multiply instead)
- FPS monitor: if `fps < 30` for 5 consecutive seconds → halve particle count, log warning to console
- Curl noise table pre-computed once at init (avoids per-frame Perlin calls)
- Camera auto-orbit uses `requestAnimationFrame` delta time (not fixed step)

**Input handling:**
- **Mic:** `navigator.mediaDevices.getUserMedia({audio: true, video: false})` → `AudioContext` → `MediaStreamSourceNode` → `AnalyserNode`
- **File upload:** Drag-drop on canvas OR file input → `AudioContext.decodeAudioData` → `AudioBufferSourceNode` → same `AnalyserNode`; file loops on end
- **Mouse drag:** `pointerdown` + `pointermove` → manual azimuth/elevation orbit (quaternion-based, same feel as OrbitControls without the dependency)
- **Mouse click:** Fire burst impulse centered on cursor's 3D ray intersection with `z=0` plane
- **Mouse move (no drag):** Subtle gravity well — nearest 800 particles feel 2% pull toward cursor projection each frame
- **Scroll/pinch:** Camera `fov` zoom (THREE.PerspectiveCamera.fov), clamp 20°–90°
- **Touch:** `pointerdown`/`pointermove` work via pointer events API (mobile native); pinch via two-touch distance delta

---

### Interactions Detail

| Trigger | Animation | Result | Feedback |
|---------|-----------|--------|----------|
| **Click (canvas)** | Radial burst impulse from click point | Particles in 40-unit radius launch outward, orbit back via cohesion | Brief white flash ring at click point (DOM div, CSS animation, 200ms) |
| **Drag (canvas)** | Camera azimuth + elevation orbit | Nebula rotates to reveal depth of 3D particle volume | Smooth, no snap — 0.92 momentum damping |
| **Mouse move** | Gentle cursor gravity | Nearest particles drift toward cursor at 2% strength | Subtle — feels magnetic, not jarring |
| **Scroll/pinch** | FOV zoom | Camera narrows/widens, particles appear to expand/contract | Smooth ease 0.1 lerp per frame |
| **Space** | Freeze FFT read | Particles continue physics but audio frozen at last frame | Freeze icon appears in mic indicator (❄️) |
| **R key** | Reset positions | All particles lerp back to sphere-shell distribution over 1.2s | Smooth spring interpolation, not teleport |
| **T key** | Toggle trails | Motion blur accumulation plane shows/hides | Slight fade transition (0.3s opacity) |
| **B key** | Toggle bloom | `UnrealBloomPass` `enabled` flag | Noticeable quality shift — off mode looks "raw" |
| **C key** | Chaos mode on/off | Flock weights perturb ±40% randomly every 1.5s | Indicator LED in UI pulses orange |
| **M key** | Toggle control panels | Both panels slide in/out (CSS `transform: translateX`) | 0.25s ease-out |
| **1/2/3 keys** | Color preset switch | All particle colors lerp to new scheme over 0.8s | Smooth gradient, not snap |
| **? key** | Show shortcuts | Glassmorphism overlay with keybinding list | Auto-dismiss 4s |
| **Drop audio file** | Switch to file mode | File decoded, loops; mic indicator shows filename | "FILE MODE" badge replaces mic indicator |

---

### Edge Cases

**Mobile:**
- Touch events via Pointer Events API (works iOS Safari + Android Chrome)
- Single finger = orbit, two fingers = pinch zoom
- Particle count: 8k (not 20k)
- Bloom disabled (perf)
- Control panels: tap canvas center to toggle fullscreen overlay controls (not side panels)
- Viewport: `meta viewport content="width=device-width, initial-scale=1, maximum-scale=1"` to prevent pinch-page-zoom interfering with canvas pinch

**Performance fallback:**
- FPS measurement: rolling 30-frame average
- If avg < 30fps → halve particles, disable bloom
- If still < 20fps → disable trails, reduce curl noise influence
- Performance tier communicated via small `⚡ reduced quality` badge bottom-right (auto-dismiss 3s)

**Empty state (ambient mode):**
- Particles initialize in sphere shell distribution (radius 50)
- Curl noise + mild Perlin breathing creates organic motion immediately
- 3 loose flock clusters gently orbit — visually compelling before any audio
- "No audio? It's still beautiful." feeling intentional

**Error handling:**
- `getUserMedia` denied → fade in "Mic blocked — try file upload ↑" message; ambient mode continues
- `AudioContext` suspended (browser autoplay policy) → show "Tap anywhere to activate audio" overlay; any click resumes context
- Three.js/WebGL not supported → friendly "WebGL required for Nebula Swarm" message with emoji; no blank screen
- File decode fails → `"Unsupported format — try MP3 or WAV"` toast notification
- Mobile iOS Safari `getUserMedia`: requires HTTPS AND user gesture — handled correctly since all activation is click-gated

---

### Sage Notes

I renamed this "Nebula Swarm" — "Sonic Nebula Forge" was half-step from "Sonic Wire Forge" and Forge doesn't need naming confusion 4 days apart. The concept is legitimately different (full 3D GPU point cloud with emergent flocking vs. spring-wire resonance geometry), but the name would have made it look like a sequel.

The spatial hash grid for boids is the single most important performance decision in this build — without it, 20k × 20k neighbor comparisons at 60fps are impossible on any device. Forge must implement this; do not skip it for a "good enough" O(n²) version. It's ~50 lines of code that make the whole build viable.

The ambient mode matters as much as the mic mode. Most users will see the page before granting microphone access — that first 3 seconds needs to earn the permission click. Pre-compute the curl noise table at load time so the ambient drift is smooth from frame one, not choppy.

Don't let the GLSL shaders be an afterthought. The bloom threshold and `UnrealBloomPass` settings I specified (`strength: 1.2, radius: 0.4, threshold: 0.1`) are intentional — too much bloom and the nebula looks like a soap bubble; too little and it looks like a screensaver. The additive blending doing the heavy lifting (cluster density = natural luminosity) is the correct approach; the bloom is accent, not the primary glow effect.

# Build Proposal - 2026-03-13

---
## Build Spec (Sage)
**Verdict:** APPROVED
**Changes from proposal:** Upgraded from vague "WebGL globe" to precise two-pass bloom pipeline, Fresnel atmosphere shader, procedural night-side city lights, hover ray-cast quake info cards, Web Audio magnitude rumble, and instanced billboard particles with per-instance fade/trail uniforms. Scout's proposal was directionally strong; the spec adds the precision Codex needs to hit the visual standard.
**Estimated JS complexity:** 1100–1400 lines (WebGL2 boilerplate ~200, shaders ~250, particle system ~200, USGS fetch/parse/cache ~100, orbit controls ~100, bloom pipeline ~150, UI panels ~100, Web Audio ~80)

---

### Visual Design
- **Color scheme:**
  - Background: `#000005` (near-black space, slightly blue-shifted)
  - Globe ocean base: `#04102b`
  - Globe land base: `#0d2a14`
  - Globe atmosphere rim (Fresnel): `#1a6fff` fading to transparent
  - Night side city glow: `#ff9944` at ~0.15 opacity in populated zones
  - Magnitude colors:
    - M < 2.0: `#6644ff` (faint violet, dim alpha)
    - M 2.0–3.9: `#00aaff` (ice blue)
    - M 4.0–4.9: `#ffcc00` (amber)
    - M 5.0–5.9: `#ff6600` (orange)
    - M 6.0–6.9: `#ff2200` (red)
    - M 7.0+: `#ffffff` → `#ff0000` flare (white core, red halo)
  - UI panels: `rgba(5,10,25,0.85)` with `1px solid rgba(100,160,255,0.25)` border, `backdrop-filter: blur(12px)`
  - Accent/hover: `#4488ff`

- **Layout:** Full viewport canvas (100vw × 100vh). Globe centered. Floating HUD overlays:
  - Top-left: Live quake counter + last-updated timestamp
  - Bottom-center: Horizontal time slider (24h / 7d toggle)
  - Bottom-right: Magnitude legend with color swatches
  - Center-right: Collapsible quake info card (appears on hover)
  - Top-right: Minimal controls hint

- **Typography:** `'Courier New', monospace` for data readouts (techy feel). `system-ui` for labels. Sizes: 11px for legend details, 13px for HUD, 16px for quake info card title. All text `#c0d4ff`.

- **Visual style:** Deep space cinematic. Dark void. Globe glows from within its own data. No grid, no borders, no chrome — just the Earth and its violence.

- **Key visual elements:**
  - Atmospheric Fresnel glow ring (electric blue halo around globe limb)
  - Instanced billboard particles at epicenters: burst sprite + trailing fade
  - Expanding radial ripple rings on globe surface (great-circle distance in globe fragment shader)
  - Starfield background: 2000 static white points, slight parallax on orbit drag
  - Bloom post-process: bright quake cores bleed into surrounding space
  - Night side city lights: warm orange glow in urbanized regions (shader approximation)

---

### UX Flow
1. **Page loads:** Starfield fades in first (0.5s). Globe sphere emerges from dark with slow rotation (0.3 rpm). Atmospheric halo pulses once. "Fetching live data..." status blinks in top-left. Starfield has subtle parallax even before interaction.
2. **Data arrives (< 2s typically):** Quakes bloom onto globe simultaneously — oldest ones already half-faded, recent ones burst bright. Each burst plays a staggered 50ms delay so it looks like the Earth "lighting up" from accumulated activity. Quake counter increments live.
3. **User discovers orbit:** Mouse drag → smooth spherical orbit (quaternion slerp, not Euler to avoid gimbal). Inertia: when released, globe coasts and decelerates over ~1.5s. Pinch/scroll = zoom (0.5x–3x). Touch: two-finger rotate + pinch.
4. **User hovers near a quake:** Mouse-to-sphere ray cast computes nearest epicenter within 40px screen radius. Info card slides in from right: magnitude badge (color-coded), location name (from GeoJSON properties.place), depth, time ago (e.g. "3h 22m ago"), coordinates. Card stays until mouse moves away.
5. **User drags time slider:** Smoothly filters visible quakes by time window. Quakes outside window fade out gracefully (alpha → 0 over 300ms). Slider at rightmost = live mode (auto-refresh every 60s, blinking green dot).
6. **Power user discovers:** Press `Space` = reset to auto-orbit. Press `H` = toggle quake density heatmap layer (warm overlay showing seismically active zones). Press `A` = toggle audio rumble on/off. Click any quake burst = locks camera on that epicenter, shows extended info.

---

### Technical Architecture

- **Rendering:** WebGL2 (pure, no external libraries). Two render targets for bloom pipeline.

- **Animation loop:** `requestAnimationFrame`, uncapped but with `performance.now()` delta-time for physics. Target 60fps. Particle updates happen on CPU (small N — max ~2000 quakes per week); instanced draw calls to GPU.

- **State management:**
  ```
  state = {
    quakes: Array<{lon, lat, depth, mag, time, xyz: vec3, age: float}>,
    camera: {theta, phi, radius, target: quat, inertia: vec2},
    timeWindow: {mode: '24h'|'7d', cursor: float},  // cursor = hours back
    hovered: QuakeIndex | null,
    selected: QuakeIndex | null,
    bloom: {enabled: true, threshold: 0.6, radius: 1.2},
    audio: {ctx: AudioContext, enabled: bool},
    lastFetch: timestamp,
    globeRotation: float  // radians, auto-increments
  }
  ```

- **Key algorithms:**
  1. **Lat/lon → XYZ sphere projection:** `x = cos(lat)*cos(lon)`, `y = sin(lat)`, `z = cos(lat)*sin(lon)` (unit sphere, radius 1.0 in world space)
  2. **Quaternion orbit camera:** Mouse delta → quaternion rotation; `quat.slerp()` for smooth lerp between frames; prevents gimbal lock at poles
  3. **Fresnel atmosphere:** `pow(1.0 - dot(viewDir, normal), 3.0) * atmosphereColor` in globe vertex shader
  4. **Ripple rings on surface:** In globe fragment shader, for each active quake (capped at 30 nearest), compute `greatCircleDist(fragLatLon, quakeLatLon)`. If `abs(dist - waveRadius) < waveWidth`, add radial glow contribution. `waveRadius` grows as `quakeAge * waveSpeed`.
  5. **Night-side city lights:** Compute `dot(fragPos_world, sunDir) < 0` → night fragment. Then sample a hardcoded procedural "population" function (smooth gaussians at major urban clusters: NA East Coast, Europe, India, China coast, Japan) → warm orange glow. No texture file needed.
  6. **Bloom post-process:** 3 render passes:
     - Pass 1: Scene → `sceneTexture` (RGBA16F framebuffer)
     - Pass 2: Threshold (`lum > 0.6`) → `brightTexture`, then dual-pass Gaussian blur (horizontal + vertical, 9-tap kernel, `sigma=2.0`) → `blurTexture`
     - Pass 3: Full-screen quad, `gl_FragColor = sceneTexture + blurTexture * bloomStrength`
  7. **Billboard particles:** Instanced quads (6 verts × 2000 instances). Per-instance attributes: `a_worldPos` (vec3), `a_magnitude` (float), `a_age` (float), `a_seed` (float). Vertex shader billboards quad to always face camera using camera right/up vectors. Fragment shader: radial gradient, alpha = `exp(-r*r*4.0) * (1.0 - age)`.
  8. **Mouse ray-cast to sphere:** Unproject mouse from NDC → world ray via inverse MVP. Ray-sphere intersection (`t = -b ± sqrt(b²-4ac)/2a`). Convert hit point to lat/lon → find nearest quake within threshold.

- **Performance considerations:**
  - Instance data uploaded once per fetch (not every frame)
  - `age` updated on CPU each frame, uploaded as single float array via `gl.bufferSubData`
  - Ripple computation capped at 30 nearest quakes per globe fragment (distance pre-sort on CPU)
  - Bloom blur uses half-resolution framebuffer (50% of viewport) for 4× speedup
  - On mobile or slow devices: reduce bloom kernel to 5-tap, disable ripple waves, halve particle count

- **Input handling:** Mouse: `mousedown`/`mousemove`/`mouseup` for orbit drag. `wheel` for zoom. `mousemove` for hover ray-cast (throttled to 30fps). Touch: `touchstart`/`touchmove` with 1-finger orbit, 2-finger pinch-zoom. Keyboard: `Space`, `H`, `A` as described above.

---

### Interactions Detail

- **Click (globe drag):** `mousedown` sets `isDragging=true`, records start position. `mousemove` while dragging → compute delta → update camera quaternion → `globeRotation` manual override (pause auto-spin). `mouseup` → apply inertia from last delta.
- **Click (quake):** If not dragging (`mouseDelta < 5px`), and hovered quake exists → `selected = hovered`. Camera smoothly pans/zooms to focus on that quake over 800ms. Info card expands with depth detail.
- **Drag:** Smooth orbit as above. Quaternion camera prevents poles from "flipping."
- **Mouse move:** Throttled hover ray-cast → nearest quake → info card slides in/out. Quake particle brightens (1.5× alpha) while hovered.
- **Scroll/pinch:** Zoom `camera.radius` clamped `[1.5, 5.0]`. Smooth lerp: `radius += (targetRadius - radius) * 0.12` per frame.
- **Keyboard:**
  - `Space`: Reset to auto-orbit, deselect
  - `H`: Toggle heatmap layer (density overlay blended additively on globe)
  - `A`: Toggle Web Audio rumble
  - `T`: Cycle time window (24h → 7d → 24h)
- **Time slider:** `<input type="range">` styled with CSS, emits live filter event. Rightmost notch snaps to "LIVE" (auto-refresh). Dragging slider backwards plays quake history in reverse.

---

### Edge Cases

- **Mobile:** Touch orbit with 1 finger. Pinch zoom. Info card appears bottom-center instead of center-right. Time slider full-width at bottom. Hide keyboard hints. Globe radius slightly smaller to fit portrait viewport.
- **Performance:** Frame rate monitor via rolling 60-frame average. If FPS < 30 for 3s: disable bloom, reduce particle count by half, disable ripple waves. Show subtle "Reduced quality" notice in bottom-left. Restore on next user interaction (assume they moved to a more powerful context).
- **Empty state:** Before USGS data arrives, globe rotates in auto-spin. Atmospheric halo pulses at 0.5Hz. Status says "Scanning for seismic activity..." — builds tension before the data erupts.
- **USGS API failure:** Catch fetch errors. Display "Live data unavailable — showing cached data" in top-left. Use any previously loaded data if available; otherwise show empty globe with error state.
- **WebGL not supported:** Full-page fallback: dark background, centered message "Your browser doesn't support WebGL2. Try Chrome or Firefox." with a static screenshot-style illustration (CSS-drawn globe with emoji quakes).
- **AudioContext blocked:** Many browsers block audio until user gesture. First audio trigger must be inside a click handler. Add `unlockAudio()` call on first click anywhere on canvas.

---

### USGS API Endpoints
```
24h all: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
7d all:  https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
```
Both return CORS-enabled JSON. Parse `features[].geometry.coordinates` [lon, lat, depth] and `features[].properties` {mag, place, time, sig}.

---

### Web Audio Rumble Spec
On M5+ quake detected during fetch refresh:
```js
const ctx = new AudioContext();
// Low rumble: sine wave at 40-80Hz, magnitude-scaled
const osc = ctx.createOscillator();
osc.frequency.value = 40 + (mag - 5) * 8;  // M5=40Hz, M8=64Hz
const gain = ctx.createGain();
gain.gain.setValueAtTime(0, ctx.currentTime);
gain.gain.linearRampToValueAtTime(0.3 * Math.min(mag - 4, 1.5), ctx.currentTime + 0.3);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
osc.connect(gain); gain.connect(ctx.destination);
osc.start(); osc.stop(ctx.currentTime + 3.0);
```
Keep audio subtle — seismic ambience, not jump scare.

---

### Sage Notes
Scout nailed the concept. Live seismic data + cinematic WebGL globe is exactly the kind of "real data made beautiful" that earns shares from both data nerds and design people. I pushed hardest on three things: first, the night-side city lights — this transforms the globe from a data chart into something that feels alive and inhabited, which makes every earthquake feel more viscerally human and significant. Second, the bloom pipeline had to be specified precisely because a poorly implemented bloom looks muddy; the dual-pass half-resolution Gaussian with a 0.6 luminance threshold is the correct recipe for that "light bleeding from bright sources" look without washing out the scene. Third, the quaternion orbit camera is non-negotiable — Euler camera at the poles creates disorienting flip artifacts that kill the polish. The builder needs to get the ripple ring math right: great-circle distance, not screen-space or Euclidean, so rings curve correctly around the sphere surface. The moment a M7.0 hits and a white-core burst erupts with red bloom trailing and a bass rumble rolls through the speaker — that's the screenshot that gets posted to Twitter. Build toward that moment.

---

## Scout's Original Proposal (Preserved for Reference)

## Research Sources
- r/InternetIsBeautiful hot: Mood2Know (https://mood2know.com) — live anonymous global mood map aggregating one-click emotions into world heatmap and trends. Simple, real-time, collective data viz that's shareable. Fake work simulators, LEGO colors timeline (https://sheets.works/data-viz/lego-colors) — data arranged visually by year/production status. Drum machine (https://drumha.us/), cosmic playground (https://www.nebulatool.com/play/stardust), collaborative pixel walker (https://littlewanderer.net/).
- r/creativecoding hot: Audio-reactive ASCII/Unicode, infinite shared wall concept, Lagrangian densities, contour formation sketches.
- r/generative hot: Fluid sims in Godot compute shaders, proto-cell GIFs, TerDragon fractals, funkyvector designs.
- Recent daily ships: Beat Beast (2026-03-12: WebAudio physics sequencer — technical/audio), Mandelbulb Morpher (2026-03-11: WebGL2 fractals — generative), Nebula Swarm (2026-03-10: mic-reactive particles — technical).

Global real-time data viz like Mood2Know/LEGO colors caught my eye — elegant aggregation of live/shared data into hypnotic visuals. Paired with physics trends, screams for a seismic twist.

## Idea: Quake Globe Live
**Category:** Data/visualization (real data, beautifully presented — rotates from recent technical/generative/audio)
**One-liner:** Real-time WebGL 3D Earth where live earthquakes bloom as magnitude-scaled particle bursts with glowing trails and tension waves.
**Technical Stack:** WebGL2 (globe raymarch/shader, particle system, bloom post-process), fetch USGS earthquake GeoJSON API every 60s.
**Inspired by:** Mood2Know's minimalist live world mood map (anonymous global data → instant viz) + LEGO colors timeline (data particles by time/status) + proto-cell/contour physics from generative Reddit.

**Description:** A dark-space 3D Earth (procedural or texture-mapped) spins slowly. Every minute, it polls USGS all-day GeoJSON (http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson), spawning particles at epicenter lat/lon: magnitude scales burst size/color (M5+ red fireballs, M3+ orange pulses, low-mag blue sparks). Particles rise + expand with velocity decay, leave faint trails, trigger radial tension waves across surface. Zoom/orbit controls, time slider for last 24h/7d feeds, auto-recenter on activity, quake density heat map toggle.

**Target audience:** Data nerds, earth science fans, devs — anyone who loves live global feeds (flights/stars/quakes) rendered with cinematic WebGL polish. Shares like "Watch the Earth rumble in real-time."

**Key features:**
- Live USGS API polling (all_day + significant_hour feeds, parse GeoJSON coords/mag/time).
- WebGL2 particle sim (GPU instanced quads, age/velocity uniforms, bloom for glow).
- Procedural Earth (normals/shading + night lights) or low-res texture, lat/lon → 3D projection.
- Mag-based visuals: size=exp(mag), color=hue(mag), wave radius=mag*dist.
- Interactions: mouse/touch orbit/zoom, keyboard presets (zoom-to-cluster, pause sim, history scrub).
- Performance: LOD particles, fade old quakes, 60fps cap with fallback.
- Ambient: Slow rotation, subtle seismic hum (procedural sine swell on big quakes).

**The hook:** Pinching into a live M6.5 off Japan as red particles erupt and waves ripple the globe — screenshot gold for Twitter/Reddit.

**Wow Test Results:**
1. Stop scrolling? YES — live planetary data with physics drama grabs instantly, like Flightradar but underground + prettier.
2. Developer would share? YES — USGS API + WebGL particle globe shows off real-time data wrangling + shader chops without deps.
3. Technical boundary pushed? YES — GeoJSON → lat/lon → globe projection → GPU particles/waves/bloom in single-file WebGL2.
4. Different from this week? YES — Data/viz vs technical audio/physics, generative fractals, particle nebula (this uses real external data + earth sim).

### Scout Notes
r/InternetIsBeautiful's Mood2Know nailed minimalist live global aggregation — I want that but seismic, since quakes are always happening and visually explosive. Over other ideas (another drum/ASCII/fluid), this rotates category cleanly, uses public USGS API for authenticity (no fakes), and layers particle physics on real data for moat-level wow. Excited by the tech stack: hand-rolled globe projection + instanced particles will flex WebGL skills hard, perfect for "AI shipped a live data globe?!" shares. Challenges like accurate lat/lon spherical mapping and smooth polling will make it shine.

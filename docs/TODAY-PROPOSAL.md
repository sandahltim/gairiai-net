# Build Proposal - 2026-03-05

---
## Build Spec (Sage)
**Verdict:** APPROVED with technical refinements
**Changes from proposal:** Replaced GPGPU compute shaders with WebGL2 instanced rendering (compute shaders have <70% browser support; instanced rendering gives 80k particles at 60fps cross-browser). Replaced ScrollTimeline API with wheel/pointer events (ScrollTimeline still experimental in Firefox). Replaced WebSockets with polling + simulated per-second ticker (rtb-api is a static CDN, confirmed live — returns Musk at $839.6B rank #1 as of 2026-03-02). Refined interaction model: user STARTS at full vortex view, scrolls IN to discover human-scale labels. Added "Earned Since Opened" counter as the primary viral share element. Tightened GDP ring selection to 4 meaningful comparisons within/near Musk's range.
**Estimated JS complexity:** ~950 lines — WebGL2 setup + shaders (~300), particle system + animation loop (~200), logarithmic zoom + scale labels (~150), API + live counter (~100), GDP rings + billionaire switcher (~130), touch/keyboard input + "Earned Since" widget (~70)

### Visual Design
- **Color scheme:** Background `#0a0a0f`. Particles gradient by wealth rank: cold zone (small $) `#003d80` → `#0066ff` → `#00d4ff`; mid zone `#7c3aed` → `#c026d3`; hot zone (large $) `#ff6b35` → `#ff1a1a`. GDP rings `rgba(255, 204, 0, 0.35)` yellow. Scale label rings `rgba(228, 228, 237, 0.5)` white-grey. "Earned Since" counter `#00ff88` neon green. Live net worth counter `#ffffff` with `text-shadow: 0 0 20px rgba(0, 255, 136, 0.8)`.
- **Layout:** Full-viewport WebGL2 canvas behind all UI. Fixed top bar (glassmorphism: `rgba(10,10,15,0.85)` + `backdrop-filter: blur(12px)`) contains: left = billionaire name + avatar emoji, center = live net worth counter (giant, ticking), right = rank badge + last-updated timestamp. Fixed bottom-left: "Earned Since Opened" chip. Fixed bottom-center: zoom level indicator + hint text. Fixed bottom-right: GDP toggle button + billionaire switcher pills. Scale labels float as canvas annotations.
- **Typography:** System-ui / Inter, monospace for the ticker (`font-variant-numeric: tabular-nums`). Counter: 2.5rem bold. Scale labels: 0.75rem. Hints: 0.65rem `#888`.
- **Visual style:** Dark cosmic. Particle vortex feels like a galaxy rotating — dense bright core, sparse glowing outer arms. Glass UI panels over WebGL depth. Neon accents against near-black. Particles have a soft radial glow bloom (additive blending).
- **Key visual elements:** 80,000 glowing particle instances rotating in a logarithmic spiral vortex. Additive blending (`gl.blendFunc(gl.SRC_ALPHA, gl.ONE)`) gives particle overlap a bloom/haze effect. White concentric rings at landmark dollar values (salary, $1M, $1B, etc.) with floating text labels. Yellow GDP comparison arcs drawn as partial circles. A single bright dot at center-of-vortex = "this is you" reference point. Particle birth burst animation when live wealth updates.

### UX Flow
1. **First impression:** Page loads to full vortex — 80k glowing particles rotating in a slow galactic spiral, filling the viewport. Top center shows: `$839,618,478,XXX` ticking up in real time. Bottom-left chip immediately starts counting "Elon has earned $0 while you've been here..." and ticks upward. The vortex feels alive.
2. **Discovery:** User reads "Scroll to explore scale ↑" at bottom. Rolling mouse wheel IN (or pinch-in on mobile) begins zooming INTO the center. The outer particles drift off-screen. The remaining inner particles swell in apparent size as scale reveals finer detail.
3. **Scale revelation:** At each zoom threshold, a scale ring appears with an annotation. First ring revealed: "$1 Billion — Billionaire Threshold." Keep zooming. "$100 Million." "$10 Million." "$1 Million." Finally: "$50,000 — US Median Annual Salary. This is 1 year of your life." At max zoom: only a handful of particles fill the viewport. Text: "Everything else in this vortex is 12,000× larger." That's the moment.
4. **Feedback:** Particles smoothly redistribute as zoom changes (particle size scales inversely with zoom so individual particles are always visible at any level). Scale rings fade in/out with opacity transitions at their threshold zoom levels. GDP rings can be toggled — a yellow arc appears at the corresponding radius, labeled "Finland GDP" etc., giving a country-comparison landmark.
5. **Mastery:** Keyboard shortcut `G` toggles GDP rings. `S` takes screenshot (hides UI chrome, full vortex). Tab cycles billionaires — particles smoothly contract/expand with spring physics as wealth changes. Bottom-left "Earned Since" counter is the number users screenshot and post. The longer you stay, the more obscene the number gets.

### Technical Architecture
- **Rendering:** WebGL2. Instanced rendering with `gl.drawArraysInstanced`. One instanced quad (2 triangles) per particle. Instance buffer holds per-particle: `angle (f32)`, `radius_norm (f32, 0-1)`, `wealth_rank (f32, 0-1)`, `phase_offset (f32)`, `size_base (f32)`. Additive blending for bloom effect. 
- **Shaders:**
  ```glsl
  // Vertex shader: convert polar to cartesian, apply zoom transform
  // radius_world = radius_norm * R_MAX (in dollar-log-space)
  // screenPos = (polar_to_cart(angle + time * omega(radius), radius_norm) - panOffset) / zoomScale
  // omega(r) = BASE_OMEGA / (1.0 + r * 8.0)  // slower at edge
  
  // Fragment shader: radial glow circle
  // alpha = max(0.0, 1.0 - dist * 2.0) ^ 1.5
  // color = mix(coldColor, hotColor, wealth_rank) based on 4-stop gradient
  ```
- **Animation loop:** `requestAnimationFrame` at 60fps. Global `time` accumulator drives particle rotation. Each frame: update `time`, upload new uniform `u_time` and `u_zoomScale`. No per-frame CPU particle updates — all motion is in vertex shader as function of time. Exception: wealth pulse animation updates a small CPU-side burst particle list (~200 particles) on wealth tick events.
- **State management:**
  - `state.billionaires[]`: array of 5 objects with name, uri, networth (in $M), perSecond estimate, emoji
  - `state.activeBillionaire`: index 0-4
  - `state.liveNetworth`: current net worth in $M (starts from API fetch, grows by perSecond each second)
  - `state.logZoom`: float 0-1 (0 = full vortex, 1 = salary scale)
  - `state.gdpVisible`: boolean
  - `state.sessionStartTime`: timestamp for "Earned Since" calculation
  - `state.particleBuffer`: Float32Array(80000 × 5) — set once at init, reused
- **Key algorithms:**
  - **Logarithmic spiral placement:** `radius_norm[k] = log(k + 1) / log(N + 1)` for k = 0..N-1. `angle[k] = k * 2.399963` (golden angle ≈ 137.5°). This gives a sunflower-pattern distribution (visually even coverage, denser near center).
  - **Zoom viewport transform:** `zoomScale = pow(10, logZoom * 7.2)`. Viewport shows dollar range from `$50k` (zoom=1) to `$839B` (zoom=0). In shader: particle is visible if `radius_norm / zoomScale < 1.5` (with fade at edge).
  - **Scale ring threshold:** Ring at dollar value D is visible when `logZoom_D - 0.15 < logZoom < logZoom_D + 0.15`, where `logZoom_D = log10(D / 50000) / 7.2`. Opacity peaks at center, fades at edges.
  - **Wealth pulse:** On each $1M gain tick (computed from liveNetworth), spawn 50 burst particles at center with outward velocity. Burst particles have their own Float32Array and are drawn as a separate instanced pass with shorter lifetime.
  - **Billionaire switch spring:** When switching, animate `state.targetNetworth` from old to new using `spring(current, target, 0.08, 0.85)` (stiffness, damping). This changes R_MAX uniform in shader — particles appear to contract/expand as vortex rescales.
- **Performance considerations:** All 80k particle positions set at init and never changed (motion is shader-driven). Zoom and time are uniforms — zero CPU particle update cost per frame. GDP rings drawn with Canvas2D overlay synchronized with WebGL frame (2-canvas composite: WebGL underneath, Canvas2D on top for text/rings). Target: 80k particles at 60fps on integrated GPU.
- **Input handling:** Wheel event → `logZoom += delta * 0.001` clamped [0,1]. Pointer drag → `panOffset` (x,y) in normalized space. Pinch → two-pointer distance change = zoom. Keyboard: `G` = GDP toggle, `S` = screenshot, `1-5` = billionaire switch.

### Interactions Detail
- **Wheel (scroll):** `delta > 0` = zoom in (logZoom increases toward 1 = salary scale). `delta < 0` = zoom out. Smooth easing: target logZoom updated, actual animates toward target at 8% per frame. Scale ring labels crossfade as thresholds crossed.
- **Drag:** Pan the vortex. Two-finger pan on mobile. Momentum: velocity decays at 0.92/frame. Bounds: panOffset clamped to 1 vortex radius.
- **Mouse move (hover):** Detect nearest particle within 20px. Show tooltip: `"This dot ≈ $[dollarAmount]"` with human-readable comparison ("≈ 3 months groceries" / "≈ a new Tesla" / "≈ a small startup"). Tooltip follows cursor with 100ms delay.
- **Scroll/pinch:** Same as wheel — pinch-to-zoom adjusts logZoom. Two-finger swipe = pan.
- **Keyboard G:** GDP rings toggle. Rings fade in with 300ms transition. Each ring labeled with country name and GDP amount.
- **Keyboard S:** Screenshot: hide all UI panels (`opacity: 0`), `canvas.toDataURL()`, trigger download, restore UI. Button also available in UI.
- **Billionaire switcher click:** Animate current billionaire's particles contracting, update `state.activeBillionaire`, fetch new API data, animate expand. The live counter smoothly transitions to new net worth. "Earned Since Opened" resets for new billionaire.
- **GDP ring click (on canvas):** Detect click near ring → highlight ring (brighter yellow) + show comparison panel: "Elon Musk's wealth vs [Country] GDP: [X]× larger." Dismisses on click-away.

### Edge Cases
- **Mobile:** Touch pinch → logZoom. Two-finger drag → pan. Billionaire switcher shows as horizontal scroll row at bottom. GDP toggle is a floating button (44×44px min). `viewport meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"`. Canvas fills `100dvh`.
- **Performance:** If fps drops below 45 (measured via frame delta), reduce particle count: try 60k, 40k, 20k (halving each step). WebGL2 not supported fallback: show static SVG vortex image with animated CSS counter only (graceful degradation).
- **Empty/loading state:** On load, show spinning vortex with placeholder net worth (`$---,---,---,---`). API fetch in background. On fetch success, animate counter from placeholder to real value with a "cascade" reveal (digits roll from right).
- **API failure:** If fetch fails or times out (5s timeout), use hardcoded fallback values from the data confirmed on 2026-03-02. Show subtle "(data as of Mar 2)" label. The per-second ticker still runs — it just uses the fallback baseline.
- **CORS:** rtb-api is served via statically.io CDN with `access-control-allow-origin: *`. No CORS issues expected.

### Sage Notes
Scout's concept is genuinely strong — the logarithmic zoom "scale reveal" and live ticker are the right viral mechanics, and the rtb-api is confirmed live and returning real data. My main technical intervention is replacing the GPGPU compute shader approach: WebGL compute is behind a flag in Firefox and not worth the exclusion for this type of demo. Instanced rendering with shader-driven motion achieves the same visual result at better compatibility. The critical "make or break" element is the zoom transition — when users scroll IN and hit the "US Median Salary" ring label with the text "Everything else in this vortex is 12,000× larger," that's the screenshot moment. If the label timing or copy is off, the emotional punch is lost. Builder must nail the scale label crossfade and copy. Second most important: the "Earned Since Opened" counter must update at least once per second with smooth CSS transitions, not jumpy integer increments — use `setInterval(100ms)` with decimal interpolation and format to `$X,XXX,XXX` with comma separators. The particle glow bloom via additive blending is non-negotiable for the "galaxy" aesthetic — without it, dots look flat.

---

## Scout's Original Proposal (kept for reference)

## Research Sources
- r/InternetIsBeautiful hot: "How Rich Is a Billionaire, Really?" (https://www.thehowpage.com/economics/billionaire-wealth) — scroll-driven interactive putting billionaire wealth in perspective via endless scroll, GDP comparisons, spending sims. Blew up for breaking scale intuition.
- F1 Clock (https://labs.laserdeathstehr.com/f1-clock): Every hour compresses a full F1 race to realtime clock — genius data compression/time viz.
- r/creativecoding: Physics node wires, audio-reactive geometry, Xbox controller DMX laser synth — node-based sims trending.
- r/generative: Liquid backgrounds, glitch text, seismic vision — procedural fluids/viz hot.
- GitHub/HN trends: WebGL-plot for realtime waveforms, deck.gl geospatial big data, but no pure wealth clocks.
- Recent ships: GLSL Node Forge (shader nodes), Fractal Wavetable (gen art audio), GPU Murmuration (physics sim) — avoiding technical showpiece/generative repeat.

Public APIs found: komed3/rtb-api (Forbes realtime billionaires historical), Forbes Billionaires API for live net worth/rankings.

## Idea: Billionaire Wealth Vortex
**Category:** Data/visualization (real data, beautifully presented — rotates from recent physics/shaders/gen art)
**One-liner:** Spiral into a billionaire's live net worth — scroll/zoom compresses trillions into viewport, particles swarm as wealth grows realtime from Forbes API.
**Technical Stack:** WebGL (GPGPU particles), WebSockets (live API polling), Canvas2D fallback, ScrollTimeline API for scrubber.
**Inspired by:** "How Rich Is a Billionaire" endless scroll + F1 Clock realtime compression — nobody does live billionaire growth as emergent particle vortex.

**Description:** A swirling vortex of particles represents one billionaire's (e.g., Musk) net worth: center is $0, outer edge is current total (e.g., $852B). Scroll/zoom dives deeper into scales (your salary → millions → billions), particles density/velocity visualize growth rate ($155k/min → insane realtime ticks). Live fetch from rtb-api updates total + rank, particles birth/die accordingly. Mouse orbits camera, click toggles GDP/national comparisons (e.g., overlay Finland GDP as orbiting ring). Particles trail glows encode hourly growth history.

**Target audience:** Data nerds, econ twitter, r/InternetIsBeautiful crowd — they'll share because it's hypnotic realtime inequality porn with GDP context.

**Key features:**
- Realtime API fetch (rtb-api/Forbes) updates wealth clock + sparks particle bursts for $ gains.
- Infinite zoom scroll (ScrollTimeline + logarithmic scale) — compresses 1T into viewport without perf loss.
- 100k+ GPGPU particles (WebGL compute shader) — emergence: flocks form 'wealth waves' on surges.
- GDP overlays: 15+ countries as interactive rings (drag to compare Musk vs Nigeria GDP).
- History trail: Particle comet tails show 24hr growth curve.
- Multi-billionaire switcher: Tabs for top 5, rank deltas animate.
- Export: Screenshot + CSV of hourly net worth for threads.

**The hook:** Watching $852B swirl/grow live, then zooming to see your salary as a single particle — screenshot that for Twitter: "Musk earned this in the time you read this tweet."

**Wow Test Results:**
1. Stop scrolling? YES — realtime money vortex grabs instantly, logarithmic zoom mindf*cks scale.
2. Developer would share? YES — GPGPU realtime API viz + ScrollTimeline polish screams #dataviz #webgl.
3. Technical boundary pushed? YES — WebGL particle compute for trillions-scale sim, live API WebSockets without lag.
4. Different from this week? YES — Data/viz realtime (not shaders/physics/audio), first live external data pull.

### Scout Notes
Reddit's billionaire scroll post exploded because it weaponizes scroll fatigue to teach scale — I'm amping it with live API + GPGPU particles for emergence nobody codes manually (wealth 'flocks' on surges). Picked over audio-reactives (repeat fractal synth) or node wires (echoes GLSL Forge) because realtime data viz is underserved client-side, APIs make it defensible moat. Excited by compute shader challenge: pack net worth log-scale into particle pos/vel without precision loss. Devs will fork for stock viz, users hypnotized for hours — pure virality.

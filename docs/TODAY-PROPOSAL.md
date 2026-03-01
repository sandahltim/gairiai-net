# Build Proposal - 2026-03-01

## Research Sources
GitHub trending heavy on AI agents (airi self-hosted Grok companion, OpenSandbox for AI apps, memU for OpenClaw agents, claude-scientific-skills). HN dominated by AI drama (OpenAI/Anthropic/War Dept). r/InternetIsBeautiful: fake Gmail hiding live cricket (boss-key interactive), anonymous wall prints, GameDate reviving old games. r/creativecoding: p5.js sketch galleries, 3D art galleries. r/generative: "Murmurations" video (flocking emergent patterns), waves conventions, human archive art. Many WebGL boids/murmuration demos (threejs.org/webgl_gpgpu_birds.html, mike-lyman.com/boids). Recent dailies: rectangle packer (algorithm viz/edu), particle beam arena (GPGPU game), fractal audio reactor (shader audio).

## Idea: GPU Murmuration Flocking Arena
**Category:** Technical showpiece (physics, 3D, WebGL GPGPU)
**One-liner:** Command 500k+ birds in emergent 3D murmurations — mouse as predator, spawn obstacles, all GPU-simulated at 60fps without CPU lag.
**Technical Stack:** WebGL2 GPGPU (ping-pong FBO textures for pos/vel/update), GLSL compute shaders, Canvas2D trails optional.
**Inspired by:** r/generative "Murmurations" post (617 upvotes), threejs.org/examples/webgl_gpgpu_birds (GPU boids proof), particle-beam-arena extension to pure sim.

**Description:** Pure GPU flocking sim pushes browser limits: classic boids (separation/alignment/cohesion) + predator avoidance (mouse repulsion field) + obstacle navigation (spawn circles flocks weave around). Flocks form hypnotic murmurations, split on threat, reform organically. Fly-through camera captures epic scale — trails show flow, bloom/depth-of-field for cinematic feel. Live sliders tweak params without stutter. Scales 10k to 1M birds dynamically.

**Target audience:** WebGL devs, procedural sim fans, nature viz geeks — they'd share "1M birds in browser, mouse hunts them!"

**Key features:**
- GPGPU core: position/velocity/life/type packed RGBA textures, update/collision in fragment shader (spatial hash for neighbors).
- Mouse predator: dynamic repulsion vector broadcast to all boids.
- Interactive obstacles: click-spawn destructible circles (boids pathfind around via steer force).
- Trail renderer: stretched billboards or geometry shader for motion blur.
- Live controls: cohesion/align/sep/separation radius sliders, bird count scaler, speed.
- Orbit cam + auto-fly paths through densest flocks.
- Stats overlay: FPS, active birds, collision rate, perf graphs.
- Fullscreen, device-scale, WebGPU fallback if avail.

**The hook:** Viral GIF of flocks exploding around cursor then reforming — "GPU panic at 500k scale!"

**Wow Test Results:**
1. Stop scrolling? YES — hypnotic organic motion grabs instantly.
2. Developer would share? YES — GPGPU boids + mouse hunt is resume gold.
3. Technical boundary pushed? YES — 500k+ GPU agents with interactions, spatial hashing in shader.
4. Different from this week? YES — pure sim showcase vs viz/packer, game/particles, shader/audio.

### Scout Notes
Murmurations lit up generative reddit amid AI agent trends, but client-side JS sims like threejs birds prove massive scale feasible — perfect post-particle arena pivot to classic algo extreme. Chose GPGPU over Three.js wrappers for raw perf/moat (shader collision/obstacle is black magic). Excited by emergent behavior surprises + mouse agency creating replay/share moments. Technical meat: neighbor query via texture sampling/hash pushes shader chops, challenges builder but delivers "wait AI shipped THIS?". This cements gairiai.net as browser sim frontier.

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Refined technical architecture for GLM; specified exact boids parameters and visual polish requirements; added fallback strategy
**Estimated JS complexity:** 600-900 lines

### Visual Design
- **Background:** #0a0a0f (deep void black)
- **Bird colors:** Gradient from cyan (#00d4ff) through electric blue (#0066ff) to violet (#8b5cf6) based on velocity magnitude (faster = more violet)
- **Trail effect:** 20-30% opacity fading trails using accumulation buffer or stretched billboards, color-matched to birds
- **Obstacles:** Glowing red-orange rings (#ff4444 to #ff8844) with pulsing core, 40-80px radius
- **Predator cursor:** White ring (#ffffff at 50% opacity) with shockwave ripple on click, 120px influence radius visualized
- **UI overlay:** Glassmorphism panels — rgba(10,10,15,0.85) backdrop with 1px rgba(255,255,255,0.1) border, blur(10px)
- **Typography:** Inter or system-ui, 0.875rem controls, 0.75rem stats
- **Bloom/Post:** Optional subtle glow on dense flock clusters using additive blending

### UX Flow
1. **First impression:** Page loads to 50k birds already flocking in emergent pattern — immediate visual payoff, no "press start". Camera slowly orbits through the swarm.
2. **Discovery:** User moves mouse → nearby birds scatter in panic wave, creating visible disturbance in the flock. Natural "what happens if I...?" moment.
3. **Experimentation:** User clicks → spawns obstacle (red circle) that birds actively pathfind around. User discovers they can sculpt the flock's flow.
4. **Mastery:** User finds control panel (top-right, collapsible) — tweaks cohesion/alignment/separation sliders to create different behaviors: tight balls, flowing streams, chaotic swarms. Discovers right-click clears obstacles.
5. **Share moment:** Dense flock explodes around cursor then reforms into hypnotic spiral — perfect for screen recording.

### Technical Architecture
- **Rendering:** WebGL2 with GPGPU compute via ping-pong framebuffer textures
- **Simulation textures:** Two RGBA32F textures (position.xyz + velocity.xy packed), 1024x512 or 2048x256 depending on bird count
- **Animation loop:** requestAnimationFrame, target 60fps, adaptive time step capped at 33ms
- **State management:** 
  - \`birds\` array: {px, py, vx, vy, phase} for rendering (phase for wing flap animation)
  - \`params\` object: cohesion, alignment, separation, separationRadius, maxSpeed, maxForce, birdCount
  - \`obstacles\` array: {x, y, radius, active}
- **Key algorithms:**
  - **Boids:** Reynolds classic (separation, alignment, cohesion forces)
  - **Spatial hashing:** 2D grid hash in fragment shader for O(1) neighbor lookup (grid cell size = separation radius)
  - **Obstacle avoidance:** Steer force = normalized(avoidance vector) × maxSpeed − velocity, clamped to maxForce
  - **Predator repulsion:** Inverse-square falloff from mouse position, 150px influence radius
  - **Wing animation:** Sine wave based on velocity magnitude + individual phase offset
- **Performance:**
  - Spatial hash in shader — no CPU readback
  - Instanced rendering for bird sprites (triangles or simple V shapes)
  - Obstacle count capped at 20 for performance
  - Bird count: 10k default, slider to 100k (mobile) / 500k (desktop with WebGL2)
- **Input handling:**
  - Mouse move: predator position update (uniform)
  - Left click: spawn obstacle at world position (raycast from screen)
  - Right click: clear nearest obstacle or all if no hit
  - Touch: single finger = predator, double tap = obstacle

### Interactions Detail
- **Mouse move:** Updates \`u_predator\` uniform → shader calculates repulsion force for each bird → immediate visual scatter wave propagates through flock
- **Left click:** Raycast screen → world coords → add to \`obstacles\` array → upload to \`u_obstacles\` texture/UBO → birds get avoidance force
- **Drag:** Continuous predator movement — flock responds in real-time
- **Control sliders:** 
  - Cohesion (0-2): attraction to flock center
  - Alignment (0-2): match velocity with neighbors  
  - Separation (0-3): avoid crowding (main param for visual style)
  - Separation radius (10-100px): neighbor detection range
  - Speed (2-8): max velocity
  - Bird count (1k-500k): requires texture reallocation if changed significantly
- **Stats toggle:** FPS counter, active bird count, time spent in shader (if query available)

### Edge Cases
- **Mobile:** 
  - Default to 25k birds max (performance)
  - Touch: single touch = predator, double-tap = obstacle, pinch doesn't zoom (performance)
  - UI collapses to bottom sheet
- **Performance degradation:**
  - If FPS < 30 for 3 seconds, auto-reduce bird count by 25%
  - Show warning: "Reduced to N birds for performance"
- **Empty state:** Not applicable — birds spawn immediately
- **WebGL2 not supported:** Fallback to 2D Canvas with 2k birds max, simplified boids (no spatial hash, O(n²) neighbors). Show banner: "WebGL2 required for 500k birds — using 2k fallback"
- **Context loss:** Save params to localStorage, restore on reload

### Kimi Notes
I refined Scout's vision with specific technical constraints that GLM can execute. The key insight: spatial hashing in the shader is the "black magic" that makes 500k birds possible — without it, O(n²) neighbor checks would choke. I specified exact color progression (cyan→blue→violet) so velocity visualization reads instantly. The wing flap animation adds organic life — simple sine wave per bird based on speed. Right-click to clear obstacles gives users an undo mechanism. Most importantly: this MUST launch with birds already moving — no start screen, no tutorial, immediate visual payoff. The wow moment is the first scatter when they move their mouse. If GLM can nail the spatial hash shader and the trail accumulation buffer, this will be site-defining. The fallback strategy is critical — we can't ship broken on older devices.

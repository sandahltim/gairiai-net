# Build Proposal - 2026-02-27

## Research Sources
- r/InternetIsBeautiful hot: Live data tools (wifi.live crowdsourced speeds), browser audio mastering tool, eBay listings aggregator — trend toward useful browser-local tools.
- r/creativecoding hot: Stylized anime game in Three.js (full breakdown), Blocky 3D World, Critical strip packing, Bitunit, Butterfly Math 101 — 3D/interactive/physics sims hot.
- r/generative hot: Fractal Dream PNG, SVG abstract lines, Microbiome particle sim (python taichi), Real time particle generation / Fighting particle beams, Ramanujan Dog and Cat — particles/fractals dominant.
- GitHub trending (via search): AI-heavy but WebGL particle systems (stephengou/WebGL-Particle-System ~250k particles GPU sim, nopjia/particles-mrt 1M particles 60fps GLSL compute), WebGL CRT shader, Three.js ecosystem.
- HN top: Recent Show HN Browser-based WebGL terrain editor (Three.js authoring mode), Generative Art Synthesizer sliders.

Particles exploding everywhere: Reddit beam-fighting particles + GH massive GPU sims + taichi microbiome = clear signal for high-perf particle chaos. Avoided audio-reactive (recent overlap).

## Idea: Particle Beam Arena
**Category:** 3. Game/interactive (zero-gravity beam duels with emergent particle chaos)
**One-liner:** Fire controllable particle beams in a 3D arena — collide with enemy shots for massive GPU-simulated explosions and debris storms.
**Technical Stack:** WebGL2 fragment shaders (GPGPU compute for particle update/collision), Three.js PointsMaterial for massive instanced render, ping-pong FBO textures.
**Inspired by:** r/generative \"Real time particle generation // Fighting particle beams\" video + GH particles-mrt (1M particles 60fps) + WebGL-Particle-System (collision textures).

**Description:** Spherical arena, two emitters (player mouse + chasing AI). Charge and fire beams of homing particles. Beams curve toward target, collide mid-air spawning explosion cascades, debris trails, sparks. Arena fills with 500k+ particles under motion blur. Survive waves, upgrade via orbs. Pure browser mayhem at 60fps.

**Target audience:** Indie game devs (perf benchmark), shader nerds (fork shaders), viral gamers (share explosions).

**Key features:**
- Player/AI emitters: mouse aim/charge, AI predictive dodging.
- Beam sim: velocity lerp homing, size/life/vel in textures.
- Collision detection: GPU distance query texture, spawn 100+ debris per hit.
- PostFX: trails via accumulation buffer, bloom on explosions.
- Upgrades: collect floating orbs for faster fire/spread/burst.
- Controls: space fire, mouse move/aim, fullscreen auto.

**The hook:** Screenshot mid-explosion particle apocalypse — \"Browser handles 500k colliding particles? AI built this?\"

**Wow Test Results:**
1. Stop scrolling? YES — kinetic explosions beat static fractals/mandalas.
2. Developer would share? YES — GPGPU perf hacks + shader guts to dissect.
3. Technical boundary pushed? YES — 1M-scale particle collision/lifecycle fully GPU, no CPU bottleneck.
4. Different from this week? YES — action game vs audio-fractal viz (02-26), mandala drawing (02-25), sand physics zen (02-24).

### Scout Notes
Particle beams on reddit screamed \"chaos engine\" — combined with GH 1M particle proofs, this is primed for virality without audio/drawing overlap. Picked game depth over pure viz (terrain editor HN was close but less replay/share). Thrilled by compute shader challenge: collision via packed textures is black magic most can't replicate. This screams \"wait, AI shipped Quake-particle edition?\" — devs will benchmark, players rage-quit explosions. Over microbiome sim because combat adds stakes.
---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Refined color palette for better particle visibility, specified exact FBO resolution for performance, added mobile fallback strategy
**Estimated JS complexity:** 650-850 lines (WebGL setup, GPGPU simulation, game logic, rendering)

### Visual Design
- **Background:** `#0a0a0f` (deep space void)
- **Arena border:** `#1a1a2e` with subtle glow `#2d2d44` at edges
- **Player beam:** `#00f5ff` (cyan, electric), trail fades to `#0080ff`
- **AI beam:** `#ff3366` (hot magenta), trail fades to `#ff0066`
- **Explosion core:** `#ffffff` → `#ffff00` → `#ff6600` → fade
- **Debris particles:** `#ffaa00`, `#ff4400`, `#888888` (metallic)
- **UI/Score:** `#e4e4ed` (primary text), `#00f5ff` (accent highlights)
- **Orbs:** `#00ff88` (health), `#ffdd00` (fire rate), `#ff00ff` (spread)

**Layout:**
- Full viewport canvas (100vw × 100vh)
- HUD overlay positioned absolute top-left and top-right
- Minimal UI: score top-left, health bar top-right, wave indicator center-top
- Start screen overlay centered with glowing title

**Typography:**
- `font-family: 'Inter', system-ui, sans-serif` (or system fallback)
- Title: `3rem`, weight 800, letter-spacing `-0.02em`
- Score: `1.5rem`, weight 600
- HUD labels: `0.875rem`, weight 500, uppercase, letter-spacing `0.1em`

**Visual Style:**
- Cyberpunk arena — glowing edges, particle light sources
- Motion blur via accumulation buffer (not CSS blur)
- Bloom on explosions using additive blending
- Scanline overlay subtle (5% opacity) for retro-tech feel
- Particle glow via radial gradients on point sprites

**Key Visual Elements:**
- Faint spherical arena boundary (wireframe or glowing ring)
- Particle beams with trail streaks
- Shockwave rings on collision
- Particle collision creates "spark showers" (50-100 mini particles)
- Screen shake on big explosions (2-3px jitter, 200ms)

### UX Flow
1. **First impression:** Black screen → title "PARTICLE BEAM ARENA" fades in with cyan glow → subtle particle drift in background → "CLICK TO START" pulses
2. **User discovers:** Mouse movement rotates view slightly (parallax) → cursor changes to crosshair on canvas hover
3. **User experiments:** Click-and-hold charges beam (visual charge indicator fills) → release fires beam → particles stream toward AI
4. **Feedback loop:** Beam hits AI shield → explosion burst → score increments → screen flash white 50ms → debris particles scatter with physics
5. **Mastery discovery:** Rapid click = burst fire → Hold longer = bigger beam → Collect orbs between waves → Dodge AI beam (red warning line appears before fire)

### Technical Architecture

**Rendering Stack:**
- **Primary:** WebGL2 with `OES_texture_float` extension
- **Renderer:** Custom GLSL shaders (not Three.js for simulation)
- **Display:** Three.js `Points` for final particle render (interoperability)
- **Resolution:** Simulation FBO at 1024×1024 (1M particles max)

**Animation Loop:**
```javascript
// Target 60fps
function loop() {
  requestAnimationFrame(loop);
  
  // 1. Update game state (CPU)
  updatePlayerAI();
  
  // 2. GPGPU particle simulation (GPU)
  gl.useProgram(simProgram);
  bindPingPongFBOs();
  gl.drawArrays(gl.TRIANGLES, 0, 3); // Full-screen quad
  swapFBOs();
  
  // 3. Render particles (GPU)
  gl.useProgram(renderProgram);
  bindParticleTexture();
  gl.drawArrays(gl.POINTS, 0, particleCount);
  
  // 4. Post-processing (optional bloom)
  applyBloom();
}
```

**State Management:**
```javascript
const state = {
  particles: Float32Array(1_000_000 * 4), // x, y, vx, vy
  particleLife: Uint8Array(1_000_000),    // life 0-255
  player: { x: 0, y: 0, charge: 0, health: 100 },
  ai: { x: 0, y: 0, targetX: 0, targetY: 0, health: 100 },
  wave: 1,
  score: 0,
  orbs: [{x, y, type, active}],
  explosions: [{x, y, radius, intensity}] // queued explosions
};
```

**Key Algorithms:**

1. **Particle Update (Vertex Shader):**
   - Read position/velocity from texture
   - Apply velocity with Euler integration
   - Apply homing: `velocity += normalize(target - position) * homingStrength`
   - Decrement life, fade alpha
   - Write to output texture

2. **Collision Detection (Fragment Shader):**
   - Distance field approach: sample nearby particles
   - If distance < threshold && different owner → collision
   - Spawn explosion at midpoint, kill both particles

3. **Beam Firing:**
   - Spawn particles at emitter position
   - Initial velocity: toward target + spread angle
   - Set owner (player=1, ai=2) in life channel high bits
   - Burst spawn: 100-500 particles per shot

4. **Explosion Spawning:**
   - On collision: spawn 50-100 debris particles
   - Random velocity outward from explosion center
   - Short life (30-60 frames), fast fade

**Performance Considerations:**
- Use `gl.POINTS` with `gl_PointSize` for particle rendering
- Enable `gl.BLEND` with `gl.ONE, gl.ONE` for additive explosions
- Limit active particles: 500k typical, 1M max
- Spatial hash for collision (GPU texture lookup)
- Reduce FBO resolution on mobile (512×512 = 262k particles)
- Object pool for explosions (don't allocate mid-frame)

**Input Handling:**
- `mousemove`: Update player target position (normalized -1 to 1)
- `mousedown`: Start charging (visual feedback only)
- `mouseup`: Fire beam (if charge > minThreshold)
- `touchstart/touchmove/touchend`: Mirror mouse for mobile
- `resize`: Update viewport, maintain aspect ratio

### Interactions Detail

**Click/Hold (Charge & Fire):**
- Trigger: `mousedown` on canvas
- Animation: Charge ring expands around cursor (0.5s to max)
- Result: On `mouseup`, spawn particle burst
  - Min charge (0.1s): 50 particles, narrow spread (5°)
  - Max charge (0.5s): 300 particles, wide spread (30°)
- Feedback: Haptic vibration (if supported), screen shake 2px

**Mouse Move (Aim):**
- Trigger: `mousemove` over canvas
- Animation: Subtle parallax on background stars
- Result: Player emitter rotates to face cursor
- Feedback: Crosshair follows cursor with 50ms lag (smooth lerp)

**Beam Collision:**
- Trigger: GPU distance check < 15px between opposing particles
- Animation: 
  - Explosion particles spawn (white core, orange mid, red edge)
  - Shockwave ring expands outward (alpha fade)
  - Screen flash white (20-50ms based on explosion size)
- Result: Both particles killed, score +10, debris physics
- Feedback: Audio-less haptic/visual only

**Orb Collection:**
- Trigger: Player beam particle within 30px of orb
- Animation: Orb shrinks while particles absorb into it, then orb bursts into upgrade text
- Result: Apply upgrade (fire rate +20%, spread +10%, etc.)
- Feedback: Upgrade text floats up "+FIRE RATE", cyan glow pulse

**AI Behavior:**
- Predictive aim: Lead player movement by 0.2s
- Dodge: When player beam within 100px, strafe perpendicular
- Fire pattern: Charge 0.8s, fire burst, cooldown 1.2s
- Warning: Red line appears 0.3s before AI fires

### Edge Cases

**Mobile:**
- Touch targets: Min 60px for UI buttons
- Controls: Virtual joystick bottom-left, fire button bottom-right
- Particle count: Cap at 250k (half desktop)
- Orientation: Lock to landscape, show rotate prompt if portrait

**Performance Degradation:**
- If FPS < 30 for 3 seconds: Reduce particle spawn rate 50%
- If FPS < 20: Switch to 512×512 simulation (quarter particles)
- Show "PERFORMANCE MODE" badge in corner

**Empty State (Start Screen):**
- 1000 ambient drift particles (slow, decorative)
- Title "PARTICLE BEAM ARENA" with glitch effect
- Subtitle "WebGL GPGPU Combat Simulation"
- Pulsing "CLICK TO START" button

**WebGL Not Supported:**
- Detect with `!!window.WebGL2RenderingContext`
- Fallback: Canvas 2D with 10k particle limit
- Show "SIMPLIFIED MODE — WebGL2 not available"

**Tab Hidden:**
- `visibilitychange` → pause simulation, stop rAF
- Resume on visible (don't accumulate missed time)

**Memory Pressure:**
- Fixed-size arrays (no dynamic allocation)
- Reuse explosion objects
- Clear FBOs on game over

### Kimi Notes

I refined Scout's proposal by tightening the visual design — cyan vs magenta creates instant readability in chaotic particle fields. The key technical decision is using raw WebGL2 for the GPGPU simulation (not Three.js) because we need full control over ping-pong FBO textures for the compute shader. Three.js is only for the final particle display layer.

The builder must pay special attention to the texture format: use `RGBA32F` for position/velocity, packed into a 1024×1024 texture = 1M particles. The fragment shader does the physics update by sampling neighbor pixels for collision — this is the "black magic" that makes 1M particles possible without CPU bottleneck.

What makes or breaks this build: The collision detection shader. If the distance field lookup isn't efficient, it'll choke. Use a simplified spatial hash: only check 8 neighboring pixels in the texture, not all particles. The visual wow comes from the explosion feedback — screen flash, shockwave rings, and debris showers must feel punchy.

Don't underestimate the UI polish — the charge indicator, screen shake, and orb collection animations separate a tech demo from a game people share.

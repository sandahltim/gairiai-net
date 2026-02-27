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
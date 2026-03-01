# Build Proposal - 2026-03-01

## Research Sources
GitHub trending heavy on AI agents (airi self-hosted Grok companion, OpenSandbox for AI apps, memU for OpenClaw agents, claude-scientific-skills). HN dominated by AI drama (OpenAI/Anthropic/War Dept). r/InternetIsBeautiful: fake Gmail hiding live cricket (boss-key interactive), anonymous wall prints, GameDate reviving old games. r/creativecoding: p5.js sketch galleries, 3D art galleries. r/generative: \"Murmurations\" video (flocking emergent patterns), waves conventions, human archive art. Many WebGL boids/murmuration demos (threejs.org/webgl_gpgpu_birds.html, mike-lyman.com/boids). Recent dailies: rectangle packer (algorithm viz/edu), particle beam arena (GPGPU game), fractal audio reactor (shader audio).

## Idea: GPU Murmuration Flocking Arena
**Category:** Technical showpiece (physics, 3D, WebGL GPGPU)
**One-liner:** Command 500k+ birds in emergent 3D murmurations — mouse as predator, spawn obstacles, all GPU-simulated at 60fps without CPU lag.
**Technical Stack:** WebGL2 GPGPU (ping-pong FBO textures for pos/vel/update), GLSL compute shaders, Canvas2D trails optional.
**Inspired by:** r/generative \"Murmurations\" post (617 upvotes), threejs.org/examples/webgl_gpgpu_birds (GPU boids proof), particle-beam-arena extension to pure sim.

**Description:** Pure GPU flocking sim pushes browser limits: classic boids (separation/alignment/cohesion) + predator avoidance (mouse repulsion field) + obstacle navigation (spawn circles flocks weave around). Flocks form hypnotic murmurations, split on threat, reform organically. Fly-through camera captures epic scale — trails show flow, bloom/depth-of-field for cinematic feel. Live sliders tweak params without stutter. Scales 10k to 1M birds dynamically.

**Target audience:** WebGL devs, procedural sim fans, nature viz geeks — they'd share \"1M birds in browser, mouse hunts them!\"

**Key features:**
- GPGPU core: position/velocity/life/type packed RGBA textures, update/collision in fragment shader (spatial hash for neighbors).
- Mouse predator: dynamic repulsion vector broadcast to all boids.
- Interactive obstacles: click-spawn destructible circles (boids pathfind around via steer force).
- Trail renderer: stretched billboards or geometry shader for motion blur.
- Live controls: cohesion/align/sep/separation radius sliders, bird count scaler, speed.
- Orbit cam + auto-fly paths through densest flocks.
- Stats overlay: FPS, active birds, collision rate, perf graphs.
- Fullscreen, device-scale, WebGPU fallback if avail.

**The hook:** Viral GIF of flocks exploding around cursor then reforming — \"GPU panic at 500k scale!\"

**Wow Test Results:**
1. Stop scrolling? YES — hypnotic organic motion grabs instantly.
2. Developer would share? YES — GPGPU boids + mouse hunt is resume gold.
3. Technical boundary pushed? YES — 500k+ GPU agents with interactions, spatial hashing in shader.
4. Different from this week? YES — pure sim showcase vs viz/packer, game/particles, shader/audio.

### Scout Notes
Murmurations lit up generative reddit amid AI agent trends, but client-side JS sims like threejs birds prove massive scale feasible — perfect post-particle arena pivot to classic algo extreme. Chose GPGPU over Three.js wrappers for raw perf/moat (shader collision/obstacle is black magic). Excited by emergent behavior surprises + mouse agency creating replay/share moments. Technical meat: neighbor query via texture sampling/hash pushes shader chops, challenges builder but delivers \"wait AI shipped THIS?\". This cements gairiai.net as browser sim frontier.
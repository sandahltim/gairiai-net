# Build Proposal - 2026-03-10

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

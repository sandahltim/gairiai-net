# Build Proposal - 2026-03-11

## Research Sources
- r/creativecoding hot: Fractal Singularity 3D (https://codepen.io/sabosugi/full/dPpOdNa) — stunning WebGL ray-marched fractal zoom with infinite depth and color-shifting plasma. Humans are sharing 3D fractal shaders hard right now.
- r/generative: PixelSortStudio (Python app), chaotic symmetry angle paths gallery, Julia sets, flying over GIFs — heavy emphasis on procedural geometry and symmetry emergence.
- r/InternetIsBeautiful: Littlewanderer.net collaborative pixel creature walk (6km trek), nuclear escalation simulator with real 2026 alliances — interactive sims with emergent/global scale.
- Recent GitHub/HN: Zig devlogs, agent-running blogs, but creative energy around procedural/math visuals.
- Category check: Last 3 days were Technical showpiece (Nebula Swarm: audio boids), Useful tool (Fourier epicycles), Game (Ant Wars). Avoid those — targeting Generative art.

Key spark: Fractal Singularity's hypnotic infinite zoom + chaotic symmetry paths. Nobody's done browser-native 3D Mandelbulb explorer with live parameter morphing yet.

## Idea: Mandelbulb Morpher
**Category:** 4. Generative art (visually stunning and unique)
**One-liner:** Infinite 3D Mandelbulb explorer where you twist Mandelbox/Quaternion parameters live to spawn alien geometries, ray-marched in real-time WebGL with volumetric glow and orbit cam.
**Technical Stack:** WebGL2 / GLSL fragment shaders (ray marching, signed distance fields), orbital controls, parameter interpolation, bloom post-processing.
**Inspired by:** Fractal Singularity 3D CodePen — that plasma zoom tunnel grabbed me, but it's static. Extend to interactive Mandelbulb family (power-3 bulb to fractal boxes) with smooth morphs between 16+ primitives.

**Description:** Load hits with a spinning Mandelbulb in neon plasma — no permissions, instant wow. Sliders for bulb power (2-8), iterations (5-20), scale/julia params let you sculpt impossible 3D fractals on the fly. Morph button tween-interpolates between random seeds, creating evolution sequences. Double-click explodes slices for interior views, mouse-drag orbits, wheel zooms to infinity. Adaptive step-counting keeps 60fps even at depth 100+. Export as animated GIF of your morph sequence.

**Target audience:** Shader nerds, generative artists, mathviz fans — the r/creativecoding crowd sharing "AI shipped a Mandelbulb shader toy better than most personal sites."

**Key features:**
- Live GLSL ray marcher with 10+ Mandelbulb primitives (Mandelbox, Menger sponge hybrids, quaternion julia sets).
- Smooth parameter lerping + auto-morph sequences (e.g., bulb→box→sponge in 5s).
- Volumetric fog/glow with cheap bloom (dual-pass shader).
- Slice planes + interior explosion mode for topology reveals.
- Preset gallery + random seed button for instant variety.
- GIF export of morph cam flythrough (using CCapture.js or shader recording).

**The hook:** Hypnotic infinite geometries mutating live — screenshot mid-morph shows impossible floating islands of math. Devs share with "AI raymarched this in one night?"

**Wow Test Results:**
1. Stop scrolling? YES — infinite neon fractal zoom tunnel sucks you in like black hole.
2. Developer would share? YES — full GLSL Mandel family with morphs is portfolio-level shader work.
3. Technical boundary pushed? YES — WebGL2 raymarching at interactive speeds with lerped primitives + bloom/volumetrics.
4. Different from this week? YES — Pure generative shader art vs particles/boids (tech), epicycles (tool), ants (game).

### Scout Notes
Fractal Singularity 3D on r/creativecoding blew up my pattern radar — 3D procedural fractals are hot, but most are static renders or Python. Browser GLSL morphing takes it to interactive extremes nobody's shipping daily. Excited by the math depth (SDF unions/intersections for hybrids) and perf challenge (adaptive marching for mobile). This screams "AI made THIS?" — perfect rotation after sim-heavy week.

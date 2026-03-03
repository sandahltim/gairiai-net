# Build Proposal - 2026-03-03

## Research Sources
- r/InternetIsBeautiful hot: Tools like cutthestream.com (streaming service overlap viz), moneyvisualiser.com (3D cash stacks), mediableach.com – emphasis on useful, bookmarkable data viz tools that visualize subscriptions/money/media.
- r/creativecoding hot: Physics node wires (interactive wiring sim), Lorenz System Sonified (attractor audio), Multiscale Complex Systems Sandbox – node/graph based interactive systems trending.
- r/generative hot: GLSL expression explorer (live shader param tweaking gallery), Infinite Hilbert curve generator, fractal/maze art – shader-heavy generative playgrounds blowing up.
- Web search GitHub trending: WebGL CRT Shader (retro effects), threejs-handtracking-101 (gesture control), shaders/WebGL topics active with live editors/explorers.
- Recent ships: 03-02 Fractal Wavetable (gen art/audio), 03-01 GPU Murmuration (WebGL physics sim), 02-28 Rectangle Packer (algo viz/educational). Avoiding repeats: no audio, no GPU sims/physics, no algo viz.

Shader editors/explorers (GLSL explorer, expression playgrounds) are hot across reddit/github – devs sharing interactive param tweaks for instant visual feedback. Node wires hint at composable graph systems, perfect combo for a shader building tool.

## Idea: GLSL Node Forge
**Category:** Useful tool (bookmarkable dev tool)
**One-liner:** Drag-and-drop node graph composes live WebGL fragment shaders – no code, instant preview, export GLSL + share json.
**Technical Stack:** WebGL2 fragment shaders, node editor (lite-graph.js or custom SVG), real-time compilation/eval.
**Inspired by:** r/generative's GLSL expression explorer (live param grids → node params), physics node wires (composable wiring), trending WebGL shader topics (CRT/distortion primitives ready-to-node).

**Description:** A browser-based node editor where you wire shader functions (Perlin noise → curl field → distortion → glow → CRT) into fragment shaders that render live at 60fps. Nodes have exposed sliders (time, mouse, resolution), auto-connect previews, and a master canvas shows the composed effect. Unlike Shadertoy (text-only), this is visual/flow-based – drag noise node to shape node, tweak params, see plasma morph instantly. Perfect for prototyping raymarchers, distortions, generative patterns without syntax hell.

**Target audience:** Creative coders, shader hobbyists, game devs prototyping FX – they'll bookmark for daily use, share insane node graphs on X/Reddit ("AI shipped node shader editor").

**Key features:**
- 20+ primitive nodes: noise (Perlin/curl/Simplex), shapes (SDF circle/box/torus), warps (polar/twist/kaleido), effects (glow/bloom/CRT/chromatic), math (mix/step/smoothstep/fractalize).
- Visual wiring: SVG bezier edges animate data flow, hover previews sub-shader output as mini-thumbnails.
- Live params: Every exposed uniform gets a slider/range/color picker, with keyframe tweening (record/play morphs).
- Export: One-click GLSL code dump + json graph (import anywhere), screenshot/video capture.
- Presets: Load trending shaders (CRT, attractors, fluids) as starting graphs.
- Perf monitor: FPS/frag count, auto-simplify graph on low perf.

**The hook:** Screenshot your "impossible" shader graph (noise→fractal→raymarch→volumetric godrays) and post "built this in 2min with AI node editor" – devs freak, fork your json.

**Wow Test Results:**
1. Stop scrolling? YES – glowing node graph + hypnotic shader canvas grabs instantly like Shadertoy but buildable.
2. Developer would share? YES – fills gap between code/text editors and noobs, "finally visual shader prototyping in browser".
3. Technical boundary pushed? YES – real-time node-to-GLSL compiler/transpiler, flow animation on wires, sub-shader preview thumbs (WebGL offscreen canvases).
4. Different from this week? YES – useful dev tool vs sim/audio/viz; rotates to category 2 after 4/1/5/6.

### Scout Notes
Reddit's GLSL explorer galleries exploded because param grids make shader hacking accessible yet powerful – nodes take that to composable infinity, wiring physics nodes vibe adds flow energy. Chose over money viz/stream tools (too static) or mazes (gen art repeat) because shader node editors are underserved client-side (Blender big but desktop), trending hard, and Forge can crush lite-graph + WebGL eval. Excited by transpiler challenge: parse node DAG to nested GLSL functions without eval hacks – pure math expression tree. This screams virality in #creativecoding, devs will chain insane graphs daily.


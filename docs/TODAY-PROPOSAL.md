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

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** None — Scout nailed this. Clean category rotation into Useful Tool after recent sim/audio/viz pieces.
**Estimated JS complexity:** 800-1200 lines (node system, WebGL compiler, SVG wiring, offscreen previews)

### Visual Design
- **Color scheme:** 
  - Background: `#0a0a0f` (deep void black)
  - Node cards: `#1a1a24` with `#252532` borders
  - Accent glow: `#00d4ff` (cyan) for active nodes/connections
  - Secondary accent: `#ff6b6b` (coral) for output/special nodes
  - Wire gradient: `#00d4ff` → `#5d3fd3` (cyan to purple)
  - Text: `#e4e4ed` (primary), `#8a8a9a` (secondary)
  - Success/compile: `#4ade80` (green)
  - Error: `#ff5555` (red)
- **Layout:** 
  - Split-pane: Left 40% = node graph canvas (pan/zoomable infinite grid), Right 60% = live shader preview
  - Floating toolbar at top: Add node buttons, export, presets
  - Properties panel slides out from right edge when node selected
  - Minimap in bottom-right corner showing full graph overview
- **Typography:** 
  - System font stack, `0.875rem` node titles, `0.75rem` port labels
  - Monospace `0.75rem` for code snippets in export modal
- **Visual style:** Glassmorphism node cards with subtle backdrop blur, glowing active states, animated data flow on wires (dash animation), grid snap with faint dot pattern
- **Key visual elements:** 
  - Pulsing glow on active nodes
  - Animated dashed lines showing data flow direction
  - Real-time thumbnail previews on node outputs (tiny WebGL canvases)
  - Smooth zoom/pan with momentum
  - Node deletion poof animation

### UX Flow
1. **First impression:** User sees a split screen — empty dark grid on left, mesmerizing default shader on right (animated plasma). A subtle "Double-click to add node" hint pulses. The contrast between the technical node graph and the beautiful shader output is immediately intriguing.

2. **Discovering interactivity:** User double-clicks the grid → node palette appears with categories (Noise, Shapes, Warps, Effects, Math). They drag out a "Perlin Noise" node. They notice the shader preview instantly reacts.

3. **Experimentation:** User drags from noise output to a "Colorize" node input — an SVG bezier wire animates into place. They see the noise now has color. They tweak sliders (scale, octaves, time speed) and watch the shader morph in real-time. They chain more nodes, watching the complexity grow.

4. **Feedback loop:** Every connection instantly updates the shader preview. Every parameter slider shows the change live at 60fps. Hovering a wire highlights its data flow. Clicking a node shows its parameters in the side panel. Errors (circular graphs, type mismatches) show red warnings on the node.

5. **Mastery:** Power users discover: right-click for context menu, middle-drag to pan, scroll to zoom, Ctrl+click multi-select. They can save presets, export their graph as JSON to share, or export raw GLSL code. They can hit "R" to record a 5-second animation of their shader morphing.

### Technical Architecture
- **Rendering:** 
  - Main shader preview: WebGL2 fullscreen canvas (right pane)
  - Node thumbnails: OffscreenCanvas with WebGL for each output preview (64x64px)
  - Node graph: DOM elements with absolute positioning + SVG overlay for wires
  - Grid background: CSS `background-image: radial-gradient()`
- **Animation loop:** `requestAnimationFrame` at 60fps for shader preview; 30fps for node wire animations to save battery
- **State management:**
  ```javascript
  state = {
    nodes: Map<id, {type, x, y, params, inputs: Map<port, nodeId>}>,
    wires: Set<{from: {node, port}, to: {node, port}}>,
    camera: {x, y, zoom},
    selected: nodeId | null,
    dragging: {nodeId, offset} | null,
    connecting: {from, to} | null
  }
  ```
- **Key algorithms:**
  - **DAG traversal:** Topological sort for execution order (Kahn's algorithm)
  - **GLSL generation:** Recursively build shader code from output node back to inputs
  - **Bezier curves:** Cubic bezier for wires with control points based on port positions
  - **Hit testing:** Quadtree or simple grid spatial index for node picking at scale
  - **Type system:** Each port has type (float, vec2, vec3, vec4, sampler2D) — validate connections
- **Performance considerations:**
  - OffscreenCanvas for node previews (don't render all at once)
  - Object pool for wire SVG paths
  - Debounce GLSL recompilation (wait 50ms after last change)
  - WebGL context reuse across preview canvases where possible
  - Spatial indexing for node hit-testing with 100+ nodes
- **Input handling:**
  - Mouse: Click to select, drag to move, double-click to add, right-click for menu
  - Touch: Two-finger pan/zoom, tap to select, long-press for menu
  - Keyboard: Delete/Backspace to remove selected, Ctrl+Z/Y for undo/redo, Space+drag to pan, +/- to zoom, Esc to cancel connection

### Interactions Detail
- **Click node:** Select it, show parameters in right panel, highlight connected wires
- **Drag node:** Move it on grid (snap to 20px grid), wires follow smoothly via bezier updates
- **Drag from output port:** Start connection, show ghost wire following cursor, snap to compatible input ports (highlight valid targets)
- **Drop on input port:** Create wire, trigger shader recompile, show brief "Compiling..." indicator
- **Double-click empty grid:** Open node palette (categorized grid of available nodes)
- **Scroll:** Zoom centered on mouse position (0.5x to 3x range)
- **Middle-drag / Space+drag:** Pan the camera
- **Right-click node:** Context menu (Duplicate, Delete, Mute — disable without removing)
- **Slider drag:** Real-time parameter update, debounced shader uniform update
- **Export button:** Modal with GLSL code tab and JSON graph tab, copy-to-clipboard buttons
- **Presets dropdown:** Load pre-built graphs (Plasma, Fire, Water, Neon Pulse, etc.)

### Edge Cases
- **Mobile:** Touch targets minimum 44px; two-finger pinch to zoom; simplified UI (hide minimap, collapse panels)
- **Performance:** Auto-disable node thumbnails if >20 nodes; show "Simplify graph" warning if FPS drops below 30
- **Empty state:** Default shader plays on load with subtle "Double-click to start" hint
- **Error handling:** 
  - WebGL not supported → Show fallback message with static shader examples
  - Circular graph → Red error on offending node, "Circular dependency detected"
  - Type mismatch → Red port highlight, "Cannot connect vec3 to float"
  - Compile error → Show in shader preview with line numbers, highlight error node
- **Undo/redo:** Full history stack of graph operations (max 50 states)

### Kimi Notes
Scout found a genuinely hot trend — shader node editors are blowing up on r/generative and GitHub, but there's no good client-side implementation. This hits the sweet spot between "useful dev tool" (bookmarkable) and "technically impressive" (live GLSL compilation, DAG parsing, WebGL previews). I kept the visual design clean and modern — glassmorphism without overdoing it, cyan/purple gradient wires that pulse with data flow. The complexity is real: a node graph system, topological sorting for execution order, recursive GLSL generation, and live thumbnail previews using offscreen WebGL contexts. GLM needs to nail the DAG traversal and shader compilation — that's the core. Everything else is polish. The "wow" moment comes when users wire their first noise→color→output chain and see it live at 60fps. That's the hook that gets shared.


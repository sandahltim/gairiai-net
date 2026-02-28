# Build Proposal - 2026-02-28

## Research Sources
GitHub Trending: Heavy on AI agents (OpenClaw use cases/skills, claude-flow, deer-flow), Scrapling web scraping, wifi-densepose pose estimation. No strong web demo trends, but agentic coding tools hint at workflow viz potential.
Hacker News: Dominated by AI drama (Anthropic/OpenAI vs Dept of War, Nano Banana 2 image gen). Nano Banana sparks image gen interest, but client-side focus steers elsewhere.
r/InternetIsBeautiful hot: MovieSpan (movie planner), instant Epstein files search, Aux (music Omegle), GameDate (dead games revival), anonymous wall printer. Strong useful tool vibe — instant search/UI delights.
r/creativecoding hot: Audio-reactive MRI (TouchDesigner), The Structure, Critical strip packing (44 upvotes), Ramanujan Dog/Cat. Strip packing stands out — optimization visuals are rare and mesmerizing.
r/generative hot: Natsukashii (R code), Truchet spheres, Fractal Dream, Curl Packing. Packing algos again — clear hot topic in procedural/math art.

Recent ships (ls tail): 02-27 Particle Beam Arena (WebGL GPGPU game), 02-26 Fractal Audio Reactor (shader audio viz), 02-25 Mandala Mirror (canvas drawing symmetry). Categories: game/technical, technical/audio-gen, generative/meditative. Avoid repeats.

## Idea: Live Rectangle Packer
**Category:** Educational/little-learners (CS algo teaching tool with replay value)
**One-liner:** Drag rectangles onto a strip and watch multiple packing algorithms compete in real-time to optimize space — visualize waste, speed, and emergent patterns instantly.
**Technical Stack:** Canvas2D for rendering, Web Workers for parallel algo runs, ResizeObserver for responsive, localStorage for preset packs.

**Inspired by:** "Critical strip packing" (r/creativecoding, 44 upvotes) + Curl Packing (r/generative). Packing optimization is trending hard — devs/students crave interactive demos that show why naive greedy fails vs heuristics/genetics.

**Description:** Users drag colorful rectangles (random or custom sizes) onto a 1D strip canvas. Hit PLAY: 4 algorithms race side-by-side — First-Fit Decreasing (FFD), Best-Fit (BF), Bottom-Left (BL), simple Genetic Algo (GA). Watch bars fill with shapes, waste heatmapped red, density % live-updating. Pause/rewind, tweak params (mutation rate for GA), export SVG/PNG. Speed slider from 1x (step-by-step) to 100x (blur of optimization). Emergent chaos: GA evolves wild layouts that beat heuristics sometimes.

**Target audience:** CS students learning NP-hard problems, game devs (asset packing), UI designers (responsive grids), optimization nerds. Bookmarkable tool + shareable screenshots of "perfect packs".

**Key features:**
- Drag/drop rectangles with live preview — snap to strip, resize via handles.
- 4 algos visualized parallel: color-coded bars, live density/waste metrics, step/rewind controls.
- Web Workers prevent UI freeze — handles 500+ rects at 60fps.
- Preset challenges: "Pack Tetris", "Bin 1000 items", "Waste under 5%"
- Export high-res SVG (vector perfect for print), share link with seed.
- Heatmap overlays: waste intensity, algo comparison graphs.

**The hook:** Screenshots of 4 algos battling over a chaotic pile of rects, GA pulling a surprise perfect pack — "AI beats humans at Tetris packing?" Twitter bait.

**Wow Test Results:**
1. Stop scrolling? YES — optimization porn like sorting algos but spatial/mesmerizing.
2. Developer would share? YES — rare interactive NP-hard demo; CS profs/students will assign it.
3. Technical boundary pushed? YES — Web Workers + Canvas perf for 1000-item real-time GA (mutation/crossover in JS).
4. Different from this week? YES — edu/algo tool vs recent games/shaders/drawing.

### Scout Notes
The strip packing post on creativecoding lit up because it's math-beauty-meets-practical — exactly the untapped niche after avoiding shader/particle repeats. I pivoted from agent viz (OpenClaw trending) since daily builds are client-side JS, not full frameworks. What excites me: GA emergent surprises create replayability beyond static viz; handling 500 rects live in browser pushes JS perf envelope without WebGL crutches. Technical challenge of worker sync + smooth Canvas redraw will test builder, but presets/challenges make it instantly engaging. This screams "bookmark for job interview prep" — virality locked.

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Refined the GA implementation details, added specific visualization polish requirements, tightened color scheme for the dark theme
**Estimated JS complexity:** 800-1200 lines

### Visual Design
- **Color scheme:** 
  - Background: `#0a0a0f` (dark base, required)
  - Surface panels: `#12121a` with `rgba(255,255,255,0.05)` borders
  - Algorithm colors (distinct, saturated):
    - First-Fit Decreasing: `#ff3366` (hot pink/red)
    - Best-Fit: `#33ccff` (cyan)
    - Bottom-Left: `#33ff99` (mint green)
    - Genetic Algorithm: `#ffcc33` (amber/gold)
  - Waste heatmap: gradient from transparent to `#ff4444` at 20% intensity
  - Text: `#e4e4ed` primary, `#888899` secondary
  - Accents: `#aa88ff` (purple) for interactive elements
- **Layout:** 
  - Header: Title + density stats (4-up grid, one per algorithm)
  - Main: 4 horizontal strip canvases, stacked vertically, each ~120px tall
  - Each strip has: algo name badge (left), canvas (center-right), live metrics (right)
  - Control bar: fixed bottom, drag-drop zone, playback controls, speed slider
  - Side panel: rectangle inventory (draggable items), challenge presets
- **Typography:** 
  - Font: system-ui, -apple-system, sans-serif
  - Title: 1.5rem, weight 700
  - Algo labels: 0.75rem uppercase, weight 600, letter-spacing 0.05em
  - Metrics: 0.875rem, tabular-nums for percentages
- **Visual style:** 
  - Glassmorphism panels with subtle blur
  - Neon glow on algorithm badges (box-shadow with algo color at 30%)
  - Rectangles have 1px inner highlight, subtle drop shadow
  - Active rectangle being placed: pulse animation, 2px stroke
  - Waste regions: faint red overlay with noise texture pattern
- **Key visual elements:**
  - Particle burst when rect snaps into place (3-5 small dots, fade over 300ms)
  - Progress bars for each algo (thin, algo-colored, at top of each strip)
  - Density % as large numbers with "xx.x%" format
  - Speed indicator: 1x-100x with smooth transitions

### UX Flow
1. **First impression:** Page loads with 4 empty strips and a "drop rectangles here" zone. A subtle animated arrow points to the drag area. The 4 algorithm badges glow faintly, waiting.
2. **Discovery:** User drags a rectangle from the inventory (or clicks "Generate Random") onto the drop zone. As they drag, rectangles snap to a grid preview. Release adds it to the queue.
3. **Experimentation:** User hits PLAY. All 4 strips animate simultaneously — rectangles fly in from the top/left and settle into their packed positions. User can PAUSE to inspect, STEP forward one placement at a time, or REWIND.
4. **Feedback loop:** Each placement triggers: (a) particle burst at snap point, (b) density number ticks up with a spring animation, (c) waste heatmap updates in real-time, (d) algorithm ranking updates in the header.
5. **Mastery:** Power users discover: (a) hover over any placed rect to see its dimensions and placement order, (b) right-click to remove and re-pack, (c) tweak GA mutation rate mid-run (0.01-0.5 slider), (d) export SVG button reveals vector-perfect output, (e) URL updates with seed for sharing "perfect pack" configurations.

### Technical Architecture
- **Rendering:** Canvas2D (4 separate canvases, one per algorithm, 800x120 each)
- **Animation loop:** `requestAnimationFrame` with delta-time calculation, target 60fps. Each strip renders independently. Use `willReadFrequently: false` for canvases.
- **State management:** 
  ```javascript
  state = {
    rectangles: [{id, width, height, color, placed}], // all rects
    algorithms: {
      ffd: { placements: [], currentIdx: 0, stripHeight: 0, running: false },
      bf: { /* same */ },
      bl: { /* same */ },
      ga: { placements: [], generation: 0, population: [], bestFitness: 0 }
    },
    global: { speed: 1, paused: false, stepMode: false }
  }
  ```
- **Key algorithms:**
  - **First-Fit Decreasing:** Sort by height descending. For each rect, find first strip with sufficient remaining width. Track strip height (max of placed rects).
  - **Best-Fit:** Sort by height descending. For each rect, find strip that minimizes remaining waste (tightest fit). Tie-breaker: lowest strip.
  - **Bottom-Left:** Place each rect at bottom-most, left-most valid position. Requires shelf management.
  - **Genetic Algorithm:** 
    - Chromosome: permutation of rectangle indices
    - Fitness: 1 / (total packed height * penalty for overlap)
    - Operators: Order crossover (OX), swap mutation, tournament selection
    - Generational: 50 individuals, run 100 gens or until convergence
- **Performance considerations:**
  - Object pooling for particle effects (avoid GC pauses)
  - Spatial indexing: simple shelf array for each strip [x, width, height] — no quadtree needed for 1D packing
  - Throttle GA calculations: one generation per frame when speed >10x
  - Use `OffscreenCanvas` for worker if supported (fallback: main thread with RAF throttling)
- **Input handling:**
  - Mouse: dragstart on rect inventory, dragover/drop on strip zone
  - Touch: same + pinch to zoom strip view (transform scale on canvas container)
  - Keyboard: Space = play/pause, Left/Right = step, R = reset, S = export SVG

### Interactions Detail
- **Click:** 
  - On rect in inventory: add to drag buffer
  - On PLAY button: start all algorithms from current state
  - On PAUSE button: halt animation, show step controls
  - On strip canvas: if paused, show rect tooltip with dimensions
- **Drag:** 
  - From inventory to strip: ghost preview follows cursor, snap to 10px grid
  - On drop: rect added to queue, bounces into place with spring physics (300ms)
- **Mouse move:** 
  - Over strip: highlight row under cursor, show placement order tooltip
  - Over controls: subtle scale up (1.02x) on buttons
- **Scroll/pinch:** 
  - On strip container: zoom 0.5x-2x (scale transform on wrapper div, not canvas)
  - On speed slider: horizontal drag adjusts 1x-100x
- **Keyboard:** 
  - Space: toggle play/pause
  - ←/→: step backward/forward one placement (only when paused)
  - R: reset all strips
  - S: trigger SVG export
  - 1-4: toggle visibility of individual algorithms

### Edge Cases
- **Mobile:** 
  - Touch targets minimum 44px
  - Strip height reduced to 80px on screens < 480px wide
  - Show only 2 algorithms at a time (swipe to switch pairs)
  - Disable particle effects if FPS drops below 30
- **Performance:** 
  - If >200 rectangles: disable particle effects, throttle to 30fps
  - If >500 rectangles: switch GA to Web Worker only, main thread just renders
  - Slow device detection: `navigator.hardwareConcurrency < 4` → auto-reduce particle count
- **Empty state:** 
  - Show animated dotted outline in drop zone
  - "Drag rectangles or click Generate" text with subtle pulse
  - Algorithm strips show "Waiting for rectangles..." faint text
- **Error handling:** 
  - WebGL not applicable (Canvas2D only)
  - Web Worker fallback: if Worker fails, run GA on main thread with setTimeout 0
  - LocalStorage full: silently catch, don't block functionality
  - Export fails: show "Copy to clipboard" fallback button

### Kimi Notes
I refined the visual design to emphasize the algorithm competition aspect — each algo gets a distinct neon color that glows on its badge, making the 4-way race instantly readable. The key polish addition is the particle burst on each placement — it turns the abstract packing into a satisfying micro-interaction. I tightened the GA spec: OX crossover and tournament selection are battle-tested for permutation problems. The Web Worker fallback is critical because GA will stutter on slow devices. For the builder: pay special attention to the animation timing — if placements happen too fast, the visualization becomes a blur; if too slow, it's boring. The speed slider must feel responsive across the full 1x-100x range. The heatmap overlay is subtle but essential — it makes waste visible without overwhelming the composition. This build lives or dies on the "race" feeling — all 4 algorithms must feel like they're competing in real-time, even though they execute sequentially in the render loop.

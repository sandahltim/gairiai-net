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

**Inspired by:** \"Critical strip packing\" (r/creativecoding, 44 upvotes) + Curl Packing (r/generative). Packing optimization is trending hard — devs/students crave interactive demos that show why naive greedy fails vs heuristics/genetics.

**Description:** Users drag colorful rectangles (random or custom sizes) onto a 1D strip canvas. Hit PLAY: 4 algorithms race side-by-side — First-Fit Decreasing (FFD), Best-Fit (BF), Bottom-Left (BL), simple Genetic Algo (GA). Watch bars fill with shapes, waste heatmapped red, density % live-updating. Pause/rewind, tweak params (mutation rate for GA), export SVG/PNG. Speed slider from 1x (step-by-step) to 100x (blur of optimization). Emergent chaos: GA evolves wild layouts that beat heuristics sometimes.

**Target audience:** CS students learning NP-hard problems, game devs (asset packing), UI designers (responsive grids), optimization nerds. Bookmarkable tool + shareable screenshots of \"perfect packs\".

**Key features:**
- Drag/drop rectangles with live preview — snap to strip, resize via handles.
- 4 algos visualized parallel: color-coded bars, live density/waste metrics, step/rewind controls.
- Web Workers prevent UI freeze — handles 500+ rects at 60fps.
- Preset challenges: \"Pack Tetris\", \"Bin 1000 items\", \"Waste under 5%\"
- Export high-res SVG (vector perfect for print), share link with seed.
- Heatmap overlays: waste intensity, algo comparison graphs.

**The hook:** Screenshots of 4 algos battling over a chaotic pile of rects, GA pulling a surprise perfect pack — \"AI beats humans at Tetris packing?\" Twitter bait.

**Wow Test Results:**
1. Stop scrolling? YES — optimization porn like sorting algos but spatial/mesmerizing.
2. Developer would share? YES — rare interactive NP-hard demo; CS profs/students will assign it.
3. Technical boundary pushed? YES — Web Workers + Canvas perf for 1000-item real-time GA (mutation/crossover in JS).
4. Different from this week? YES — edu/algo tool vs recent games/shaders/drawing.

### Scout Notes
The strip packing post on creativecoding lit up because it's math-beauty-meets-practical — exactly the untapped niche after avoiding shader/particle repeats. I pivoted from agent viz (OpenClaw trending) since daily builds are client-side JS, not full frameworks. What excites me: GA emergent surprises create replayability beyond static viz; handling 500 rects live in browser pushes JS perf envelope without WebGL crutches. Technical challenge of worker sync + smooth Canvas redraw will test builder, but presets/challenges make it instantly engaging. This screams \"bookmark for job interview prep\" — virality locked.

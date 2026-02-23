# Build Proposal - 2026-02-23

## Idea: Particle Life Universe
**Category:** daily
**One-liner:** An interactive artificial life simulator where colorful particles follow attraction/repulsion rules to form emergent ecosystems like galaxies, flocks, and predators.
**Description:** Users adjust sliders for interactions between five particle colors—attraction, repulsion, or neutral—and watch thousands of particles self-organize in real-time on an infinite canvas. Simple rules yield complex, hypnotic behaviors: swirling vortexes, chasing packs, symbiotic dances. Pure Canvas API, no frameworks—timeless procedural magic rediscovered for 2026 screens.
**Target audience:** Science enthusiasts, procedural art lovers, anyone mesmerized by emergence (think Conway's Game of Life but fluid and shareable).
**Key features:**
- 5x5 interaction matrix sliders (-1 repulsion to +1 attraction) for endless experimentation.
- 500-5000 particles with velocity damping, wrapping edges, collision avoidance.
- Real-time stats: cluster counts, velocity averages, dominant species.
- Preset "biomes" (galaxy, ocean, hunt), save/load/share configs via URL params.
- Dark theme, mobile-touch optimized, hypnotic color cycles.
**The hook:** Hypnotic and unpredictable—one tweak spawns viral "what are these dots doing?!" moments; screenshots/GIFs beg to be shared on X/TikTok.

### Scout Notes
Emergent complexity from dumb rules never gets old, especially post-2025 AI sim hype—this vanilla JS version proves you don't need models for wonder. Avoided repeats like yesterday's pixels/colors by going kinetic/soundless-life. Pumped to see Forge animate the chaos; revenue angle: could spin into NFT generator later.

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Minor scope refinement—capped max particles at 3000 for mobile performance, simplified biome presets to 4 core types, removed URL param sharing for v1 (add later), added pause/play and step controls for scientific observation.

### Visual Design
- **Background:** `#0a0a0f` (site standard dark)
- **Particle colors:** 
  - Red: `#ff4757`, Blue: `#3742fa`, Green: `#2ed573`, Yellow: `#ffa502`, Purple: `#8e44ad`
- **UI surface:** `#12121a` cards with `rgba(255,255,255,0.06)` borders
- **Accent:** `#00d4aa` for active states, sliders, primary actions
- **Text:** `#e4e4ed` primary, `#888` secondary labels
- **Layout:** Canvas fills viewport, floating control panel on right (top on mobile <640px)
- **Typography:** System font stack, 14px labels, 12px stats numbers, monospace for live counters

### UX Flow
1. **Landing:** Dark screen, particles immediately swarm in preset "Cosmos" biome (gentle orbital motion). Subtle hint text fades: "Drag to pan • Scroll to zoom".
2. **Discovery:** User notices floating control handle (≡) on right edge—opens to reveal 5×5 interaction matrix. Each cell is a slider (-1.0 to +1.0) showing particle A's attraction to particle B.
3. **Experimentation:** Dragging any slider instantly affects particle physics—no submit button, real-time feedback. Colors glow brighter when interaction is strong.
4. **Presets:** Row of pill buttons below matrix: "Cosmos" (orbits), "Hunt" (chase), "Swarm" (flocking), "Chaos" (turbulent). Click snaps sliders to predetermined states, particles transition smoothly.
5. **Observation:** Pause button freezes time—user can step frame-by-frame to study emergent patterns. Screenshot button saves current canvas state.
6. **Stats:** Live counters show particle counts by species, average velocity, detected cluster count (simple distance-based algorithm).

### Technical Spec
- **Canvas:** Full window size, `devicePixelRatio` scaling for crisp rendering, requestAnimationFrame loop
- **Particles:** 1500 default (500-3000 range slider), each has: x, y, vx, vy, colorIndex, radius (2-4px)
- **Physics per frame:**
  1. For each particle, check attraction to all others (O(n²) is fine for n≤3000 on modern devices)
  2. Apply force = attraction_matrix[myColor][theirColor] / distance² (clamped max distance 150px for performance)
  3. Add velocity damping (0.96 factor) to prevent explosion
  4. Update position, wrap edges (torus topology—particles exit right, enter left)
- **Interactions:** 
  - Slider drag: updates matrix value immediately
  - Preset click: animates slider values over 300ms, then physics update
  - Pause/Play: toggles animation loop
  - Step: advances one frame when paused
  - Reset: randomizes particle positions, keeps matrix
- **State management:** Single `state` object with: `particles[]`, `matrix[5][5]`, `isPaused`, `selectedPreset`, `zoom`, `panX`, `panY`
- **Animations:** 
  - Slider thumb: 150ms ease-out on value change
  - Preset transition: matrix values interpolate 300ms
  - Particle birth: radius grows 0→final over 10 frames
  - Button hover: background shifts to `rgba(0,212,170,0.1)`
- **Edge cases:**
  - Mobile: touch events for pan, pinch for zoom, sliders work with touch
  - Performance: if fps drops below 30 for 3 seconds, auto-reduce particle count by 20%
  - Tab inactive: pause animation, resume on visibilitychange
  - Empty matrix (all zeros): particles drift with damping—show "Try adjusting the sliders" hint

### Kimi Notes
I kept the core emergent magic but tightened the scope for a single-day build. The 5×5 matrix is the star—make those sliders tactile with glow effects. I removed URL sharing to ensure the physics simulation itself is rock-solid; shareable configs can be a fast follow. The "Cosmos" preset should be the default—it produces satisfying orbital motion immediately without user input, hooking them to explore. Performance is the hidden challenge: O(n²) particle physics at 60fps means we need the distance cutoff and velocity damping, or 1500 particles becomes a slideshow on mobile. Test the "Hunt" preset carefully—it should create predator-chase-prey dynamics, not just random chaos.
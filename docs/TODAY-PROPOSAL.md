# Build Proposal - 2026-03-08

## Research Sources
- GitHub Trending: Eyot (GPU as thread lang), Curiosity Telescope site, Lobster lang — hot on seamless GPU compute and niche sim tools.
- HN: Eyot lang making GPU=CPU threads, PS5 Linux port, Rembrandt discovery — dev tools blending hardware boundaries.
- r/InternetIsBeautiful: Live satellite map (https://satellitemap.space/), painting galaxy interactive (https://painting.com.in), local kanban — real-time data viz and explorable art.
- r/creativecoding hot: "My Ant colony simulator mini game" video (v.redd.it/ua384oocping1), interactive footer/shield effects, ASCII torus, global trade timelapse — agent sims, particle effects, procedural mazes.
- r/generative: Radiolarian procedural gallery, Hilbert splined curves, fractal dimensions — organic procedural geometry.
- Recent ships: 03-07 Morphogenesis (generative WebGL patterns), 03-06 Sonic Wire (physics/audio sandbox), 03-05 Billionaire Vortex (WebGL data viz) — avoid generative/physics/data viz; rotate to Game/interactive.

Key spark: Ant colony sim video in creativecoding — emergent agent behaviors from simple rules, highly shareable chaos. Combined with satellite swarms/orbitals for scale inspiration, but pivoted to ground-level colony wars for replay depth.

## Idea: Ant Wars Arena
**Category:** Game/interactive (something with depth and replayability)
**One-liner:** Drop food bombs and pheromone walls to command your ant colony into emergent wars against AI rivals — evolve strategies over 5-minute battles.
**Technical Stack:** Canvas2D particle system (10k ants max), simple Reynolds steering + pheromone diffusion field, Verlet physics for tumbling fights, seeded RNG for replays.

**Description:** A top-down arena where you spawn your red ant colony vs blue AI. Drop food packets to lure/boost your ants, paint pheromone highways/traps to guide swarms, unleash soldier caste floods. Ants follow emergent flocking (seek food/phero/follow leader/attack enemy), with fights causing physics ragdolls and casualties. 5-min rounds end in territory % score; share replay seeds on social. Procedural arena with obstacles, wind/diffusion adds chaos. Starts with tutorial swarm demo — feels alive instantly.

**Target audience:** Creative coders, game devs, procedural sim fans — they'd share epic swarm clashes or counter-tactics discoveries.

**Key features:**
- Ant agent sim: 1000+ ants with steering forces (food seek, phero follow, enemy attack, collision avoid), caste upgrades (workers/soldiers).
- Player tools: Food dropper (lure/boost), phero brush (paths/traps), pause/FF, caste selector.
- Physics clashes: Enemy contact = Verlet impulse tumbles + HP drain; dead ants decay into food.
- Emergent depth: AI mirrors player but slower learning; wind shifts phero clouds; obstacles force routing.
- Replay system: Seeded arenas/food drops, PNG snapshot mid-battle, clipboard seed code.
- Perf adaptive: LOD distance fade, particle pooling, 60fps cap with lite mode.

**The hook:** Viral swarm battles — screenshot a massive red wave crashing blue lines at a chokepoint, or a clever phero trap starving enemies. "My ants just invented flanking maneuvers!"

**Wow Test Results:**
1. Stop scrolling? YES — instant swarm chaos grabs like a strategy game trailer.
2. Developer would share? YES — emergent AI wars from 200LOC steering math; devs love dissecting agent sims.
3. Technical boundary pushed? YES — 5k-particle Canvas2D flocking + diffusion at 60fps, Verlet fights without WebGL.
4. Different from this week? YES — Agent sim game vs recent pattern gen/physics sandbox/data particles.

### Scout Notes
The ant colony video hooked me — simple rules, insane emergent wars, perfect screenshot fodder. Eyot's GPU-thread vibe inspired scaling to 10k agents affordably in Canvas (no WebGL needed). Over satellite maps (cool but data-viz adjacent to recent vortex) or painting galaxy (explorable but static). Excited by replay seeds turning it into competitive sharing; technical challenge is balancing steering weights for believable tactics without hardcoding.

---
## Build Spec (Sage)
**Verdict:** APPROVED
**Changes from proposal:** Structurally identical. Upgraded with: exact pheromone grid architecture (typed Float32Array, 4 channels), simplified "Verlet fights" to impulse-based collision response (cleaner at scale, same visual result), explicit finite state machine for ant behavior, named AI strategy system, exact hex colors and caste stats. Scout's direction is correct — emergent swarm warfare with player agency is the real deal and the correct category rotation.
**Estimated JS complexity:** 950–1200 lines

---

### Visual Design
- **Color scheme:** Background `#0a0a0f`. Red colony ants: `#ff3344`, pheromone trail: `rgba(255, 60, 60, 0.22)`. Blue colony ants: `#3388ff`, pheromone trail: `rgba(60, 120, 255, 0.22)`. Food pellets: `#00ff99` with radial glow. Soldier variant (red): `#cc1122`, (blue): `#1144cc`. Nest rings: colony color at 35% opacity, slow pulse. Obstacles: `#1e1a1a` with `#2e2828` edge highlight. UI glassmorphism panels: `rgba(255,255,255,0.06)` fill, `1px solid rgba(255,255,255,0.10)` border, `8px` border-radius.
- **Layout:** Full-viewport canvas (max 900px wide, centered on desktop; 100vw on mobile). Canvas is the game world. Overlay HTML: slim top HUD bar (timer center, territory bar full width, score flanking left/right). Bottom-right: tool panel (food / pheromone / caste buttons, 48px min touch targets). Top-right: pause button. Seed display appears in bottom-left corner only at round end.
- **Typography:** `'JetBrains Mono', 'Courier New', monospace` throughout. HUD labels 0.7rem. Score digits 1.1rem bold. Round-end overlay: 2rem win text, 0.9rem stats grid. All text `#e4e4ed`.
- **Visual style:** Dark UV-light organic. Like watching a war under black light — pheromone trails glow faintly on a near-black dirt canvas. No flat fills: everything has subtle glow or grain.
- **Key visual elements:** Ant wedge shapes (canvas `arc` + `lineTo`; 3px head radius, 7px body; oriented to velocity vector). Pheromone field as separate `OffscreenCanvas` composited onto main with `globalCompositeOperation: 'lighter'` for genuine glow. Food as 4px `#00ff99` circle + `createRadialGradient` outer glow (12px radius). Nest as 3-ring concentric hexagon (no fill, stroke only, 0.8 opacity pulsing). Death burst: 6 white pixel sparks radiating outward, fade over 400ms. Obstacle rocks: `bezierCurveTo` blobs, `#1e1a1a` fill.

---

### UX Flow
1. **Instant life:** Page loads → both colonies (30 red ants, 30 blue ants) are already in motion from opposite arena corners. No splash, no loading state. Pheromone trails already forming after 2 seconds. Player is dropped into an active war.
2. **Discovery:** Three tooltip hints appear sequentially (2s each): `"[Left Click] Drop food"` → `"[Right Drag] Paint pheromone highways"` → `"[S] Spawn soldiers"`. Tooltips are subtle (bottom-left, 0.7rem, fade out after 6s total). Player experiments naturally.
3. **First win:** Player drops food near red nest → workers detect it within 80px → swarm converges → food carried back → nest food meter ticks → new workers auto-spawn. Rewarding within 15 seconds.
4. **Escalation:** ~60s in, frontlines collide at arena center. Fights break out — ants tumble from impulse, corpses flash white then become green food pellets. Player discovers pheromone brush to funnel enemies into chokepoints.
5. **Strategy:** Player realizes soldiers can break enemy lines while workers flank to steal food. Or: bait enemies with food drops while soldiers ambush. The pheromone system creates real strategic depth without scripting.
6. **Round end:** 5-minute countdown hits zero (or one nest is destroyed). Overlay: `RED WINS / BLUE WINS` in 2rem. Stats: territory %, food collected, kills. Replay seed in monospace box with copy-to-clipboard button. "New Round" / "Same Map" buttons.

---

### Technical Architecture

- **Rendering:** Two stacked `<canvas>` elements (CSS `position: absolute`). Bottom canvas: pheromone heatmap (updated every 3 frames, drawn via `ImageData` bulk pixel write). Top canvas: ants, food, obstacles, UI overlays (cleared and redrawn every frame). No WebGL — pure Canvas2D. `OffscreenCanvas` for pheromone diffusion compute to avoid blocking main thread.

- **Animation loop:**
  ```js
  let last = 0;
  function loop(ts) {
    const dt = Math.min((ts - last) / 1000, 0.033); // cap at 33ms
    last = ts;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  ```
  FPS monitor (rolling 60-frame average). <30fps → enable lite mode: halve max ants, disable pheromone glow overlay.

- **State management:**
  ```
  pheromoneGrid: Float32Array[GRID_W × GRID_H × 4]
    channels: [RED_FOOD, RED_DANGER, BLUE_FOOD, BLUE_DANGER]
  ants: pre-allocated Array(MAX_ANTS=500) of Ant objects (object pool, no mid-game `new`)
  foods: Array of {x, y, amount, id}
  colonies: [RedColony, BlueColony] — each: {nestX, nestY, food, killCount}
  obstacles: Array of {polygon: [[x,y],...]}
  round: {elapsed, seed, phase: 'active'|'ended', winner}
  input: {mouseX, mouseY, leftDown, rightDown, dragPath, selectedTool, casteSel}
  rng: xorshift32 seeded from round.seed
  ```

- **Key algorithms:**
  - **Reynolds steering:** Weighted force accumulation per ant — `wander`, `seek`, `flee`, `separation`, `alignment`, `cohesion`. Per-state weights table (see FSM below). Forces summed, clamped to max speed, applied as velocity delta.
  - **Pheromone diffusion:** Each tick (every 3 frames), iterate grid cells: `newVal[i] = oldVal[i] * 0.992 + 0.25 * (avg of 4 orthogonal neighbors)`. Player-painted HIGHWAY cells decay at 0.998 instead. Applied via single-pass over `Float32Array` — ~30k ops, ~0.2ms.
  - **Spatial grid:** Arena divided into 24px cells. Each ant registers in its cell on position update (every 2 frames). Neighbor lookup = check 9 surrounding cells. Enables O(1) k-nearest queries for steering and fight detection.
  - **Collision/fight:** Each frame, soldiers/workers check spatial grid for enemy ants within 8px. On contact: deal `(2 + caste_bonus)` HP damage to enemy, apply impulse `(dx,dy) * 0.8` pushing both apart. HP ≤ 0 → death: spawn 1 food pellet at location, white spark burst, return ant to pool.
  - **Seeded RNG:** xorshift32 (`state = (state ^ state << 13) >>> 0; state ^= state >> 17; state ^= state << 5;`). Used for obstacle placement, AI food drop decisions, ant wander noise. Same seed = identical arena + AI behavior = shareable replay.
  - **Territory control:** Every 60 frames, iterate pheromone grid: count cells where `RED_FOOD + RED_DANGER > BLUE_FOOD + BLUE_DANGER` → red territory %. Update HUD bar.

- **Performance considerations:** Object pooling for ants (pre-allocate 500 at init, recycle on death — no GC pressure). Spatial grid rebuild every 2 frames. Pheromone `ImageData` pixel write: precompute `Uint8ClampedArray` from float grid each 3 frames, single `putImageData` call. Pheromone glow composited with `globalCompositeOperation: 'lighter'` on bottom canvas only. Cap pheromone grid at 150×112 cells (24px per cell at 3600×2688 logical — scaled to canvas).

- **Input handling:** Mouse left click = drop food tool action. Mouse right click + drag = pheromone brush (sample every 8px along drag path). Keyboard: `S` = soldier mode, `W` = worker mode, `Space` = pause, `F` = 2× fast-forward, `R` = restart same seed, `N` = new random seed. Touch: single tap = food drop, two-finger press-and-drag = pheromone paint (prevent default pinch zoom during drag).

---

### Ant Behavior — Finite State Machine

**5 states. Per-state steering weight tables:**

| State | seek_food | seek_nest | flee_enemy | seek_enemy | wander | phero_follow | separation |
|-------|-----------|-----------|------------|------------|--------|--------------|------------|
| EXPLORING | 0 | 0 | 0 | 0 | 0.6 | 0.4 | 0.5 |
| FORAGING | 1.0 | 0 | 0.1 | 0 | 0 | 0.2 | 0.3 |
| RETURNING | 0 | 1.0 | 0.1 | 0 | 0 | 0 | 0.3 |
| FIGHTING | 0 | 0.1 | 0 | 1.0 | 0 | 0 | 0.2 |
| FLEEING | 0 | 0.5 | 1.0 | 0 | 0 | 0 | 0.4 |

**Transitions:**
```
EXPLORING → FORAGING:   food detected within 80px
EXPLORING → FIGHTING:   enemy ant within 40px AND (soldier OR outnumber 2:1 local)
FORAGING → RETURNING:   arrived at food (within 6px) AND food.amount > 0
FORAGING → FIGHTING:    enemy ant within 12px (soldiers attack mid-forage)
RETURNING → EXPLORING:  arrived at nest (within 20px of nestX,nestY)
RETURNING → FIGHTING:   enemy within 12px AND is soldier
FIGHTING → FLEEING:     HP < 20% of max
FIGHTING → EXPLORING:   no enemy within 60px for 1.5s
FLEEING → EXPLORING:    no enemy within 100px for 2.0s
```

**Pheromone laying:**
- RETURNING ants lay `RED_FOOD` = 180 at current grid cell each frame
- FIGHTING/FLEEING ants lay `RED_DANGER` = 200 at current grid cell
- Player-painted HIGHWAY sets `RED_FOOD` = 255 with 3× decay halflife

**Caste stats:**

| Caste | Speed | Max HP | Damage/frame | Attack range | Phero follow | Food carry |
|-------|-------|--------|-------------|--------------|--------------|------------|
| Worker | 2.4px/f | 20 | 1 | 6px | 1.0× | Yes |
| Soldier | 1.5px/f | 50 | 4 | 10px | 0.5× | No |

---

### AI Colony (Blue) — Rule-Based Strategy

The blue colony runs on the same physics as red — no cheating, same mechanics. Only its "high-level decisions" are scripted. Every 15 seconds, AI evaluates:

```js
function aiTick() {
  const ratio = blue.food / Math.max(red.food, 1);
  const killLead = blue.killCount - red.killCount;

  if (ratio < 0.6 || killLead < -5) {
    // Defensive: drop food at safe locations, spawn workers
    dropFood(randomSafePoint(blueNest, 120), 3);
    blue.castePref = 'worker';
  } else if (ratio > 1.4 && killLead > 3) {
    // Aggressive: push toward red nest, flood soldiers
    dropFood(midpointToward(redNest, 0.6), 2);
    paintHighway(blueNest, midpointToward(redNest, 0.6));
    blue.castePref = 'soldier';
    blue.soldierBurst = 5; // spawn 5 soldiers next cycle
  } else {
    // Expansion: claim center territory
    dropFood(arenaCenter + rng.offset(80), 2);
    paintHighway(blueNest, arenaCenter);
    blue.castePref = 'worker';
  }
}
```

AI "paints" pheromone highways by directly writing into the blue pheromone grid — the same operation the player performs with right-click. Not magic, just fast. Makes the AI feel purposeful and reactive without scripted paths.

---

### Interactions Detail

- **Left click:** Spawn 3 food pellets at cursor ±10px jitter. Each pellet: `{x, y, amount: 20}`. Visual: `#00ff99` radial burst (radius expands 0→20px over 300ms, then settles). Nearby red ants (within 80px) instantly transition to FORAGING state.

- **Right click + drag:** Every 8px along drag path: set `pheromone[RED_FOOD][cell] = 255` (HIGHWAY flag, slower decay). Visual: trail of glowing red dots appear instantly as you drag. Release: trail persists and decays normally. No action on right-click without drag.

- **S key / Soldier button:** Toggle `castePref` = 'soldier'. New ants spawned from red nest are soldiers (larger size, darker `#cc1122`). Button gets `box-shadow: 0 0 12px #ff3344` active glow. If `red.food < SOLDIER_COST (30)`: button flashes red, small text: `"Need more food"`.

- **W key / Worker button:** Toggle back to worker mode. Default on round start.

- **Space:** Pause toggle. Full-screen `rgba(0,0,0,0.5)` overlay with `"PAUSED"` in 2.5rem centered. Simulation frozen (dt=0). Pheromone continues decaying (time is passing). Unpause on Space again.

- **F key:** Fast-forward toggle. `dt *= 2`. HUD label shows `"2×"` in yellow. Ant count updates feel snappy; pheromone diffuses faster visually. Toggle off with F again.

- **Mouse move:** Ghost preview of selected tool: food tool = small `#00ff99` circle follows cursor; pheromone tool = 16px radius circle outline in red follows cursor.

- **Scroll/pinch:** Zoom (1×–2.5×) centered on cursor position using canvas `transform`. Pan with middle-click drag or two-finger drag (when not painting pheromone). Pheromone grid query scales with zoom — always full resolution.

- **R key (round-end only):** Restart with same `round.seed`. Arena, obstacles, AI behavior identical. N key: `round.seed = Date.now()` → fresh procedural run.

---

### Edge Cases

- **Mobile:** Touch targets minimum 48px on all UI buttons. Canvas fills full viewport width. Pheromone grid halved in resolution (<600px viewport) for performance. Two-finger pheromone paint: check `e.touches.length === 2` and disable default browser pinch-zoom while painting.

- **Performance:** Rolling FPS average (60-frame window). Below 30fps → `liteMode = true`: max ants capped at 150 per colony, pheromone glow overlay disabled (draw pheromone as solid color instead of lighter blend). Below 20fps → canvas resolution halved (`.style.width/height` = 2× actual canvas resolution). HUD shows lite mode badge.

- **Empty state:** There is none. Round begins with 30 ants per colony already active and navigating. Player sees a live war within 3 seconds of load.

- **Canvas not supported:** Centered fallback text: `"Your browser doesn't support canvas. Try Chrome or Firefox."` — no other dependencies.

- **Window resize:** Debounced resize handler (150ms). Canvas resizes proportionally to new viewport. Pheromone grid rescales: bilinear sample from old grid into new grid dimensions. Game state preserved through resize.

- **Round end:** Timer hits 0:00 or a nest is captured (5+ enemy soldiers reach within 30px of nest for 3 consecutive seconds → nest destroyed). Overlay appears: large win text, stats table (territory %, food, kills), seed code in monospace box with `[Copy]` button, `[Same Map]` and `[New Arena]` buttons. Ants freeze in place (simulation paused). Pheromone trails continue fading gracefully.

---

### Sage Notes

Scout's proposal is genuinely strong — the ant colony sim video from r/creativecoding is exactly the kind of viral reference point that produces shareable work. My key architectural decision is the dual-canvas approach with `globalCompositeOperation: 'lighter'` on the pheromone layer: without this, the pheromone field looks flat and functional rather than alive and glowing, which kills the visual hook entirely. The builder must implement the spatial grid before anything else — at 300+ ants, O(n²) neighbor checks will immediately destroy framerate, and the whole simulation collapses. The FSM state table is non-negotiable: without explicit per-state steering weights, ants either ignore everything or respond to everything equally, which produces incoherent behavior that looks broken rather than emergent. The AI's 15-second strategy cycles should feel like it's "thinking" — the visual tell is blue soldiers suddenly flooding a new direction after a pause, which players read as intelligent response even though it's dead simple logic. The round must start hot — no tutorial screens, no loading states, ants already fighting within 3 seconds. That first impression is what makes the share screenshot happen.

# Build Proposal - 2026-03-08

## Research Sources
- GitHub Trending: Eyot (GPU as thread lang), Curiosity Telescope site, Lobster lang — hot on seamless GPU compute and niche sim tools.
- HN: Eyot lang making GPU=CPU threads, PS5 Linux port, Rembrandt discovery — dev tools blending hardware boundaries.
- r/InternetIsBeautiful: Live satellite map (https://satellitemap.space/), painting galaxy interactive (https://painting.com.in), local kanban — real-time data viz and explorable art.
- r/creativecoding hot: \"My Ant colony simulator mini game\" video (v.redd.it/ua384oocping1), interactive footer/shield effects, ASCII torus, global trade timelapse — agent sims, particle effects, procedural mazes.
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

**The hook:** Viral swarm battles — screenshot a massive red wave crashing blue lines at a chokepoint, or a clever phero trap starving enemies. \"My ants just invented flanking maneuvers!\"

**Wow Test Results:**
1. Stop scrolling? YES — instant swarm chaos grabs like a strategy game trailer.
2. Developer would share? YES — emergent AI wars from 200LOC steering math; devs love dissecting agent sims.
3. Technical boundary pushed? YES — 5k-particle Canvas2D flocking + diffusion at 60fps, Verlet fights without WebGL.
4. Different from this week? YES — Agent sim game vs recent pattern gen/physics sandbox/data particles.

### Scout Notes
The ant colony video hooked me — simple rules, insane emergent wars, perfect screenshot fodder. Eyot's GPU-thread vibe inspired scaling to 10k agents affordably in Canvas (no WebGL needed). Over satellite maps (cool but data-viz adjacent to recent vortex) or painting galaxy (explorable but static). Excited by replay seeds turning it into competitive sharing; technical challenge is balancing steering weights for believable tactics without hardcoding.
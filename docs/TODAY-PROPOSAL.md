# Build Proposal - 2026-03-07

## Research Sources
- GitHub Trending: Heavy on AI agents and frameworks (Qwen-Agent, agency-agents, ai-hedge-fund, KeygraphHQ/shannon autonomous hacker). Swarms of specialized agents dominating.
- Hacker News: AI security scans, but light on creative; "RankClaw" scanning AI skills caught eye for agent ecosystems.
- r/InternetIsBeautiful hot: Flight trackers by altitude (satisfying visuals), media converters, 3D cash timers — interactive data/tools with visual punch.
- r/generative hot: Radiolarian (organic forms), Murmurations (flocking), cyanowaves — procedural organic motion trending.
- Recent ships: 03-06 Sonic Wire Forge (physics/audio game), 03-05 Billionaire Vortex (data viz WebGL), 03-03 GLSL Node Forge (shader tool/generative). Avoiding repeats: no pure data viz, no nodes/shaders, no audio/physics sims.

## Idea: FlockForge Arena
**Category:** 3. Game/interactive (with depth and replayability)
**One-liner:** Evolve bird-like AI swarms in a real-time competitive arena — breed behaviors, watch flocks battle for territory via emergent flocking + genetics.
**Technical Stack:** WebGL2 instanced particles (10k+ birds), boid flocking algorithm, simple genetic algorithm (mutation/selection per round), collision physics, territory heatmaps.
**Inspired by:** r/generative's Murmurations (flocking visuals) + GitHub's agent swarms (Qwen-Agent/agency-agents) — humans love watching emergent AI battles; flight tracker colors for altitude/score layers.

**Description:** Start with a flock of 500 colorful particles representing your swarm. Tweak 6 behavior sliders (cohesion, separation, alignment, aggression, speed bias, color morph) to define DNA. Hit PLAY — your flock spawns in a foggy circular arena against 2-3 rival swarms (procedurally varied DNA). Flocks flock, dodge, chase glowing food pellets and rival birds using classic boid rules + your DNA params. Kill rivals to grow your flock; hold territory center for bonus multipliers. After 60s, top flock's DNA auto-mutates slightly + breeds with survivors for next round. 5-round tournament with escalating arena hazards (winds, predators). Mobile drag orbits camera; keyboard for god-mode nudges.

**Target audience:** Creative coders, AI/game devs, procedural art fans — they'll obsess over tweaking DNA for "god flocks," share replay gifs of insane emergent patterns (toroidal swarms, kamikaze raids).

**Key features:**
- Real-time WebGL boid sim: 10k particles at 60fps via instanced rendering + GPU compute for forces.
- 6-DNA editor: Sliders mutate post-round; viz DNA as radial gene wheel.
- Emergent competition: Flocks steal food/gems from rivals, density-based territory scoring.
- Replay camera: Auto-cinematic replays of best moments (zoom on clashes, slow-mo evolutions).
- Share/export: DNA seeds + final heatmap PNG; embed replay video gen.
- Hazards rounds: Wind vortices, shrinking arena, predator particles.

**The hook:** That moment when your tweaked hyper-aggressive flock spirals into a death-vortex that shreds rivals — pure screenshot/gif gold for #creativecoding Twitter.

**Wow Test Results:**
1. Stop scrolling? YES — hypnotic flocks + evolution races grab eyes instantly like murmurations but playable.
2. Developer would share? YES — "I evolved this insane swarm strat" with replay GIF; devs love boids+GA browser demos.
3. Technical boundary pushed? YES — GPU-accelerated boids + real-time GA selection on 10k agents client-side; rare in single-file builds.
4. Different from this week? YES — Game/arena battles vs recent physics wires, data vortex, shader nodes.

### Scout Notes
GitHub's agent swarm hype + r/generative's murmurations screamed "make it interactive + competitive" — nobody's doing evolvable boid battles in-browser at scale. Beats static viz or tools because endless replay tweaking + sharing DNA creates virality loops. Most excited by GA viz challenge: mutating flocks visually emerge patterns humans never design (e.g. rotating phalanxes). Forge can nail instanced WebGL + boid GPU pass; this passes Wow harder than safe utils.

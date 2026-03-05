# Build Proposal - 2026-03-05

## Research Sources
- r/InternetIsBeautiful hot: \"How Rich Is a Billionaire, Really?\" (https://www.thehowpage.com/economics/billionaire-wealth) — scroll-driven interactive putting billionaire wealth in perspective via endless scroll, GDP comparisons, spending sims. Blew up for breaking scale intuition.
- F1 Clock (https://labs.laserdeathstehr.com/f1-clock): Every hour compresses a full F1 race to realtime clock — genius data compression/time viz.
- r/creativecoding: Physics node wires, audio-reactive geometry, Xbox controller DMX laser synth — node-based sims trending.
- r/generative: Liquid backgrounds, glitch text, seismic vision — procedural fluids/viz hot.
- GitHub/HN trends: WebGL-plot for realtime waveforms, deck.gl geospatial big data, but no pure wealth clocks.
- Recent ships: GLSL Node Forge (shader nodes), Fractal Wavetable (gen art audio), GPU Murmuration (physics sim) — avoiding technical showpiece/generative repeat.

Public APIs found: komed3/rtb-api (Forbes realtime billionaires historical), Forbes Billionaires API for live net worth/rankings.

## Idea: Billionaire Wealth Vortex
**Category:** Data/visualization (real data, beautifully presented — rotates from recent physics/shaders/gen art)
**One-liner:** Spiral into a billionaire's live net worth — scroll/zoom compresses trillions into viewport, particles swarm as wealth grows realtime from Forbes API.
**Technical Stack:** WebGL (GPGPU particles), WebSockets (live API polling), Canvas2D fallback, ScrollTimeline API for scrubber.
**Inspired by:** \"How Rich Is a Billionaire\" endless scroll + F1 Clock realtime compression — nobody does live billionaire growth as emergent particle vortex.

**Description:** A swirling vortex of particles represents one billionaire's (e.g., Musk) net worth: center is $0, outer edge is current total (e.g., $852B). Scroll/zoom dives deeper into scales (your salary → millions → billions), particles density/velocity visualize growth rate ($155k/min → insane realtime ticks). Live fetch from rtb-api updates total + rank, particles birth/die accordingly. Mouse orbits camera, click toggles GDP/national comparisons (e.g., overlay Finland GDP as orbiting ring). Particles trail glows encode hourly growth history.

**Target audience:** Data nerds, econ twitter, r/InternetIsBeautiful crowd — they'll share because it's hypnotic realtime inequality porn with GDP context.

**Key features:**
- Realtime API fetch (rtb-api/Forbes) updates wealth clock + sparks particle bursts for $ gains.
- Infinite zoom scroll (ScrollTimeline + logarithmic scale) — compresses 1T into viewport without perf loss.
- 100k+ GPGPU particles (WebGL compute shader) — emergence: flocks form 'wealth waves' on surges.
- GDP overlays: 15+ countries as interactive rings (drag to compare Musk vs Nigeria GDP).
- History trail: Particle comet tails show 24hr growth curve.
- Multi-billionaire switcher: Tabs for top 5, rank deltas animate.
- Export: Screenshot + CSV of hourly net worth for threads.

**The hook:** Watching $852B swirl/grow live, then zooming to see your salary as a single particle — screenshot that for Twitter: \"Musk earned this in the time you read this tweet.\"

**Wow Test Results:**
1. Stop scrolling? YES — realtime money vortex grabs instantly, logarithmic zoom mindf*cks scale.
2. Developer would share? YES — GPGPU realtime API viz + ScrollTimeline polish screams #dataviz #webgl.
3. Technical boundary pushed? YES — WebGL particle compute for trillions-scale sim, live API WebSockets without lag.
4. Different from this week? YES — Data/viz realtime (not shaders/physics/audio), first live external data pull.

### Scout Notes
Reddit's billionaire scroll post exploded because it weaponizes scroll fatigue to teach scale — I'm amping it with live API + GPGPU particles for emergence nobody codes manually (wealth 'flocks' on surges). Picked over audio-reactives (repeat fractal synth) or node wires (echoes GLSL Forge) because realtime data viz is underserved client-side, APIs make it defensible moat. Excited by compute shader challenge: pack net worth log-scale into particle pos/vel without precision loss. Devs will fork for stock viz, users hypnotized for hours — pure virality.
# Build Proposal - 2026-03-13

## Research Sources
- r/InternetIsBeautiful hot: Mood2Know (https://mood2know.com) — live anonymous global mood map aggregating one-click emotions into world heatmap and trends. Simple, real-time, collective data viz that's shareable. Fake work simulators, LEGO colors timeline (https://sheets.works/data-viz/lego-colors) — data arranged visually by year/production status. Drum machine (https://drumha.us/), cosmic playground (https://www.nebulatool.com/play/stardust), collaborative pixel walker (https://littlewanderer.net/).
- r/creativecoding hot: Audio-reactive ASCII/Unicode, infinite shared wall concept, Lagrangian densities, contour formation sketches.
- r/generative hot: Fluid sims in Godot compute shaders, proto-cell GIFs, TerDragon fractals, funkyvector designs.
- Recent daily ships: Beat Beast (2026-03-12: WebAudio physics sequencer — technical/audio), Mandelbulb Morpher (2026-03-11: WebGL2 fractals — generative), Nebula Swarm (2026-03-10: mic-reactive particles — technical).

Global real-time data viz like Mood2Know/LEGO colors caught my eye — elegant aggregation of live/shared data into hypnotic visuals. Paired with physics trends, screams for a seismic twist.

## Idea: Quake Globe Live
**Category:** Data/visualization (real data, beautifully presented — rotates from recent technical/generative/audio)
**One-liner:** Real-time WebGL 3D Earth where live earthquakes bloom as magnitude-scaled particle bursts with glowing trails and tension waves.
**Technical Stack:** WebGL2 (globe raymarch/shader, particle system, bloom post-process), fetch USGS earthquake GeoJSON API every 60s.
**Inspired by:** Mood2Know's minimalist live world mood map (anonymous global data → instant viz) + LEGO colors timeline (data particles by time/status) + proto-cell/contour physics from generative Reddit.

**Description:** A dark-space 3D Earth (procedural or texture-mapped) spins slowly. Every minute, it polls USGS all-day GeoJSON (http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson), spawning particles at epicenter lat/lon: magnitude scales burst size/color (M5+ red fireballs, M3+ orange pulses, low-mag blue sparks). Particles rise + expand with velocity decay, leave faint trails, trigger radial tension waves across surface. Zoom/orbit controls, time slider for last 24h/7d feeds, auto-recenter on activity, quake density heat map toggle.

**Target audience:** Data nerds, earth science fans, devs — anyone who loves live global feeds (flights/stars/quakes) rendered with cinematic WebGL polish. Shares like "Watch the Earth rumble in real-time."

**Key features:**
- Live USGS API polling (all_day + significant_hour feeds, parse GeoJSON coords/mag/time).
- WebGL2 particle sim (GPU instanced quads, age/velocity uniforms, bloom for glow).
- Procedural Earth (normals/shading + night lights) or low-res texture, lat/lon → 3D projection.
- Mag-based visuals: size=exp(mag), color=hue(mag), wave radius=mag*dist.
- Interactions: mouse/touch orbit/zoom, keyboard presets (zoom-to-cluster, pause sim, history scrub).
- Performance: LOD particles, fade old quakes, 60fps cap with fallback.
- Ambient: Slow rotation, subtle seismic hum (procedural sine swell on big quakes).

**The hook:** Pinching into a live M6.5 off Japan as red particles erupt and waves ripple the globe — screenshot gold for Twitter/Reddit.

**Wow Test Results:**
1. Stop scrolling? YES — live planetary data with physics drama grabs instantly, like Flightradar but underground + prettier.
2. Developer would share? YES — USGS API + WebGL particle globe shows off real-time data wrangling + shader chops without deps.
3. Technical boundary pushed? YES — GeoJSON → lat/lon → globe projection → GPU particles/waves/bloom in single-file WebGL2.
4. Different from this week? YES — Data/viz vs technical audio/physics, generative fractals, particle nebula (this uses real external data + earth sim).

### Scout Notes
r/InternetIsBeautiful's Mood2Know nailed minimalist live global aggregation — I want that but seismic, since quakes are always happening and visually explosive. Over other ideas (another drum/ASCII/fluid), this rotates category cleanly, uses public USGS API for authenticity (no fakes), and layers particle physics on real data for moat-level wow. Excited by the tech stack: hand-rolled globe projection + instanced particles will flex WebGL skills hard, perfect for "AI shipped a live data globe?!" shares. Challenges like accurate lat/lon spherical mapping and smooth polling will make it shine.
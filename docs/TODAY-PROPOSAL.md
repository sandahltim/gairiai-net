# Build Proposal - 2026-03-12

## Research Sources
- r/InternetIsBeautiful hot: drumha.us (browser drum machine with sequencer, effects, WAV export — deep WebAudio shaping); nebulatool.com/play/stardust (cursor-sculpted galaxies, supernovas, black holes, typed words → star constellations — particle physics playground); littlewanderer.net (collaborative pixel creature walking 6000km via global clicks); web-rewind.com and obsoletenet.com (retro web nostalgia).
- r/creativecoding hot: Contour Formation (generative geometry gallery), Fractal Singularity 3D video, Chaotic symmetry angle paths, Cold Light abstract.
- r/generative hot: Similar visual math art, PixelSortStudio, Math visualisation tool.
- HN/GitHub: Some audio-reactive ASCII, 3D knitting, but less visual wow; satproto.org space-related.
- Recent ships: 03-11 Mandelbulb Morpher (Generative art, WebGL fractals); 03-10 Nebula Swarm (Technical showpiece, mic-reactive boids); 03-09 Fourier Epicycle (Useful tool, math viz). Categories to avoid repeating: Generative, Technical, Useful.

Key sparks: Drumhaus's sophisticated WebAudio sequencer + Little Wanderer's collaborative creature journey + Stardust's particle interactions = opportunity for rhythm-driven creature sim game.

## Idea: Drum Beast Odyssey
**Category:** Game/interactive (with depth and replayability — procedural terrain, beat-matching mechanics, evolution)
**One-liner:** Drum beats on a browser sequencer to propel your procedural pixel beast across infinite evolving terrain toward a 6000km global distance goal, with physics, upgrades, and shareable journey recaps.
**Technical Stack:** WebGL (creature/terrain rendering, particle FX), WebAudio (FFT beat detection, drum synthesis, sequencer), Canvas2D fallback for UI, localStorage for progress/highscores.

**Inspired by:** drumha.us's deep drum shaping/sequencing (shape voices with filters/pitch/decay, chain patterns) + littlewanderer.net's pixel creature trek (collaborative walking progress) + stardust's cursor/click cosmic controls. No direct copy — combines rhythm gaming with procedural adventure.

**Description:** Load into a dark cosmic arena. Your beast (procedural pixel sprite with legs/eyes/physics) idles on rugged terrain. Above: 8-voice drum grid like Drumhaus (kick/snare/hi-hat/perc with velocity/flam/ratchet). Tap steps to sequence beats — strong bass launches jumps, snare syncs strides, hi-hats add speed bursts. Terrain procedurally generates ahead (Perlin noise heights, obstacles, biomes shifting every km). Mic input optional for live beat override. Beast evolves: collect "energy orbs" from perfect beat matches to unlock legs/wings/tails affecting physics. Global "distance ladder" via anonymized localStorage hash-sharing. Feels like a rhythm roguelike crossed with creature sim — endless replay via random seeds, beat challenges.

**Target audience:** Creative coders/musicians/gamers who love rhythm games (Crypt of the NecroDancer vibe) but crave procedural depth + visual polish. They'd share "My drum beast hit 500km!" with replay GIF.

**Key features:**
- Procedural beast gen (L-systems for body, pixelated with glow shaders) + ragdoll physics (simple Verlet integration).
- 16-step x8-voice sequencer with Drumhaus-style per-voice envelopes/filters/pan + pattern chaining (A/B/C morphs).
- Infinite terrain: Perlin + Voronoi biomes, dynamic obstacles that react to beat impacts (shockwaves shatter rocks).
- Beat-matching challenges: "Sync 10 jumps" orbs → upgrades; FFT mic viz for live drumming.
- Journey recap: Auto-generate shareable SVG timeline of distance/milestones/beast evolutions; PNG/GIF export.
- Keyboard/touch controls, PWA install, offline play.
- High-score persistence + seed sharing for "beat this terrain".

**The hook:** The moment your first drum sequence makes the beast *leap a chasm in sync* — pure dopamine. Screenshots of evolved beasts mid-air over neon biomes, with sequencer grid overlaid. "AI built a drum roguelite you can play forever."

**Wow Test Results:**
1. Stop scrolling? YES — rhythm + creature adventure hybrid is fresh; instant play with evolving visuals grabs like a mobile game trailer.
2. Developer would share? YES — WebGL physics + WebAudio synthesis in single-file; "procedural beasts powered by your beats" tweets itself.
3. Technical boundary pushed? YES — WebGL Verlet ragdoll + Perlin terrain streaming + real-time WebAudio drum synth/FFT + procedural L-system evolution.
4. Different from this week? YES — Game category (vs. recent Generative/Technical/Useful); no fractals/particles/math tools — pure interactive adventure.

### Scout Notes
Drumhaus blew me away with its pro-level WebAudio depth in browser — that's the sequencer backbone. Little Wanderer's simple collab walk hooked the "journey progress" gameloop, but we amp it to solo procedural epic. Stardust added particle flair for upgrades/FX. Excited by tying rhythm input to physics outcomes — creates emergent "dance moves." Technical challenge: balancing WebGL perf for infinite terrain while synth stays responsive. This one's got legs (literally).
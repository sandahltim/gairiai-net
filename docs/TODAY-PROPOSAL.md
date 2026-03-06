# Build Proposal - 2026-03-06

## Research Sources
- r/InternetIsBeautiful hot: 3D Cash Timer (https://3dcashtimer.com/) standing out for upgrading a stale UI concept to 3D physics; StreamGrid Twitch guide (https://streamgrid.win) as useful real-time data tool; LocalSquash (https://localsquash.com/) client-side media tool showing demand for browser power.
- r/creativecoding hot: \"Physics based node wires\" (https://v.redd.it/m748ydi7xtmg1) – real-time node connections with tension physics; \"My audio-reactive geometry system\" (https://v.redd.it/j8u74gmx8gmg1) – mic-driven deformations; Xbox controller synth with visuals.
- r/generative hot: Particle flow turbulent noise, tensor mesh, fractal curves – emphasis on fluid/procedural motion.
- Recent HN/InternetIsBeautiful: Interactive explainers like billionaire wealth (but we shipped vortex yesterday), music timelines.
- Recent ships: 03-05 billionaire wealth vortex (data/viz), 03-03 GLSL node forge (technical shaders), 03-02 fractal wavetable (generative audio), 03-01 GPU murmuration (physics flocks), so rotating away from viz/shaders/audio flocks to interactive game/physics.

## Idea: Sonic Wire Forge
**Category:** Game/interactive (with depth and replayability)
**One-liner:** Drag nodes to build physics wire networks that vibrate and resonate to your microphone input, forging stable structures or chaotic symphonies.
**Technical Stack:** Three.js + Ammo.js (Bullet physics WebAssembly), WebAudio API (mic FFT real-time), GLSL shaders for wire glow/vibration effects.
**Inspired by:** r/creativecoding \"Physics based node wires\" + \"My audio-reactive geometry system\" – combines node physics tension with mic-driven reactivity for emergent gameplay.

**Description:** Click/drag to spawn pinned or free nodes, auto-connecting spring wires simulate tension/damping. Plug in mic – low freqs pump bass waves along wires, highs spark node flares. Goal: Build resonant structures (harps, bridges) that \"sing\" without collapsing, or unleash chaos for visual spectacle. Physics emergent: waves propagate, nodes cluster/swing, colors shift by freq bands. Replayable challenges: survive earthquakes (random forces), tune to specific songs.

**Target audience:** Creative coders on Reddit/Twitter, music producers, physics sim fans – they'll share clips of insane mic-reactive builds going viral.

**Key features:**
- Real-time microphone FFT analysis driving wire tensions, node displacements, shader intensities (WebAudio AnalyserNode).
- Realistic physics joints/springs for 100+ nodes (Ammo.js collision detection, stable stacking).
- Procedural wire meshs with glowing GLSL shaders distorting by audio amplitude.
- Interactive modes: Free build, stability challenges (timer + forces), song tuner (upload audio file fallback).
- Export: Screenshot, animated GIF capture, shareable seed/state URL.
- Mic permission graceful fallback to tone generator.

**The hook:** Screenshot a glowing wire harp pulsing to your voice dropping beats – \"AI built a physics instrument you control with sound.\" Instant Twitter/Reddit bait.

**Wow Test Results:**
1. Stop scrolling? YES – mic reactivity + physics chaos grabs instantly, hypnotic yet controllable.
2. Developer would share? YES – showcases WebAssembly physics + WebAudio mastery, forkable code appeal.
3. Technical boundary pushed? YES – real-time audio-to-physics coupling with stable 60fps WebGL sim (Ammo.js heavy lift).
4. Different from this week? YES – Interactive node game vs static GLSL forge, audio synth, flocking particles, wealth viz.

### Scout Notes
The physics node wires post jumped out – simple concept but endless emergent potential when mic-driven. Paired with audio-reactive geo, it screams replayability: stable vs collapse gameplay loop. Excited for Ammo.js challenge (heavy but doable nightly build), pushes beyond canvas to full 3D physics. This captures today's hot physics+audio vibe without rehashing recent ships. Will make devs go \"how's that running smooth in browser?\"

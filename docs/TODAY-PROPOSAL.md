# Build Proposal - 2026-03-02

## Research Sources
- Github Trending: Heavy on AI agents/skills (ruvnet/wifi-densepose WiFi pose est, OpenSandbox AI sandbox, claude-skills, openclaw), but pivoted to client-side JS for our strength.
- HN Top: Ghostty terminal, AI code debates, WebMCP preview, ship tracker (Flightradar24 for Ships), but audio/physics less covered.
- r/InternetIsBeautiful: Single-purpose sites, real-time sharing tools.
- r/creativecoding Hot: Mandelbulb Wavetable, Mandelbrot sounds like, Netherlands sounds (matigekunst audio-fractals), Infinite Chainwheel, Rubik procedural, 3D galleries/anime games.
- r/generative Hot: Space filling loops, cormorants/murmurations art, infinite Hilbert curve generator.
Key spark: Audio-from-fractals in creativecoding — math visuals driving WebAudio synths, untapped vs particle sims.

Recent ships: 03-01 GPU Murmuration (technical showpiece/physics), 02-28 Rectangle Packer (useful tool/algo viz), 02-27 Particle Beam (game/interactive). Rotating to **Generative Art + Audio**.

## Idea: Fractal Wavetable Odyssey
**Category:** Generative art (visually stunning + audio synthesis)
**One-liner:** Dive into infinite Mandelbrot zoom — fractal boundaries morph a live wavetable synth, turning math chaos into hypnotic soundscapes.
**Technical Stack:** Canvas2D accelerated Mandelbrot render + WebGL fragment for zoom slices → WebAudio wavetable osc, filters, LFOs from fractal data.

**Inspired by:** r/creativecoding's \"Mandelbulb Wavetable\" and \"Mandelbrot Set sounds like\" by matigekunst — procedural audio from fractals, amid trending shader/creativecoding energy.

**Description:** Pan/zoom the Mandelbrot set in real-time (smooth animated transitions). Each zoom level slices the fractal edge into a wavetable loaded into a WebAudio oscillator. Fractal density drives filter cutoff, iteration depth modulates LFO rate, boundary colors tint harmonics. Play notes via keyboard/mouse to hear the evolving synth — deeper zooms yield harsher, alien tones; edge chaos creates glitchy rhythms. Record loops, export stems. Emergent: mouse trails leave temporary distortion wakes.

**Target audience:** Synth heads, creative coders, math-art nerds — they'll share clips of \"infinite zoom symphony\" on Twitter/Reddit.

**Key features:**
- Smooth pinch/zoom/pan Mandelbrot with 1e-15 precision (accelerated Canvas2D julia-set hints).
- Auto-wavetable gen: 1024-sample slices from current viewport edge, FFT-optimized load to OscillatorNode.
- Parametric mapping: density→filter freq, hue→formant shift, zoom→pitch bend range.
- Keyboard poly synth (A-G keys), mouse scribble for melodies, auto-arpeggiate from fractal contours.
- Effects chain: fractal-driven delay (echo depth from iter), reverb (space from zoom), distortion (chaos metric).
- Record/export: Capture 30s stems as WAV, shareable glitch-art waveforms.

**The hook:** Screenshot a surreal zoom level + audio clip — \"AI turns Mandelbrot into synth patch that evolves forever\". Devs obsess over procedural audio math.

**Wow Test Results:**
1. Stop scrolling? YES — hypnotic fractal zoom + immediate eerie synth grabs visually/aurally.
2. Developer would share? YES — creativecoding crowd loves math-audio hybrids; shader-to-sound pipeline impressive.
3. Technical boundary pushed? YES — real-time fractal→wavetable pipeline + smooth deep zoom without perf crash.
4. Different from this week? YES — audio/generative vs GPU physics/tool/game; first WebAudio focus.

### Scout Notes
Reddit creativecoding's fractal-audio posts exploded amid shader trends — perfect counter to our recent particle flocks/packer (no more sims). This leverages Canvas perf + WebAudio depth for emergence nobody scripts manually. Thrilled by challenges: precise wavetable extract from fractal iter, FFT harm avoidance. Over packer games, pure math-music moat shines — devs will fork shaders, users loop-trip forever. Black magic: julia perturbation for ultra-deep zooms without float blowup.

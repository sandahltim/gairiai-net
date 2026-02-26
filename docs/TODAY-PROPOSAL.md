# Build Proposal - 2026-02-26

## Research Sources
- GitHub Trending: Heavy on AI agent orchestration (claude-flow, deer-flow, agent skills), web scraping (Scrapling), edge ASR (moonshine), vector NN (ruvector). Shows agent/AI tooling hot, but creative angle sparse.
- Hacker News: General trends toward genuine tech insights, open-source launches, STEM news.
- r/InternetIsBeautiful hot: Discovery sites like 'what people doing right now', random interesting websites, advanced web experiences.
- r/creativecoding hot: Standouts include \"Real-time geometric music visualizer\", piano-to-monster game, hand-reactive particles, Three.js anime game, procedural Rubik's cube, audio-reactive MRI in TouchDesigner, kinect instruments. Audio-visual reactivity exploding.
- r/generative hot: Pure art like cormorant experiments, murmurations, Truchet cubes, funkyvector designs.
- Recent ships (mandala-mirror, digital-zen-garden, pixel-art-studio): All generative/drawing/meditative — banned patterns. Need fresh category.

## Idea: Live Fractal Audio Reactor
**Category:** Technical showpiece (WebGL shaders + WebAudio)
**One-liner:** Plug in your mic or upload a track — watch GLSL fractals pulse, morph, and explode in perfect sync with real-time FFT audio analysis.
**Technical Stack:** WebGL2 (fragment shaders), WebAudio API (AnalyserNode FFT), Canvas, procedural geometry (ray marching distance fields).
**Inspired by:** r/creativecoding's \"Real-time geometric music visualizer\" and \"Audio-reactive MRI [TouchDesigner]\" — taking audio-geometry reactivity to browser-native shader level.

**Description:** A mesmerizing live visualizer where uploaded audio or live microphone input drives dynamic GLSL fragment shaders rendering infinite fractals (Mandelbulb, Julia sets, torus knots). FFT spectrum controls shader uniforms: bass pumps scale/zoom, mids twist rotations, highs spark particle bursts. Sliders let users tweak shader params mid-performance for custom remixes. No plugins — pure browser magic that turns any track into a shareable psychedelic light show.

**Target audience:** Creative coders, music producers, VJs, glitch art fans — anyone who geeks out over audio-reactive visuals and wants to experiment without Unity/TouchDesigner setup.

**Key features:**
- Real-time mic input or drag-drop audio file upload with playback controls.
- 5 swappable shader presets (fractal zoom, plasma waves, metaballs, kaleidoscope warp, plasma fire).
- FFT-driven uniforms: 32-band spectrum maps to time, color, distortion, speed.
- Live shader editor: tweak GLSL code snippets and see instant changes (safe params only).
- Screenshot/video record (MediaRecorder API) for social sharing.
- Responsive fullscreen mode with beat-sync camera shake.

**The hook:** Drop your favorite EDM track — bass drops literally shatter the fractal into exploding shards. Devs screenshot the code, musicians share the viz, everyone wonders \"how is this all browser?\"

**Wow Test Results:**
1. Stop scrolling? YES — live audio reactivity grabs instantly, especially with headphones/mic.
2. Developer would share? YES — editable GLSL + WebAudio sync is catnip for shader nerds.
3. Technical boundary pushed? YES — real-time FFT-to-shader param mapping without libs, ray marching fractals at 60fps.
4. Different from this week? YES — no drawing/zen; pure audio-shader tech demo vs recent canvas doodles.

### Scout Notes
The audio-reactive trend screams from creativecoding — geometric viz and TouchDesigner MRI posts lit me up because they blend sound design with visuals in ways drawing tools can't touch. I picked fractals/shaders over particles because ray marching pushes WebGL harder (distance fields are moat-level impressive) and ties into generative without being 'art toy'. Excited for the builder challenge: syncing AnalyserNode to uniform updates without lag is non-trivial, and live shader tweaking adds replay value. This positions gairiai.net as the go-to for bleeding-edge audio viz without downloads — devs will fork the shaders on GitHub.
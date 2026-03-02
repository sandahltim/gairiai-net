# Build Proposal - 2026-03-02

---
## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Refined interaction model for better UX flow; specified exact audio architecture; added mobile touch handling requirements; clarified performance optimizations.
**Estimated JS complexity:** 650-850 lines

### Visual Design
- **Color scheme:** 
  - Background: `#0a0a0f` (deep space black)
  - Fractal interior: `#1a1a2e` → `#16213e` (deep blues)
  - Fractal edges: `#e94560` (coral red) through `#ff6b6b` (warm pink) → `#ffd93d` (gold) → `#6bcb77` (mint)
  - UI panels: `rgba(20, 20, 30, 0.85)` with `backdrop-filter: blur(12px)`
  - Accent glow: `#00d9ff` (cyan) for active elements
  - Text: `#e4e4ed` (off-white), `#a0a0b0` (muted)
- **Layout:** Full-viewport Canvas2D renderer (100vw × 100vh). HUD overlay positioned absolute top-left (parameters panel), top-right (audio controls), bottom-center (transport/keyboard hint). No scrolling — entire interface is the fractal canvas.
- **Typography:** Inter or system-ui, 0.875rem for UI labels, 1rem for values, 0.75rem for hints. Monospace for coordinate readout (JetBrains Mono).
- **Visual style:** Glassmorphism panels with subtle borders (`1px solid rgba(255,255,255,0.08)`). Fractal rendering uses smooth color cycling with hue rotation based on iteration count. Particle overlay for "zoom dust" — tiny white dots that drift slowly, creating depth.
- **Key visual elements:** 
  - Infinite zoom with smooth interpolation (lerp between scales, not jump cuts)
  - Iteration count visualization as concentric glow rings
  - "Wavetable preview" mini-visualizer showing current audio waveform (64px × 32px glass panel)
  - Coordinate readout showing real/imaginary components

### UX Flow
1. **First impression:** User sees a Mandelbrot set rendered in dark blues and reds. Subtle "breathing" animation (slow hue shift) makes it feel alive. A brief "Click anywhere to start audio" overlay fades after first interaction (AudioContext requires user gesture).
2. **Discovery:** User drags to pan — the fractal follows smoothly with momentum. Mouse wheel or pinch zooms with exponential scaling (each step is 2x closer). Audio immediately responds to new viewport.
3. **Experimentation:** User realizes the bottom of screen shows a hint: "Keys A-K for notes, Space to arpeggiate." Pressing 'A' plays a note — the wavetable is derived from current fractal edge data, creating an otherworldly timbre that evolves as they zoom.
4. **Feedback loop:** Every interaction produces immediate audio-visual correlation. Zoom deeper = higher harmonic content. Pan to different regions = timbre morphs. The wavetable preview panel updates in real-time showing the waveform shape.
5. **Mastery:** Power users discover: (a) right-click sets "bookmark" coordinate that auto-returns with 'B', (b) holding Shift while playing creates chords from fractal contour data, (c) Ctrl+S exports 30-second audio stem as WAV + screenshot combo.

### Technical Architecture
- **Rendering:** Canvas2D (not WebGL — easier for single-file, sufficient for 800x600 at 60fps with optimizations). Offscreen canvas for background tile rendering. Progressive refinement: low-res preview first, then iterate to higher quality.
- **Animation loop:** `requestAnimationFrame` at 60fps. Separate render and audio threads via AudioWorklet (or ScriptProcessorNode fallback). Render loop: clear → draw fractal tiles → draw UI overlay → draw particles.
- **State management:** 
  ```javascript
  state = {
    view: { cx, cy, zoom, targetZoom, zoomProgress }, // complex plane center
    audio: { wavetable: Float32Array(1024), filterFreq, lfoRate, activeNotes: Map() },
    interaction: { isDragging, lastMouse, momentum },
    render: { iterationMax, colorOffset, qualityLevel }
  }
  ```
- **Key algorithms:**
  - Mandelbrot: `z = z² + c` iteration with escape radius 4. Smooth coloring: `n + 1 - log(log|z|)/log(2)`
  - Wavetable extraction: Sample 1024 points along fractal boundary at current zoom level. FFT to harmonic series, normalize to [-1, 1].
  - Audio synthesis: Custom wavetable oscillator using PeriodicWave. BiquadFilter for lowpass. Delay with feedback for space effect.
  - Pan momentum: velocity-based with friction coefficient 0.9
- **Performance considerations:** 
  - Tile-based rendering with LRU cache (max 16 tiles)
  - Adaptive iteration count: max 256 for preview, 1024 for final quality
  - Worker thread for heavy computation (optional but nice)
  - Audio wavetable updates throttled to 100ms minimum
- **Input handling:**
  - Mouse down + move → pan with momentum
  - Wheel → zoom with exponential scaling (deltaY → zoom multiplier)
  - Touch: two-finger pinch for zoom, single finger pan
  - Keyboard: A-K mapped to pentatonic scale, Space for auto-arpeggio toggle

### Interactions Detail
- **Click:** If audio not started, initializes AudioContext. If started, triggers note at click position (maps x→pitch, y→filter cutoff).
- **Drag (mouse/touch):** Pans view. Momentum continues after release. Cursor changes to grabbing state.
- **Mouse move:** Subtle parallax on "dust particles" layer. Updates coordinate readout in HUD.
- **Scroll/pinch:** Zooms centered on pointer location. Uses `wheel` event with `preventDefault`. Zoom level clamped to avoid float overflow (max 1e-12 scale).
- **Keyboard:**
  - A, S, D, F, G, H, J, K: Play notes in C minor pentatonic scale
  - Space: Toggle auto-arpeggio (plays notes from fractal contour data)
  - B: Return to bookmark coordinate (if set)
  - R: Reset to initial view
  - ↑/↓: Adjust master volume
  - M: Mute/unmute

### Edge Cases
- **Mobile:** Touch events prevent page scroll. Fullscreen recommended. UI panels collapse to bottom sheet on <600px width. Touch targets minimum 44px.
- **Performance:** If frame rate drops <30fps, automatically reduce iteration count and tile resolution. Show subtle "quality" indicator in corner.
- **Empty state:** Initial view shows full Mandelbrot set. Brief animated hint overlay explains "Drag to pan, scroll to zoom, click to play."
- **Error handling:** 
  - WebAudio not supported: Show fallback message, visual-only mode
  - AudioContext suspended: Retry on next user gesture
  - Canvas too large for memory: Downscale automatically

### Kimi Notes
I refined Scout's ambitious proposal into a buildable spec. Key decisions: (1) Stuck with Canvas2D instead of WebGL fragment shaders — it's more accessible for a single-file build and we can hit 60fps with smart tile caching. (2) Specified the exact wavetable extraction method: sampling the fractal boundary contour, not just raw pixel data — this creates more musical results. (3) Added the "bookmark" feature for UX depth — gives users a way to return to favorite sonic textures. (4) The color palette shifted from Scout's generic suggestion to a specific deep-space scheme with coral/gold/mint gradients that'll look stunning on OLED displays. The builder needs to nail the momentum-based panning and the audio-visual sync — that's where the magic lives. If the wavetable update causes audio glitches, throttle it or use crossfading.

---

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

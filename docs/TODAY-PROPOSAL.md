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

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Refined shader architecture for performance, added specific uniform mapping strategy, specified exact color palette and UI layout
**Estimated JS complexity:** 800-1200 lines (WebGL boilerplate + 5 shader presets + FFT analysis + UI + recorder)

### Visual Design
- **Color scheme:** 
  - Background: `#0a0a0f` (mandatory dark)
  - Accent primary: `#00d4ff` (cyan glow — audio reactivity color)
  - Accent secondary: `#ff006e` (magenta — high frequency bursts)
  - Accent tertiary: `#fb5607` (orange — mid range warmth)
  - Text: `#e4e4ed` (primary), `#a0a0b0` (secondary)
  - Glass panels: `rgba(255,255,255,0.03)` with `backdrop-filter: blur(12px)`
- **Layout:** Fullscreen WebGL canvas as background layer. Floating glass UI panels: top-left (title/source controls), bottom-center (shader preset selector as horizontal pill buttons), right side (collapsible parameter sliders + mini shader editor), bottom-right (record/screenshot buttons). All UI sits ABOVE canvas via `position: fixed` with `pointer-events: auto` on controls, `none` on canvas.
- **Typography:** 
  - Headings: `Inter` or system-ui, `1.5rem`, weight 600
  - Body: `0.875rem`, weight 400
  - Code: `JetBrains Mono` or `monospace`, `0.8rem`
  - Line heights: 1.4 for readability
- **Visual style:** Cyberpunk-neon meets minimal glassmorphism. Glowing borders on active elements (`box-shadow: 0 0 20px rgba(0,212,255,0.3)`). Subtle scanline overlay (CSS repeating-linear-gradient) at 5% opacity for CRT vibe. Beat-pulse glow on title during audio playback.
- **Key visual elements:** 
  - Canvas fills viewport, `position: fixed`, `z-index: 0`
  - UI panels: `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 12px`
  - Audio visualizer strip below source controls showing 32 frequency bars in accent colors
  - Shader editor: mini textarea (10 lines) with syntax highlighting simulation via CSS classes

### UX Flow
1. **First impression:** User sees fullscreen dark void with subtle animated fractal (use preset 1, auto-play demo mode with synthesized sine wave if no audio source). Title "FRACTAL AUDIO REACTOR" glows with cyan pulse. Bottom hint: "Drag audio file or click microphone".
2. **Discover interactivity:** User drags MP3 onto canvas OR clicks "🎤 Use Microphone" button. Visualizer strip activates showing audio levels. Fractal instantly responds to audio — bass pulses zoom, mids twist rotation, highs spark color shifts.
3. **Experimentation:** User clicks through 5 shader preset pills (Mandelbulb, Plasma Waves, Metaballs, Kaleidoscope, Plasma Fire). Each transition is a 0.5s morph or hard switch with visual feedback. User drags sliders: "Bass Sensitivity", "Mid Intensity", "High Sparkle", "Rotation Speed", "Zoom Scale". Sliders update uniforms in real-time.
4. **Feedback loop:** Every audio frame (requestAnimationFrame sync'd to AnalyserNode) updates shader uniforms. Visual result: fractal morphs, pulses, rotates in perfect audio sync. Screen subtly shakes (CSS transform) on bass hits > threshold. Parameter changes show toast notification "Uniform updated".
5. **Mastery:** Power users discover: (a) Mini shader editor — edit GLSL fragment code and click "Compile" for instant preview, (b) Keyboard shortcuts (1-5 for presets, Space to pause/play, R to record), (c) Double-click canvas to toggle fullscreen, (d) Right-click canvas to save screenshot, (e) Hidden "chaos mode" (hold Shift + click preset) that randomizes all parameters.

### Technical Architecture
- **Rendering:** WebGL2 with fragment shader ray marching. Single full-screen quad (two triangles). Fragment shader does all heavy lifting.
- **Animation loop:** `requestAnimationFrame` callback. Inside: get FFT data from AnalyserNode → smooth with easing (lerp) → update uniforms → `gl.drawArrays`. Target 60fps, cap at display refresh rate.
- **State management:** Central `state` object: `{ audioSource: null|'file'|'mic', isPlaying: false, currentPreset: 0, fftData: Float32Array(32), uniforms: {...}, recorder: null }`. No React/Vue — vanilla JS with state listeners that trigger UI updates.
- **Key algorithms:**
  - **FFT Analysis:** AnalyserNode with `fftSize: 64` (gives 32 usable frequency bins). Map bins to bass (0-8), mids (8-20), highs (20-31).
  - **Smoothing:** Exponential moving average on each band: `smoothed = smoothed * 0.8 + raw * 0.2` prevents jitter.
  - **Ray Marching:** Standard distance field sphere tracing in fragment shader. For each preset:
    - Mandelbulb: `pow(r, 8)` fractal with `sin/cos` rotations
    - Plasma: `sin(x)*cos(y)*sin(time)` noise functions
    - Metaballs: 4 moving spheres, smooth min blending
    - Kaleidoscope: Polar coordinates with `mod(angle, PI/6)` sectors
    - Plasma Fire: FBM noise with vertical gradient
  - **Uniform mapping:** Bass → `u_zoom` (0.5 to 2.0), Mids → `u_rotationSpeed` (0 to 3.0), Highs → `u_sparkle` (0 to 1.0, triggers color shift).
- **Performance considerations:**
  - Use `gl.getExtension('EXT_color_buffer_float')` for HDR if available
  - Offscreen canvas not needed — single fullscreen quad is trivial
  - Cap shader iteration count (ray march steps) at 64 for mobile, 128 for desktop
  - Use `OES_texture_float_linear` for smooth FFT texture reads if needed
  - Frame skipping: if `deltaTime > 33ms` (sub-30fps), reduce march steps dynamically
- **Input handling:**
  - **Drag-and-drop:** `dragover`, `dragleave`, `drop` events on canvas. Read `e.dataTransfer.files[0]`, validate audio MIME type, create `URL.createObjectURL`, load into `Audio` element → connect to `AudioContext`.
  - **Microphone:** `navigator.mediaDevices.getUserMedia({audio: true})` → `MediaStreamSource` → connect to analyzer. Handle permission denied with toast error.
  - **Mouse:** Sliders use native `<input type="range">` with CSS styling. Shader editor is `<textarea>`.
  - **Keyboard:** `keydown` listener for shortcuts (1-5, Space, R, F for fullscreen).
  - **Touch:** All mouse interactions work for touch. Buttons sized 44px minimum.

### Interactions Detail
| Trigger | Animation | Result | Feedback |
|---------|-----------|--------|----------|
| Click preset pill | Background flash, 0.3s CSS transition | Switch shader program, recompile | Pill gets active glow border, canvas briefly flashes white at 20% opacity |
| Drag audio file | File hover overlay (glass panel "Drop to react") | Load file, auto-play, enable controls | Toast: "Loaded: filename.mp3", visualizer activates |
| Click mic button | Ripple effect from button center | Request permission, connect stream | Toast: "Microphone active" or "Permission denied" |
| Move slider | Real-time (throttled to 60fps) | Uniform value updates | Slider thumb glows, value tooltip appears |
| Edit shader + Compile | Button press animation | Recompile shader, catch errors | Success: "Compiled!" toast. Error: Show line number + message in red panel |
| Press R | None | Start MediaRecorder | Red "REC" badge appears top-right, pulses |
| Bass hit > threshold | CSS `transform: scale(1.02)` on canvas container | Visual punch | Subtle screen shake, returns in 100ms |
| Double-click canvas | Fade to fullscreen | `document.documentElement.requestFullscreen()` | None (native fullscreen transition) |

### Edge Cases
- **Mobile:** 
  - Touch targets minimum 44px (sliders expanded, buttons large)
  - Portrait: Stack UI panels vertically on left side instead of right
  - Auto-start with demo sine wave since user interaction required for AudioContext
  - Disable shader editor on mobile (too cramped), keep presets + sliders
- **Performance:**
  - Detect low FPS (running average of frame times). If < 30fps for 3 seconds: reduce `u_maxSteps` uniform to 64, disable sparkle effects, show toast "Performance mode enabled"
  - If WebGL2 not supported: Show fallback message "WebGL2 required — try Chrome/Firefox"
  - Shader compile error: Show error panel with line highlight, fallback to last working shader
- **Empty state:**
  - No audio source: Play synthesized demo loop (`OscillatorNode` sine wave at 440Hz with LFO) so fractal still animates. Show "Drag audio or click mic" overlay that fades after first interaction.
- **Error handling:**
  - Audio file decode fail: Toast "Invalid audio file"
  - Mic permission denied: Toast "Microphone access required"
  - WebGL context lost: Show "Graphics error — refresh to restart"
  - Recording fail: Toast "Recording failed — try shorter duration"

### Kimi Notes
I refined Scout's solid foundation by specifying exact uniform mapping (bass→zoom, mids→rotation, highs→sparkle) rather than vague "controls parameters." The visual design adds cyberpunk-neon aesthetic with glassmorphism panels — this differentiates it from generic shader demos. I mandated 5 specific shader presets with defined algorithms (Mandelbulb ray marching vs plasma sine noise) so GLM doesn't guess. The key challenge is FFT-to-shader sync without lag — I specified 64-bin analysis with exponential smoothing to prevent jitter. Added "chaos mode" easter egg for replay value. Critical: The mini shader editor must compile safely — wrap in try/catch and validate no texture fetches (security). This build positions gairiai.net as the bleeding-edge audio-viz destination — devs will screenshot the GLSL.
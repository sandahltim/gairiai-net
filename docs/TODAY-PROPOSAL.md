# Build Proposal - 2026-03-11

## Research Sources
- r/creativecoding hot: Fractal Singularity 3D (https://codepen.io/sabosugi/full/dPpOdNa) — stunning WebGL ray-marched fractal zoom with infinite depth and color-shifting plasma. Humans are sharing 3D fractal shaders hard right now.
- r/generative: PixelSortStudio (Python app), chaotic symmetry angle paths gallery, Julia sets, flying over GIFs — heavy emphasis on procedural geometry and symmetry emergence.
- r/InternetIsBeautiful: Littlewanderer.net collaborative pixel creature walk (6km trek), nuclear escalation simulator with real 2026 alliances — interactive sims with emergent/global scale.
- Recent GitHub/HN: Zig devlogs, agent-running blogs, but creative energy around procedural/math visuals.
- Category check: Last 3 days were Technical showpiece (Nebula Swarm: audio boids), Useful tool (Fourier epicycles), Game (Ant Wars). Avoid those — targeting Generative art.

Key spark: Fractal Singularity's hypnotic infinite zoom + chaotic symmetry paths. Nobody's done browser-native 3D Mandelbulb explorer with live parameter morphing yet.

## Idea: Mandelbulb Morpher
**Category:** 4. Generative art (visually stunning and unique)
**One-liner:** Infinite 3D Mandelbulb explorer where you twist Mandelbox/Quaternion parameters live to spawn alien geometries, ray-marched in real-time WebGL with volumetric glow and orbit cam.
**Technical Stack:** WebGL2 / GLSL fragment shaders (ray marching, signed distance fields), orbital controls, parameter interpolation, bloom post-processing.
**Inspired by:** Fractal Singularity 3D CodePen — that plasma zoom tunnel grabbed me, but it's static. Extend to interactive Mandelbulb family (power-3 bulb to fractal boxes) with smooth morphs between 16+ primitives.

**Description:** Load hits with a spinning Mandelbulb in neon plasma — no permissions, instant wow. Sliders for bulb power (2-8), iterations (5-20), scale/julia params let you sculpt impossible 3D fractals on the fly. Morph button tween-interpolates between random seeds, creating evolution sequences. Double-click explodes slices for interior views, mouse-drag orbits, wheel zooms to infinity. Adaptive step-counting keeps 60fps even at depth 100+. Export as animated GIF of your morph sequence.

**Target audience:** Shader nerds, generative artists, mathviz fans — the r/creativecoding crowd sharing "AI shipped a Mandelbulb shader toy better than most personal sites."

**Key features:**
- Live GLSL ray marcher with 10+ Mandelbulb primitives (Mandelbox, Menger sponge hybrids, quaternion julia sets).
- Smooth parameter lerping + auto-morph sequences (e.g., bulb→box→sponge in 5s).
- Volumetric fog/glow with cheap bloom (dual-pass shader).
- Slice planes + interior explosion mode for topology reveals.
- Preset gallery + random seed button for instant variety.
- GIF export of morph cam flythrough (using CCapture.js or shader recording).

**The hook:** Hypnotic infinite geometries mutating live — screenshot mid-morph shows impossible floating islands of math. Devs share with "AI raymarched this in one night?"

**Wow Test Results:**
1. Stop scrolling? YES — infinite neon fractal zoom tunnel sucks you in like black hole.
2. Developer would share? YES — full GLSL Mandel family with morphs is portfolio-level shader work.
3. Technical boundary pushed? YES — WebGL2 raymarching at interactive speeds with lerped primitives + bloom/volumetrics.
4. Different from this week? YES — Pure generative shader art vs particles/boids (tech), epicycles (tool), ants (game).

### Scout Notes
Fractal Singularity 3D on r/creativecoding blew up my pattern radar — 3D procedural fractals are hot, but most are static renders or Python. Browser GLSL morphing takes it to interactive extremes nobody's shipping daily. Excited by the math depth (SDF unions/intersections for hybrids) and perf challenge (adaptive marching for mobile). This screams "AI made THIS?" — perfect rotation after sim-heavy week.

---
## Build Spec (Sage)
**Verdict:** APPROVED with refinements
**Changes from proposal:**
1. GIF export removed — CCapture.js violates single-file constraint. Replaced with PNG snapshot (canvas.toDataURL).
2. "10+ primitives" tightened to exactly 6 named primitives with explicit GLSL formulas — vague counts produce vague implementations.
3. "Interior explosion mode" replaced with clip-plane cross-section mode — more precise, equally dramatic, implementable cleanly.
4. Bloom specified as two-pass FBO pipeline (bright-extract → blur FBO → additive composite), not a single-pass approximation.
5. Adaptive marching epsilon specified: ε = max(0.0001, 0.001 × t) so surface precision scales with ray depth.
**Estimated JS complexity:** ~900 lines — WebGL setup + shader compilation, orbital camera, FBO bloom pipeline, morph engine with easing, 6-preset system, touch/mouse input, quality scaling, UI panel

---

### Visual Design
- **Background:** `#0a0a0f` (site standard)
- **Canvas:** Full viewport, WebGL2 rendered, stretches edge-to-edge with zero margin
- **UI panel:** Right side, collapsible — `rgba(8, 8, 18, 0.88)` background, `1px solid rgba(99, 102, 241, 0.25)` border, `backdrop-filter: blur(12px)`, width 260px on desktop, slides in from right with CSS transition
- **Preset bar:** Bottom row of 6 pill buttons, `#0f0f1e` bg, `#6366f1` active glow — `box-shadow: 0 0 12px #6366f180` on hover/active
- **Accent colors:** Indigo `#6366f1`, cyan `#06b6d4`, rose `#f43f5e`, amber `#f59e0b` (used in preset palette mapping, UI highlights)
- **Typography:** `'JetBrains Mono', 'Fira Code', monospace` for parameter labels and values; `system-ui, -apple-system` for buttons
- **Label sizes:** 0.7rem for parameter names, 0.85rem for values, 1rem for preset names
- **Fractal palette per preset:** Each preset has a `vec3 colorA, colorB, colorC` uniform triplet mapped to orbit-trap coloring in the shader
- **Glow ring:** Subtle animated gradient ring around the canvas perimeter, `conic-gradient` from `#6366f1` → `#06b6d4` → `#f43f5e`, opacity 0.15, rotates every 8s — gives the page a living border

### UX Flow
1. **First frame (< 200ms):** WebGL canvas fills the viewport with the "Power 8 Singularity" preset already rendering — a slowly rotating spiny Mandelbulb in deep violet-cyan plasma. No loading screen. The fractal is the loading state.
2. **Discovery (first 5 seconds):** The user drags to orbit — the fractal rotates smoothly, immediate feedback. The panel toggle button (`⟩`) pulses once 2 seconds after load to hint it exists. Scrolling zooms in, pulling the viewer toward the fractal surface.
3. **Experimentation:** User opens panel, moves "Power" slider from 8 down to 2 — the form collapses in real time, morphing from spiky to bulbous. Moving "Julia blend" introduces alien twisting; "Fold scale" warps the geometry. The fractal is always live — no "apply" button.
4. **Morph sequences:** "Random Morph" button picks a random seed target and lerps all parameters over 3 seconds with `smoothstep` easing. "Auto-Morph" starts a continuous cycle — new random target every 8 seconds, so the fractal never settles. The morph progress bar below the canvas fills in real time.
5. **Cross-section mode:** Double-click on canvas activates a clip plane — a glowing slice bisects the fractal and the user drags to translate it, revealing the interior topology. Interior geometry uses a different color palette (warm amber/rose vs cold exterior cyan/violet). Click again to dismiss.
6. **Power user discovery:** Pressing `[` / `]` cycles presets with keyboard. Pressing `Space` fires a random morph. Pressing `S` screenshots. `C` toggles cross-section. `Q` toggles quality mode. These are discoverable via a tiny keyboard shortcut tooltip that appears on first hover of the screenshot button.

### Technical Architecture
- **Rendering:** WebGL2 — fragment shader ray marcher on a full-screen quad (two triangles, VAO, positions in NDC)
- **Animation loop:** `requestAnimationFrame`, uncapped FPS with `performance.now()` delta tracking. Auto-throttles to 30fps if frame time > 50ms (mobile fallback).
- **Shader compilation:** One-time compile at startup. All parameters passed as uniforms — no recompilation on slider change.
- **State management:**
  - `currentParams`: live float32 object mirroring all uniforms
  - `morphState`: `{ active, startParams, endParams, startTime, durationMs }`
  - `camera`: `{ azimuth, elevation, distance }` (spherical coordinates, converted to mat3 each frame)
  - `clipPlane`: `{ active, offset }` (z-offset of the cross-section plane)
- **Key algorithms:**
  - **Ray marching (sphere tracing):** up to 128 steps; step = `d × 0.9` safety factor; ε = `max(0.0002, 0.0008 × t)` adaptive epsilon
  - **SDF surface normal:** finite differences `normalize(vec3(sdf(p+ex)−sdf(p−ex), sdf(p+ey)−sdf(p−ey), sdf(p+ez)−sdf(p−ez)))` with `e = 0.001`
  - **Orbit trap coloring:** track `minR` (minimum distance to origin), `minXY` (minimum distance to XY plane), `escIter` (iteration at bailout). Map to HSL triplet driven by `u_colorA`, `u_colorB`, `u_colorC` uniforms.
  - **Ambient occlusion:** 5-sample cone AO: `ao = 1 − Σ(2^−i × (i×δ − sdf(p+n×i×δ)))` with δ=0.08
  - **Parameter lerping:** `lerp(a, b, smoothstep(0, 1, t/duration))` per parameter, `requestAnimationFrame`-driven
  - **FBO bloom:** Two WebGL framebuffers. Pass 1: render fractal. Pass 2: bright-extract (threshold 0.7) + 5×5 Gaussian blur horizontal. Pass 3: vertical blur + additive composite with main FBO at `u_bloomStrength` weight.
- **Performance considerations:**
  - Half-resolution canvas on mobile (`devicePixelRatio > 1.5` + viewport width < 768): render at 0.5× then upscale with CSS
  - Quality slider (JS-side): sets canvas pixel dimensions to `window.width × quality` — range 0.4–1.0
  - Object pooling: not needed (single quad draw call per frame)
  - Early-exit on bailout `r > 2.0` — standard escape radius
- **Input handling:**
  - Mouse down+drag: update azimuth/elevation angles (`Δx → azimuth`, `Δy → elevation`, clamped −80° to +80°)
  - Mouse wheel: adjust camera distance (exponential: `distance *= 1 − delta × 0.001`)
  - Touch single-finger drag: orbit (same as mouse)
  - Touch pinch (two-finger): zoom (distance ratio)
  - Double-click: toggle cross-section mode
  - Keyboard: `[ ]` presets, `Space` random morph, `S` screenshot, `C` cross-section, `Q` quality toggle

### Fractal Primitives (6 Exact GLSL Implementations)

**All primitives return `vec2(distance, trapColor)` and are selected by `u_primitive` int uniform.**

**1. Standard Mandelbulb (power n)**
```glsl
// Power n Mandelbulb: z → z^n + c
float mandelbulb(vec3 pos, float power, int maxIter) {
    vec3 z = pos; float dr = 1.0; float r;
    for (int i = 0; i < 20; i++) {
        if (i >= maxIter) break;
        r = length(z);
        if (r > 2.0) break;
        float theta = acos(clamp(z.z / r, -1.0, 1.0)) * power;
        float phi   = atan(z.y, z.x) * power;
        float zr    = pow(r, power);
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        z = zr * vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta)) + pos;
    }
    return 0.5 * log(r) * r / dr;  // distance estimate
}
```

**2. Mandelbox**
```glsl
float mandelbox(vec3 pos, float scale, int maxIter) {
    vec3 z = pos; float dr = 1.0;
    for (int i = 0; i < 20; i++) {
        if (i >= maxIter) break;
        // Box fold: clamp to [-1,1] and reflect
        z = clamp(z, -1.0, 1.0) * 2.0 - z;
        // Sphere fold: r < minR → scale; r < 1 → 1/r^2
        float r2 = dot(z, z);
        if      (r2 < 0.25) { z *= 4.0; dr *= 4.0; }
        else if (r2 < 1.0)  { float k = 1.0/r2; z *= k; dr *= k; }
        z = scale * z + pos;
        dr = dr * abs(scale) + 1.0;
        if (length(z) > 100.0) break;
    }
    return length(z) / abs(dr);
}
```

**3. Quaternion Julia Set (3D projection)**
```glsl
// Project to quaternion (x,y,z,0), iterate q → q^2 + c, measure 3D slice
float quaternionJulia(vec3 pos, vec4 c, int maxIter) {
    vec4 q = vec4(pos, 0.0);
    float dr = 1.0;
    for (int i = 0; i < 20; i++) {
        if (i >= maxIter) break;
        // q^2: (a^2−b^2−c^2−d^2, 2ab, 2ac, 2ad)
        vec4 q2 = vec4(q.x*q.x - q.y*q.y - q.z*q.z - q.w*q.w,
                       2.0*q.x*q.y, 2.0*q.x*q.z, 2.0*q.x*q.w) + c;
        dr = 2.0 * length(q) * dr + 1.0;
        q = q2;
        if (dot(q, q) > 16.0) break;
    }
    float r = length(q);
    return 0.5 * log(r) * r / dr;
}
```

**4. Burning Ship 3D**
```glsl
// Burning ship: fold abs on x and y before each iteration
float burningShip3D(vec3 pos, float power, int maxIter) {
    vec3 z = pos; float dr = 1.0; float r;
    for (int i = 0; i < 20; i++) {
        if (i >= maxIter) break;
        r = length(z);
        if (r > 2.0) break;
        z = abs(z);  // The "burning ship" fold
        float theta = acos(clamp(z.z / r, -1.0, 1.0)) * power;
        float phi   = atan(z.y, z.x) * power;
        float zr    = pow(r, power);
        dr = pow(r, power - 1.0) * power * dr + 1.0;
        z = zr * vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta)) + pos;
    }
    return 0.5 * log(r) * r / dr;
}
```

**5. Menger–Mandelbox Hybrid (Box + Fold iteration)**
```glsl
// Menger fold repeated in 3D with sphere bailout — produces sponge-like geometry
float mengerBox(vec3 pos, float scale, int maxIter) {
    vec3 z = pos; float dr = 1.0;
    for (int i = 0; i < 20; i++) {
        if (i >= maxIter) break;
        // Menger fold: reflect around nearest axis midpoint
        z = abs(z);
        if (z.x < z.y) z.xy = z.yx;
        if (z.x < z.z) z.xz = z.zx;
        if (z.y < z.z) z.yz = z.zy;
        z.x = scale * z.x - (scale - 1.0);
        z.y = scale * z.y - (scale - 1.0) * 0.5;
        z.z = (z.z > 0.5 * (scale - 1.0)) ? scale * z.z - (scale - 1.0) : z.z;
        dr *= abs(scale);
        if (dot(z, z) > 100.0) break;
    }
    return length(z) / dr;
}
```

**6. Mandelbulb–Julia Blend (lerp between Mandelbulb and Julia set by u_juliaBlend)**
```glsl
// Blend: use u_juliaBlend (0=full Mandelbulb, 1=full Julia)
// In the Mandelbulb loop, mix the additive term:
//   z += mix(pos, u_juliaSeed, u_juliaBlend)
// This continuously morphs topology — produces alien twisted coral shapes at 0.3–0.7 blend
```

### Exact Uniforms (All pushed per-frame — no shader recompile)
| Uniform | Type | Range | Drives |
|---|---|---|---|
| `u_power` | float | 2.0–8.0 | Mandelbulb power n |
| `u_iterations` | int | 4–18 | Max fractal iterations |
| `u_foldScale` | float | 1.5–3.0 | Mandelbox/Menger fold scale |
| `u_bailout` | float | 1.5–4.0 | Escape radius |
| `u_juliaSeed` | vec4 | −0.5 to 0.5 each | Quaternion Julia constant c |
| `u_juliaBlend` | float | 0.0–1.0 | Blend Mandelbulb↔Julia |
| `u_primitive` | int | 0–5 | Select which SDF (listed above) |
| `u_colorA` | vec3 | [0,1]³ | Orbit trap color 1 (exterior) |
| `u_colorB` | vec3 | [0,1]³ | Orbit trap color 2 (mid-surface) |
| `u_colorC` | vec3 | [0,1]³ | Orbit trap color 3 (deep interior) |
| `u_colorShift` | float | 0.0–1.0 | Global hue rotation |
| `u_bloomStrength` | float | 0.0–1.0 | Additive bloom blend weight |
| `u_camPos` | vec3 | — | Camera world-space position |
| `u_camMat` | mat3 | — | Camera orientation matrix |
| `u_clipPlane` | float | −2.0–2.0 | Cross-section clip offset (active when u_clipActive=1) |
| `u_clipActive` | int | 0/1 | Cross-section mode on/off |
| `u_time` | float | — | Elapsed seconds (subtle color animation) |
| `u_resolution` | vec2 | — | Canvas pixel size for aspect ratio |

### Six Presets (Exact Parameter Sets)
```javascript
const PRESETS = [
  {
    name: "Power 8 Singularity",
    u_primitive: 0, u_power: 8.0, u_iterations: 10, u_foldScale: 2.0,
    u_bailout: 2.0, u_juliaBlend: 0.0, u_juliaBlend: 0.0,
    u_colorA: [0.15, 0.05, 0.6],   // deep violet
    u_colorB: [0.05, 0.7, 0.9],    // electric cyan
    u_colorC: [0.9, 0.1, 0.5],     // hot magenta
    camera: { distance: 2.5, azimuth: 0.4, elevation: 0.6 }
  },
  {
    name: "Alien Coral",
    u_primitive: 1, u_power: 2.0, u_iterations: 14, u_foldScale: 2.0,
    u_bailout: 2.5, u_juliaBlend: 0.0,
    u_colorA: [0.02, 0.5, 0.4],    // teal
    u_colorB: [0.0, 0.9, 0.6],     // emerald
    u_colorC: [0.8, 0.3, 0.05],    // amber
    camera: { distance: 3.2, azimuth: 1.2, elevation: 0.3 }
  },
  {
    name: "Crystal Cave",
    u_primitive: 2, u_power: 2.0, u_iterations: 12, u_foldScale: 2.0,
    u_bailout: 4.0, u_juliaBlend: 0.5,
    u_colorA: [0.4, 0.1, 0.7],     // purple
    u_colorB: [0.9, 0.8, 0.1],     // gold
    u_colorC: [0.05, 0.2, 0.95],   // cobalt blue
    camera: { distance: 2.8, azimuth: -0.8, elevation: 0.7 }
  },
  {
    name: "Burning Ship",
    u_primitive: 3, u_power: 2.0, u_iterations: 8, u_foldScale: 2.0,
    u_bailout: 2.0, u_juliaBlend: 0.0,
    u_colorA: [0.9, 0.2, 0.0],     // flame red
    u_colorB: [0.95, 0.6, 0.0],    // orange
    u_colorC: [0.3, 0.0, 0.0],     // deep crimson
    camera: { distance: 3.0, azimuth: 0.0, elevation: 0.4 }
  },
  {
    name: "Sponge World",
    u_primitive: 4, u_power: 2.0, u_iterations: 10, u_foldScale: 2.7,
    u_bailout: 2.0, u_juliaBlend: 0.0,
    u_colorA: [0.8, 0.8, 0.95],    // icy white
    u_colorB: [0.3, 0.5, 0.9],     // steel blue
    u_colorC: [0.05, 0.05, 0.15],  // near-black
    camera: { distance: 4.0, azimuth: 0.6, elevation: 0.5 }
  },
  {
    name: "Twisted Julia",
    u_primitive: 5, u_power: 5.0, u_iterations: 12, u_foldScale: 2.0,
    u_bailout: 2.0, u_juliaBlend: 0.7,
    u_colorA: [0.05, 0.85, 0.95],  // neon cyan
    u_colorB: [0.9, 0.1, 0.7],     // magenta
    u_colorC: [0.5, 0.0, 0.9],     // violet
    camera: { distance: 2.2, azimuth: -0.3, elevation: 0.8 }
  }
];
```

### Interactions Detail

| Trigger | Animation | Result | Feedback |
|---|---|---|---|
| Mouse drag | Smooth azimuth/elevation update each frame | Fractal orbits in real time | Immediate — 60fps render |
| Scroll wheel | Camera distance exponential scale | Zoom in/out toward fractal center | Fractal grows/shrinks; epsilon adapts |
| Slider change | Uniform pushed directly (no recompile) | Fractal morphs live as slider moves | Continuous fractal update |
| Preset click | 3-second `smoothstep` lerp across all params + camera | Full fractal + camera transition | Morph progress bar slides across bottom; preset pill lights with `#6366f1` glow |
| "Random Morph" click | Generate random valid param set, trigger lerp | Unexpected alien geometry emerges | Same progress bar; button pulses during lerp |
| "Auto-Morph" toggle | Continuous 8s cycle; pick new random target after each completes | Endless mutation — screensaver mode | Button turns rose `#f43f5e` with "LIVE" label while active |
| Double-click canvas | Toggle `u_clipActive`, show clip drag handle | Cross-section slice cuts through fractal | Glowing cyan plane appears with drag handle; interior renders in warm palette |
| Clip handle drag | `u_clipPlane` offset changes in real time | Slice sweeps through fractal interior | Fractal cross-section animates; interior geometry revealed |
| `S` key | `canvas.toDataURL('image/png')` → anchor download | PNG snapshot saved locally | Brief "Snapshot saved ✓" toast in top-right, fades 1.5s |
| `Q` key | Toggle quality: 0.5× ↔ 1.0× canvas size | Canvas resized, CSS scaled up if 0.5× | Quality badge in corner shows "🔴 FAST" or "🟢 FULL" |

### FBO Bloom Pipeline Detail
```
Frame N:
  1. Bind FBO-A (fractal render target, same resolution as canvas)
     → Draw full-screen quad with ray march shader
     → Output: raw fractal color in RGBA

  2. Bind FBO-B (bloom work buffer, 1/4 resolution for perf)
     → Bright-extract pass: sample FBO-A, output max(0, color − 0.7) × 3.0
     → Horizontal Gaussian blur: 9-tap kernel [1,2,4,7,10,7,4,2,1]/38

  3. Bind FBO-B2 (second bloom buffer, same 1/4 resolution)
     → Vertical Gaussian blur of FBO-B

  4. Bind default framebuffer (screen)
     → Composite shader: FBO-A + FBO-B2 × u_bloomStrength (additive blend)
     → Tone-map: Reinhard: c / (c + 1.0) for HDR headroom
```

### Edge Cases
- **Mobile:** Single-finger orbit, two-finger pinch zoom, panel collapses to bottom sheet on `max-width: 768px`. Canvas renders at 0.5× DPR and upscales with CSS `image-rendering: pixelated` — acceptable trade-off vs battery drain.
- **Performance:** If frame delta > 50ms for 3 consecutive frames: auto-halve quality (reduce canvas pixels by 50%), show "⚡ Performance mode" toast. Restores after 10s or on user Q toggle.
- **Empty state (< 200ms):** Never shown — shader fires on WebGL init, first frame renders immediately. A CSS radial gradient `#0a0a0f → #1a0a2e` covers the canvas while WebGL initializes if compilation takes >100ms.
- **WebGL2 not supported:** Fallback to full-page message: "Your browser doesn't support WebGL2 — try Chrome or Firefox" with a static pre-rendered fractal image as backdrop.
- **AudioContext:** Not used in this build — no audio permission needed.
- **Very long ray march (deep zoom):** Max steps 128 with adaptive epsilon prevents infinite loops. At extreme zoom, fractal may appear blocky (epsilon too large) — acceptable; quality slider helps.

### Sage Notes
Scout's Mandelbulb proposal was fundamentally sound — the right category, strong Wow Test scores, clear technical ambition. My job was to add precision where vagueness would cost the builder. The two sharpest changes: replacing GIF export with PNG (CCapture.js would balloon scope and violate single-file) and specifying exact GLSL for all six primitives so Codex doesn't improvise formulas that may not converge. The orbit-trap coloring system is the make-or-break visual detail — without it, ray-marched fractals look like gray blobs; with it, the surface stratification makes the alien geometry legible and beautiful. The bloom pipeline must be FBO-based, not single-pass approximation — single-pass bloom washes out the dark background and kills the neon plasma effect. The morph engine's `smoothstep` easing on all parameters simultaneously is what makes this feel like watching something alive rather than a slider demo. Codex must get that easing right on every single parameter, not just one.

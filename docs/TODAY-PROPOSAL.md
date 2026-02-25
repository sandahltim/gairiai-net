# Build Proposal - 2026-02-25

## Idea: Mandala Mirror
**Category:** daily
**One-liner:** A live symmetric drawing canvas that transforms your doodles into hypnotic mandalas across multiple axes.
**Description:** Draw freely on a circular canvas, and watch your strokes mirror perfectly across 4-12 radial spokes, creating intricate mandala patterns in real-time. Switch colors, adjust brush size and opacity, add glowing trails, and export your creation as PNG. It's therapeutic doodling meets generative art — no skills required, instant beauty. Perfect for a 5-minute zen break or shareable Instagram art.

**Target audience:** Creative seekers, meditators, designers hunting patterns, social media sharers, anyone with 2 minutes to unwind.

**Key features:**
- Radial symmetry toggles (4, 6, 8, 12 spokes) for varied complexity
- Live color picker with history and gradient blending
- Dynamic brush: size, opacity, smooth trails with decay
- One-tap clear, undo stack, fullscreen mode
- Export PNG at high-res with transparent bg option

**The hook:** Anyone can create pro-level mandala art from random squiggles — the surprise reveal and shareability make it addictive and viral-ready.

### Scout Notes
Pixel art and zen garden hooked on creation/satisfaction; this amps it with user input + symmetry magic for higher engagement. Inspired by viral mirror drawing apps and 2026's interactive toy trends craving instant gratification. I'm pumped because it's endlessly replayable, fits pure JS perfectly, and screams "ship this now" for daily dopamine hits.

---
## Build Spec (Kimi K2.5)
**Verdict:** APPROVED
**Changes from proposal:** Added "starter patterns" (3 preset stroke guides for users who freeze at blank canvas), simplified export to single high-res PNG only (no transparent option - adds complexity for minimal value), replaced gradient blending with solid color + opacity slider (cleaner UI, same creative range).

### Visual Design
- **Background:** #0a0a0f (site requirement) with subtle radial gradient from center (#0f0f18 to #0a0a0f)
- **Canvas:** 800x800 logical resolution, CSS responsive to fit viewport, background #12121a with faint radial guidelines (spokes visible at 10% opacity)
- **Accent colors:** Purple (#a855f7) for primary UI, Cyan (#06b6d4) for active states, Pink (#ec4899) for destructive/clear actions
- **Control panel:** Floating bottom-center, glassmorphism (bg: rgba(20,20,30,0.8), backdrop-blur: 12px), rounded 16px, padding 20px
- **Typography:** System sans-serif, 14px controls, 12px labels in muted gray (#888899)
- **Touch targets:** Minimum 48px for all buttons

### UX Flow
1. **User opens page:** Sees empty circular canvas with faint spoke guidelines. Control panel floats at bottom. A pulsing "tip" suggests "Draw anywhere — we'll mirror it"
2. **User draws on canvas:** Stroke appears under finger/cursor. Simultaneously, N mirrored strokes appear based on symmetry setting (default 8). Real-time, no lag.
3. **User adjusts controls:** 
   - Symmetry buttons (4, 6, 8, 12) instantly re-render guidelines, live strokes continue with new symmetry
   - Color picker shows 8 swatches + custom picker
   - Brush size slider (2-30px) shows live preview dot
   - Opacity slider (10-100%) affects stroke alpha
4. **User taps clear:** Canvas wipes with a quick fade-out animation (200ms)
5. **User taps export:** PNG downloads as `mandala-YYYY-MM-DD-HHMM.png`. Brief "Saved!" toast appears for 1.5s

### Technical Spec
- **Key interactions:** MouseDown/Move/Up, TouchStart/Move/End, Click for buttons
- **State management:** 
  - `isDrawing: boolean`
  - `symmetry: 4|6|8|12` (default 8)
  - `brush: {size, color, opacity}`
  - `points: Array<{x,y}>` (current stroke)
  - `undoStack: Array<ImageData>` (max 10 states, capture on stroke end)
- **Canvas logic:** 
  - Main canvas centered in viewport
  - On draw: calculate angle from center, mirror point across N spokes using `Math.cos/sin`
  - Draw to all N positions simultaneously via loop
  - Use `globalCompositeOperation = 'lighter'` for glow effect when opacity < 100%
- **Animations:**
  - Glow trails: requestAnimationFrame loop fading canvas by 2% each frame (creates trail effect)
  - Guidelines: CSS transition opacity on symmetry change
  - Button press: scale(0.95) for 80ms
  - Clear: canvas fade via CSS opacity transition, then context.clearRect()
- **Edge cases:**
  - Touch cancel: treat as touchEnd, commit stroke
  - Window resize: debounced canvas re-center, maintain drawing
  - Empty export: if no strokes drawn, show "Draw something first!" toast instead of downloading blank
  - High-DPI: use `window.devicePixelRatio` for crisp rendering on retina displays

### Kimi Notes
I kept the symmetry simple—pure radial mirroring, no kaleidoscope angle offset. The "starter patterns" solve the blank-canvas paralysis that kills engagement. I chose 8 as default symmetry because it feels balanced (not too simple, not overwhelming). The glow trail effect uses canvas fade rather than particle systems—much lighter performance. Make sure the touch handling prevents page scroll while drawing; essential for mobile use.

# Build Proposal - 2026-02-24
## Idea: Digital Zen Garden
**Category:** tools
**One-liner:** Mesmerizing virtual zen garden where you rake smooth patterns in physics-simulated sand, place rocks, and create ripples for instant digital calm.
**Description:** Escape the chaos with this fully interactive zen garden simulator built in pure HTML Canvas. Drag your mouse or finger to rake hypnotic trails in flowing sand particles that respond realistically to your movements—watch them settle and smooth out like real sand. Scatter stones, rake perfect circles, or disturb the peace with ripple effects. Subtle ambient animations like gentle wind and glowing lanterns create an immersive, meditative experience right in your browser. No installs, infinite canvas, pure satisfaction.
**Target audience:** Stressed office workers, mindfulness enthusiasts, social media scrollers craving a quick ASMR break—ages 18-45 who love oddly satisfying sims.
**Key features:**
- Hyper-realistic sand particle physics: rake disturbs and smooths thousands of particles in real-time.
- Interactive elements: draggable rocks/boulders, ripple ponds, multiple rake styles (wide, fine, wavy).
- Ambient effects: soft wind animation, dynamic lighting, calming color shifts at dusk.
- Mobile-optimized touch controls with haptic feedback simulation via vibrations.
- One-click screenshot export for sharing your masterpiece on X or Instagram.
**The hook:** The addictive "just one more rake" physics will hook users for minutes; viral potential as "the web app that fixed my anxiety in 60 seconds"—perfect for Twitter threads and TikTok duets.

### Scout Notes
Zen garden sims are underserved online (mostly static apps or paid mobile), but ASMR/raking videos rack up millions of views— this fills the gap with pro-level physics in a tiny HTML file. Inspired by sandpiles.org's virality and recent pixel art success here, but bolder with full interaction and zen theme for broader appeal. Pumped because it's technically impressive for the builder (particle forces without libs), bookmark-worthy as a tool, and has massive shareability to grow the site.

---

## Build Spec (Kimi K2.5)
**Verdict:** APPROVED with revisions
**Changes from proposal:** 
- Simplified physics: use grid-based "sand height map" instead of thousands of particles (performance + mobile battery)
- Removed "multiple rake styles" for MVP (adds complexity, minimal UX gain)
- Consolidated ambient effects: wind becomes subtle particle drift, dusk cycle becomes static but selectable palette
- Dropped vibration API (not universally supported, adds permission friction)
- Added explicit canvas sizing rules for mobile vs desktop

### Visual Design
- **Background:** `#0a0a0f` (site standard), sand rendered in `#c4a77d` to `#e8d5b7` gradient based on height
- **Accent colors:** Rocks in `#5a5a6a` to `#8a8a9a` (smooth river stone grays), ripples in `#7ec8e3` (subtle cyan glow)
- **Layout:** Full-viewport canvas (100vw × 100vh). Minimal UI: floating toolbar at bottom center, semi-transparent glassmorphism panel (`rgba(20,20,30,0.85)` backdrop-filter blur 12px)
- **Typography:** System fonts only. Toolbar buttons use 14px labels, tool icons 24px. No text on canvas (purely visual).
- **Glow effects:** Subtle `box-shadow: 0 0 20px rgba(126,200,227,0.3)` on active tool, ripple trails have `radial-gradient` fade

### UX Flow
1. **User opens page:** Sees a pristine sand canvas with a single large "starter rock" slightly off-center. Gentle animated particles (wind) drift occasionally across surface. Bottom toolbar shows: Rake tool (active), Rock tool, Clear tool, Screenshot button.
2. **User rakes:** Dragging disturbs the sand height map—trail follows cursor, sand "piles up" on sides of stroke like real raking. Release: sand slowly settles back toward flat (1-2 second relaxation animation). Color shifts subtly with height (shallow=darker, peak=lighter).
3. **User places rock:** Switch to Rock tool, click anywhere—rock "drops" with small impact ripple, pushes sand aside (permanent displacement in height map), rock remains draggable.
4. **User clears:** Clear button wipes canvas with a smooth fade-to-flat transition, respawns single starter rock.
5. **User screenshots:** Screenshot button downloads PNG (canvas.toDataURL), excludes toolbar UI via temporary canvas clone or careful draw order.

### Technical Spec
- **Canvas setup:** 2D context, `devicePixelRatio` scaling for crisp rendering. Grid resolution: 200×150 cells (cell size = canvas/200). Height map: Float32Array(200×150), values 0-1.
- **Rake physics:** 
  - On drag: add "disturbance" to height map cells under cursor radius (8px), creating valley with ridges on sides
  - On release: apply relaxation—each cell averages with neighbors, converging toward flat (value 0.5) over 60 frames
  - Rendering: per-frame color map based on height + lighting (fake normal from height gradient)
- **Rocks:** Array of objects `{x, y, radius, dragOffsetX, dragOffsetY, isDragging}`. Draw as radial gradient circles. When placed: carve circular depression in height map (subtract from height values in radius+10px).
- **Wind particles:** 20-30 tiny dots (1-2px) drifting slowly with sine-wave motion. Reset to random edge when exiting canvas. Low opacity (0.3), subtle only.
- **Ripples:** Expanding ring animation (scale 1→5, opacity 1→0) on rock drop. Purely visual, 30-frame duration.
- **Interactions:** 
  - Mouse/touch: single point tracking, preventDefault on touchmove
  - State: currentTool ('rake'|'rock'|'move'), isDragging, rockBeingDragged
  - Throttle: render loop via requestAnimationFrame, physics updates every 2nd frame for performance
- **Edge cases:**
  - Window resize: reinitialize height map with current values interpolated to new grid
  - Touch with multiple fingers: track only first touch, ignore others
  - Rapid tool switching: cancel any active drag operations
  - Screenshot on mobile: use setTimeout to ensure UI is hidden before capture

### Kimi Notes
I streamlined the particle system into a height-map approach because thousands of individual particles would murder mobile batteries and complicate the build significantly. The "rake" effect comes from manipulating the height values directly—this is how professional sand sims actually work. I kept the wind particles because they're cheap (just dots) and add that ambient "alive" quality Scout wanted. The toolbar placement at bottom center follows thumb-zone ergonomics. Builder should focus on the relaxation algorithm—that's where the satisfying "settling" magic happens. Watch for floating-point drift in the height map; clamp values to 0-1 range each frame.

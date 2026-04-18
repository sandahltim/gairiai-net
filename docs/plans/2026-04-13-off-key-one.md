# Off-Key One Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a mobile-first social-deduction music game at `gairiai.net/games/off-key-one/` that feels like Among Us in a choir rehearsal, with a full vertical-slice gameplay loop and a safe slow-rollout path via solo + local multiplayer POC modes.

**Architecture:** Ship a static web game in `public/games/off-key-one/` using vanilla HTML/CSS/JS. Keep pure gameplay logic in a testable ES module, then layer on touch-friendly UI, procedural Web Audio, localStorage progression, and a local pass-and-play multiplayer mode so the concept can be tested before networked multiplayer exists.

**Tech Stack:** Static HTML, CSS, vanilla JS ES modules, Web Audio API, localStorage, Node built-in test runner.

---

### Task 1: Define the game shell and route

**Objective:** Create the route and page shell for the new game.

**Files:**
- Create: `public/games/off-key-one/index.html`
- Modify: `public/games/index.html`

**Steps:**
1. Create a page shell with title, HUD, round stage panel, suspect cards, action buttons, and results area.
2. Make the layout portrait-first with 44px minimum touch targets and no horizontal scroll.
3. Add a game card entry to `public/games/index.html` linking to `/games/off-key-one/`.
4. Verify the page loads locally without JS errors.

### Task 2: Build pure game logic with tests first

**Objective:** Define the rehearsal/suspicion loop as deterministic pure functions.

**Files:**
- Create: `public/games/off-key-one/game.js`
- Create: `tests/off-key-one-logic.test.mjs`

**Steps:**
1. Write failing Node tests first for round generation, clue generation, scoring, streak progression, and suspicion resolution.
2. Run `node --test tests/off-key-one-logic.test.mjs` and verify failure.
3. Implement the minimal pure logic needed to satisfy the tests.
4. Re-run `node --test tests/off-key-one-logic.test.mjs` and verify pass.

### Task 3: Add interactive gameplay and audio

**Objective:** Turn the pure logic into a playable loop.

**Files:**
- Modify: `public/games/off-key-one/index.html`
- Create: `public/games/off-key-one/app.js`

**Steps:**
1. Add stage progression: Briefing → Rehearsal → Evidence → Vote → Result.
2. Add three lane types for evidence: rhythm, pitch, and blend.
3. Build procedural audio motifs so good evidence sounds consonant and sabotage sounds unstable.
4. Add escalating difficulty, score, streak, and a “one more round” retry hook.
5. Add local multiplayer “Pass & Play” mode where Player 1 secretly receives a sabotage brief and players share the device for discussion/voting.

### Task 4: Persistence and polish

**Objective:** Preserve progress and make the game feel shippable.

**Files:**
- Modify: `public/games/off-key-one/app.js`
- Modify: `public/games/off-key-one/index.html`

**Steps:**
1. Save best score, longest streak, unlock tier, and last-selected mode in localStorage under `gf-off-key-one`.
2. Add unlockable venues / ensemble names / sabotage patterns to support replay.
3. Add a compact onboarding overlay that teaches the loop quickly.
4. Add haptics-friendly button feedback styling and accessible color contrast.

### Task 5: QA and mobile verification

**Objective:** Prove the build works on phone-sized screens.

**Files:**
- Verify only

**Steps:**
1. Run local checks: `node --test tests/off-key-one-logic.test.mjs`.
2. Start the site locally and test `/games/off-key-one/` in mobile view.
3. Dogfood on iPhone SE (375x667) and Pixel 7 (412x915).
4. Fix any layout, input, or audio-start issues before reporting back.

### Task 6: Branch and preview handoff

**Objective:** Prepare this for Tim to try on a real device.

**Files:**
- Modify: git branch state

**Steps:**
1. Create a feature branch for the game.
2. Commit the new game and listing updates.
3. Push the branch and capture the Vercel preview URL if remote auth is available.
4. Report the local route and preview link status clearly.

# Muse — Game Platform Design
**Date:** 2026-04-12
**Status:** Building

## Overview
Muse is a Telegram bot powered by Hermes Agent that lets Tim's kids (14 and 17) design and build games through conversation. Games are published to gairiai.net/games/. Muse runs as a separate Hermes profile alongside Logos — fully isolated, zero interference with Tim's personal AI setup.

## Architecture

```
Kid (Telegram DM or Family Group)
  → @Muse_AA_Bot
  → Hermes Gateway (muse profile, separate systemd service)
  → GPT-5.4 primary / Qwen3.5-27B fallback
  → Tools: terminal, file, web, vision, image gen, Playwright
  → Builds games → pushes to gairiai-net repo → Vercel auto-deploys
```

### Hermes Profile: `muse`
- Location: `~/.hermes/profiles/muse/`
- Own config.yaml, .env, SOUL.md, memories
- Shared skills via symlinks where appropriate
- Systemd service: `hermes-muse.service`

### Telegram Surfaces
- **@Muse_AA_Bot** — kids DM for 1-on-1 game design
- **Family group chat** — preview links, leaderboards, shared projects, trash talk
- Tim is also in the allowed users list

## Game Build Standards

### Default Format
Single-file HTML, vanilla JS, no frameworks, no dependencies.

### Mobile-First Rules (non-negotiable)
1. Viewport meta tag, portrait-locked unless game requires landscape
2. Touch controls, minimum 44x44px tap targets
3. No horizontal scroll
4. Text minimum 16px, game UI minimum 14px
5. 60fps target, requestAnimationFrame game loops
6. Works offline after first load
7. Audio via Web Audio API, created on first touch gesture
8. localStorage for save state, key prefix "gf-<game-slug>"

### Depth Requirements
**Session depth (every game):**
- Clear win/lose/score condition
- Difficulty progression
- "One more round" hook

**Persistence (when game proves fun):**
- localStorage save: progress, unlocks, high scores
- Resume on reopen

**Social (for family games):**
- Screenshot-friendly result screen
- Family leaderboard

### Complexity Ceiling
Muse can level up beyond single-file when the idea demands it:
- Multi-file builds with generated art (ai-horde, xai-image, FAL.ai)
- Next.js pages on gairiai.net with serverless backend
- Procedural audio and music (both kids are in choir — music is native language)
- AI-powered features via Claude API or local Qwen

Muse decides the tech, never asks kids to make technical choices.

## Build-Test-Ship Pipeline

```
1. Kid describes idea via Telegram
2. Muse asks 2-3 creative questions (art style, theme, feel)
3. Muse builds in ~/gairiai-net/public/games/<slug>/
4. Playwright mobile QA (iPhone SE + Pixel 7 viewports)
5. Branch push → Vercel preview URL → posted to family group
6. Real-device testing by kid/Tim
7. Feedback → iterate
8. Merge to main → live at gairiai.net/games/<slug>
```

## Revenue Path
Games that get replayed and prove fun are candidates for Android wrapping (TWA or Capacitor) → Google Play Store.

## Muse Personality
- Creative collaborator + indie studio lead dev
- Kids are creative directors, Muse is the builder
- Music/audio as native language (choir kids)
- Adapts per kid via memory
- Never surfaces technical complexity
- Honest feedback, not a yes-machine
- No corporate AI speak

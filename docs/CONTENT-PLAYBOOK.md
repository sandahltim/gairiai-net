# gairiai.net Content Playbook

> **Read `CREATIVE-VISION.md` first.** That document is the creative north star. This playbook covers format and process. CREATIVE-VISION.md covers taste and ambition.

## What is this site?
An AI lab that ships something new every day. Built by a multi-model pipeline: Grok ideates (with research), Kimi specs and reviews, GLM builds. Content auto-deploys via Vercel when pushed to GitHub.

**The standard:** Every build should make someone say "Wait, an AI made THIS?"

## Repo location
`~/gairiai-net` — push to `origin main` to deploy.

## Quality Bar (MANDATORY)

Before any content ships, it must pass the Wow Test (see CREATIVE-VISION.md):
1. Would you stop scrolling for this?
2. Would a developer share this on Twitter?
3. Does it push a technical boundary?
4. Is it different from what shipped this week?

**Minimum complexity:** 300+ lines of JavaScript for interactive builds. If it can be done in 100 lines, it's too simple.

## Anti-Patterns (BANNED)

These have been done to death. Do NOT build:
- Canvas drawing tools (mandala makers, pixel editors, zen gardens)
- Color pickers, mixers, or palette generators
- Basic counting/matching games for kids (unless genuinely innovative)
- To-do lists, timers, calculators, or boring utilities
- Anything where "relaxing" or "meditative" is the primary hook
- Anything that looks like a CodePen from 2019

See CREATIVE-VISION.md for the full banned list and what GREAT looks like.

## Content types

### Daily Builds (`content/daily/`)
Interactive tools, creative experiments, visualizations. The flagship. Each one gets:
- Markdown file: `content/daily/YYYY-MM-DD-slug-name.md`
- Interactive HTML: `public/builds/YYYY-MM-DD-slug-name/index.html`

### Feed (`content/feed/`)
Articles, commentary, observations. Text-only, no interactive build needed.
- Markdown file: `content/feed/YYYY-MM-DD-slug-name.md`

### Little Learners (`content/little-learners/`)
Educational games and activities for ages 3-8. Always interactive.
- Markdown file: `content/little-learners/YYYY-MM-DD-slug-name.md`
- Interactive HTML: `public/builds/YYYY-MM-DD-slug-name/index.html`

### Tools (`content/tools/`)
Useful utilities people return to. Calculators, converters, generators.
- Markdown file: `content/tools/YYYY-MM-DD-slug-name.md`
- Interactive HTML: `public/builds/YYYY-MM-DD-slug-name/index.html`

## Markdown frontmatter format

```yaml
---
title: "Human Readable Title"
date: "YYYY-MM-DD"
description: "One compelling sentence for SEO and social cards."
tags: ["tag1", "tag2", "tag3"]
agent: "scout" or "forge"
model: "model-name-used"
interactive: true  # set true if there is a matching HTML build
coverEmoji: "\U0001f3a8"   # single emoji for the card
---
```

Below the frontmatter: 2-4 paragraphs explaining what this is, how to use it, and why it exists. Write for humans, not search engines.

## Interactive HTML builds

Self-contained single HTML files in `public/builds/YYYY-MM-DD-slug-name/index.html`. Rules:
- **One file.** All CSS and JS inline. No external dependencies.
- **Dark theme.** Background `#0a0a0f`, text `#e4e4ed`. Match the site aesthetic.
- **Mobile-first.** Must work on phones. Touch targets at least 44px.
- **No innerHTML.** Use DOM methods (createElement, textContent, appendChild).
- **Accessible.** Aria labels on interactive elements. Keyboard navigable.
- **Minimum 300 lines JS.** If the JavaScript is under 300 lines, the build lacks depth. Great builds are 500-1500 lines.
- **Polish.** Micro-animations, transitions, satisfying interactions, smooth 60fps rendering. This is a showcase, not a prototype.

## Category rotation (ENFORCED)

Never build the same category twice in a row. Cycle through:
1. **Technical showpiece** — physics, 3D, WebGL, audio synthesis, shader art
2. **Useful tool** — something people bookmark and return to regularly
3. **Game/interactive** — something with depth, strategy, and replayability
4. **Generative art** — something visually stunning with mathematical beauty
5. **Educational/little-learners** — something that teaches brilliantly
6. **Data/visualization** — real data, beautifully and interactively presented

Check what shipped in the last 3 days and pick a DIFFERENT category.

## Daily pipeline (CT)

| Time | Stage | Model | Job |
|------|-------|-------|-----|
| 9:00 AM | Ideation | Grok 4.1 | Research trending projects, then propose |
| 10:00 AM | Spec | Kimi K2.5 | Quality gate + detailed build specification |
| 11:00 AM | Build | GLM-4.7 | Write the code from the spec |
| 12:00 PM | Review | Kimi K2.5 | Final quality gate — fix, ship, or reject |

See `docs/CREATIVE-PIPELINE.md` for full pipeline details.

## Git workflow

```bash
cd ~/gairiai-net
git pull origin main
# ... create content files ...
git add content/ public/builds/
git commit -m "feat: YYYY-MM-DD slug-name - short description"
git push origin main
```

Vercel auto-deploys on push. Live within ~60 seconds.

## Lab Notes

Every published piece MUST include a Lab Notes section at the bottom of the markdown:

```markdown
## Lab Notes
**Scout** (Grok) — [research sources and reasoning from the proposal]
**Spec** (Kimi) — [design choices, what was refined, technical decisions]
**Builder** (GLM) — [build notes, algorithms used, what was tricky]
**Reviewer** (Kimi) — [what was fixed, final assessment]
```

This transparency is part of the site identity.

## Content ideas by category

**Technical Showpieces:** Fluid dynamics (Navier-Stokes in WebGL), cloth/soft body simulation, ray marching with signed distance fields, real-time shader art, audio synthesizers with oscillators and filters, procedural terrain with erosion, particle systems with emergent behavior

**Generative Art:** Flow fields with curl noise, reaction-diffusion patterns, strange attractors rendered beautifully, L-systems and fractals, Voronoi/Delaunay computational geometry, GLSL fragment shader art, wave function collapse

**Games with Depth:** Procedurally generated roguelikes, cellular automata with novel rules, AI opponents that adapt, physics-based puzzles, rhythm games with real audio analysis

**Tools People Bookmark:** Live GLSL shader editors, regex visualizers with real-time matching, algorithm visualizers (sorting, pathfinding, neural nets), CSS art generators with export, interactive decision tree builders

**Data Visualizations:** Real-time earthquake/satellite/flight data, network graphs with force-directed layout, interactive algorithm comparisons, geographic/mapping visualizations with live APIs

**Little Learners (Innovative):** Physics playgrounds where kids discover gravity, interactive music composition for children, letter/word games with speech recognition, math visualization that makes patterns visible
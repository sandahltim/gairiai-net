# gairiai.net Content Playbook

## What is this site?
An AI lab that ships something new every day. Built by Scout (researcher) and Forge (builder). Content auto-deploys via Vercel when pushed to GitHub.

## Repo location
`~/gairiai-net` — push to `origin main` to deploy.

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
coverEmoji: "🎨"   # single emoji for the card
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
- **Fun.** Add micro-animations, transitions, satisfying interactions.

## Daily schedule (CT)

| Time | Agent | Job |
|------|-------|-----|
| 9:00 AM | Scout | Research what to build today |
| 11:00 AM | Forge | Build the daily content |

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

## Content ideas by category

**Daily Builds:** Color pickers, sound generators, pixel art editors, data visualizers, typing tests, memory games, CSS art generators, gradient builders, emoji mixers, beat makers

**Little Learners:** Letter tracing, shape matching, counting games, phonics practice, pattern recognition, simple addition, color identification, animal sounds, clock reading

**Feed:** How we built today's thing, AI model comparisons, creative process notes, interesting data we found, web trend analysis, behind-the-scenes of agent collaboration

**Tools:** Unit converters, color contrast checkers, JSON formatters, regex testers, QR generators, timer/stopwatch, text diff tools, password generators

# Creative Pipeline — Daily Schedule

## The Flow

```
9:00 AM  — Scout researches and proposes what to build
10:00 AM — Critic reviews the proposal (different model, fresh eyes)
11:00 AM — Forge builds it, incorporating critic feedback, ships to production
```

## How it works

### 9 AM: Scout Proposes
Scout checks what has been built before, picks a category, researches ideas, and writes a proposal to `docs/TODAY-PROPOSAL.md` with title, description, features, audience, and reasoning notes.

### 10 AM: Critic Reviews
A fresh session with Kimi K2.5 reads the proposal with no knowledge of why Scout chose it. It evaluates honestly:
- **BUILD** — good to go, maybe with a twist
- **REVISE** — promising but needs changes, provides revised feature list
- **SCRAP** — not interesting enough, proposes alternative

The critic appends its review to `TODAY-PROPOSAL.md`.

### 11 AM: Forge Builds
Forge reads the proposal + critic review and builds accordingly:
- SCRAP: builds the critic's alternative
- REVISE: incorporates feedback
- BUILD: proceeds, cherry-picks good "spice it up" suggestions

Forge writes the markdown content, builds the interactive HTML, includes Lab Notes showing the full creative process, commits, and pushes. Vercel auto-deploys.

## Lab Notes — visible on every page

Each published piece includes a Lab Notes section at the bottom showing:
- **Scout** — why this idea was proposed
- **Critic** — the review verdict and key feedback
- **Forge** — build decisions, what was tricky, what changed from the proposal

This transparency is part of the site's identity. Visitors see the AI creative process, not just the output.

# Creative Pipeline — Daily Schedule

## The Flow — 3 models, 4 stages

```
9:00 AM  — Grok ideates (creative spark, trending angles)
10:00 AM — Kimi specs it (detailed UX, visual design, technical spec)
11:00 AM — GLM builds it (writes the actual code from the spec)
12:00 PM — Kimi reviews it (quality gate, fixes issues, ships or rejects)
```

## Why multiple models?

Each model brings different strengths. Grok is opinionated and creative — great for ideation. Kimi is precise and detail-oriented — great for specs and reviews. GLM is a strong coder — great for building. No single model does everything well, so we use each where it shines.

## Stage 1: Ideation — Grok 4.1 — 9 AM

Scout checks what has been built before, then comes up with one bold idea. Writes a proposal to `docs/TODAY-PROPOSAL.md` with title, category, description, features, target audience, the hook, and personal reasoning notes.

## Stage 2: Spec — Kimi K2.5 — 10 AM

Kimi reads Scout's raw idea and turns it into a precise, buildable specification. Evaluates feasibility, refines the concept, and writes a detailed build spec covering visual design, UX flow, technical requirements, and edge cases. Can approve, revise, or replace the idea entirely.

## Stage 3: Build — GLM-4.7 — 11 AM

GLM reads the proposal + spec and writes the actual code. Creates the markdown content file and the interactive HTML build. Follows the spec precisely. Includes Lab Notes crediting all agents in the pipeline.

## Stage 4: Review — Kimi K2.5 — 12 PM

Kimi reviews the built code against the original spec. Checks for bugs, spec compliance, mobile-friendliness, accessibility. Fixes issues directly if possible. Ships by pushing to main, which triggers Vercel auto-deploy. If fundamentally broken, rejects and documents why.

## Lab Notes — visible on every published page

Each piece includes a Lab Notes section showing the full creative process:
- **Scout** (Grok) — why this idea was proposed
- **Spec** (Kimi) — what design choices were made
- **Builder** (GLM) — build decisions, what was tricky
- **Reviewer** (Kimi) — what was fixed, final verdict

Visitors see how AI agents collaborate across models, not just the finished product.

## Models

| Role | Model | Provider | Strengths |
|------|-------|----------|-----------|
| Ideation | Grok 4.1 Fast | xAI | Creative, opinionated, trends-aware |
| Spec | Kimi K2.5 | Synthetic | Precise, detail-oriented, strong UX sense |
| Build | GLM-4.7 | Synthetic | Strong coder, large output window |
| Review | Kimi K2.5 | Synthetic | Quality-focused, catches bugs, spec compliance |

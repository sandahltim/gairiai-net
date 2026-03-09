# Build Proposal - 2026-03-09

## Research Sources
GitHub Trending exploding with AI agent repos (agency-agents 4k+ stars today, MiroFish swarm intell 2k stars, hermes-agent, page-agent). HN frontpage: Fontcrafter (handwriting-to-font tool, 258 pts), Agent Safehouse macOS sandbox (730 pts), VS Code Agent Kanban (57 pts), artificial-life simple sim (146 pts). Recent Reddit trends implied via category overlap: creativecoding/generative hot on simulations/shaders. Recent ships: Fourier Epicycle (math tool), Ant Wars (game sim), Morphogenesis (reaction-diffusion gen art) — avoiding game/gen art/tool repeats.

Key spark: AI agent hype + shadertoy-style GLSL editors in creativecoding history + impeccable design lang for AI (1k stars). Devs love live shader playgrounds (shareable, technical depth).

## Idea: Live GLSL Fragment Shader Forge
**Category:** Technical showpiece (WebGL, shaders)
**One-liner:** Real-time GLSL fragment shader editor with AI-suggested mutations, live audio reactivity, and one-click shadertoy export — turn mouse position/time into hypnotic agent swarms or fluid plasmas.
**Technical Stack:** WebGL2, live GLSL parsing/compilation, WebAudio FFT for freq mapping to uniforms, code diff highlighting.
**Inspired by:** agency-agents/MiroFish AI swarms on GitHub (4k+ stars today) + HN artificial-life sims + r/creativecoding shader posts. Captures agent/swarm visual energy in editable shader form.

**Description:** Load with a swirling agent-flock plasma preset (inspired by MiroFish swarms). Edit GLSL live in a side editor — changes compile instantly, no refresh. Mouse XY/time/u_time feed into shader uniforms; toggle mic input to map FFT bins to color/noise/octaves for audio-driven chaos. AI button suggests mutations (e.g., "add voronoi cells", "inject flow noise") via simple prompt-to-snippet. Dark theme, mobile keyboard-safe, fullscreen toggle.

**Target audience:** Creative coders, shadertoy addicts, WebGL devs — they'll fork/export/share custom agent sims or audio visuals.

**Key features:**
- Live GLSL edit → compile → render pipeline (error overlay on syntax fail).
- 6 swarm/agent presets (flocking plasma, neural net viz, particle CA).
- WebAudio FFT mapping: bass drives scale, highs add turbulence.
- AI mutation suggester (3 snippets/click, insert/replace modes).
- Shadertoy export (copy-paste ready code block).
- Uniform sliders for iTime/iResolution/mouse + preset saves.
- Mobile: virtual keyboard + touch-drag uniforms.

**The hook:** Screenshot a custom audio-reactive agent swarm shader, post to r/creativecoding or X with "AI-mutated this live in browser" — devs will dissect the code and remix.

**Wow Test Results:**
1. Stop scrolling? YES — instant hypnotic swarm render grabs eyes like shadertoy viral hits.
2. Developer would share? YES — editable GLSL + AI mutations + export = instant remix fodder for HN/Reddit/X.
3. Technical boundary pushed? YES — live GLSL compile loop + FFT uniforms + mutation injection in pure browser WebGL2/WebAudio.
4. Different from this week? YES — shaders vs recent Canvas2D sims/math viz/game physics; rotates to pure GPU fragment pipeline.

### Scout Notes
GitHub's agent/swarm explosion (agency-agents 16k stars, MiroFish 9k) screams for visual embodiment — this turns abstract AI hype into editable, audio-reactive shader art that feels alive. Over other ideas (font gen repeat, basic automata), this pushes WebGL compile-time boundaries with AI assist, perfect for devs who want to hack swarms on the fly. Excited by the mutation loop: human edit → AI tweak → audio test → share; technical challenge is robust GLSL error handling + uniform injection without full parser.
import {
  createGameState,
  createRound,
  resolveVote,
  advanceProgress,
  serializeProgress,
  hydrateProgress,
  listUnlocks,
} from '/games/off-key-one/game.mjs';

const SAVE_KEY = 'gf-off-key-one';
const STAGES = ['briefing', 'rehearsal', 'evidence', 'vote', 'result'];

const els = {
  scoreValue: document.getElementById('scoreValue'),
  streakValue: document.getElementById('streakValue'),
  bestValue: document.getElementById('bestValue'),
  unlockValue: document.getElementById('unlockValue'),
  nextRoundBtn: document.getElementById('nextRoundBtn'),
  howToBtn: document.getElementById('howToBtn'),
  resetBtn: document.getElementById('resetBtn'),
  onboardingPanel: document.getElementById('onboardingPanel'),
  modeRow: document.getElementById('modeRow'),
  secretScreen: document.getElementById('secretScreen'),
  secretTitle: document.getElementById('secretTitle'),
  secretCopy: document.getElementById('secretCopy'),
  stageStrip: document.getElementById('stageStrip'),
  focusBadge: document.getElementById('focusBadge'),
  briefingCopy: document.getElementById('briefingCopy'),
  venueCopy: document.getElementById('venueCopy'),
  revealSecretBtn: document.getElementById('revealSecretBtn'),
  advanceStageBtn: document.getElementById('advanceStageBtn'),
  evidenceList: document.getElementById('evidenceList'),
  suspectList: document.getElementById('suspectList'),
  voteBtn: document.getElementById('voteBtn'),
  resultPanel: document.getElementById('resultPanel'),
  resultCopy: document.getElementById('resultCopy'),
  continueBtn: document.getElementById('continueBtn'),
  replayBtn: document.getElementById('replayBtn'),
  unlockList: document.getElementById('unlockList'),
};

const state = {
  progress: loadProgress(),
  round: null,
  selectedSuspectId: null,
  currentStage: 'briefing',
  resolution: null,
  audioContext: null,
  secretRevealed: false,
};

function loadProgress() {
  const fallback = {
    score: 0,
    streak: 0,
    bestScore: 0,
    longestStreak: 0,
    unlockTier: 1,
    mode: 'solo',
    round: 1,
  };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...fallback, ...hydrateProgress(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(SAVE_KEY, serializeProgress(state.progress));
  } catch {
    // ignore storage failures
  }
}

function newRound(seed = Date.now()) {
  const gameState = createGameState({ ...state.progress, seed });
  state.round = createRound(gameState);
  state.selectedSuspectId = null;
  state.currentStage = 'briefing';
  state.resolution = null;
  state.secretRevealed = false;
  render();
}

function restartRun() {
  state.progress = {
    ...state.progress,
    score: 0,
    streak: 0,
    mode: state.progress.mode,
    round: 1,
  };
  saveProgress();
  newRound(Date.now());
}

function render() {
  renderStats();
  renderModes();
  renderStageStrip();
  renderBriefing();
  renderEvidence();
  renderSuspects();
  renderResult();
  renderUnlocks();
}

function renderStats() {
  els.scoreValue.textContent = String(state.progress.score);
  els.streakValue.textContent = String(state.progress.streak);
  els.bestValue.textContent = String(state.progress.bestScore);
  els.unlockValue.textContent = String(state.progress.unlockTier);
}

function renderModes() {
  [...els.modeRow.querySelectorAll('[data-mode]')].forEach((button) => {
    button.dataset.active = String(button.dataset.mode === state.progress.mode);
  });

  if (!state.round) {
    els.secretTitle.textContent = 'Local multiplayer secret brief';
    els.secretCopy.textContent = state.progress.mode === 'pass-play'
      ? 'Start a rehearsal, reveal the secret sabotage assignment for Player 1, then hand the phone over.'
      : 'Solo conductor is the default launch path. Switch to Pass & Play for the couch-test build.';
    els.secretScreen.classList.remove('revealed');
    return;
  }

  if (state.progress.mode === 'pass-play') {
    els.secretTitle.textContent = state.secretRevealed ? 'Hand the phone over' : 'Player 1 secret brief';
    els.secretCopy.textContent = state.secretRevealed
      ? `${saboteur().name} is the hidden saboteur. Pass the device. Everyone else should hunt based on the room, not this screen.`
      : 'Reveal the secret brief only when the saboteur is holding the phone.';
    els.secretScreen.classList.toggle('revealed', state.secretRevealed);
  } else {
    els.secretTitle.textContent = 'Solo conductor rollout';
    els.secretCopy.textContent = 'No hidden player here. You are the conductor, reading the room and calling out the saboteur yourself.';
    els.secretScreen.classList.remove('revealed');
  }
}

function renderStageStrip() {
  els.stageStrip.innerHTML = '';
  const currentIndex = STAGES.indexOf(state.currentStage);
  STAGES.forEach((stage, index) => {
    const pill = document.createElement('div');
    pill.className = 'stage-pill';
    pill.dataset.active = index === currentIndex ? 'true' : index < currentIndex ? 'preview' : 'false';
    pill.textContent = stage;
    els.stageStrip.appendChild(pill);
  });
}

function renderBriefing() {
  if (!state.round) {
    els.focusBadge.textContent = 'waiting';
    els.briefingCopy.textContent = 'Tap Start rehearsal to generate a cast, venue, and sabotage pattern.';
    els.venueCopy.textContent = 'The room will fill in here.';
    return;
  }
  els.focusBadge.textContent = state.round.focus;
  els.briefingCopy.textContent = `${state.round.ensemble} is rehearsing at ${state.round.venue}. Watch the ${state.round.focus}. Round ${state.round.roundNumber} raises the pressure to ${state.round.difficulty}/7.`;
  els.venueCopy.textContent = state.progress.mode === 'pass-play'
    ? `In pass & play, reveal the secret brief before you advance. Then everyone uses the same ${state.round.evidence.length}-clue set and ${state.round.suspects.length}-singer suspect board.`
    : `Sabotage flavor tonight: ${state.round.sabotageLabel}. ${state.round.evidence.length} clues are on the stand, and ${state.round.suspects.length} singers could have poisoned the blend.`;

  els.revealSecretBtn.textContent = state.progress.mode === 'pass-play'
    ? state.secretRevealed ? 'Hide secret brief' : 'Reveal secret brief'
    : 'Solo mode: no secret brief';
  els.revealSecretBtn.disabled = state.progress.mode !== 'pass-play';
  els.advanceStageBtn.textContent = state.resolution ? 'Result locked' : nextStageLabel();
  els.advanceStageBtn.disabled = Boolean(state.resolution);
}

function renderEvidence() {
  els.evidenceList.innerHTML = '';
  const evidence = state.round?.evidence ?? [];
  evidence.forEach((clue) => {
    const card = document.createElement('article');
    card.className = 'evidence-card';
    card.innerHTML = `
      <div class="evidence-top">
        <div>
          <div class="pill">${clue.label}</div>
          <h3 class="section-title">${clue.actorName}</h3>
        </div>
        <div class="intensity">Intensity ${clue.intensity}</div>
      </div>
      <p class="section-copy">${clue.clueText}</p>
      <div class="controls">
        <button class="btn-secondary" data-play-clue="${clue.id}">Play cue</button>
        <button class="btn-secondary" data-read-clue="${clue.id}">Spotlight</button>
      </div>
    `;
    els.evidenceList.appendChild(card);
  });
}

function renderSuspects() {
  els.suspectList.innerHTML = '';
  const suspects = state.round?.suspects ?? [];
  suspects.forEach((suspect) => {
    const card = document.createElement('article');
    card.className = 'suspect-card';
    card.dataset.selected = String(state.selectedSuspectId === suspect.id);
    card.innerHTML = `
      <div class="suspect-top">
        <div>
          <div class="pill">${suspect.seat} section</div>
          <h3 class="section-title">${suspect.name}</h3>
        </div>
        <div class="intensity">Nerve ${suspect.confidence}</div>
      </div>
      <div class="suspect-meta">
        <span>${state.round?.ensemble ?? 'Ensemble'}</span>
        <span>${state.round?.focus ?? 'focus'} pressure</span>
      </div>
      <ul class="suspect-tells">
        ${suspect.tells.map((tell) => `<li>${tell}</li>`).join('')}
      </ul>
      <button class="btn-secondary" data-select-suspect="${suspect.id}">${state.selectedSuspectId === suspect.id ? 'Selected' : 'Suspect this singer'}</button>
    `;
    els.suspectList.appendChild(card);
  });
  els.voteBtn.disabled = !state.selectedSuspectId || !state.round;
}

function renderResult() {
  if (!state.resolution) {
    els.resultCopy.textContent = 'No accusation locked yet. Listen, read, then make the call.';
    els.continueBtn.disabled = true;
    return;
  }
  const culpritName = saboteur().name;
  const verdict = state.resolution.correct ? 'Choir holds.' : 'Harmony breaks.';
  els.resultCopy.textContent = `${verdict} ${state.resolution.summary} ${state.resolution.correct ? `+${state.resolution.scoreDelta}` : `${state.resolution.scoreDelta}`} score. The saboteur was ${culpritName}.`;
  els.continueBtn.disabled = false;
}

function renderUnlocks() {
  const unlocks = listUnlocks(state.progress.unlockTier);
  els.unlockList.innerHTML = '';
  [
    { title: 'Venues', values: unlocks.venues },
    { title: 'Ensembles', values: unlocks.ensembles },
    { title: 'Sabotage lanes', values: unlocks.sabotageTypes },
  ].forEach((item) => {
    const card = document.createElement('article');
    card.className = 'unlock-card';
    card.innerHTML = `
      <h3 class="section-title">${item.title}</h3>
      <p class="section-copy">${item.values.join(' • ')}</p>
    `;
    els.unlockList.appendChild(card);
  });
}

function nextStageLabel() {
  if (!state.round) return 'Advance';
  const currentIndex = STAGES.indexOf(state.currentStage);
  if (currentIndex === -1 || currentIndex === STAGES.length - 1) return 'Move to result';
  return `Advance to ${STAGES[currentIndex + 1]}`;
}

function saboteur() {
  return state.round.suspects.find((suspect) => suspect.isSaboteur) ?? state.round.suspects[0];
}

async function ensureAudio() {
  if (!state.audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    state.audioContext = new AudioCtx();
  }
  if (state.audioContext.state === 'suspended') {
    await state.audioContext.resume();
  }
  return state.audioContext;
}

async function playCue(clue) {
  const ctx = await ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime + 0.02;
  const root = 220 + clue.intensity * 24;
  const gain = ctx.createGain();
  gain.gain.value = 0.0001;
  gain.connect(ctx.destination);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  if (clue.cue.family === 'rhythm') {
    clue.cue.pattern.forEach((pulse, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = clue.isSabotaged ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(root * pulse, now + index * 0.22);
      osc.detune.value = clue.cue.detune;
      oscGain.gain.setValueAtTime(0.0001, now + index * 0.22);
      oscGain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.22 + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.22 + 0.14);
      osc.connect(oscGain).connect(gain);
      osc.start(now + index * 0.22);
      osc.stop(now + index * 0.22 + 0.16);
    });
  } else {
    const intervals = clue.cue.intervals;
    intervals.forEach((interval, index) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const freq = root * Math.pow(2, interval / 12);
      osc.type = clue.isSabotaged ? 'sawtooth' : index === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.value = clue.cue.detune;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.09, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc.connect(oscGain).connect(gain);
      osc.start(now + index * 0.02);
      osc.stop(now + 1);
    });
  }
}

async function playResultSting(correct) {
  const ctx = await ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime + 0.03;
  const intervals = correct ? [0, 4, 7, 12] : [0, 3, 6, 10];
  intervals.forEach((interval, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = correct ? 'triangle' : 'square';
    osc.frequency.value = 280 * Math.pow(2, interval / 12);
    gain.gain.setValueAtTime(0.0001, now + index * 0.04);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.04 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + index * 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + index * 0.04);
    osc.stop(now + 0.7 + index * 0.03);
  });
}

function advanceStage() {
  if (!state.round) return;
  const currentIndex = STAGES.indexOf(state.currentStage);
  if (currentIndex < STAGES.length - 1) {
    state.currentStage = STAGES[currentIndex + 1];
  }
  render();
}

function lockVote() {
  if (!state.round || !state.selectedSuspectId) return;
  state.resolution = resolveVote(state.progress, state.round, state.selectedSuspectId);
  state.progress = advanceProgress(state.progress, state.resolution);
  state.currentStage = 'result';
  saveProgress();
  render();
  playResultSting(state.resolution.correct);
}

function spotlightClue(clue) {
  els.briefingCopy.textContent = `${clue.label}: ${clue.clueText}`;
  els.venueCopy.textContent = clue.isSabotaged
    ? 'That clue carries dissonance. Maybe obvious. Maybe bait.'
    : 'That clue resolves cleanly. Trust it, but not too much.';
}

function bindEvents() {
  els.nextRoundBtn.addEventListener('click', () => {
    newRound(Date.now());
    ensureAudio();
  });

  els.howToBtn.addEventListener('click', () => {
    els.onboardingPanel.classList.toggle('hidden');
  });

  els.resetBtn.addEventListener('click', () => {
    localStorage.removeItem(SAVE_KEY);
    state.progress = loadProgress();
    newRound(Date.now());
  });

  els.modeRow.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    state.progress.mode = button.dataset.mode === 'pass-play' ? 'pass-play' : 'solo';
    saveProgress();
    render();
  });

  els.revealSecretBtn.addEventListener('click', () => {
    if (state.progress.mode !== 'pass-play' || !state.round) return;
    state.secretRevealed = !state.secretRevealed;
    render();
  });

  els.advanceStageBtn.addEventListener('click', () => {
    if (!state.round) return;
    advanceStage();
  });

  els.evidenceList.addEventListener('click', (event) => {
    const playId = event.target.closest('[data-play-clue]')?.dataset.playClue;
    const readId = event.target.closest('[data-read-clue]')?.dataset.readClue;
    if (!state.round) return;
    const clue = state.round.evidence.find((item) => item.id === playId || item.id === readId);
    if (!clue) return;
    if (playId) {
      playCue(clue);
      if (STAGES.indexOf(state.currentStage) < 2) {
        state.currentStage = 'evidence';
        renderStageStrip();
      }
      return;
    }
    spotlightClue(clue);
  });

  els.suspectList.addEventListener('click', (event) => {
    const suspectId = event.target.closest('[data-select-suspect]')?.dataset.selectSuspect;
    if (!suspectId) return;
    state.selectedSuspectId = suspectId;
    if (STAGES.indexOf(state.currentStage) < 3) {
      state.currentStage = 'vote';
    }
    render();
  });

  els.voteBtn.addEventListener('click', lockVote);
  els.continueBtn.addEventListener('click', () => newRound(Date.now()));
  els.replayBtn.addEventListener('click', restartRun);
}

bindEvents();
newRound(Date.now());

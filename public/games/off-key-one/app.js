import {
  createGameState,
  createRound,
  getRoundTimeLimit,
  resolveVote,
  advanceProgress,
  serializeProgress,
  hydrateProgress,
  listUnlocks,
} from '/games/off-key-one/game.mjs';

const SAVE_KEY = 'gf-off-key-one';
const STAGES = ['drop', 'hear', 'solo', 'pick', 'resolve'];
const SEAT_INTERVALS = { S: 12, A: 5, T: 0, B: -7, Lead: 16, Swing: 9 };
const SEAT_PAN = { S: -0.72, A: -0.32, T: 0.18, B: 0.52, Lead: 0.04, Swing: 0.72 };

const els = {
  scoreValue: document.getElementById('scoreValue'),
  streakValue: document.getElementById('streakValue'),
  bestValue: document.getElementById('bestValue'),
  unlockValue: document.getElementById('unlockValue'),
  nextRoundBtn: document.getElementById('nextRoundBtn'),
  howToBtn: document.getElementById('howToBtn'),
  howToCopy: document.getElementById('howToCopy'),
  resetBtn: document.getElementById('resetBtn'),
  stageStrip: document.getElementById('stageStrip'),
  hearRoomBtn: document.getElementById('hearRoomBtn'),
  revealSecretBtn: document.getElementById('revealSecretBtn'),
  focusBadge: document.getElementById('focusBadge'),
  timerValue: document.getElementById('timerValue'),
  briefingCopy: document.getElementById('briefingCopy'),
  actionCopy: document.getElementById('actionCopy'),
  pressureFill: document.getElementById('pressureFill'),
  venueCopy: document.getElementById('venueCopy'),
  mixPad: document.getElementById('mixPad'),
  bars: Array.from(document.querySelectorAll('#bars .bar')),
  suspectList: document.getElementById('suspectList'),
  voteBtn: document.getElementById('voteBtn'),
  continueBtn: document.getElementById('continueBtn'),
  replayBtn: document.getElementById('replayBtn'),
  resultCopy: document.getElementById('resultCopy'),
  unlockList: document.getElementById('unlockList'),
};

const state = {
  progress: loadProgress(),
  round: null,
  selectedSuspectId: null,
  currentStage: 'drop',
  resolution: null,
  audioContext: null,
  isPlaying: false,
  roundDurationMs: 0,
  roundStartedAt: 0,
  clockInterval: null,
  barInterval: null,
  lastWarningSecond: null,
  barPhase: 0,
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

function remainingMs() {
  if (!state.round || !state.roundDurationMs) return 0;
  return Math.max(0, state.roundDurationMs - (Date.now() - state.roundStartedAt));
}

function timeRatio() {
  if (!state.roundDurationMs) return 1;
  return Math.max(0, Math.min(1, remainingMs() / state.roundDurationMs));
}

function setStage(stage) {
  state.currentStage = stage;
  renderStages();
  renderRound();
}

function startRound(seed = Date.now(), options = {}) {
  clearRoundTimers();
  const gameState = createGameState({ ...state.progress, seed, mode: 'solo' });
  state.round = createRound(gameState);
  state.selectedSuspectId = null;
  state.currentStage = 'hear';
  state.resolution = null;
  state.roundDurationMs = getRoundTimeLimit(state.round.difficulty);
  state.roundStartedAt = Date.now();
  state.lastWarningSecond = null;
  state.barPhase = 0;
  startRoundTimers();
  render();

  if (options.autoplay !== false) {
    window.setTimeout(() => {
      playRoomMix();
    }, 60);
  }
}

function restartRun() {
  clearRoundTimers();
  state.progress = {
    ...state.progress,
    score: 0,
    streak: 0,
    round: 1,
    mode: 'solo',
  };
  saveProgress();
  startInteractiveRound();
}

function clearRoundTimers() {
  if (state.clockInterval) {
    window.clearInterval(state.clockInterval);
    state.clockInterval = null;
  }
  if (state.barInterval) {
    window.clearInterval(state.barInterval);
    state.barInterval = null;
  }
}

function startRoundTimers() {
  clearRoundTimers();
  state.clockInterval = window.setInterval(() => {
    if (!state.round || state.resolution) return;
    const seconds = Math.ceil(remainingMs() / 1000);
    if (!state.isPlaying && seconds > 0 && seconds <= 3 && seconds !== state.lastWarningSecond) {
      state.lastWarningSecond = seconds;
      playWarningTick(seconds).catch(() => {});
    }
    renderRound();
  }, 100);

  state.barInterval = window.setInterval(() => {
    state.barPhase += 0.45;
    updateBars();
  }, 120);
}

function render() {
  renderStats();
  renderStages();
  renderRound();
  renderSuspects();
  renderResult();
  renderUnlocks();
  updateBars();
}

function renderStats() {
  els.scoreValue.textContent = String(state.progress.score);
  els.streakValue.textContent = String(state.progress.streak);
  els.bestValue.textContent = String(state.progress.bestScore);
  els.unlockValue.textContent = String(state.progress.unlockTier);
}

function renderStages() {
  els.stageStrip.innerHTML = '';
  const currentIndex = STAGES.indexOf(state.currentStage);
  STAGES.forEach((stage, index) => {
    const chip = document.createElement('div');
    chip.className = `chip${index === currentIndex ? ' active' : ''}`;
    chip.textContent = stage;
    els.stageStrip.appendChild(chip);
  });
}

function renderRound() {
  if (!state.round) {
    els.focusBadge.textContent = 'waiting';
    els.timerValue.textContent = '--.-s';
    els.briefingCopy.textContent = 'Tap drop in. Then trust your ears.';
    els.actionCopy.textContent = 'Wrong voice, fast verdict.';
    els.venueCopy.textContent = 'The saboteur bends rhythm, pitch, or blend. Clean singers resolve. Guilty singers rub.';
    els.hearRoomBtn.disabled = true;
    els.revealSecretBtn.disabled = true;
    els.pressureFill.style.transform = 'scaleX(1)';
    els.pressureFill.style.filter = 'saturate(1)';
    els.mixPad.classList.remove('urgent');
    return;
  }

  const ratio = timeRatio();
  const seconds = (remainingMs() / 1000).toFixed(1);
  const overtime = remainingMs() === 0 && !state.resolution;
  const selected = state.round.suspects.find((suspect) => suspect.id === state.selectedSuspectId);

  els.focusBadge.textContent = `${state.round.focus} focus • round ${state.round.roundNumber}`;
  els.timerValue.textContent = overtime ? 'overtime' : `${seconds}s`;
  els.briefingCopy.textContent = `${state.round.ensemble}`;
  els.actionCopy.textContent = state.resolution
    ? (state.resolution.correct ? 'Room saved.' : 'Saboteur named.')
    : state.isPlaying
      ? 'Listen. Don’t guess yet.'
      : overtime
        ? 'Bonus burned. Lock it anyway.'
        : selected
          ? `Marked ${selected.name}. Lock it or keep listening.`
          : 'Solo suspects. Mark the voice that rubs.';
  els.venueCopy.textContent = `${state.round.venue}. ${state.round.suspects.length} voices. ${state.round.evidence.length} audio passes.`;
  els.pressureFill.style.transform = `scaleX(${Math.max(0.03, ratio)})`;
  els.pressureFill.style.filter = overtime ? 'saturate(0.8) brightness(0.9)' : `saturate(${1 + (1 - ratio) * 0.6}) brightness(${1 + ratio * 0.12})`;
  els.mixPad.classList.toggle('urgent', !state.resolution && ratio < 0.28);
  els.hearRoomBtn.disabled = state.isPlaying;
  els.revealSecretBtn.disabled = state.isPlaying;
  els.hearRoomBtn.textContent = state.currentStage === 'hear' ? 'Replay room' : 'Hear the room';
  els.revealSecretBtn.textContent = state.round.focus === 'pitch'
    ? 'Hear pure chord'
    : state.round.focus === 'rhythm'
      ? 'Hear click grid'
      : 'Hear clean blend';
}

function renderSuspects() {
  els.suspectList.innerHTML = '';
  if (!state.round) {
    els.voteBtn.disabled = true;
    return;
  }

  state.round.suspects.forEach((suspect) => {
    const card = document.createElement('article');
    card.className = `suspect-card${state.selectedSuspectId === suspect.id ? ' selected' : ''}`;
    card.innerHTML = `
      <div class="suspect-top">
        <div>
          <div class="suspect-seat">${suspect.seat}</div>
          <div class="suspect-name">${suspect.name}</div>
        </div>
        <div class="chip">nerve ${suspect.confidence}</div>
      </div>
      <div class="suspect-actions">
        <button class="listen-btn" data-listen="${suspect.id}" ${state.isPlaying ? 'disabled' : ''}>Solo</button>
        <button class="select-btn" data-select="${suspect.id}" ${state.isPlaying ? 'disabled' : ''}>${state.selectedSuspectId === suspect.id ? 'Marked' : 'Mark'}</button>
      </div>
    `;
    els.suspectList.appendChild(card);
  });

  els.voteBtn.disabled = !state.selectedSuspectId || state.isPlaying;
}

function renderResult() {
  if (!state.resolution) {
    els.resultCopy.textContent = state.round ? 'Catch the off voice.' : 'No round yet.';
    els.continueBtn.disabled = true;
    return;
  }

  if (state.resolution.correct) {
    const bonusText = state.resolution.timeBonus > 0 ? ` • speed +${state.resolution.timeBonus}` : '';
    els.resultCopy.textContent = `Nailed it. +${state.resolution.scoreDelta}${bonusText} • ${state.resolution.culpritName}`;
  } else {
    els.resultCopy.textContent = `${state.resolution.scoreDelta} • ${state.resolution.culpritName} got away.`;
  }
  els.continueBtn.disabled = false;
}

function renderUnlocks() {
  const unlocks = listUnlocks(state.progress.unlockTier);
  els.unlockList.textContent = `Unlocked rooms: ${unlocks.venues.join(' • ')}`;
}

function updateBars() {
  const ratio = state.round ? timeRatio() : 1;
  els.bars.forEach((bar, index) => {
    const motion = 0.52 + Math.sin(state.barPhase + index * 0.95) * 0.24 + Math.cos(state.barPhase * 0.72 + index * 0.55) * 0.12;
    const urgency = 0.18 + (1 - ratio) * 0.36;
    const height = Math.max(18, Math.min(96, Math.round((motion + urgency) * 58)));
    bar.style.height = `${height}%`;
  });
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

function noteFrequency(interval, root = 220) {
  return root * Math.pow(2, interval / 12);
}

function createVoiceChain(ctx, pan = 0) {
  if (typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), ctx.currentTime);
    panner.connect(ctx.destination);
    return panner;
  }
  return ctx.destination;
}

function envelope(gainNode, start, attack = 0.02, sustain = 0.14, level = 0.12) {
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(level, start + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + attack + sustain);
}

async function playChord(intervals, options = {}) {
  const ctx = await ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime + 0.02;
  const root = options.root ?? 196;
  const waveform = options.waveform ?? 'triangle';
  const detune = options.detune ?? 0;
  const duration = options.duration ?? 0.6;
  const level = options.level ?? 0.08;
  const output = createVoiceChain(ctx, options.pan ?? 0);

  intervals.forEach((interval, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(noteFrequency(interval, root), now);
    osc.detune.setValueAtTime(detune + index * 3, now);
    envelope(gain, now, 0.02, Math.max(0.16, duration - 0.08), level);
    osc.connect(gain).connect(output);
    osc.start(now + index * 0.01);
    osc.stop(now + duration);
  });
}

async function playPulse(pattern, options = {}) {
  const ctx = await ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime + 0.02;
  const root = options.root ?? 220;
  const waveform = options.waveform ?? 'triangle';
  const detune = options.detune ?? 0;
  const output = createVoiceChain(ctx, options.pan ?? 0);

  pattern.forEach((pulse, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(root * pulse, now + index * 0.19);
    osc.detune.setValueAtTime(detune, now + index * 0.19);
    envelope(gain, now + index * 0.19, 0.01, 0.08, 0.11);
    osc.connect(gain).connect(output);
    osc.start(now + index * 0.19);
    osc.stop(now + index * 0.19 + 0.12);
  });
}

async function playWarningTick(step) {
  const root = 420 + step * 28;
  await playChord([0, 7], { root, waveform: 'sine', duration: 0.18, level: 0.045 });
}

async function playClue(clue, options = {}) {
  if (clue.cue.family === 'rhythm') {
    await playPulse(clue.cue.pattern, {
      root: 190 + clue.intensity * 18,
      waveform: clue.isSabotaged ? 'square' : 'triangle',
      detune: clue.cue.detune,
      pan: options.pan ?? 0,
    });
    return;
  }

  await playChord(clue.cue.intervals, {
    root: 180 + clue.intensity * 14,
    waveform: clue.isSabotaged ? 'sawtooth' : 'triangle',
    detune: clue.cue.detune,
    duration: 0.72,
    level: clue.isSabotaged ? 0.09 : 0.07,
    pan: options.pan ?? 0,
  });
}

function suspectPan(suspect) {
  return SEAT_PAN[suspect?.seat] ?? 0;
}

async function playReference() {
  if (!state.round || state.isPlaying) return;
  setStage('hear');
  state.isPlaying = true;
  renderRound();
  renderSuspects();

  if (state.round.focus === 'rhythm') {
    await playPulse([1, 1, 1, 1], { root: 210, waveform: 'triangle', detune: 0, pan: 0 });
  } else if (state.round.focus === 'pitch') {
    await playChord([0, 4, 7], { root: 210, waveform: 'sine', detune: 0, duration: 0.8, pan: 0 });
  } else {
    await playChord([0, 4, 9], { root: 200, waveform: 'triangle', detune: 0, duration: 0.8, pan: 0 });
  }

  await wait(120);
  state.isPlaying = false;
  setStage(state.selectedSuspectId ? 'pick' : 'solo');
  renderSuspects();
}

async function playRoomMix() {
  if (!state.round || state.isPlaying) return;
  setStage('hear');
  state.isPlaying = true;
  renderRound();
  renderSuspects();

  for (const clue of state.round.evidence) {
    const suspect = state.round.suspects.find((item) => item.id === clue.actorId);
    await playClue(clue, { pan: suspectPan(suspect) });
    await wait(190);
  }

  state.isPlaying = false;
  setStage(state.selectedSuspectId ? 'pick' : 'solo');
  renderSuspects();
}

function clueForSuspect(suspect) {
  const direct = state.round.evidence.find((clue) => clue.actorId === suspect.id);
  if (direct) return direct;
  const fallback = state.round.evidence.find((clue) => clue.isSabotaged === suspect.isSaboteur);
  return fallback ?? state.round.evidence[0];
}

async function playSuspect(suspectId) {
  if (!state.round || state.isPlaying) return;
  const suspect = state.round.suspects.find((item) => item.id === suspectId);
  if (!suspect) return;
  setStage('solo');
  state.isPlaying = true;
  renderRound();
  renderSuspects();

  const clue = clueForSuspect(suspect);
  const seatOffset = SEAT_INTERVALS[suspect.seat] ?? 0;
  const syntheticClue = {
    ...clue,
    cue: clue.cue.family === 'rhythm'
      ? { ...clue.cue, pattern: suspect.isSaboteur ? [1, 0.78, 1.28, 0.84] : [1, 1, 1, 1] }
      : { ...clue.cue, intervals: (clue.cue.intervals ?? [0, 4, 7]).map((interval) => interval + Math.round(seatOffset / 12)) },
    intensity: Math.max(1, Math.min(5, clue.intensity + Math.floor(suspect.confidence / 3))),
  };

  await playClue(syntheticClue, { pan: suspectPan(suspect) });
  await wait(160);
  state.isPlaying = false;
  setStage(state.selectedSuspectId ? 'pick' : 'solo');
  renderSuspects();
}

function chooseSuspect(suspectId) {
  if (!state.round || state.isPlaying) return;
  state.selectedSuspectId = suspectId;
  setStage('pick');
  renderSuspects();
}

async function lockVote() {
  if (!state.round || !state.selectedSuspectId || state.isPlaying) return;
  const timeRemainingMs = remainingMs();
  state.resolution = resolveVote(state.progress, state.round, state.selectedSuspectId, {
    timeRemainingMs,
    roundDurationMs: state.roundDurationMs,
  });
  state.progress = advanceProgress(state.progress, state.resolution);
  saveProgress();
  clearRoundTimers();
  setStage('resolve');
  renderStats();
  renderRound();
  renderSuspects();
  renderResult();
  renderUnlocks();
  await playVerdict(state.resolution.correct);
}

async function playVerdict(correct) {
  if (correct) {
    await playChord([0, 4, 7, 12], { root: 230, waveform: 'triangle', duration: 0.72, level: 0.08 });
    return;
  }
  await playChord([0, 3, 6, 10], { root: 180, waveform: 'square', detune: -12, duration: 0.72, level: 0.09 });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function startInteractiveRound() {
  await ensureAudio();
  startRound(Date.now(), { autoplay: true });
}

function bindEvents() {
  els.nextRoundBtn.addEventListener('click', () => {
    startInteractiveRound();
  });

  els.howToBtn.addEventListener('click', () => {
    els.howToCopy.classList.toggle('hidden');
  });

  els.resetBtn.addEventListener('click', () => {
    localStorage.removeItem(SAVE_KEY);
    state.progress = loadProgress();
    restartRun();
  });

  els.hearRoomBtn.addEventListener('click', () => {
    playRoomMix();
  });
  els.revealSecretBtn.addEventListener('click', () => {
    playReference();
  });

  els.suspectList.addEventListener('click', (event) => {
    const listenId = event.target.closest('[data-listen]')?.dataset.listen;
    const selectId = event.target.closest('[data-select]')?.dataset.select;
    if (listenId) {
      playSuspect(listenId);
      return;
    }
    if (selectId) {
      chooseSuspect(selectId);
    }
  });

  els.voteBtn.addEventListener('click', () => {
    lockVote();
  });
  els.continueBtn.addEventListener('click', () => {
    startInteractiveRound();
  });
  els.replayBtn.addEventListener('click', () => {
    restartRun();
  });
}

bindEvents();
render();
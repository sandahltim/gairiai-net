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
const STAGES = ['load', 'hear', 'solo', 'choose', 'resolve'];
const SEAT_INTERVALS = { S: 12, A: 5, T: 0, B: -7, Lead: 16, Swing: 9 };

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
  briefingCopy: document.getElementById('briefingCopy'),
  venueCopy: document.getElementById('venueCopy'),
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
  currentStage: 'load',
  resolution: null,
  audioContext: null,
  isPlaying: false,
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
  const gameState = createGameState({ ...state.progress, seed, mode: 'solo' });
  state.round = createRound(gameState);
  state.selectedSuspectId = null;
  state.currentStage = 'hear';
  state.resolution = null;
  render();
}

function restartRun() {
  state.progress = {
    ...state.progress,
    score: 0,
    streak: 0,
    round: 1,
    mode: 'solo',
  };
  saveProgress();
  newRound(Date.now());
}

function render() {
  renderStats();
  renderStages();
  renderRound();
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
    els.briefingCopy.textContent = 'Tap start. Then trust your ears.';
    els.venueCopy.textContent = 'The saboteur will bend rhythm, pitch, or blend.';
    els.hearRoomBtn.disabled = true;
    els.revealSecretBtn.disabled = true;
    return;
  }

  els.focusBadge.textContent = `${state.round.focus} focus`;
  els.briefingCopy.textContent = `${state.round.ensemble} • Round ${state.round.roundNumber}`;
  els.venueCopy.textContent = `${state.round.venue}. ${state.round.suspects.length} singers. ${state.round.evidence.length} clues. One of them is wrong.`;
  els.hearRoomBtn.disabled = state.isPlaying;
  els.revealSecretBtn.disabled = state.isPlaying;
  els.revealSecretBtn.textContent = state.round.focus === 'pitch' ? 'Hear pure chord' : state.round.focus === 'rhythm' ? 'Hear click grid' : 'Hear clean blend';
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
        <button class="listen-btn" data-listen="${suspect.id}">Listen</button>
        <button class="select-btn" data-select="${suspect.id}">${state.selectedSuspectId === suspect.id ? 'Chosen' : 'Pick'}</button>
      </div>
    `;
    els.suspectList.appendChild(card);
  });

  els.voteBtn.disabled = !state.selectedSuspectId || state.isPlaying;
}

function renderResult() {
  if (!state.resolution) {
    els.resultCopy.textContent = 'Hear the room, audition suspects, then call it.';
    els.continueBtn.disabled = true;
    return;
  }

  const verdict = state.resolution.correct ? 'Nailed it.' : 'Missed it.';
  els.resultCopy.textContent = `${verdict} ${state.resolution.correct ? `+${state.resolution.scoreDelta}` : `${state.resolution.scoreDelta}`} — ${state.resolution.culpritName} was the saboteur.`;
  els.continueBtn.disabled = false;
}

function renderUnlocks() {
  const unlocks = listUnlocks(state.progress.unlockTier);
  els.unlockList.textContent = `Unlocked: ${unlocks.venues.join(' • ')}`;
}

function setStage(stage) {
  state.currentStage = stage;
  renderStages();
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

  intervals.forEach((interval, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(noteFrequency(interval, root), now);
    osc.detune.setValueAtTime(detune + index * 3, now);
    envelope(gain, now, 0.02, Math.max(0.16, duration - 0.08), 0.08);
    osc.connect(gain).connect(ctx.destination);
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

  pattern.forEach((pulse, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(root * pulse, now + index * 0.19);
    osc.detune.setValueAtTime(detune, now + index * 0.19);
    envelope(gain, now + index * 0.19, 0.01, 0.08, 0.11);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + index * 0.19);
    osc.stop(now + index * 0.19 + 0.12);
  });
}

async function playClue(clue) {
  if (clue.cue.family === 'rhythm') {
    await playPulse(clue.cue.pattern, {
      root: 190 + clue.intensity * 18,
      waveform: clue.isSabotaged ? 'square' : 'triangle',
      detune: clue.cue.detune,
    });
    return;
  }

  await playChord(clue.cue.intervals, {
    root: 180 + clue.intensity * 14,
    waveform: clue.isSabotaged ? 'sawtooth' : 'triangle',
    detune: clue.cue.detune,
    duration: 0.72,
  });
}

async function playReference() {
  if (!state.round || state.isPlaying) return;
  const focus = state.round.focus;
  setStage('hear');
  state.isPlaying = true;
  renderRound();
  if (focus === 'rhythm') {
    await playPulse([1, 1, 1, 1], { root: 210, waveform: 'triangle', detune: 0 });
  } else if (focus === 'pitch') {
    await playChord([0, 4, 7], { root: 210, waveform: 'sine', detune: 0, duration: 0.8 });
  } else {
    await playChord([0, 4, 9], { root: 200, waveform: 'triangle', detune: 0, duration: 0.8 });
  }
  setTimeout(() => {
    state.isPlaying = false;
    renderRound();
    renderSuspects();
  }, 860);
}

async function playRoomMix() {
  if (!state.round || state.isPlaying) return;
  setStage('hear');
  state.isPlaying = true;
  renderRound();
  renderSuspects();

  const cues = [...state.round.evidence];
  for (const clue of cues) {
    await playClue(clue);
    await wait(420);
  }

  state.isPlaying = false;
  setStage('solo');
  renderRound();
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
      : { ...clue.cue, intervals: (clue.cue.intervals ?? [0, 4, 7]).map((i) => i + Math.round(seatOffset / 12)) },
    intensity: Math.max(1, Math.min(5, clue.intensity + Math.floor(suspect.confidence / 3))),
  };

  await playClue(syntheticClue);
  await wait(360);
  state.isPlaying = false;
  renderRound();
  renderSuspects();
}

function chooseSuspect(suspectId) {
  state.selectedSuspectId = suspectId;
  setStage('choose');
  renderSuspects();
}

async function lockVote() {
  if (!state.round || !state.selectedSuspectId || state.isPlaying) return;
  state.resolution = resolveVote(state.progress, state.round, state.selectedSuspectId);
  state.progress = advanceProgress(state.progress, state.resolution);
  saveProgress();
  setStage('resolve');
  renderStats();
  renderResult();
  renderUnlocks();
  await playVerdict(state.resolution.correct);
}

async function playVerdict(correct) {
  if (correct) {
    await playChord([0, 4, 7, 12], { root: 230, waveform: 'triangle', duration: 0.72 });
    return;
  }
  await playChord([0, 3, 6, 10], { root: 180, waveform: 'square', detune: -12, duration: 0.72 });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function bindEvents() {
  els.nextRoundBtn.addEventListener('click', () => {
    newRound(Date.now());
    ensureAudio();
  });

  els.howToBtn.addEventListener('click', () => {
    els.howToCopy.classList.toggle('hidden');
  });

  els.resetBtn.addEventListener('click', () => {
    localStorage.removeItem(SAVE_KEY);
    state.progress = loadProgress();
    newRound(Date.now());
  });

  els.hearRoomBtn.addEventListener('click', playRoomMix);
  els.revealSecretBtn.addEventListener('click', playReference);

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

  els.voteBtn.addEventListener('click', lockVote);
  els.continueBtn.addEventListener('click', () => newRound(Date.now()));
  els.replayBtn.addEventListener('click', restartRun);
}

bindEvents();
render();
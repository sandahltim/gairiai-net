const NAMES = [
  'Aria Vale',
  'Theo Brass',
  'Mina Pulse',
  'Juno Reed',
  'Sable Quill',
  'Nova Bell',
  'Iris Tempo',
  'Cass Loom',
  'Felix Drone',
  'Lena Vox',
  'Rowan Static',
  'Piper Echo',
  'Alex Cadenza',
  'Milo Lantern',
  'Rhea Chorus',
  'Ember Lyric',
  'Dorian Hush',
  'Skye Motet',
];

const VENUES = [
  'Basement Rehearsal',
  'Cathedral Warmup',
  'Backstage Panic',
  'Moonlit Soundcheck',
  'Underground Choir Loft',
  'Neon Orchestra Pit',
];

const ENSEMBLES = [
  'Glassnote Choir',
  'Velvet Signal',
  'Night Shift Quartet',
  'Starling Ensemble',
  'Silver Room Singers',
  'Afterglow Chorus',
];

const FOCUSES = ['rhythm', 'pitch', 'blend'];

const SABOTAGE_BY_FOCUS = {
  rhythm: ['rushes the entrance', 'drags the final bar', 'hides behind the downbeat'],
  pitch: ['sings the third a shade flat', 'leans sharp on the sustained note', 'turns the cadence sour'],
  blend: ['sticks out with a harsh edge', 'drops out when the harmony lands', 'pushes way too much vibrato'],
};

const CLEAN_BY_FOCUS = {
  rhythm: ['locks to the pulse', 'lands the cutoff clean', 'keeps the groove tight'],
  pitch: ['nails the center of the note', 'supports the chord perfectly', 'rings in tune'],
  blend: ['melts into the section', 'supports the lead without showing off', 'balances the chord with warmth'],
};

const GUILTY_TELLS = {
  rhythm: ['ghosts the prep beat before entrances', 'rushes the consonants when pressure spikes', 'tenses up right before the cutoff'],
  pitch: ['checks the piano then still drifts', 're-centers too late after exposed notes', 'smiles through a note that clearly sours'],
  blend: ['pushes extra shimmer to hide in the chord', 'leans out of the section when the texture thickens', 'widens vibrato whenever attention lands on them'],
};

const CLEAN_TELLS = {
  rhythm: ['breathes with the section', 'lands releases with the conductor', 'keeps consonants unified'],
  pitch: ['settles quickly after leaps', 'tracks tuning from the center of the chord', 'adjusts without panicking'],
  blend: ['shades tone to match the room', 'stays present without poking through', 'supports the line with calm posture'],
};

function normalizeInteger(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : fallback;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6D2B79F5;
    let result = Math.imul(t ^ (t >>> 15), t | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function pickMany(list, count, rng) {
  const pool = [...list];
  const selected = [];
  while (selected.length < count && pool.length) {
    const index = Math.floor(rng() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

export function createGameState(overrides = {}) {
  const round = Math.max(1, normalizeInteger(overrides.round, 1));
  const seed = normalizeInteger(overrides.seed, Date.now());
  const unlockTier = Math.max(1, normalizeInteger(overrides.unlockTier, 1));
  return {
    mode: overrides.mode === 'pass-play' ? 'pass-play' : 'solo',
    round,
    seed,
    score: normalizeInteger(overrides.score, 0),
    streak: normalizeInteger(overrides.streak, 0),
    bestScore: normalizeInteger(overrides.bestScore, 0),
    longestStreak: normalizeInteger(overrides.longestStreak, 0),
    unlockTier,
    venueIndex: normalizeInteger(overrides.venueIndex, (round + unlockTier) % VENUES.length),
  };
}

export function createRound(state) {
  const rng = mulberry32(state.seed + state.round * 101 + state.unlockTier * 17);
  const focus = FOCUSES[(state.round + state.unlockTier + Math.floor(rng() * 8)) % FOCUSES.length];
  const difficulty = Math.min(7, Math.max(1, state.round + state.unlockTier - 1));
  const suspectCount = 4 + (difficulty >= 4 ? 1 : 0) + (difficulty >= 6 ? 1 : 0);
  const selectedNames = pickMany(NAMES, suspectCount, rng);
  const saboteurIndex = Math.floor(rng() * selectedNames.length);
  const suspects = selectedNames.map((name, index) => ({
    id: `suspect-${state.round}-${index}`,
    name,
    seat: ['S', 'A', 'T', 'B', 'Lead', 'Swing'][index],
    confidence: Math.max(1, Math.min(5, state.round + 1 + Math.floor(rng() * 3))),
    tells: pickMany(index === saboteurIndex ? GUILTY_TELLS[focus] : CLEAN_TELLS[focus], 3, rng),
    isSaboteur: index === saboteurIndex,
  }));
  const venue = VENUES[(state.round + state.unlockTier) % VENUES.length];
  const ensemble = ENSEMBLES[(state.round * 2 + state.unlockTier) % ENSEMBLES.length];

  const round = {
    id: `round-${state.round}-${state.seed}`,
    stage: 'briefing',
    mode: state.mode,
    roundNumber: state.round,
    focus,
    difficulty,
    venue,
    ensemble,
    sabotageLabel: pick(SABOTAGE_BY_FOCUS[focus], rng),
    suspects,
  };

  round.evidence = buildEvidenceSet({ ...round, seed: state.seed + 7 });
  return round;
}

export function buildEvidenceSet(round) {
  const rng = mulberry32(normalizeInteger(round.seed, 1) + round.roundNumber * 43 + round.difficulty * 19);
  const saboteur = round.suspects.find((suspect) => suspect.isSaboteur) ?? round.suspects[0];
  const innocentPool = round.suspects.filter((suspect) => !suspect.isSaboteur);
  const cleanLead = innocentPool[Math.floor(rng() * innocentPool.length)] ?? round.suspects[1] ?? saboteur;
  const alternateClean = innocentPool.find((suspect) => suspect.id !== cleanLead.id) ?? cleanLead;
  const thirdClean = innocentPool.find((suspect) => suspect.id !== cleanLead.id && suspect.id !== alternateClean.id) ?? alternateClean;
  const intensityBase = Math.max(1, Math.min(5, round.difficulty));

  const clues = [
    {
      id: `${round.id}-clean-1`,
      type: round.focus,
      label: 'Anchor phrase',
      actorId: cleanLead.id,
      actorName: cleanLead.name,
      isSabotaged: false,
      intensity: Math.max(1, intensityBase - 1),
      clueText: `${cleanLead.name} ${pick(CLEAN_BY_FOCUS[round.focus], rng)}.`,
      cue: clueCue(round.focus, false),
    },
    {
      id: `${round.id}-dirty`,
      type: round.focus,
      label: 'Suspicious moment',
      actorId: saboteur.id,
      actorName: saboteur.name,
      isSabotaged: true,
      intensity: Math.min(5, intensityBase + 1),
      clueText: `${saboteur.name} ${pick(SABOTAGE_BY_FOCUS[round.focus], rng)}.`,
      cue: clueCue(round.focus, true),
    },
    {
      id: `${round.id}-clean-2`,
      type: round.focus === 'blend' ? 'pitch' : 'blend',
      label: 'Section recovery',
      actorId: alternateClean.id,
      actorName: alternateClean.name,
      isSabotaged: false,
      intensity: intensityBase,
      clueText: `${alternateClean.name} steadies the section before the cutoff.`,
      cue: clueCue(round.focus === 'blend' ? 'pitch' : 'blend', false),
    },
  ];

  if (round.difficulty >= 3) {
    clues.push({
      id: `${round.id}-cross-check`,
      type: round.focus === 'rhythm' ? 'blend' : 'rhythm',
      label: 'Cross-check phrase',
      actorId: thirdClean.id,
      actorName: thirdClean.name,
      isSabotaged: false,
      intensity: Math.min(5, intensityBase + 1),
      clueText: `${thirdClean.name} keeps the room together when the phrase almost fractures.`,
      cue: clueCue(round.focus === 'rhythm' ? 'blend' : 'rhythm', false),
    });
  }

  if (round.difficulty >= 6) {
    clues.push({
      id: `${round.id}-dirty-echo`,
      type: round.focus,
      label: 'Late reveal',
      actorId: saboteur.id,
      actorName: saboteur.name,
      isSabotaged: true,
      intensity: 5,
      clueText: `${saboteur.name} almost hides it, then the sabotage blooms right at the release.`,
      cue: clueCue(round.focus, true),
    });
  }

  return clues;
}

function clueCue(type, isSabotaged) {
  if (type === 'rhythm') {
    return isSabotaged
      ? { family: 'rhythm', pattern: [1, 0.75, 1.35, 0.8], detune: -12 }
      : { family: 'rhythm', pattern: [1, 1, 1, 1], detune: 0 };
  }
  if (type === 'pitch') {
    return isSabotaged
      ? { family: 'pitch', intervals: [0, 6, 10], detune: -28 }
      : { family: 'pitch', intervals: [0, 4, 7], detune: 0 };
  }
  return isSabotaged
    ? { family: 'blend', intervals: [0, 5, 11], detune: 18 }
    : { family: 'blend', intervals: [0, 4, 9], detune: 0 };
}

export function resolveVote(state, round, suspectId) {
  const chosen = round.suspects.find((suspect) => suspect.id === suspectId) ?? round.suspects[0];
  const culprit = round.suspects.find((suspect) => suspect.isSaboteur) ?? round.suspects[0];
  const correct = chosen.id === culprit.id;
  const scoreDelta = correct ? 30 + round.difficulty * 10 + state.streak * 5 : -15 - Math.max(0, round.difficulty - 2) * 5;
  return {
    correct,
    culpritId: culprit.id,
    culpritName: culprit.name,
    chosenId: chosen.id,
    scoreDelta,
    nextRound: state.round + 1,
    summary: correct
      ? `You caught ${culprit.name}. The ensemble resolves instead of collapsing.`
      : `${chosen.name} was innocent. ${culprit.name} slips through the harmony.`
  };
}

export function advanceProgress(progress, resolution) {
  const nextScore = Math.max(0, normalizeInteger(progress.score, 0) + normalizeInteger(resolution.scoreDelta, 0));
  const nextStreak = resolution.correct ? normalizeInteger(progress.streak, 0) + 1 : 0;
  const longestStreak = Math.max(normalizeInteger(progress.longestStreak, 0), nextStreak);
  const unlockTier = Math.max(normalizeInteger(progress.unlockTier, 1), 1 + Math.floor(longestStreak / 3));
  return {
    score: nextScore,
    streak: nextStreak,
    bestScore: Math.max(normalizeInteger(progress.bestScore, 0), nextScore),
    longestStreak,
    unlockTier,
    mode: progress.mode === 'pass-play' ? 'pass-play' : 'solo',
    round: Math.max(1, normalizeInteger(resolution.nextRound, normalizeInteger(progress.round, 1) + 1)),
  };
}

export function serializeProgress(progress) {
  return JSON.stringify({
    score: normalizeInteger(progress.score, 0),
    streak: normalizeInteger(progress.streak, 0),
    bestScore: normalizeInteger(progress.bestScore, 0),
    longestStreak: normalizeInteger(progress.longestStreak, 0),
    unlockTier: Math.max(1, normalizeInteger(progress.unlockTier, 1)),
    mode: progress.mode === 'pass-play' ? 'pass-play' : 'solo',
    round: Math.max(1, normalizeInteger(progress.round, 1)),
  });
}

export function hydrateProgress(serialized) {
  try {
    const parsed = JSON.parse(serialized);
    return {
      score: normalizeInteger(parsed.score, 0),
      streak: normalizeInteger(parsed.streak, 0),
      bestScore: normalizeInteger(parsed.bestScore, 0),
      longestStreak: normalizeInteger(parsed.longestStreak, 0),
      unlockTier: Math.max(1, normalizeInteger(parsed.unlockTier, 1)),
      mode: parsed.mode === 'pass-play' ? 'pass-play' : 'solo',
      round: Math.max(1, normalizeInteger(parsed.round, 1)),
    };
  } catch {
    return {
      score: 0,
      streak: 0,
      bestScore: 0,
      longestStreak: 0,
      unlockTier: 1,
      mode: 'solo',
      round: 1,
    };
  }
}

export function listUnlocks(unlockTier) {
  const tier = Math.max(1, normalizeInteger(unlockTier, 1));
  return {
    venues: VENUES.slice(0, Math.min(VENUES.length, tier + 2)),
    ensembles: ENSEMBLES.slice(0, Math.min(ENSEMBLES.length, tier + 2)),
    sabotageTypes: FOCUSES.slice(0, Math.min(FOCUSES.length, 1 + Math.floor((tier + 1) / 2))),
  };
}

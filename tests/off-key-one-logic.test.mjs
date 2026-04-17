import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createGameState,
  createRound,
  buildEvidenceSet,
  getRoundTimeLimit,
  resolveVote,
  advanceProgress,
  serializeProgress,
  hydrateProgress,
} from '../public/games/off-key-one/game.mjs';

test('createRound picks one saboteur and scales difficulty by round', () => {
  const state = createGameState({ mode: 'solo', seed: 12, round: 4, unlockTier: 2 });
  const round = createRound(state);

  assert.equal(round.suspects.length, 5);
  assert.equal(round.suspects.filter((suspect) => suspect.isSaboteur).length, 1);
  assert.ok(round.difficulty >= 4);
  assert.ok(['rhythm', 'pitch', 'blend'].includes(round.focus));
  assert.ok(round.evidence.every((clue) => clue.id.startsWith(`${round.id}-`)));
});

test('buildEvidenceSet creates mixed clean and sabotaged clues', () => {
  const state = createGameState({ mode: 'solo', seed: 77, round: 3, unlockTier: 1 });
  const round = createRound(state);
  const evidence = buildEvidenceSet(round);

  assert.equal(evidence.length, 4);
  assert.ok(evidence.some((clue) => clue.isSabotaged));
  assert.ok(evidence.some((clue) => !clue.isSabotaged));
  assert.ok(evidence.every((clue) => clue.intensity >= 1 && clue.intensity <= 5));
});

test('higher difficulty rounds add more suspects and late clues', () => {
  const state = createGameState({ mode: 'solo', seed: 501, round: 6, unlockTier: 2 });
  const round = createRound(state);

  assert.equal(round.suspects.length, 6);
  assert.equal(round.evidence.length, 5);
  assert.ok(round.evidence.filter((clue) => clue.isSabotaged).length >= 2);
});

test('getRoundTimeLimit shortens the clock as difficulty rises but keeps a floor', () => {
  assert.equal(getRoundTimeLimit(1), 12000);
  assert.equal(getRoundTimeLimit(4), 10500);
  assert.equal(getRoundTimeLimit(7), 9000);
  assert.equal(getRoundTimeLimit(99), 9000);
});

test('resolveVote rewards faster correct accusations and penalizes misses', () => {
  const state = createGameState({ mode: 'solo', seed: 4, round: 2, streak: 2 });
  const round = createRound(state);
  const culprit = round.suspects.find((suspect) => suspect.isSaboteur);
  const innocent = round.suspects.find((suspect) => !suspect.isSaboteur);
  const clock = getRoundTimeLimit(round.difficulty);

  const fastWin = resolveVote(state, round, culprit.id, { timeRemainingMs: clock * 0.75, roundDurationMs: clock });
  const slowWin = resolveVote(state, round, culprit.id, { timeRemainingMs: clock * 0.1, roundDurationMs: clock });
  const loss = resolveVote(state, round, innocent.id, { timeRemainingMs: clock * 0.25, roundDurationMs: clock });

  assert.equal(fastWin.correct, true);
  assert.equal(loss.correct, false);
  assert.ok(fastWin.scoreDelta > slowWin.scoreDelta);
  assert.ok(fastWin.timeBonus > slowWin.timeBonus);
  assert.ok(loss.scoreDelta < 0);
  assert.ok(fastWin.summary.includes('Fast catch'));
  assert.ok(loss.summary.includes(culprit.name));
});

test('advanceProgress grows streaks, unlock tier, and best score', () => {
  const progress = advanceProgress(
    { score: 120, streak: 2, bestScore: 90, longestStreak: 1, unlockTier: 1 },
    { correct: true, scoreDelta: 45, nextRound: 4 }
  );

  assert.equal(progress.score, 165);
  assert.equal(progress.streak, 3);
  assert.equal(progress.bestScore, 165);
  assert.equal(progress.longestStreak, 3);
  assert.equal(progress.unlockTier, 2);
  assert.equal(progress.round, 4);
});

test('serializeProgress and hydrateProgress preserve safe save data', () => {
  const payload = serializeProgress({
    score: 240,
    streak: 5,
    bestScore: 240,
    longestStreak: 5,
    unlockTier: 3,
    mode: 'pass-play',
    round: 6,
    secret: 'do-not-save',
  });

  assert.deepEqual(JSON.parse(payload), {
    score: 240,
    streak: 5,
    bestScore: 240,
    longestStreak: 5,
    unlockTier: 3,
    mode: 'pass-play',
    round: 6,
  });

  assert.deepEqual(hydrateProgress(payload), {
    score: 240,
    streak: 5,
    bestScore: 240,
    longestStreak: 5,
    unlockTier: 3,
    mode: 'pass-play',
    round: 6,
  });
});

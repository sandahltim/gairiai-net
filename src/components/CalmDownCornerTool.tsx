'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { HeartHandshake, Printer, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { ZooCharacterAvatar } from '@/components/ZooCharacterAvatar';
import { ZOO_CHARACTERS } from '@/lib/zoo-characters';

type StrategyId = 'breathe' | 'think' | 'kind' | 'wait' | 'make';
type FeelingId = 'stormy' | 'worried' | 'frustrated' | 'sad' | 'wiggly' | 'left-out';

type CalmStep = {
  title: string;
  body: string;
  cue: string;
};

type Strategy = {
  id: StrategyId;
  characterId: string;
  title: string;
  shortTitle: string;
  feelingPrompt: string;
  helperLine: string;
  teacherTip: string;
  colorClasses: string;
  ringClasses: string;
  glow: string;
  steps: CalmStep[];
};

type FeelingCard = {
  id: FeelingId;
  label: string;
  emoji: string;
  body: string;
  strategyId: StrategyId;
};

const STRATEGIES: Strategy[] = [
  {
    id: 'breathe',
    characterId: 'penguin',
    title: 'Penny Helps Me Breathe and Count',
    shortTitle: 'Breathe + Count',
    feelingPrompt: 'Best for fast feelings, big energy, and hot cheeks.',
    helperLine: 'Penny keeps her cool by slowing her breath first and counting before she moves.',
    teacherTip: 'Invite kids to hold up fingers while they breathe so the count is visible on a smartboard.',
    colorClasses: 'from-cyan-400/25 via-sky-400/20 to-blue-950/60',
    ringClasses: 'border-cyan-300/45 bg-cyan-400/10 text-cyan-50',
    glow: 'shadow-[0_20px_55px_rgba(34,211,238,0.25)]',
    steps: [
      {
        title: 'Penguin pose',
        body: 'Put your hands on your belly like Penny holding her fish.',
        cue: 'Hands still. Eyes forward.',
      },
      {
        title: 'Breathe in for 1, 2, 3',
        body: 'Smell the cold air slowly through your nose.',
        cue: 'Soft shoulders. Quiet mouth.',
      },
      {
        title: 'Blow out for 1, 2, 3, 4',
        body: 'Pretend you are fogging a snowy window.',
        cue: 'Long breath out.',
      },
      {
        title: 'Count five calm things',
        body: 'Name five things you can see or touch right now.',
        cue: 'I am calm enough for the next step.',
      },
    ],
  },
  {
    id: 'think',
    characterId: 'owl',
    title: 'Olive Helps Me Think It Through',
    shortTitle: 'Think It Through',
    feelingPrompt: 'Best for confused feelings, hurt feelings, or when a problem keeps replaying.',
    helperLine: 'Olive slows the story down so a child can name the problem, the need, and the next safe move.',
    teacherTip: 'Use this after a conflict or mistake. It works well as a short teacher-guided script.',
    colorClasses: 'from-violet-400/25 via-fuchsia-400/15 to-zinc-950/70',
    ringClasses: 'border-violet-300/45 bg-violet-400/10 text-violet-50',
    glow: 'shadow-[0_20px_55px_rgba(167,139,250,0.24)]',
    steps: [
      {
        title: 'Name the problem',
        body: 'Say what happened in one short sentence.',
        cue: 'Something happened.',
      },
      {
        title: 'Name the feeling',
        body: 'Pick one feeling word that matches your body.',
        cue: 'I feel ______.',
      },
      {
        title: 'Name the need',
        body: 'Decide if you need space, help, a turn, or a kind redo.',
        cue: 'I need ______.',
      },
      {
        title: 'Choose the next wise move',
        body: 'Ask for help, try again, or use calm words.',
        cue: 'My next safe move is ______.',
      },
    ],
  },
  {
    id: 'kind',
    characterId: 'elephant',
    title: 'Ellie Helps Me Find Someone Kind',
    shortTitle: 'Find Someone Kind',
    feelingPrompt: 'Best for lonely, worried, or stuck feelings that need connection.',
    helperLine: 'Ellie reminds kids that calm can come from finding a safe grown-up or gentle class helper.',
    teacherTip: 'Pair this with a visual of classroom helpers so students know exactly where to go next.',
    colorClasses: 'from-sky-300/25 via-cyan-300/15 to-slate-950/70',
    ringClasses: 'border-sky-300/45 bg-sky-400/10 text-sky-50',
    glow: 'shadow-[0_20px_55px_rgba(56,189,248,0.25)]',
    steps: [
      {
        title: 'Look for a kind face',
        body: 'Find your teacher, helper, or calm buddy.',
        cue: 'Who feels safe right now?',
      },
      {
        title: 'Walk close with calm feet',
        body: 'Take slow steps and keep your hands to yourself.',
        cue: 'Calm feet. Safe body.',
      },
      {
        title: 'Use a helper sentence',
        body: 'Try, "I need help," "Can you sit with me?" or "Can I have a calm minute?"',
        cue: 'Use your helper words.',
      },
      {
        title: 'Stay together until ready',
        body: 'Breathe with your helper or sit nearby until your body feels softer.',
        cue: 'I do not have to calm down alone.',
      },
    ],
  },
  {
    id: 'wait',
    characterId: 'turtle',
    title: 'Tilly Helps Me Wait Patiently',
    shortTitle: 'Wait Patiently',
    feelingPrompt: 'Best for turn-taking, line-up frustration, and big hurry feelings.',
    helperLine: 'Tilly slows the rush and teaches that waiting is an action, not just a pause.',
    teacherTip: 'Place this near transition zones so children can use it before line-up, cleanup, or snack.',
    colorClasses: 'from-emerald-400/25 via-lime-300/15 to-zinc-950/70',
    ringClasses: 'border-emerald-300/45 bg-emerald-400/10 text-emerald-50',
    glow: 'shadow-[0_20px_55px_rgba(34,197,94,0.24)]',
    steps: [
      {
        title: 'Turtle shell stillness',
        body: 'Cross your arms or hold your hands together to make a quiet shell.',
        cue: 'Still hands. Slow body.',
      },
      {
        title: 'Count the waiting job',
        body: 'Count three things you can do while you wait: stand, breathe, watch.',
        cue: 'I can do waiting work.',
      },
      {
        title: 'Watch the line move',
        body: 'Keep your eyes on the next safe spot instead of the whole room.',
        cue: 'One small step at a time.',
      },
      {
        title: 'Say the turtle promise',
        body: 'Whisper, "My turn is coming. I can wait."',
        cue: 'My turn is coming.',
      },
    ],
  },
  {
    id: 'make',
    characterId: 'bear',
    title: 'Bruno Helps Me Make Something',
    shortTitle: 'Make Something',
    feelingPrompt: 'Best for heavy feelings that need hands-on calming.',
    helperLine: 'Bruno turns upset energy into quiet making: drawing, shaping, folding, or building.',
    teacherTip: 'Keep a small basket nearby with paper, crayons, and one quiet manipulative option.',
    colorClasses: 'from-rose-400/25 via-orange-300/15 to-zinc-950/70',
    ringClasses: 'border-rose-300/45 bg-rose-400/10 text-rose-50',
    glow: 'shadow-[0_20px_55px_rgba(244,63,94,0.22)]',
    steps: [
      {
        title: 'Pick one quiet material',
        body: 'Choose paper, crayons, dough, blocks, or another soft tool.',
        cue: 'One calm tool is enough.',
      },
      {
        title: 'Make one simple thing',
        body: 'Draw a safe place, build a tiny tower, or roll one dough snake.',
        cue: 'Small making is enough.',
      },
      {
        title: 'Notice your body',
        body: 'Check if your hands, jaw, and feet feel quieter.',
        cue: 'My body feels softer.',
      },
      {
        title: 'Show or save it',
        body: 'Share it with a grown-up or place it in a calm-down basket.',
        cue: 'I made a calm choice.',
      },
    ],
  },
];

const FEELINGS: FeelingCard[] = [
  { id: 'stormy', label: 'Stormy', emoji: '⛈️', body: 'My body feels loud and fast.', strategyId: 'breathe' },
  { id: 'worried', label: 'Worried', emoji: '🌧️', body: 'I need to feel safe again.', strategyId: 'kind' },
  { id: 'frustrated', label: 'Frustrated', emoji: '🔥', body: 'Something did not go my way.', strategyId: 'think' },
  { id: 'sad', label: 'Sad', emoji: '💧', body: 'I need gentle help.', strategyId: 'kind' },
  { id: 'wiggly', label: 'Wiggly', emoji: '⚡', body: 'My body needs a reset.', strategyId: 'breathe' },
  { id: 'left-out', label: 'Left Out', emoji: '💛', body: 'I want connection.', strategyId: 'make' },
];

function clampStepIndex(index: number, total: number) {
  if (index < 0) return 0;
  if (index >= total) return total - 1;
  return index;
}

export function CalmDownCornerTool() {
  const [selectedFeelingId, setSelectedFeelingId] = useState<FeelingId>('stormy');
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyId>('breathe');
  const [stepIndex, setStepIndex] = useState(0);
  const [shareMessage, setShareMessage] = useState('');

  const strategyMap = useMemo(() => new Map(STRATEGIES.map(strategy => [strategy.id, strategy])), []);
  const characterMap = useMemo(() => new Map(ZOO_CHARACTERS.map(character => [character.id, character])), []);

  const selectedFeeling = FEELINGS.find(feeling => feeling.id === selectedFeelingId) ?? FEELINGS[0];
  const activeStrategy = strategyMap.get(selectedStrategyId) ?? STRATEGIES[0];
  const activeCharacter = characterMap.get(activeStrategy.characterId) ?? ZOO_CHARACTERS[0];
  const activeStep = activeStrategy.steps[stepIndex] ?? activeStrategy.steps[0];
  const progressPercent = Math.round(((stepIndex + 1) / activeStrategy.steps.length) * 100);

  async function shareTool() {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://gairiai.net/tools/calm-down-corner';
    const shareText = 'Free preschool calm down corner tool from Little Learners Studio';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Free Preschool Calm Down Corner Tool',
          text: shareText,
          url: shareUrl,
        });
        setShareMessage('Shared.');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Link copied for teacher friends.');
    } catch {
      setShareMessage('Sharing was skipped.');
    }
  }

  function chooseFeeling(feeling: FeelingCard) {
    setSelectedFeelingId(feeling.id);
    setSelectedStrategyId(feeling.strategyId);
    setStepIndex(0);
    setShareMessage('');
  }

  function chooseStrategy(strategyId: StrategyId) {
    setSelectedStrategyId(strategyId);
    setStepIndex(0);
    setShareMessage('');
  }

  function moveStep(delta: number) {
    setStepIndex(current => clampStepIndex(current + delta, activeStrategy.steps.length));
  }

  function resetPath() {
    setStepIndex(0);
    setShareMessage('');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/little-learners" className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-200 hover:bg-amber-400/15">
            Little Learners
          </Link>
          <Link href="/tools" className="rounded-full border border-pink-400/30 bg-pink-400/10 px-3 py-1 text-pink-200 hover:bg-pink-400/15">
            All tools
          </Link>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-100">
            Free. No login. No data collection.
          </span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">Little Learners Tool</p>
        <h1 className="zoo-fun-font mt-2 text-3xl font-black leading-tight sm:text-5xl">
          Zoo Crew <span className="gradient-text-warm">Calm Down Corner</span>
        </h1>
        <p className="mt-3 max-w-3xl text-base text-zinc-300 sm:text-lg">
          Kids pick a feeling, a Zoo Crew buddy walks them through 3 or 4 calm steps, and teachers get a matching
          printable kit for the classroom corner.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
          <a
            href="/packs/zoo-crew-calm-down-corner-free.pdf"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-amber-400/15 px-3.5 py-2 text-amber-50 hover:border-amber-200"
          >
            <Printer size={15} /> Download printable kit
          </a>
          <button
            type="button"
            onClick={shareTool}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/45 bg-cyan-400/10 px-3.5 py-2 text-cyan-50 hover:border-cyan-200"
          >
            <Share2 size={15} /> Share this tool with your teacher friends
          </button>
          {shareMessage && <span className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-zinc-200">{shareMessage}</span>}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.15fr]">
        <section className="card-glow rounded-[28px] p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">1. Start with the feeling</p>
              <h2 className="mt-1 text-xl font-black text-zinc-50">How does your body feel right now?</h2>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200/80">Suggested helper</p>
              <p className="text-sm font-semibold text-amber-50">{activeStrategy.shortTitle}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {FEELINGS.map(feeling => {
              const isActive = feeling.id === selectedFeeling.id;
              return (
                <button
                  key={feeling.id}
                  type="button"
                  onClick={() => chooseFeeling(feeling)}
                  className={`rounded-[22px] border p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    isActive
                      ? 'border-amber-200/70 bg-gradient-to-br from-amber-300/25 via-pink-300/15 to-cyan-300/10 text-white shadow-[0_12px_32px_rgba(251,191,36,0.18)]'
                      : 'border-zinc-800 bg-zinc-950/55 text-zinc-200 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-3xl">{feeling.emoji}</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300">
                      {strategyMap.get(feeling.strategyId)?.shortTitle}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-black">{feeling.label}</p>
                  <p className="mt-1 text-sm text-zinc-300">{feeling.body}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">2. Or switch to a different buddy</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {STRATEGIES.map(strategy => {
                const character = characterMap.get(strategy.characterId) ?? ZOO_CHARACTERS[0];
                const isActive = strategy.id === activeStrategy.id;
                return (
                  <button
                    key={strategy.id}
                    type="button"
                    onClick={() => chooseStrategy(strategy.id)}
                    className={`flex items-center gap-3 rounded-[20px] border px-3 py-3 text-left ${
                      isActive ? `${strategy.ringClasses} shadow-[0_0_0_2px_rgba(255,255,255,0.04)]` : 'border-zinc-800 bg-zinc-900/60 text-zinc-200'
                    }`}
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-1.5">
                      <ZooCharacterAvatar characterId={character.id} mode="classic" alt={character.name} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="font-black">{character.name}</p>
                      <p className="text-sm text-zinc-300">{strategy.shortTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`card-glow overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${activeStrategy.colorClasses} p-4 sm:p-5 ${activeStrategy.glow}`}>
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[26px] border border-white/10 bg-zinc-950/55 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-zinc-300">
                  Strategy buddy
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] ${activeStrategy.ringClasses}`}>
                  {activeStrategy.shortTitle}
                </span>
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-black/25 p-4">
                <div className="mx-auto flex h-52 w-full max-w-[240px] items-center justify-center rounded-[22px] bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_38%,transparent_68%)]">
                  <ZooCharacterAvatar
                    characterId={activeCharacter.id}
                    mode="classic"
                    alt={activeCharacter.name}
                    className="h-full w-full object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.45)]"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="zoo-fun-font text-2xl font-black text-white">{activeCharacter.name}</p>
                  <p className="mt-1 text-sm text-zinc-200">{activeCharacter.title}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-[24px] border border-white/10 bg-zinc-950/55 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Best fit for</p>
                  <p className="mt-1 text-sm text-zinc-100">{activeStrategy.feelingPrompt}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">What this buddy teaches</p>
                  <p className="mt-1 text-sm text-zinc-100">{activeStrategy.helperLine}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Teacher tip</p>
                  <p className="mt-1 text-sm text-zinc-100">{activeStrategy.teacherTip}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-zinc-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">3. Walk through the calm steps</p>
                  <h2 className="mt-1 text-2xl font-black text-white">{activeStrategy.title}</h2>
                  <p className="mt-2 text-sm text-zinc-200">
                    Feeling picked: <span className="font-semibold text-white">{selectedFeeling.label}</span> - {selectedFeeling.body}
                  </p>
                </div>
                <div className="min-w-[160px] rounded-[22px] border border-white/10 bg-black/20 px-3 py-3 text-sm text-zinc-100">
                  <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {activeStrategy.steps.map((step, index) => {
                  const isPast = index < stepIndex;
                  const isCurrent = index === stepIndex;
                  return (
                    <div
                      key={`${activeStrategy.id}-${index}`}
                      className={`rounded-[22px] border p-4 transition-all ${
                        isCurrent
                          ? 'border-amber-200/60 bg-gradient-to-r from-amber-300/20 via-pink-300/10 to-cyan-300/10'
                          : isPast
                            ? 'border-emerald-300/35 bg-emerald-400/10'
                            : 'border-zinc-800 bg-zinc-950/55'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-black ${
                            isCurrent
                              ? 'border-amber-200/70 bg-amber-300/20 text-amber-50'
                              : isPast
                                ? 'border-emerald-300/45 bg-emerald-300/15 text-emerald-50'
                                : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-black text-white">{step.title}</p>
                          <p className="mt-1 text-sm text-zinc-200">{step.body}</p>
                          <p className="mt-2 text-sm font-semibold text-amber-100">{step.cue}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Kid words for this step</p>
                <p className="mt-2 text-2xl font-black text-white">{activeStep.cue}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveStep(-1)}
                  disabled={stepIndex === 0}
                  className="rounded-xl border border-zinc-700 px-3.5 py-2 text-sm text-zinc-200 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous step
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(1)}
                  disabled={stepIndex === activeStrategy.steps.length - 1}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-200/55 bg-amber-300/15 px-3.5 py-2 text-sm font-semibold text-amber-50 hover:border-amber-100 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Sparkles size={15} /> Next calm step
                </button>
                <button
                  type="button"
                  onClick={resetPath}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/45 bg-cyan-400/10 px-3.5 py-2 text-sm text-cyan-50 hover:border-cyan-200"
                >
                  <RotateCcw size={15} /> Start this path over
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-glow rounded-[28px] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <HeartHandshake className="text-amber-300" size={20} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Printable kit</p>
              <h2 className="text-xl font-black text-zinc-50">Ready for the classroom corner</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-zinc-800 bg-zinc-950/55 p-4">
              <p className="text-sm font-black text-white">Poster</p>
              <p className="mt-2 text-sm text-zinc-300">One anchor page showing all five Zoo Crew calm strategies together.</p>
            </div>
            <div className="rounded-[22px] border border-zinc-800 bg-zinc-950/55 p-4">
              <p className="text-sm font-black text-white">Feeling check-in cards</p>
              <p className="mt-2 text-sm text-zinc-300">Print, cut, and place near the tool so kids can point before they speak.</p>
            </div>
            <div className="rounded-[22px] border border-zinc-800 bg-zinc-950/55 p-4">
              <p className="text-sm font-black text-white">Buddy step pages</p>
              <p className="mt-2 text-sm text-zinc-300">One page per strategy buddy with teacher cues and kid-friendly language.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/packs/zoo-crew-calm-down-corner-free.pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-400/10 px-3.5 py-2 text-sm font-semibold text-emerald-50 hover:border-emerald-200"
            >
              <Printer size={15} /> Open the free PDF kit
            </a>
            <Link
              href="/little-learners/2026-03-14-zoo-crew-calm-down-corner-kit"
              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-400/10 px-3.5 py-2 text-sm text-fuchsia-50 hover:border-fuchsia-200"
            >
              See the Little Learners entry
            </Link>
          </div>
        </div>

        <div className="card-glow rounded-[28px] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Why this works</p>
          <h2 className="mt-1 text-xl font-black text-zinc-50">Character-led, kid-first, and local only</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li className="rounded-[20px] border border-zinc-800 bg-zinc-950/55 px-4 py-3">
              Kids choose from visible feelings first, then get one clear next step instead of a wall of text.
            </li>
            <li className="rounded-[20px] border border-zinc-800 bg-zinc-950/55 px-4 py-3">
              The same Zoo Crew characters from Behavior Buddy keep the preschool brand lane consistent.
            </li>
            <li className="rounded-[20px] border border-zinc-800 bg-zinc-950/55 px-4 py-3">
              Nothing is stored or sent anywhere. The tool is fully local in the browser.
            </li>
            <li className="rounded-[20px] border border-zinc-800 bg-zinc-950/55 px-4 py-3">
              Teachers can run it full-screen on a smartboard and print the companion pages right away.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

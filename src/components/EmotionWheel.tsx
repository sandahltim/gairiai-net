'use client';

import { useRef, useState } from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';
import { ZooCharacterAvatar } from '@/components/ZooCharacterAvatar';
import { ZOO_CHARACTERS } from '@/lib/zoo-characters';

type ZoneId = 'green' | 'yellow' | 'blue' | 'red';

type EmotionSlice = {
  id: string;
  label: string;
  zone: ZoneId;
  color: string;
  glow: string;
  characterId: string;
  bodySignal: string;
  discussionPrompt: string;
  teacherMove: string;
};

const ZONE_COPY: Record<ZoneId, { name: string; helper: string; badge: string }> = {
  green: {
    name: 'Green Zone',
    helper: 'Steady feelings that help kids feel ready, brave, or proud.',
    badge: 'Ready to learn',
  },
  yellow: {
    name: 'Yellow Zone',
    helper: 'Wiggly feelings that need a quick pause, plan, or reminder.',
    badge: 'Need a reset',
  },
  blue: {
    name: 'Blue Zone',
    helper: 'Low-energy feelings that need comfort, connection, and care.',
    badge: 'Need comfort',
  },
  red: {
    name: 'Red Zone',
    helper: 'Big body feelings that need space, safety, and calm support.',
    badge: 'Need help now',
  },
};

const EMOTIONS: EmotionSlice[] = [
  {
    id: 'ready',
    label: 'Ready',
    zone: 'green',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.22)',
    characterId: 'lion',
    bodySignal: 'Your body feels steady and your brain feels open for the next job.',
    discussionPrompt: 'What does ready feel like in your hands, feet, or face?',
    teacherMove: 'Invite one child to show a ready body before the group starts.',
  },
  {
    id: 'proud',
    label: 'Proud',
    zone: 'green',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.22)',
    characterId: 'giraffe',
    bodySignal: 'Your chest feels tall because you did something hard and kept going.',
    discussionPrompt: 'What happened that made you feel proud today?',
    teacherMove: 'Ask for a quick celebration motion the class can copy together.',
  },
  {
    id: 'silly',
    label: 'Silly',
    zone: 'yellow',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.22)',
    characterId: 'frog',
    bodySignal: 'Your body feels bouncy and busy, and it needs help settling down.',
    discussionPrompt: 'How can a silly body get ready for listening again?',
    teacherMove: 'Lead one short wiggle-and-freeze reset before continuing.',
  },
  {
    id: 'nervous',
    label: 'Nervous',
    zone: 'yellow',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.24)',
    characterId: 'penguin',
    bodySignal: 'Your tummy feels fluttery because you are not sure what comes next.',
    discussionPrompt: 'What helps you when your body feels nervous or unsure?',
    teacherMove: 'Use first-then language and preview the next one or two steps.',
  },
  {
    id: 'sad',
    label: 'Sad',
    zone: 'blue',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.22)',
    characterId: 'elephant',
    bodySignal: 'Your body feels heavy and your heart wants a gentle place to rest.',
    discussionPrompt: 'Who or what helps you when you feel sad?',
    teacherMove: 'Offer a connection choice like a buddy, soft voice, or quiet seat nearby.',
  },
  {
    id: 'lonely',
    label: 'Lonely',
    zone: 'blue',
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.22)',
    characterId: 'bunny',
    bodySignal: 'You want to be close to someone kind because being alone feels hard.',
    discussionPrompt: 'How can our class help someone who is feeling lonely?',
    teacherMove: 'Prompt children to name one inviting move a classmate could make.',
  },
  {
    id: 'frustrated',
    label: 'Frustrated',
    zone: 'red',
    color: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.22)',
    characterId: 'owl',
    bodySignal: 'Something feels hard, stuck, or unfair, and your body wants to quit.',
    discussionPrompt: 'What can we do when something feels too hard at first?',
    teacherMove: 'Model how to break a hard problem into one tiny next step.',
  },
  {
    id: 'angry',
    label: 'Angry',
    zone: 'red',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.24)',
    characterId: 'bear',
    bodySignal: 'Your body feels hot and loud, and it needs safety, space, and support.',
    discussionPrompt: 'What helps an angry body feel safe without hurting anyone?',
    teacherMove: 'Name a calm plan: space, breaths, and a grown-up check-in.',
  },
];

const LABEL_POSITIONS = [
  { top: '10%', left: '50%' },
  { top: '21%', left: '77%' },
  { top: '50%', left: '89%' },
  { top: '78%', left: '77%' },
  { top: '89%', left: '50%' },
  { top: '78%', left: '23%' },
  { top: '50%', left: '11%' },
  { top: '21%', left: '23%' },
];

function getCharacter(characterId: string) {
  return ZOO_CHARACTERS.find(character => character.id === characterId) ?? ZOO_CHARACTERS[0];
}

export function EmotionWheel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeEmotion = EMOTIONS[activeIndex];
  const activeZone = ZONE_COPY[activeEmotion.zone];
  const activeCharacter = getCharacter(activeEmotion.characterId);

  function clearSpinTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function spinWheel() {
    if (isSpinning) return;

    clearSpinTimeout();

    const nextIndex = Math.floor(Math.random() * EMOTIONS.length);
    const turns = 5 + Math.floor(Math.random() * 3);
    const segmentSize = 360 / EMOTIONS.length;
    const nextRotation = spinCount * 360 + turns * 360 + (360 - nextIndex * segmentSize);

    setIsSpinning(true);
    setSpinCount(current => current + turns + 1);
    setRotation(nextRotation);

    timeoutRef.current = setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsSpinning(false);
      timeoutRef.current = null;
    }, 4600);
  }

  function resetWheel() {
    clearSpinTimeout();
    setIsSpinning(false);
    setRotation(0);
    setSpinCount(0);
    setActiveIndex(0);
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#fefce8_0%,_#fff7ed_38%,_#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/88 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:px-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Circle Time Tool
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  Zoo Crew Emotion Wheel
                </span>
              </div>

              <div className="max-w-2xl">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                  Spin for a feeling, then talk about what that feeling feels like.
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
                  This version is built for whole-group discussion. Spin the wheel, land on a Zoo Crew friend, and use the prompt
                  card to help kids notice body signals, name the emotion, and practice one calm classroom move together.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-inner shadow-white/80">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white shadow-sm"
                      style={{ boxShadow: `0 18px 36px ${activeEmotion.glow}` }}
                    >
                      <ZooCharacterAvatar
                        characterId={activeEmotion.characterId}
                        mode="classic"
                        alt={activeCharacter.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Wheel Result</p>
                      <h2 className="text-2xl font-black text-slate-900">{activeEmotion.label}</h2>
                      <p className="text-sm font-semibold" style={{ color: activeEmotion.color }}>
                        {activeZone.name} · {activeCharacter.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-700">{activeEmotion.bodySignal}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isSpinning ? 'Spinning...' : 'Spin the wheel'}
                  </button>
                  <button
                    type="button"
                    onClick={resetWheel}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">1. Spin</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">Let the wheel choose the feeling instead of asking every child to decide alone.</p>
                </div>
                <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">2. Notice</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">Read the body clue out loud and ask children where they feel it in their bodies.</p>
                </div>
                <div className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">3. Practice</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">Use the prompt card to practice one quick classroom move before the next activity.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="relative mx-auto flex w-full max-w-[460px] justify-center">
                <div className="absolute top-0 z-20 flex -translate-y-2 items-center justify-center">
                  <div className="h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-slate-900 drop-shadow-[0_14px_18px_rgba(15,23,42,0.25)]" />
                </div>

                <div className="relative mt-8 aspect-square w-full max-w-[430px]">
                  <div
                    className="absolute inset-0 rounded-full border-[14px] border-white shadow-[0_26px_70px_rgba(15,23,42,0.16)]"
                    style={{
                      background: `conic-gradient(
                        ${EMOTIONS[0].color} 0deg 45deg,
                        ${EMOTIONS[1].color} 45deg 90deg,
                        ${EMOTIONS[2].color} 90deg 135deg,
                        ${EMOTIONS[3].color} 135deg 180deg,
                        ${EMOTIONS[4].color} 180deg 225deg,
                        ${EMOTIONS[5].color} 225deg 270deg,
                        ${EMOTIONS[6].color} 270deg 315deg,
                        ${EMOTIONS[7].color} 315deg 360deg
                      )`,
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning
                        ? 'transform 4.6s cubic-bezier(0.12, 0.82, 0.12, 1)'
                        : 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    {EMOTIONS.map((emotion, index) => {
                      const character = getCharacter(emotion.characterId);
                      const position = LABEL_POSITIONS[index];
                      return (
                        <div
                          key={emotion.id}
                          className="absolute flex w-[92px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center sm:w-[104px]"
                          style={position}
                        >
                          <div className="rounded-full border border-white/80 bg-white/88 px-3 py-1 shadow-sm backdrop-blur">
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-800 sm:text-xs">
                              {emotion.label}
                            </p>
                          </div>
                          <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white/70 shadow-sm sm:h-12 sm:w-12">
                            <span className="text-xl sm:text-2xl" aria-hidden="true">
                              {character.emoji}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[10px] border-white bg-slate-900 text-center text-white shadow-[0_18px_40px_rgba(15,23,42,0.3)] sm:h-32 sm:w-32">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300">Land On</p>
                        <p className="mt-2 text-lg font-black sm:text-xl">{activeEmotion.label}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <div
                  className="rounded-[28px] border border-white/70 p-5 text-slate-900 shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
                  style={{ background: `linear-gradient(135deg, white 0%, ${activeEmotion.glow} 100%)` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">What does this feel like?</p>
                  <h3 className="mt-3 text-2xl font-black text-slate-900">{activeEmotion.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{activeEmotion.bodySignal}</p>
                  <div className="mt-5 rounded-[20px] bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Discussion Prompt</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{activeEmotion.discussionPrompt}</p>
                  </div>
                  <div className="mt-4 rounded-[20px] border border-slate-200 bg-white/90 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Teacher Move</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{activeEmotion.teacherMove}</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Zone Helper</p>
                  <h3 className="mt-3 text-2xl font-black">{activeZone.name}</h3>
                  <p className="mt-2 text-sm font-semibold" style={{ color: activeEmotion.color }}>
                    {activeZone.badge}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{activeZone.helper}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {Object.entries(ZONE_COPY).map(([zoneId, zoneCopy]) => {
                      const emotionForZone = EMOTIONS.find(emotion => emotion.zone === zoneId) ?? EMOTIONS[0];
                      return (
                        <div
                          key={zoneId}
                          className={`rounded-2xl border px-3 py-3 ${
                            activeEmotion.zone === zoneId ? 'border-white/70 bg-white/14' : 'border-white/10 bg-white/6'
                          }`}
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: emotionForZone.color }}>
                            {zoneCopy.name}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-300">{zoneCopy.badge}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

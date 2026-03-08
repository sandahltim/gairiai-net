'use client';

import Link from 'next/link';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles, RotateCcw, Save, Pencil, CheckCircle2, Printer } from 'lucide-react';
import { ZOO_CHARACTERS, ZOO_CHARACTER_NAMES, type ZooCharacter } from '@/lib/zoo-characters';

const STORAGE_NAMES = 'classroom-zoo:names';
const STORAGE_DONE = 'classroom-zoo:done';

const DEMO_NAMES = ['Ava', 'Noah', 'Mila', 'Luca', 'Ivy', 'Mason', 'Nora', 'Eli'];

const ANIMALS = ZOO_CHARACTERS;

function parseNames(input: string): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  input
    .split(/[\n,]+/)
    .map(name => name.trim())
    .filter(Boolean)
    .forEach(name => {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        normalized.push(name);
      }
    });

  return normalized;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
};

export default function ClassroomZooPage() {
  const [names, setNames] = useState<string[]>([]);
  const [doneNames, setDoneNames] = useState<string[]>([]);
  const [editorText, setEditorText] = useState('');
  const [editing, setEditing] = useState(true);
  const [listError, setListError] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState<ZooCharacter>(ANIMALS[0]);
  const [showPrintCard, setShowPrintCard] = useState(false);

  const characterRosterText = useMemo(() => ZOO_CHARACTER_NAMES.join(', '), []);
  const printTagline = useMemo(() => {
    if (!winner) return '';
    return activeAnimal.tagline.replace('{student}', winner);
  }, [activeAnimal.tagline, winner]);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const remainingNames = useMemo(
    () => names.filter(name => !doneNames.includes(name)),
    [names, doneNames],
  );

  useEffect(() => {
    let nextNames: string[] = [];
    let nextDoneNames: string[] = [];
    let nextEditorText = '';
    let nextEditing = true;

    try {
      const savedNames = localStorage.getItem(STORAGE_NAMES);
      const savedDone = localStorage.getItem(STORAGE_DONE);

      if (savedNames) {
        const parsed = JSON.parse(savedNames) as string[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          nextNames = parsed;
          nextEditorText = parsed.join('\n');
          nextEditing = false;
        }
      }

      if (savedDone) {
        const parsedDone = JSON.parse(savedDone) as string[];
        if (Array.isArray(parsedDone)) {
          nextDoneNames = parsedDone;
        }
      }
    } catch {
      // ignore localStorage parse errors and continue with empty state
    }

    nextDoneNames = nextDoneNames.filter(name => nextNames.includes(name));

    startTransition(() => {
      setNames(nextNames);
      setDoneNames(nextDoneNames);
      setEditorText(nextEditorText);
      setEditing(nextEditing);
    });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (names.length > 0) {
      localStorage.setItem(STORAGE_NAMES, JSON.stringify(names));
    } else {
      localStorage.removeItem(STORAGE_NAMES);
    }
  }, [names]);

  useEffect(() => {
    if (doneNames.length > 0) {
      localStorage.setItem(STORAGE_DONE, JSON.stringify(doneNames));
    } else {
      localStorage.removeItem(STORAGE_DONE);
    }
  }, [doneNames]);

  function saveClassList() {
    const parsed = parseNames(editorText);
    if (parsed.length === 0) {
      setListError('Add at least one student name before saving.');
      return;
    }

    setNames(parsed);
    setDoneNames(prev => prev.filter(name => parsed.includes(name)));
    setListError('');
    setEditing(false);
  }

  function loadDemoClass() {
    setEditorText(DEMO_NAMES.join('\n'));
    setListError('');
  }

  function useDemoClass() {
    const demoList = [...DEMO_NAMES];
    setNames(demoList);
    setDoneNames([]);
    setWinner(null);
    setPreviewName('');
    setShowPrintCard(false);
    setEditorText(demoList.join('\n'));
    setListError('');
    setEditing(false);
  }

  function clearClassList() {
    setNames([]);
    setDoneNames([]);
    setWinner(null);
    setPreviewName('');
    setShowPrintCard(false);
    setEditorText('');
    setListError('');
    setEditing(true);
  }

  function resetRound() {
    setDoneNames([]);
    setWinner(null);
    setPreviewName('');
    setShowPrintCard(false);
  }

  function toggleDone(name: string) {
    setDoneNames(prev => (prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]));
  }

  function burstConfetti() {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width));
    canvas.height = Math.max(1, Math.floor(rect.height));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#22d3ee', '#f59e0b', '#ec4899', '#a78bfa', '#34d399', '#f43f5e'];

    const particles: ConfettiParticle[] = Array.from({ length: 110 }, () => ({
      x: canvas.width * 0.5,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 7,
      vy: -Math.random() * 5 - 2,
      size: Math.random() * 7 + 4,
      color: randomItem(colors),
      life: 1,
    }));

    const gravity = 0.16;
    const drag = 0.994;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;

      particles.forEach(particle => {
        if (particle.life <= 0) return;
        alive += 1;

        particle.vx *= drag;
        particle.vy += gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.012;

        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size * 0.6);
      });

      ctx.globalAlpha = 1;

      if (alive > 0) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    tick();
  }

  function spinTheZoo() {
    if (isSpinning || remainingNames.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setShowPrintCard(false);

    const localPool = [...remainingNames];

    let ticks = 0;
    const ticker = window.setInterval(() => {
      ticks += 1;
      setPreviewName(randomItem(localPool));
      if (ticks > 26) {
        window.clearInterval(ticker);
      }
    }, 90);

    window.setTimeout(() => {
      window.clearInterval(ticker);

      const selectedName = randomItem(localPool);
      const candidateAnimals = ANIMALS.filter(animal => animal.id !== activeAnimal.id);
      const selectedAnimal = candidateAnimals.length > 0 ? randomItem(candidateAnimals) : activeAnimal;

      setPreviewName(selectedName);
      setWinner(selectedName);
      setActiveAnimal(selectedAnimal);
      setDoneNames(prev => (prev.includes(selectedName) ? prev : [...prev, selectedName]));
      setIsSpinning(false);
      burstConfetti();
    }, 2600);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
          <Link href="/little-learners" className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-200 hover:bg-amber-400/15">
            Little Learners
          </Link>
          <Link href="/tools" className="rounded-full border border-pink-400/30 bg-pink-400/10 px-3 py-1 text-pink-200 hover:bg-pink-400/15">
            All tools
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80 font-semibold">Little Learners Tool</p>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight mt-2">
          Classroom Zoo <span className="gradient-text-warm">Name Picker</span>
        </h1>
        <p className="text-zinc-400 mt-3 max-w-3xl">
          Meet the full Classroom Zoo cast — <strong>{characterRosterText}</strong> — then tap <strong>Spin the Zoo!</strong>
          to pick a student with a joyful reveal. Names and progress save on this device for daily classroom use.
        </p>
        <p className="text-zinc-500 mt-2 max-w-2xl text-sm">
          Built for quick teacher setup, smartboard visibility, and easy re-use during the school day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 sm:gap-5">
        <section className="card-glow rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-zinc-100">Class List</h2>
            <button
              type="button"
              onClick={() => {
                setEditing(prev => !prev);
                setListError('');
              }}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              <Pencil size={14} /> {editing ? 'Close' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div>
              <label htmlFor="class-list" className="text-sm text-zinc-400 block mb-2">
                One student name per line (commas also work)
              </label>
              <textarea
                id="class-list"
                value={editorText}
                onChange={event => {
                  setEditorText(event.target.value);
                  if (listError) setListError('');
                }}
                placeholder={'Ava\nNoah\nMila\nLuca'}
                className="w-full min-h-[180px] rounded-xl bg-black/30 border border-zinc-700 px-3 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={loadDemoClass}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-3 py-2 text-xs"
                >
                  Load demo names
                </button>
                <button
                  type="button"
                  onClick={useDemoClass}
                  className="inline-flex items-center justify-center rounded-xl border border-cyan-500/60 bg-cyan-500/10 hover:border-cyan-400 text-cyan-100 hover:text-white px-3 py-2 text-xs"
                >
                  Use demo class now
                </button>
              </div>
              <button
                type="button"
                onClick={saveClassList}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5"
              >
                <Save size={16} /> Save class list
              </button>
              {listError && <p className="mt-2 text-xs text-rose-300">{listError}</p>}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-zinc-300">{remainingNames.length} students left this round</span>
              </div>

              <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2">
                {names.length === 0 ? (
                  <p className="text-sm text-zinc-500">Add your class list to start spinning.</p>
                ) : (
                  names.map(name => {
                    const done = doneNames.includes(name);
                    return (
                      <label
                        key={name}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${
                          done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-black/20 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleDone(name)}
                          className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className={`${done ? 'line-through opacity-70' : ''}`}>{name}</span>
                      </label>
                    );
                  })
                )}
              </div>

              <button
                type="button"
                onClick={resetRound}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white py-2"
              >
                <RotateCcw size={15} /> Reset round (allow repeats again)
              </button>
              <button
                type="button"
                onClick={clearClassList}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-700/60 hover:border-rose-500 text-rose-200 hover:text-rose-100 py-2"
              >
                Clear saved class list
              </button>
            </div>
          )}
        </section>

        <section className="card-glow rounded-2xl p-4 sm:p-5 relative overflow-hidden min-h-[430px]">
          <canvas ref={confettiCanvasRef} className="pointer-events-none absolute inset-0 z-20" />

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <p className="text-sm text-zinc-500">Today&apos;s picker host</p>
              <p className="font-bold text-zinc-100">{activeAnimal.name} {activeAnimal.emoji}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 print-card-controls">
              {winner && (
                <button
                  type="button"
                  onClick={() => setShowPrintCard(true)}
                  className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 border border-cyan-400/50 text-cyan-100 hover:text-white hover:border-cyan-300"
                >
                  <Printer size={16} /> Print Card
                </button>
              )}
              <button
                type="button"
                onClick={spinTheZoo}
                disabled={isSpinning || remainingNames.length === 0}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-black font-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} /> {isSpinning ? 'Spinning...' : 'Spin the Zoo!'}
              </button>
            </div>
          </div>

          {names.length === 0 && (
            <div className="mb-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-cyan-100">Need a quick demo? Load a sample class instantly.</p>
              <button
                type="button"
                onClick={useDemoClass}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/60 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:border-cyan-300 hover:text-white"
              >
                Use demo class
              </button>
            </div>
          )}

          <div className="relative rounded-2xl border border-zinc-800 bg-black/30 min-h-[320px] flex flex-col items-center justify-center p-4">
            <div className={`relative ${winner ? 'zoo-wiggle' : ''}`}>
              <Image
                src={activeAnimal.image}
                alt={`${activeAnimal.name} classroom mascot`}
                width={360}
                height={360}
                priority
                className={`w-[220px] sm:w-[300px] h-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.5)] ${isSpinning ? 'opacity-85' : ''}`}
              />

              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-2xl border border-white/20 px-5 py-2 shadow-2xl"
                style={{ backgroundColor: `${activeAnimal.accent}D9` }}
              >
                <p
                  aria-live="polite"
                  className="max-w-[min(70vw,20rem)] sm:max-w-[24rem] text-center text-black font-black text-2xl sm:text-4xl tracking-wide whitespace-normal break-words leading-tight"
                >
                  {isSpinning ? (previewName || '...') : (winner || 'Ready?')}
                </p>
              </div>
            </div>

            <p className="mt-8 text-lg sm:text-xl font-black text-zinc-100 text-center">
              {activeAnimal.name} {activeAnimal.emoji}
            </p>

            <p className="mt-2 text-sm text-zinc-500 text-center max-w-sm">
              {remainingNames.length === 0 && names.length > 0
                ? 'Everyone has been picked! Reset the round to spin again.'
                : 'Press spin for a random student. Picked students auto-check off to avoid repeats.'}
            </p>
          </div>
        </section>
      </div>

      {winner && showPrintCard && (
        <section className="mt-5 card-glow rounded-2xl p-4 sm:p-5 print-card-shell">
          <div className="print-card-controls mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-zinc-400">Print preview ready. Use browser print for a half-sheet classroom card.</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 border border-emerald-400/60 text-emerald-100 hover:text-white hover:border-emerald-300"
            >
              <Printer size={16} /> Open print dialog
            </button>
          </div>

          <article className="print-card bg-white text-zinc-900 rounded-2xl border border-zinc-300 shadow-2xl overflow-hidden mx-auto">
            <div className="print-card-inner h-full flex flex-col p-6">
              <div className="flex-1 grid grid-cols-[1fr_1.15fr] gap-5 items-center">
                <div className="flex items-center justify-center">
                  <Image
                    src={activeAnimal.image}
                    alt={`${activeAnimal.name} print card mascot`}
                    width={420}
                    height={420}
                    className="h-auto w-[220px] sm:w-[250px]"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-black leading-tight">{activeAnimal.name}</p>
                  <p className="mt-2 text-sm sm:text-base text-zinc-600">{printTagline}</p>
                  <p className="mt-5 text-sm uppercase tracking-[0.15em] text-zinc-500">Today&apos;s student</p>
                  <p className="mt-2 text-4xl sm:text-5xl font-black leading-tight break-words">{winner}</p>
                </div>
              </div>

              <footer className="mt-4 pt-3 border-t border-zinc-200 text-center text-xs sm:text-sm text-zinc-600">
                🐾 Little Learners Studio · gairiai.net
              </footer>
            </div>
          </article>
        </section>
      )}

      <div className="mt-4 card-glow rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-400">
        <strong className="text-zinc-200">Teacher note:</strong> animal art has zero text embedded; all names are rendered as live page text for classroom clarity.
      </div>

      <style jsx>{`
        .zoo-wiggle {
          animation: zoo-wiggle 700ms ease-in-out 2;
        }

        .print-card {
          width: min(100%, 700px);
          aspect-ratio: 7 / 5;
          min-height: 360px;
        }

        @keyframes zoo-wiggle {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-4deg) scale(1.02); }
          50% { transform: rotate(4deg) scale(1.03); }
          75% { transform: rotate(-2deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>

      <style jsx global>{`
        @media print {
          @page {
            size: 7in 5in;
            margin: 0.15in;
          }

          body * {
            visibility: hidden !important;
          }

          .print-card,
          .print-card * {
            visibility: visible !important;
          }

          .print-card {
            position: fixed !important;
            inset: 0 !important;
            margin: auto !important;
            width: 7in !important;
            height: 5in !important;
            max-width: 7in !important;
            border-radius: 0.2in !important;
            box-shadow: none !important;
            overflow: hidden !important;
            break-inside: avoid !important;
          }

          .print-card-inner {
            padding: 0.35in !important;
          }

          .print-card-controls,
          nav,
          header,
          footer {
            display: none !important;
          }

          .print-card-shell {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

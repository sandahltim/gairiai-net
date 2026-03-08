'use client';

import Link from 'next/link';
import Image from 'next/image';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Pencil, Printer, RotateCcw, Save, Sparkles, Star, Users } from 'lucide-react';
import { ZOO_CHARACTERS } from '@/lib/zoo-characters';

type Zone = 'green' | 'yellow' | 'red';

type BuddyStudent = {
  id: string;
  name: string;
  characterId: string;
  zone: Zone;
  starDay: boolean;
};

const STORAGE_STUDENTS = 'behavior-buddy:students';
const STORAGE_DRAFT = 'behavior-buddy:draft';
const DEMO_NAMES = ['Ava', 'Noah', 'Mila', 'Luca', 'Ivy', 'Mason', 'Nora', 'Eli'];

const ZONE_ORDER: Zone[] = ['green', 'yellow', 'red'];

const ZONE_META: Record<
  Zone,
  {
    label: string;
    subtitle: string;
    chip: string;
    shell: string;
    button: string;
    activeButton: string;
    short: string;
  }
> = {
  green: {
    label: 'Green Zone',
    subtitle: 'Ready to learn',
    chip: 'border-emerald-300/45 bg-emerald-500/20 text-emerald-100',
    shell: 'border-emerald-300/35 bg-emerald-500/10',
    button: 'border-emerald-300/35 text-emerald-100 hover:border-emerald-200 hover:bg-emerald-500/20',
    activeButton: 'border-emerald-200 bg-emerald-500/30 text-emerald-50',
    short: 'Green',
  },
  yellow: {
    label: 'Yellow Zone',
    subtitle: 'Try again gently',
    chip: 'border-amber-300/45 bg-amber-500/20 text-amber-100',
    shell: 'border-amber-300/35 bg-amber-500/10',
    button: 'border-amber-300/35 text-amber-100 hover:border-amber-200 hover:bg-amber-500/20',
    activeButton: 'border-amber-200 bg-amber-500/30 text-amber-50',
    short: 'Yellow',
  },
  red: {
    label: 'Red Zone',
    subtitle: 'Needs teacher support',
    chip: 'border-rose-300/45 bg-rose-500/20 text-rose-100',
    shell: 'border-rose-300/35 bg-rose-500/10',
    button: 'border-rose-300/35 text-rose-100 hover:border-rose-200 hover:bg-rose-500/20',
    activeButton: 'border-rose-200 bg-rose-500/30 text-rose-50',
    short: 'Red',
  },
};

function parseNames(input: string): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  input
    .split(/[\n,]+/)
    .map(value => value.trim())
    .filter(Boolean)
    .forEach(value => {
      const key = value.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        normalized.push(value);
      }
    });

  return normalized;
}

function nextCharacterId(currentId: string): string {
  const index = ZOO_CHARACTERS.findIndex(character => character.id === currentId);
  if (index < 0) return ZOO_CHARACTERS[0].id;
  return ZOO_CHARACTERS[(index + 1) % ZOO_CHARACTERS.length].id;
}

export default function BehaviorBuddyPage() {
  const [students, setStudents] = useState<BuddyStudent[]>([]);
  const [draftNames, setDraftNames] = useState('');
  const [editing, setEditing] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [showStarPrint, setShowStarPrint] = useState(false);

  const characterMap = useMemo(() => new Map(ZOO_CHARACTERS.map(character => [character.id, character])), []);

  const zoneBuckets = useMemo(
    () =>
      students.reduce(
        (acc, student) => {
          acc[student.zone].push(student);
          return acc;
        },
        { green: [] as BuddyStudent[], yellow: [] as BuddyStudent[], red: [] as BuddyStudent[] },
      ),
    [students],
  );

  const starStudents = useMemo(() => students.filter(student => student.starDay), [students]);
  const starCount = starStudents.length;
  const greenRatio = students.length === 0 ? 0 : Math.round((zoneBuckets.green.length / students.length) * 100);

  useEffect(() => {
    let nextStudents: BuddyStudent[] = [];
    let nextDraft = '';
    let nextEditing = true;

    try {
      const savedStudents = localStorage.getItem(STORAGE_STUDENTS);
      const savedDraft = localStorage.getItem(STORAGE_DRAFT);

      if (savedStudents) {
        const parsed = JSON.parse(savedStudents) as BuddyStudent[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          nextStudents = parsed;
          nextDraft = parsed.map(student => student.name).join('\n');
          nextEditing = false;
        }
      }

      if (savedDraft && !nextDraft) {
        nextDraft = savedDraft;
      }
    } catch {
      // ignore parsing errors and continue with defaults
    }

    startTransition(() => {
      setStudents(nextStudents);
      setDraftNames(nextDraft);
      setEditing(nextEditing);
      setShowStarPrint(false);
    });
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(STORAGE_STUDENTS, JSON.stringify(students));
    } else {
      localStorage.removeItem(STORAGE_STUDENTS);
    }
  }, [students]);

  useEffect(() => {
    if (draftNames.trim()) {
      localStorage.setItem(STORAGE_DRAFT, draftNames);
    } else {
      localStorage.removeItem(STORAGE_DRAFT);
    }
  }, [draftNames]);

  function saveClassBoard() {
    const names = parseNames(draftNames);
    if (names.length === 0) {
      setErrorText('Add at least one student name before saving.');
      return;
    }

    const nextStudents: BuddyStudent[] = names.map((name, index) => ({
      id: `${Date.now()}-${index}-${name}`,
      name,
      characterId: ZOO_CHARACTERS[index % ZOO_CHARACTERS.length].id,
      zone: 'green',
      starDay: false,
    }));

    setStudents(nextStudents);
    setErrorText('');
    setEditing(false);
    setShowStarPrint(false);
  }

  function useDemoClass() {
    setDraftNames(DEMO_NAMES.join('\n'));
    setErrorText('');
  }

  function resetZones() {
    setStudents(prev => prev.map(student => ({ ...student, zone: 'green' })));
  }

  function clearStarDay() {
    setStudents(prev => prev.map(student => ({ ...student, starDay: false })));
    setShowStarPrint(false);
  }

  function clearBoard() {
    setStudents([]);
    setDraftNames('');
    setErrorText('');
    setEditing(true);
    setShowStarPrint(false);
  }

  function updateStudent(id: string, updater: (student: BuddyStudent) => BuddyStudent) {
    setStudents(prev => prev.map(student => (student.id === id ? updater(student) : student)));
  }

  function printStars() {
    setShowStarPrint(true);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        window.print();
      }, 120);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8 no-print">
        <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
          <Link href="/little-learners" className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-amber-200 hover:bg-amber-400/15">
            Little Learners
          </Link>
          <Link href="/tools" className="rounded-full border border-pink-400/30 bg-pink-400/10 px-3 py-1 text-pink-200 hover:bg-pink-400/15">
            All tools
          </Link>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 font-semibold">Little Learners Tool</p>
        <h1 className="zoo-fun-font text-3xl sm:text-5xl font-black leading-tight mt-2">
          Behavior Buddy <span className="gradient-text-warm">Board</span>
        </h1>
        <p className="text-zinc-300 mt-3 max-w-3xl text-base sm:text-lg">
          Smartboard-friendly behavior tracker for preschool classrooms. Tap clear zone buttons instead of arrows, celebrate green-zone wins,
          and print Star Day award cards in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 sm:gap-5 no-print">
        <section className="card-glow rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-zinc-100">Class Setup</h2>
            <button
              type="button"
              onClick={() => {
                setEditing(prev => !prev);
                setErrorText('');
              }}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
            >
              <Pencil size={14} /> {editing ? 'Close' : 'Edit'}
            </button>
          </div>

          {editing || students.length === 0 ? (
            <>
              <label htmlFor="buddy-class-list" className="text-sm text-zinc-400 block mb-2">
                One student name per line (commas also work)
              </label>
              <textarea
                id="buddy-class-list"
                value={draftNames}
                onChange={event => {
                  setDraftNames(event.target.value);
                  if (errorText) setErrorText('');
                }}
                placeholder={'Ava\nNoah\nMila\nLuca'}
                className="w-full min-h-[180px] rounded-xl bg-black/30 border border-zinc-700 px-3 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={useDemoClass}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-3 py-2 text-xs"
                >
                  Use demo class
                </button>
              </div>
              <button
                type="button"
                onClick={saveClassBoard}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5"
              >
                <Save size={16} /> Save behavior board
              </button>
              {errorText && <p className="mt-2 text-xs text-rose-300">{errorText}</p>}
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                <strong>{students.length}</strong> students loaded. Tap a zone label on each card to move behavior instantly.
              </p>
              <button
                type="button"
                onClick={resetZones}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/10 text-emerald-100 py-2 hover:border-emerald-300"
              >
                <RotateCcw size={15} /> Reset all to green
              </button>
              <button
                type="button"
                onClick={clearStarDay}
                disabled={starCount === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 text-fuchsia-100 py-2 hover:border-fuchsia-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Star size={15} /> Clear all Star Day tags
              </button>
              <button
                type="button"
                onClick={clearBoard}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-700/60 hover:border-rose-500 text-rose-200 py-2"
              >
                Clear saved board
              </button>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-zinc-700/70 bg-zinc-950/60 px-3 py-2.5 text-xs sm:text-sm text-zinc-300">
            <p className="font-semibold text-zinc-200 mb-1">Teacher workflow</p>
            <ul className="space-y-1 text-zinc-400 list-disc pl-4">
              <li>Load names once, board remembers your class</li>
              <li>Tap Green / Yellow / Red labels directly (no arrow guessing)</li>
              <li>Tap ⭐ when a student earns Star Day</li>
              <li>Print Star Day award cards with one button</li>
            </ul>
          </div>
        </section>

        <section className="card-glow rounded-2xl p-4 sm:p-5">
          <div className="mb-4 rounded-xl border border-zinc-700/70 bg-zinc-950/60 px-3 py-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-zinc-200">
                <Users size={16} />
                <span className="text-sm sm:text-base font-semibold">Live classroom board</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {ZONE_ORDER.map(zone => (
                  <span key={zone} className={`rounded-full border px-2.5 py-1 ${ZONE_META[zone].chip}`}>
                    {ZONE_META[zone].label}: <strong>{zoneBuckets[zone].length}</strong>
                  </span>
                ))}
                <span className="rounded-full border border-fuchsia-300/45 bg-fuchsia-500/20 text-fuchsia-100 px-2.5 py-1">
                  ⭐ Star Day: <strong>{starCount}</strong>
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                <span>Green Zone momentum</span>
                <strong>{greenRatio}%</strong>
              </div>
              <div className="h-3 rounded-full bg-zinc-900 border border-zinc-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-cyan-300 transition-all duration-500" style={{ width: `${greenRatio}%` }} />
              </div>
            </div>

            {starCount > 0 && (
              <div className="rounded-xl border border-fuchsia-300/35 bg-gradient-to-r from-fuchsia-500/15 via-cyan-500/10 to-amber-500/15 px-3 py-2 text-sm text-fuchsia-100">
                <Sparkles size={14} className="inline mr-1 sparkle-spin" />
                Awesome! {starCount} student{starCount === 1 ? '' : 's'} earned Star Day. Print award cards for take-home celebration.
              </div>
            )}

            {students.length > 0 && greenRatio === 100 && (
              <div className="rounded-xl border border-emerald-300/45 bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100 pulse-glow">
                🌟 Green Zone Club unlocked! Everyone is ready to learn.
              </div>
            )}

            {starCount > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={printStars}
                  className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/55 bg-fuchsia-500/20 text-fuchsia-50 px-3 py-2 text-xs font-semibold hover:bg-fuchsia-500/30"
                >
                  <Printer size={14} /> Print Star Day awards
                </button>
                <button
                  type="button"
                  onClick={() => setShowStarPrint(prev => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-3 py-2 text-xs text-zinc-200 hover:border-zinc-400"
                >
                  {showStarPrint ? 'Hide award preview' : 'Show award preview'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            {ZONE_ORDER.map(zone => (
              <article key={zone} className={`rounded-2xl border p-3 ${ZONE_META[zone].shell} flex flex-col min-h-[320px] max-h-[66vh]`}>
                <header className="mb-3">
                  <p className="zoo-fun-font text-xl font-black text-zinc-100">{ZONE_META[zone].label}</p>
                  <p className="text-xs text-zinc-300">{ZONE_META[zone].subtitle}</p>
                </header>

                <div className="space-y-2 pr-1 overflow-y-auto flex-1">
                  {zoneBuckets[zone].length === 0 ? (
                    <p className="text-xs text-zinc-400 border border-dashed border-zinc-700 rounded-xl px-2 py-3">No students in this zone.</p>
                  ) : (
                    zoneBuckets[zone].map(student => {
                      const character = characterMap.get(student.characterId) ?? ZOO_CHARACTERS[0];

                      return (
                        <div key={student.id} className="rounded-xl border border-zinc-700/80 bg-zinc-950/75 p-2.5">
                          <div className="flex items-center gap-2.5">
                            <Image
                              src={character.image}
                              alt={`${character.name} avatar`}
                              width={72}
                              height={72}
                              className={`h-14 w-14 rounded-xl border border-zinc-700 bg-zinc-900 object-contain ${student.zone === 'green' ? 'buddy-bounce' : ''}`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="zoo-fun-font text-xl font-black text-zinc-100 leading-tight truncate">{student.name}</p>
                              <p className="text-[11px] text-zinc-400 truncate">
                                {character.emoji} {character.name}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  updateStudent(student.id, current => ({
                                    ...current,
                                    characterId: nextCharacterId(current.characterId),
                                  }))
                                }
                                className="mt-1 rounded-full border border-cyan-300/35 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-100 hover:border-cyan-200"
                              >
                                Swap buddy
                              </button>
                              {student.starDay && (
                                <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-fuchsia-300/40 bg-fuchsia-500/15 px-2 py-0.5 text-[10px] text-fuchsia-100">
                                  <Star size={11} /> Star Day
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                            {ZONE_ORDER.map(targetZone => {
                              const isActive = student.zone === targetZone;
                              return (
                                <button
                                  key={`${student.id}-${targetZone}`}
                                  type="button"
                                  onClick={() => updateStudent(student.id, current => ({ ...current, zone: targetZone }))}
                                  className={`rounded-lg border py-1.5 text-[11px] font-semibold transition-colors ${
                                    isActive ? ZONE_META[targetZone].activeButton : ZONE_META[targetZone].button
                                  }`}
                                >
                                  {ZONE_META[targetZone].short}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => updateStudent(student.id, current => ({ ...current, starDay: !current.starDay }))}
                            className={`mt-1.5 w-full inline-flex items-center justify-center gap-1 rounded-lg border py-1.5 text-xs ${
                              student.starDay
                                ? 'border-fuchsia-300/60 bg-fuchsia-500/15 text-fuchsia-100'
                                : 'border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
                            }`}
                          >
                            <Star size={14} /> {student.starDay ? 'Remove Star Day' : 'Give Star Day'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {starCount > 0 && showStarPrint && (
        <section className="star-awards-shell mt-5 card-glow rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 no-print">
            <div>
              <p className="text-sm text-zinc-300">Ready-to-print take-home cards</p>
              <h2 className="zoo-fun-font text-2xl font-black text-zinc-100">Star Day Award Pack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={printStars}
                className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/55 bg-fuchsia-500/20 text-fuchsia-50 px-3 py-2 text-xs font-semibold hover:bg-fuchsia-500/30"
              >
                <Printer size={14} /> Print now
              </button>
              <button
                type="button"
                onClick={() => setShowStarPrint(false)}
                className="rounded-xl border border-zinc-600 px-3 py-2 text-xs text-zinc-200 hover:border-zinc-400"
              >
                Hide preview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 star-awards-grid">
            {starStudents.map(student => {
              const character = characterMap.get(student.characterId) ?? ZOO_CHARACTERS[0];
              return (
                <article key={`award-${student.id}`} className="star-award-card rounded-2xl border border-zinc-700 bg-white text-zinc-900 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Star Day Award</p>
                  <p className="zoo-fun-font text-2xl font-black mt-1">{character.emoji} {character.name}</p>
                  <p className="text-sm text-zinc-600">{character.tagline}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <Image
                      src={character.image}
                      alt={`${character.name} award art`}
                      width={120}
                      height={120}
                      className="h-20 w-20 rounded-xl border border-zinc-300 bg-zinc-50 object-contain"
                    />
                    <div>
                      <p className="text-xs text-zinc-500">This Star Day goes to</p>
                      <p className="zoo-fun-font text-3xl font-black leading-none">{student.name}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-zinc-500">🐾 Little Learners Studio · gairiai.net</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-4 card-glow rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-400 no-print">
        <strong className="text-zinc-200">Teacher note:</strong> character art has zero text embedded; all names and zone labels are rendered as live text for readability.
      </div>

      <style jsx>{`
        .zoo-fun-font {
          font-family: 'Baloo 2', 'Fredoka', 'Comic Sans MS', 'Trebuchet MS', 'Arial Rounded MT Bold', system-ui, sans-serif;
          letter-spacing: 0.01em;
        }

        .buddy-bounce {
          animation: buddy-bounce 1.6s ease-in-out infinite;
        }

        .sparkle-spin {
          animation: sparkle-spin 2.8s linear infinite;
        }

        .pulse-glow {
          animation: pulse-glow 1.8s ease-in-out infinite;
        }

        @keyframes buddy-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes sparkle-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }

        @media print {
          :global(body) {
            background: #ffffff !important;
          }

          :global(body *) {
            visibility: hidden;
          }

          :global(.star-awards-shell),
          :global(.star-awards-shell *) {
            visibility: visible;
          }

          :global(.star-awards-shell) {
            position: absolute;
            inset: 0;
            width: 100%;
            margin: 0;
            border: none;
            border-radius: 0;
            background: #ffffff !important;
            padding: 0.4in;
            box-shadow: none;
          }

          :global(.star-awards-grid) {
            gap: 0.2in;
          }

          :global(.star-award-card) {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none;
            border: 2px solid #111827 !important;
          }

          :global(.no-print) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

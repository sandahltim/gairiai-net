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
    studentShell: string;
    button: string;
    activeButton: string;
    short: string;
    emoji: string;
  }
> = {
  green: {
    label: 'Green Zone',
    subtitle: 'Ready to learn',
    chip: 'border-emerald-300/45 bg-emerald-500/20 text-emerald-100',
    shell: 'border-emerald-300/35 bg-gradient-to-b from-emerald-400/18 via-emerald-500/10 to-emerald-900/25',
    studentShell: 'border-emerald-200/45 bg-emerald-500/20',
    button: 'border-emerald-300/45 text-emerald-50 hover:border-emerald-100 hover:bg-emerald-400/35',
    activeButton: 'border-emerald-100 bg-emerald-300/55 text-emerald-950 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]',
    short: '🟢 Green',
    emoji: '🌟',
  },
  yellow: {
    label: 'Yellow Zone',
    subtitle: 'Try again gently',
    chip: 'border-amber-300/45 bg-amber-500/20 text-amber-100',
    shell: 'border-amber-300/35 bg-gradient-to-b from-amber-300/18 via-amber-500/10 to-amber-900/25',
    studentShell: 'border-amber-200/45 bg-amber-500/16',
    button: 'border-amber-300/45 text-amber-50 hover:border-amber-100 hover:bg-amber-300/35',
    activeButton: 'border-amber-100 bg-amber-300/55 text-amber-950 shadow-[0_0_0_2px_rgba(251,191,36,0.35)]',
    short: '🟡 Yellow',
    emoji: '☀️',
  },
  red: {
    label: 'Red Zone',
    subtitle: 'Needs teacher support',
    chip: 'border-rose-300/45 bg-rose-500/20 text-rose-100',
    shell: 'border-rose-300/35 bg-gradient-to-b from-rose-300/18 via-rose-500/10 to-rose-900/25',
    studentShell: 'border-rose-200/45 bg-rose-500/16',
    button: 'border-rose-300/45 text-rose-50 hover:border-rose-100 hover:bg-rose-300/35',
    activeButton: 'border-rose-100 bg-rose-300/55 text-rose-950 shadow-[0_0_0_2px_rgba(244,63,94,0.35)]',
    short: '🔴 Red',
    emoji: '🛟',
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

function fillCharacterTagline(tagline: string, studentName: string): string {
  return tagline.replaceAll('{student}', studentName);
}

export default function BehaviorBuddyPage() {
  const [students, setStudents] = useState<BuddyStudent[]>([]);
  const [draftNames, setDraftNames] = useState('');
  const [editing, setEditing] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [showStarPrint, setShowStarPrint] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');

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
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('Clear the whole class board? This removes all student names and progress.');
      if (!confirmed) return;
    }

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

  function triggerCelebration(message: string) {
    setCelebrationText(message);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setCelebrationText('');
      }, 1500);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8 no-print rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/18 via-fuchsia-500/14 to-amber-500/14 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
          <Link href="/little-learners" className="rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-amber-100 hover:bg-amber-400/25">
            Little Learners
          </Link>
          <Link href="/tools" className="rounded-full border border-pink-300/40 bg-pink-400/15 px-3 py-1 text-pink-100 hover:bg-pink-400/25">
            All tools
          </Link>
          <span className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 text-cyan-100">Smartboard Mode</span>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/90 font-semibold">Little Learners Tool</p>
        <h1 className="zoo-fun-font text-4xl sm:text-6xl font-black leading-tight mt-2">
          Behavior Buddy <span className="gradient-text-warm">Board</span>
        </h1>
        <p className="text-zinc-100 mt-3 max-w-4xl text-lg sm:text-2xl leading-snug">
          Big, playful classroom behavior board for ages 3-5. Tap giant color buttons, make Green Zone feel exciting, and print Star Day
          take-home cards in one click.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-emerald-200/50 bg-emerald-400/20 px-3 py-1 text-emerald-50">🎉 Kid-friendly animations</span>
          <span className="rounded-full border border-fuchsia-200/50 bg-fuchsia-400/20 px-3 py-1 text-fuchsia-50">⭐ Star Day rewards</span>
          <span className="rounded-full border border-amber-200/50 bg-amber-400/20 px-3 py-1 text-amber-50">🖨️ Printable celebration cards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 sm:gap-5 no-print">
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
          {celebrationText && (
            <div className="mb-3 rounded-2xl border border-fuchsia-200/50 bg-gradient-to-r from-fuchsia-400/30 via-cyan-400/25 to-amber-300/30 px-4 py-2.5 text-base sm:text-lg font-bold text-white celebration-pop">
              {celebrationText}
            </div>
          )}

          <div className="mb-4 rounded-2xl border border-zinc-700/70 bg-zinc-950/60 px-3 py-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-zinc-100">
                <Users size={18} />
                <span className="zoo-fun-font text-base sm:text-xl font-black">Live classroom board</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
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

            <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2.5">
              <div className="flex items-center justify-between text-sm text-emerald-100 mb-1.5">
                <span className="zoo-fun-font text-lg">Green Zone energy</span>
                <strong className="text-xl">{greenRatio}%</strong>
              </div>
              <div className="h-4 rounded-full bg-zinc-900 border border-zinc-700 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-cyan-200 transition-all duration-500" style={{ width: `${greenRatio}%` }} />
              </div>
            </div>

            {starCount > 0 && (
              <div className="rounded-xl border border-fuchsia-300/35 bg-gradient-to-r from-fuchsia-500/25 via-cyan-500/20 to-amber-500/20 px-3 py-2.5 text-base text-fuchsia-50">
                <Sparkles size={16} className="inline mr-1 sparkle-spin" />
                Awesome! {starCount} student{starCount === 1 ? '' : 's'} earned Star Day. Print award cards for take-home celebration.
              </div>
            )}

            {students.length > 0 && greenRatio === 100 && (
              <div className="rounded-xl border border-emerald-200/60 bg-emerald-400/25 px-3 py-2.5 text-base text-emerald-50 pulse-glow">
                🌟 Green Zone Club unlocked! Everyone is ready to learn.
              </div>
            )}

            {starCount > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={printStars}
                  className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/60 bg-fuchsia-500/30 text-fuchsia-50 px-3.5 py-2.5 text-sm font-semibold hover:bg-fuchsia-500/40"
                >
                  <Printer size={15} /> Print Star Day awards
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
              <article key={zone} className={`rounded-2xl border p-3.5 ${ZONE_META[zone].shell} flex flex-col min-h-[420px] max-h-[72vh]`}>
                <header className="mb-3">
                  <p className="zoo-fun-font text-2xl sm:text-3xl font-black text-zinc-50">
                    <span className="mr-1.5">{ZONE_META[zone].emoji}</span>
                    {ZONE_META[zone].label}
                  </p>
                  <p className="text-sm text-zinc-200">{ZONE_META[zone].subtitle}</p>
                </header>

                <div className="space-y-2.5 pr-1 overflow-y-auto flex-1">
                  {zoneBuckets[zone].length === 0 ? (
                    <p className="text-sm text-zinc-200/80 border border-dashed border-zinc-500 rounded-xl px-2.5 py-3.5">No students in this zone yet.</p>
                  ) : (
                    zoneBuckets[zone].map(student => {
                      const character = characterMap.get(student.characterId) ?? ZOO_CHARACTERS[0];

                      return (
                        <div key={student.id} className={`rounded-2xl border p-3 ${ZONE_META[student.zone].studentShell}`}>
                          <div className="flex items-center gap-3">
                            <Image
                              src={character.image}
                              alt={`${character.name} avatar`}
                              width={96}
                              height={96}
                              className={`h-20 w-20 rounded-2xl border border-zinc-200/30 bg-white/10 object-contain ${student.zone === 'green' ? 'buddy-bounce' : ''}`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="zoo-fun-font text-2xl sm:text-3xl font-black text-zinc-50 leading-tight break-words">{student.name}</p>
                              <p className="text-sm text-zinc-50 leading-snug break-words">
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
                                className="mt-2 rounded-xl border border-cyan-100/50 bg-cyan-500/30 px-3 py-2 text-sm font-semibold text-cyan-50 hover:border-cyan-100"
                              >
                                Swap buddy
                              </button>
                              {student.starDay && (
                                <p className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-fuchsia-200/70 bg-fuchsia-500/30 px-2.5 py-0.5 text-xs text-fuchsia-50">
                                  <Star size={12} /> Star Day Hero
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {ZONE_ORDER.map(targetZone => {
                              const isActive = student.zone === targetZone;
                              return (
                                <button
                                  key={`${student.id}-${targetZone}`}
                                  type="button"
                                  onClick={() => {
                                    if (student.zone !== targetZone && targetZone === 'green') {
                                      triggerCelebration(`🎉 ${student.name} made it to Green Zone!`);
                                    }
                                    updateStudent(student.id, current => ({ ...current, zone: targetZone }));
                                  }}
                                  className={`rounded-xl border py-3 text-base font-black transition-colors min-h-[52px] ${
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
                            onClick={() => {
                              const nextStar = !student.starDay;
                              updateStudent(student.id, current => ({ ...current, starDay: nextStar }));
                              if (nextStar) {
                                triggerCelebration(`⭐ Star Day for ${student.name}!`);
                              }
                            }}
                            className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-base font-semibold min-h-[48px] ${
                              student.starDay
                                ? 'border-fuchsia-200/75 bg-fuchsia-500/30 text-fuchsia-50'
                                : 'border-zinc-200/35 bg-zinc-900/40 text-zinc-100 hover:border-zinc-100/50'
                            }`}
                          >
                            <Star size={15} /> {student.starDay ? 'Remove Star Day' : 'Give Star Day'}
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
                  <p className="text-sm text-zinc-600">{fillCharacterTagline(character.tagline, student.name)}</p>

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

        .celebration-pop {
          animation: celebration-pop 0.35s ease-out;
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

        @keyframes celebration-pop {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
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

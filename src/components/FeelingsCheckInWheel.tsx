'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Copy, HeartPulse, Printer, RotateCcw, Share2, Sparkles, Users } from 'lucide-react';
import { ZooCharacterAvatar } from '@/components/ZooCharacterAvatar';
import { ZOO_CHARACTERS } from '@/lib/zoo-characters';

type ZoneId = 'green' | 'yellow' | 'blue' | 'red';
type FeelingId =
  | 'ready'
  | 'proud'
  | 'silly'
  | 'nervous'
  | 'frustrated'
  | 'sad'
  | 'angry'
  | 'lonely';

type Feeling = {
  id: FeelingId;
  label: string;
  zone: ZoneId;
  characterId: string;
  color: string;
  glow: string;
  wheelDescription: string;
  childScript: string;
  teacherMove: string;
};

type Zone = {
  id: ZoneId;
  name: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  helper: string;
};

type StudentCheckIn = {
  id: string;
  name: string;
  feelingId: FeelingId;
};

const ZONES: Zone[] = [
  {
    id: 'green',
    name: 'Green Zone',
    label: 'Ready to learn',
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.12)',
    border: 'rgba(134, 239, 172, 0.35)',
    helper: 'Bodies that feel steady, ready, proud, or playful.',
  },
  {
    id: 'yellow',
    name: 'Yellow Zone',
    label: 'Need a reset',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(253, 224, 71, 0.35)',
    helper: 'Bodies that feel wiggly, worried, or a little off balance.',
  },
  {
    id: 'blue',
    name: 'Blue Zone',
    label: 'Need comfort',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(125, 211, 252, 0.35)',
    helper: 'Bodies that feel low, heavy, tired, or disconnected.',
  },
  {
    id: 'red',
    name: 'Red Zone',
    label: 'Need help now',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(252, 165, 165, 0.38)',
    helper: 'Bodies that feel hot, loud, stuck, or ready to explode.',
  },
];

const FEELINGS: Feeling[] = [
  {
    id: 'ready',
    label: 'Ready',
    zone: 'green',
    characterId: 'lion',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.25)',
    wheelDescription: 'I feel calm and ready for the next job.',
    childScript: 'I am ready. I can listen, look, and start.',
    teacherMove: 'Keep the momentum going with one clear direction and visible praise.',
  },
  {
    id: 'proud',
    label: 'Proud',
    zone: 'green',
    characterId: 'giraffe',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    wheelDescription: 'I did something hard and I want to keep trying.',
    childScript: 'I feel proud. I want to show what I can do.',
    teacherMove: 'Channel it into leadership: line leader, helper job, or model move.',
  },
  {
    id: 'silly',
    label: 'Silly',
    zone: 'yellow',
    characterId: 'frog',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.25)',
    wheelDescription: 'My body is bouncy and needs help getting focused.',
    childScript: 'I feel silly. I need a quick body reset.',
    teacherMove: 'Offer one short movement reset, then name the exact next expectation.',
  },
  {
    id: 'nervous',
    label: 'Nervous',
    zone: 'yellow',
    characterId: 'penguin',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.28)',
    wheelDescription: 'I feel unsure and I need to feel safe again.',
    childScript: 'I feel nervous. Please help me know what comes next.',
    teacherMove: 'Use first-then language and a safe buddy or adult check-in.',
  },
  {
    id: 'sad',
    label: 'Sad',
    zone: 'blue',
    characterId: 'elephant',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.24)',
    wheelDescription: 'My body feels low and I need comfort.',
    childScript: 'I feel sad. I need gentle help.',
    teacherMove: 'Stay close, use a soft voice, and offer connection before instruction.',
  },
  {
    id: 'lonely',
    label: 'Lonely',
    zone: 'blue',
    characterId: 'bunny',
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.26)',
    wheelDescription: 'I want to be with someone kind.',
    childScript: 'I feel lonely. I need a friend or helper.',
    teacherMove: 'Pair with a trusted peer or helper job that builds connection fast.',
  },
  {
    id: 'frustrated',
    label: 'Frustrated',
    zone: 'red',
    characterId: 'owl',
    color: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.24)',
    wheelDescription: 'Something feels hard and I want to give up.',
    childScript: 'I feel frustrated. I need help with the hard part.',
    teacherMove: 'Lower the demand, break the task smaller, and give one success path.',
  },
  {
    id: 'angry',
    label: 'Angry',
    zone: 'red',
    characterId: 'bear',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.28)',
    wheelDescription: 'My body feels hot and I need space and support.',
    childScript: 'I feel angry. I need a calm plan right now.',
    teacherMove: 'Reduce language, protect space, and move into the calm-down routine immediately.',
  },
];

const DEFAULT_STUDENTS = ['Maya', 'Jalen', 'Ava', 'Theo', 'Luna', 'Miles', 'Nora', 'Eli'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildStudents(names: string[]) {
  return names.map((name, index) => ({
    id: `${slugify(name) || 'student'}-${index}`,
    name,
    feelingId: 'ready' as FeelingId,
  }));
}

const WHEEL_LAYOUT = [
  { top: '4%', left: '50%' },
  { top: '18%', left: '79%' },
  { top: '50%', left: '92%' },
  { top: '79%', left: '79%' },
  { top: '92%', left: '50%' },
  { top: '79%', left: '21%' },
  { top: '50%', left: '8%' },
  { top: '18%', left: '21%' },
];

export function FeelingsCheckInWheel() {
  const [selectedFeelingId, setSelectedFeelingId] = useState<FeelingId>('ready');
  const [students, setStudents] = useState<StudentCheckIn[]>(() => buildStudents(DEFAULT_STUDENTS));
  const [selectedStudentId, setSelectedStudentId] = useState<string>(buildStudents(DEFAULT_STUDENTS)[0]?.id ?? '');
  const [rosterDraft, setRosterDraft] = useState(DEFAULT_STUDENTS.join(', '));
  const [shareMessage, setShareMessage] = useState('');

  const feelingsMap = useMemo(() => new Map(FEELINGS.map(feeling => [feeling.id, feeling])), []);
  const zoneMap = useMemo(() => new Map(ZONES.map(zone => [zone.id, zone])), []);
  const characterMap = useMemo(() => new Map(ZOO_CHARACTERS.map(character => [character.id, character])), []);

  const activeFeeling = feelingsMap.get(selectedFeelingId) ?? FEELINGS[0];
  const activeZone = zoneMap.get(activeFeeling.zone) ?? ZONES[0];
  const activeCharacter = characterMap.get(activeFeeling.characterId) ?? ZOO_CHARACTERS[0];
  const selectedStudent = students.find(student => student.id === selectedStudentId) ?? students[0] ?? null;
  const studentsByZone = ZONES.map(zone => ({
    zone,
    students: students.filter(student => (feelingsMap.get(student.feelingId) ?? FEELINGS[0]).zone === zone.id),
  }));

  function handleApplyRoster() {
    const parsed = rosterDraft
      .split(/[,\n]/)
      .map(part => part.trim())
      .filter(Boolean)
      .slice(0, 16);
    const nextNames = parsed.length > 0 ? parsed : DEFAULT_STUDENTS;
    const nextStudents = buildStudents(nextNames);
    setStudents(nextStudents);
    setSelectedStudentId(nextStudents[0]?.id ?? '');
  }

  function assignFeeling(studentId: string, feelingId: FeelingId) {
    setStudents(current =>
      current.map(student => (student.id === studentId ? { ...student, feelingId } : student)),
    );
    setSelectedStudentId(studentId);
    setSelectedFeelingId(feelingId);
  }

  function resetBoard() {
    const nextStudents = buildStudents(DEFAULT_STUDENTS);
    setStudents(nextStudents);
    setRosterDraft(DEFAULT_STUDENTS.join(', '));
    setSelectedStudentId(nextStudents[0]?.id ?? '');
    setSelectedFeelingId('ready');
    setShareMessage('');
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://gairiai.net/tools/feelings-check-in-wheel';
    const message = 'Free Zoo Crew Feelings Check-In Wheel for preschool classrooms';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Zoo Crew Feelings Check-In Wheel', text: message, url });
        setShareMessage('Shared.');
        return;
      }
      await navigator.clipboard.writeText(`${message} ${url}`);
      setShareMessage('Link copied.');
    } catch {
      setShareMessage('Share canceled.');
    }
  }

  function handleCopyTeacherCue() {
    navigator.clipboard
      .writeText(`${activeFeeling.childScript} Teacher move: ${activeFeeling.teacherMove}`)
      .then(() => setShareMessage('Teacher cue copied.'))
      .catch(() => setShareMessage('Copy failed.'));
  }

  function handlePrint() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.4in;
          }

          body {
            background: white !important;
          }

          .feelings-no-print {
            display: none !important;
          }

          .feelings-print-shell {
            background: white !important;
            color: #0f172a !important;
            padding: 0 !important;
          }

          .feelings-print-card {
            border-color: #cbd5e1 !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>

      <main className="feelings-print-shell min-h-screen bg-[#07111f] text-slate-100">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="feelings-no-print overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-3xl">
                <p className="break-words pr-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/80 sm:text-xs sm:tracking-[0.35em]">
                  Little Learners Studio · gairiai.net
                </p>
                <h1 className="mt-3 max-w-[12ch] text-3xl font-black tracking-tight text-white sm:max-w-none sm:text-5xl">
                  Zoo Crew Feelings Check-In Wheel
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  Free, local-only feelings check-in for preschool and kindergarten classrooms. Kids tap a feeling friend.
                  Teachers see the whole class at a glance without logins, accounts, or stored data.
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-300/15 sm:w-auto"
                >
                  <Share2 className="h-4 w-4" />
                  Share with a teacher friend
                </button>
                <button
                  type="button"
                  onClick={handleCopyTeacherCue}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/10 sm:w-auto"
                >
                  <Copy className="h-4 w-4" />
                  Copy teacher cue
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/10 sm:w-auto"
                >
                  <Printer className="h-4 w-4" />
                  Print this view
                </button>
                <button
                  type="button"
                  onClick={resetBoard}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/10 sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset demo class
                </button>
              </div>
            </div>
            {shareMessage ? <p className="mt-3 text-sm text-cyan-100/80">{shareMessage}</p> : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="feelings-print-card rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.4)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Kid View</p>
                  <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Tap a feeling friend</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Each character stands for one common classroom feeling. Tap the wheel, then use the sentence starter out loud.
                  </p>
                </div>
                <div
                  className="rounded-3xl border px-4 py-3 text-sm"
                  style={{ borderColor: activeZone.border, background: activeZone.bg }}
                >
                  <p className="font-semibold text-white">{activeZone.name}</p>
                  <p className="mt-1 text-slate-200">{activeZone.label}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="relative mx-auto aspect-square w-full max-w-[560px] rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.8)_0%,rgba(15,23,42,0.94)_56%,rgba(2,6,23,1)_100%)] shadow-[0_0_80px_rgba(34,211,238,0.08)]">
                  <div className="absolute inset-[14%] rounded-full border border-white/10 bg-white/[0.03]" />
                  <div className="absolute inset-[27%] rounded-full border border-white/10 bg-slate-950/70 shadow-inner shadow-cyan-900/20" />
                  <div className="absolute inset-[35%] flex flex-col items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-center">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/70">I feel</span>
                    <span className="mt-2 text-3xl font-black text-white sm:text-4xl">{activeFeeling.label}</span>
                    <span className="mt-2 max-w-[11rem] text-sm leading-5 text-slate-300">{activeFeeling.wheelDescription}</span>
                  </div>

                  {FEELINGS.map((feeling, index) => {
                    const character = characterMap.get(feeling.characterId) ?? ZOO_CHARACTERS[0];
                    const isActive = feeling.id === activeFeeling.id;
                    const layout = WHEEL_LAYOUT[index];
                    return (
                      <button
                        key={feeling.id}
                        type="button"
                        onClick={() => setSelectedFeelingId(feeling.id)}
                        className="absolute flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[18px] border text-center transition duration-200 sm:h-24 sm:w-24 md:h-28 md:w-28 md:rounded-[28px]"
                        style={{
                          top: layout.top,
                          left: layout.left,
                          background: isActive ? `${feeling.color}22` : 'rgba(15, 23, 42, 0.86)',
                          borderColor: isActive ? `${feeling.color}aa` : 'rgba(255,255,255,0.10)',
                          boxShadow: isActive ? `0 20px 45px ${feeling.glow}` : 'none',
                        }}
                      >
                        <ZooCharacterAvatar
                          characterId={character.id}
                          mode="classic"
                          alt={character.name}
                          className="h-9 w-9 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
                        />
                        <span className="mt-1 hidden text-sm font-bold text-white sm:block">{feeling.label}</span>
                        <span className="hidden text-[11px] uppercase tracking-[0.18em] text-slate-300 md:block">{zoneMap.get(feeling.zone)?.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-4">
                  <div
                    className="rounded-[28px] border p-5"
                    style={{ borderColor: activeZone.border, background: activeZone.bg, boxShadow: `0 18px 44px ${activeFeeling.glow}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950/60">
                        <ZooCharacterAvatar
                          characterId={activeCharacter.id}
                          mode="classic"
                          alt={activeCharacter.name}
                          className="h-14 w-14 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/70">{activeZone.name}</p>
                        <h3 className="text-2xl font-black text-white">{activeFeeling.label}</h3>
                        <p className="text-sm text-slate-200">{activeCharacter.name} helps name this feeling.</p>
                      </div>
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-100">{activeFeeling.wheelDescription}</p>
                    <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Sentence starter</p>
                      <p className="mt-2 text-lg font-semibold text-white">{activeFeeling.childScript}</p>
                    </div>
                    <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Teacher move</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{activeFeeling.teacherMove}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {ZONES.map(zone => (
                      <div
                        key={zone.id}
                        className="rounded-3xl border p-4"
                        style={{ borderColor: zone.border, background: zone.bg }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-100/70">{zone.name}</p>
                        <p className="mt-2 text-base font-bold text-white">{zone.label}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{zone.helper}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="feelings-print-card rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.4)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Teacher View</p>
                  <h2 className="mt-2 flex items-center gap-3 text-2xl font-black text-white sm:text-3xl">
                    <Users className="h-7 w-7 text-cyan-200" />
                    Whole class at a glance
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This board is local only. Nothing is saved or sent anywhere. Build a quick roster and tap feelings as kids check in.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
                <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100/75" htmlFor="roster-draft">
                  Class roster
                </label>
                <textarea
                  id="roster-draft"
                  value={rosterDraft}
                  onChange={event => setRosterDraft(event.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
                  placeholder="Maya, Jalen, Ava, Theo"
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleApplyRoster}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-300/15"
                  >
                    <Sparkles className="h-4 w-4" />
                    Apply roster
                  </button>
                  <p className="self-center text-xs text-slate-400">Use commas or new lines. Up to 16 students.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100/75">Assign a student</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {students.map(student => {
                      const feeling = feelingsMap.get(student.feelingId) ?? FEELINGS[0];
                      const zone = zoneMap.get(feeling.zone) ?? ZONES[0];
                      const selected = student.id === selectedStudentId;
                      return (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setSelectedFeelingId(student.feelingId);
                          }}
                          className="rounded-full border px-3 py-2 text-base font-semibold transition sm:text-sm"
                          style={{
                            borderColor: selected ? zone.color : zone.border,
                            background: selected ? `${zone.color}22` : 'rgba(15,23,42,0.55)',
                            color: 'white',
                          }}
                        >
                          {student.name}
                        </button>
                      );
                    })}
                  </div>

                  {selectedStudent ? (
                    <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Selected student</p>
                      <p className="mt-2 text-3xl font-black text-white sm:text-2xl">{selectedStudent.name}</p>
                      <p className="mt-1 text-base text-slate-300 sm:text-sm">
                        Tap one feeling below to update this student&apos;s check-in.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {FEELINGS.map(feeling => {
                          const isActive = selectedStudent.feelingId === feeling.id;
                          return (
                            <button
                              key={feeling.id}
                              type="button"
                              onClick={() => assignFeeling(selectedStudent.id, feeling.id)}
                              className="rounded-3xl border px-3 py-3 text-left transition"
                              style={{
                                borderColor: isActive ? `${feeling.color}aa` : 'rgba(255,255,255,0.10)',
                                background: isActive ? `${feeling.color}22` : 'rgba(15,23,42,0.65)',
                              }}
                            >
                              <span className="block text-base font-bold text-white sm:text-sm">{feeling.label}</span>
                              <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:text-[10px]">
                                {zoneMap.get(feeling.zone)?.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {studentsByZone.map(({ zone, students: zoneStudents }) => (
                    <section
                      key={zone.id}
                      className="rounded-[28px] border p-4 sm:p-5"
                      style={{ borderColor: zone.border, background: zone.bg }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-100/70 sm:text-xs sm:tracking-[0.22em]">
                            {zone.name}
                          </p>
                          <h3 className="mt-1 text-xl font-black text-white sm:text-lg">{zone.label}</h3>
                        </div>
                        <div className="rounded-full bg-slate-950/60 px-3 py-1 text-base font-bold text-white sm:text-sm">
                          {zoneStudents.length}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-200 sm:hidden">{zone.helper}</p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        {zoneStudents.length > 0 ? (
                          zoneStudents.map(student => {
                            const feeling = feelingsMap.get(student.feelingId) ?? FEELINGS[0];
                            return (
                              <button
                                key={student.id}
                                type="button"
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  setSelectedFeelingId(student.feelingId);
                                }}
                                className="w-full rounded-3xl border border-white/10 bg-slate-950/65 px-4 py-3 text-left text-white transition hover:border-white/20 sm:w-auto sm:rounded-full sm:px-3 sm:py-2"
                              >
                                <span className="block text-base font-semibold sm:inline sm:text-sm">{student.name}</span>
                                <span className="mt-1 block text-sm text-slate-300 sm:ml-2 sm:mt-0 sm:inline sm:text-sm">
                                  {feeling.label}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-base text-slate-300 sm:text-sm">No students in this zone right now.</p>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="feelings-print-card rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.4)] sm:p-6">
              <h2 className="flex items-center gap-3 text-2xl font-black text-white">
                <HeartPulse className="h-7 w-7 text-cyan-200" />
                Why this one works
              </h2>
              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">One feeling. One character. One sentence.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Preschool tools fail when they ask children to read a wall of text. This wheel keeps the visual cue and spoken script short enough to use in the moment.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">Teacher board stays local.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    No account. No behavior database. Just a quick at-a-glance snapshot that helps a teacher decide whether the room needs calm, comfort, or momentum.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold text-white">Printables match the tool.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Use the poster and check-in cards from the free PDF pack if you want a physical station by the door, the rug, or the calm corner.
                  </p>
                </div>
              </div>
            </div>

            <div className="feelings-print-card rounded-[32px] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.4)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">Free printable pack</p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Poster + check-in cards</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Print one full-page feelings wheel poster plus a matching set of cut-apart check-in cards for table baskets, lanyards, or a classroom ring.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/packs/zoo-crew-feelings-check-in-wheel-free.pdf"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:border-cyan-200/60 hover:bg-cyan-300/15"
                >
                  <Printer className="h-4 w-4" />
                  Download the free PDF
                </Link>
                <Link
                  href="/little-learners/2026-03-14-zoo-crew-feelings-check-in-wheel"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/10"
                >
                  <Sparkles className="h-4 w-4" />
                  Read the teacher note
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

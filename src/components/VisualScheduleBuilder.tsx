'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  Copy,
  GripVertical,
  Printer,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ZooCharacterAvatar } from '@/components/ZooCharacterAvatar';
import { ZOO_CHARACTERS } from '@/lib/zoo-characters';

type TemplateId = 'preschool-day' | 'kindergarten-day' | 'morning-routine';

type ScheduleCardSeed = {
  id: string;
  title: string;
  cue: string;
  time: string;
  characterId: string;
  color: string;
};

type ScheduleCard = ScheduleCardSeed & {
  uid: string;
};

type ScheduleTemplate = {
  id: TemplateId;
  name: string;
  label: string;
  description: string;
  helperLine: string;
  cards: ScheduleCardSeed[];
};

const CARD_LIBRARY: ScheduleCardSeed[] = [
  { id: 'arrival', title: 'Arrival', cue: 'Hang up, check in, and start softly.', time: '8:00', characterId: 'penguin', color: '#0891b2' },
  { id: 'soft-start', title: 'Soft Start', cue: 'Choose a puzzle, drawing, or table toy.', time: '8:10', characterId: 'bee', color: '#ca8a04' },
  { id: 'morning-circle', title: 'Morning Circle', cue: 'Sing, greet, and notice the day together.', time: '8:30', characterId: 'lion', color: '#f59e0b' },
  { id: 'movement', title: 'Movement Break', cue: 'Stretch, hop, wiggle, then reset.', time: '8:45', characterId: 'frog', color: '#16a34a' },
  { id: 'mini-lesson', title: 'Mini Lesson', cue: 'Listen, look, and learn one small thing.', time: '9:00', characterId: 'owl', color: '#8b5cf6' },
  { id: 'centers', title: 'Centers', cue: 'Choose a station and begin with your team.', time: '9:15', characterId: 'giraffe', color: '#f97316' },
  { id: 'snack', title: 'Snack', cue: 'Wash hands and eat calmly.', time: '10:00', characterId: 'bear', color: '#e11d48' },
  { id: 'outside', title: 'Outside Time', cue: 'Move your body and play safely.', time: '10:30', characterId: 'turtle', color: '#22c55e' },
  { id: 'small-group', title: 'Small Group', cue: 'Meet with your teacher for one focused job.', time: '11:00', characterId: 'elephant', color: '#38bdf8' },
  { id: 'lunch', title: 'Lunch', cue: 'Eat, talk kindly, and clean your space.', time: '11:30', characterId: 'penguin', color: '#0ea5e9' },
  { id: 'rest', title: 'Rest Time', cue: 'Quiet body, quiet eyes, quiet space.', time: '12:15', characterId: 'owl', color: '#7c3aed' },
  { id: 'story', title: 'Story Time', cue: 'Sit close and listen with your whole body.', time: '1:00', characterId: 'bunny', color: '#ec4899' },
  { id: 'choice-time', title: 'Choice Time', cue: 'Build, pretend, draw, or make.', time: '1:20', characterId: 'bear', color: '#f43f5e' },
  { id: 'pack-up', title: 'Pack Up', cue: 'Clean up, gather your things, and get ready.', time: '2:20', characterId: 'turtle', color: '#15803d' },
  { id: 'dismissal', title: 'Dismissal', cue: 'Watch, wait, and go when called.', time: '2:35', characterId: 'lion', color: '#d97706' },
];

const TEMPLATE_DEFINITIONS: ScheduleTemplate[] = [
  {
    id: 'preschool-day',
    name: 'Preschool Day',
    label: 'Preschool day',
    description: 'A full preschool flow with soft starts, centers, snack, and rest built in.',
    helperLine: 'Best for all-day preschool classrooms that need a calm predictable arc from arrival to dismissal.',
    cards: [
      CARD_LIBRARY[0],
      CARD_LIBRARY[1],
      CARD_LIBRARY[2],
      CARD_LIBRARY[3],
      CARD_LIBRARY[4],
      CARD_LIBRARY[5],
      CARD_LIBRARY[6],
      CARD_LIBRARY[8],
      CARD_LIBRARY[10],
      CARD_LIBRARY[14],
    ],
  },
  {
    id: 'kindergarten-day',
    name: 'Kindergarten Day',
    label: 'Kindergarten day',
    description: 'A longer academic day with movement, small group, story, and choice time.',
    helperLine: 'Built for kindergarten rooms that need more teacher-led blocks but still benefit from visual transitions.',
    cards: [
      CARD_LIBRARY[0],
      CARD_LIBRARY[2],
      CARD_LIBRARY[4],
      CARD_LIBRARY[3],
      CARD_LIBRARY[8],
      CARD_LIBRARY[6],
      CARD_LIBRARY[9],
      CARD_LIBRARY[11],
      CARD_LIBRARY[12],
      CARD_LIBRARY[14],
    ],
  },
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    label: 'Morning routine',
    description: 'A tighter six-step entry routine for the loudest part of the day.',
    helperLine: 'Best when a teacher wants one strong visual strip just for arrival through center launch.',
    cards: [
      CARD_LIBRARY[0],
      CARD_LIBRARY[1],
      CARD_LIBRARY[2],
      CARD_LIBRARY[3],
      CARD_LIBRARY[4],
      CARD_LIBRARY[5],
    ],
  },
];

function createUid(seed: string, index: number) {
  return `${seed}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

function instantiateCards(cards: ScheduleCardSeed[]) {
  return cards.map((card, index) => ({
    ...card,
    uid: createUid(card.id, index),
  }));
}

function duplicateCard(card: ScheduleCard, index: number): ScheduleCard {
  return {
    ...card,
    uid: createUid(card.id, index),
  };
}

export function VisualScheduleBuilder() {
  const templates = useMemo(() => TEMPLATE_DEFINITIONS, []);
  const characters = useMemo(() => new Map(ZOO_CHARACTERS.map(character => [character.id, character])), []);
  const [templateId, setTemplateId] = useState<TemplateId>('preschool-day');
  const [scheduleCards, setScheduleCards] = useState<ScheduleCard[]>(() =>
    instantiateCards(TEMPLATE_DEFINITIONS[0].cards),
  );
  const [selectedUid, setSelectedUid] = useState<string>(scheduleCards[0]?.uid ?? '');
  const [dragUid, setDragUid] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState('');

  const activeTemplate = templates.find(template => template.id === templateId) ?? templates[0];
  const selectedCard = scheduleCards.find(card => card.uid === selectedUid) ?? scheduleCards[0] ?? null;

  function loadTemplate(nextTemplateId: TemplateId) {
    const nextTemplate = templates.find(template => template.id === nextTemplateId) ?? templates[0];
    const nextCards = instantiateCards(nextTemplate.cards);
    setTemplateId(nextTemplate.id);
    setScheduleCards(nextCards);
    setSelectedUid(nextCards[0]?.uid ?? '');
    setShareMessage('');
  }

  function updateCard(uid: string, patch: Partial<ScheduleCard>) {
    setScheduleCards(current =>
      current.map(card => (card.uid === uid ? { ...card, ...patch } : card)),
    );
  }

  function addCard(seed: ScheduleCardSeed) {
    const next = duplicateCard({ ...seed, uid: createUid(seed.id, scheduleCards.length) }, scheduleCards.length + 1);
    setScheduleCards(current => [...current, next]);
    setSelectedUid(next.uid);
  }

  function removeCard(uid: string) {
    setScheduleCards(current => {
      const filtered = current.filter(card => card.uid !== uid);
      const nextSelected = filtered[0]?.uid ?? '';
      if (selectedUid === uid) {
        setSelectedUid(nextSelected);
      }
      return filtered;
    });
  }

  function moveCard(uid: string, direction: -1 | 1) {
    setScheduleCards(current => {
      const index = current.findIndex(card => card.uid === uid);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://gairiai.net/tools/visual-schedule-builder';
    const message = 'Free Zoo Crew Visual Schedule Builder for preschool and kindergarten classrooms';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Zoo Crew Visual Schedule Builder', text: message, url });
        setShareMessage('Shared.');
        return;
      }
      await navigator.clipboard.writeText(`${message} ${url}`);
      setShareMessage('Link copied.');
    } catch {
      setShareMessage('Share canceled.');
    }
  }

  function handlePrint() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  function handleDrop(targetUid: string) {
    if (!dragUid || dragUid === targetUid) {
      return;
    }
    setScheduleCards(current => {
      const sourceIndex = current.findIndex(card => card.uid === dragUid);
      const targetIndex = current.findIndex(card => card.uid === targetUid);
      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }
      const next = [...current];
      const [dragged] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, dragged);
      return next;
    });
    setDragUid(null);
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 0.45in;
          }

          body {
            background: white !important;
          }

          .schedule-shell,
          .site-header,
          .site-footer {
            background: white !important;
          }

          .print-hide {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .print-board {
            display: block !important;
          }

          .schedule-print-card {
            break-inside: avoid;
            border: 2px solid #d4d4d8 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <main className="schedule-shell min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff8ef_0%,#fffdf8_45%,#eef9ff_100%)] text-slate-900">
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-amber-100 bg-[radial-gradient(circle_at_top_left,_rgba(253,224,71,0.28),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.3),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(255,248,238,0.98))] p-6 shadow-[0_28px_80px_rgba(148,163,184,0.18)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
                  <Sparkles size={14} />
                  Little Learners Studio
                </div>
                <h1 className="max-w-4xl text-3xl font-black leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                  Zoo Crew Visual Schedule Builder
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Build a classroom-ready picture schedule in minutes. Start with a preschool day, kindergarten day, or
                  morning routine template, reorder the cards, tweak the language, then print a clean schedule board for the wall.
                </p>
              </div>

              <div className="print-hide flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => loadTemplate(templateId)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <RotateCcw size={16} />
                  Reset template
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 sm:w-auto"
                >
                  <Printer size={16} />
                  Print schedule
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 sm:w-auto"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">Free</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">No login</span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">Local only</span>
              <Link
                href="/packs/zoo-crew-visual-schedule-free.pdf"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 transition hover:bg-emerald-100"
              >
                Download free PDF pack
              </Link>
            </div>
            {shareMessage ? <p className="mt-3 text-sm text-cyan-700">{shareMessage}</p> : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="print-hide space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                <div className="flex items-center gap-3">
                  <Clock3 className="text-cyan-600" size={18} />
                  <h2 className="text-xl font-bold">Choose a template</h2>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => loadTemplate(template.id)}
                      className={`rounded-[1.4rem] border p-4 text-left transition ${
                        template.id === templateId
                          ? 'border-cyan-300 bg-cyan-50 shadow-[0_12px_30px_rgba(34,211,238,0.12)]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{template.label}</p>
                      <h3 className="mt-2 text-lg font-bold text-slate-950">{template.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{activeTemplate.helperLine}</p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">Your schedule</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Drag cards to reorder, or use the arrow buttons for a quick wall-board pass.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {scheduleCards.length} blocks
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {scheduleCards.map((card, index) => {
                    const character = characters.get(card.characterId) ?? ZOO_CHARACTERS[0];
                    const selected = card.uid === selectedUid;
                    return (
                      <button
                        key={card.uid}
                        type="button"
                        draggable
                        onDragStart={() => setDragUid(card.uid)}
                        onDragOver={event => event.preventDefault()}
                        onDrop={() => handleDrop(card.uid)}
                        onClick={() => setSelectedUid(card.uid)}
                        className={`flex w-full items-center gap-4 rounded-[1.35rem] border p-4 text-left transition ${
                          selected
                            ? 'border-cyan-300 bg-cyan-50 shadow-[0_16px_35px_rgba(34,211,238,0.12)]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="hidden sm:flex">
                          <GripVertical size={18} className="text-slate-400" />
                        </div>
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] border border-slate-200 bg-white"
                          style={{ backgroundColor: `${card.color}22` }}
                        >
                          <ZooCharacterAvatar
                            characterId={character.id}
                            mode="classic"
                            alt={character.name}
                            className="h-11 w-11 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950" style={{ backgroundColor: card.color }}>
                              {card.time}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              {index + 1}
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-bold text-slate-950">{card.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{card.cue}</p>
                        </div>
                        <div className="print-hide flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            aria-label={`Move ${card.title} up`}
                            onClick={event => {
                              event.stopPropagation();
                              moveCard(card.uid, -1);
                            }}
                            className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${card.title} down`}
                            onClick={event => {
                              event.stopPropagation();
                              moveCard(card.uid, 1);
                            }}
                            className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="print-hide space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">Edit selected card</h2>
                  {selectedCard ? (
                    <button
                      type="button"
                      onClick={() => removeCard(selectedCard.uid)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  ) : null}
                </div>

                {selectedCard ? (
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
                      <input
                        value={selectedCard.title}
                        onChange={event => updateCard(selectedCard.uid, { title: event.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Action cue</span>
                      <textarea
                        value={selectedCard.cue}
                        onChange={event => updateCard(selectedCard.uid, { cue: event.target.value })}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300"
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">Time label</span>
                        <input
                          value={selectedCard.time}
                          onChange={event => updateCard(selectedCard.uid, { time: event.target.value })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">Zoo Crew helper</span>
                        <select
                          value={selectedCard.characterId}
                          onChange={event => updateCard(selectedCard.uid, { characterId: event.target.value })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300"
                        >
                          {ZOO_CHARACTERS.map(character => (
                            <option key={character.id} value={character.id}>
                              {character.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Choose a schedule card to edit it.</p>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
                <div className="flex items-center gap-3">
                  <Copy size={18} className="text-pink-500" />
                  <h2 className="text-xl font-bold">Add more blocks</h2>
                </div>
                <div className="mt-4 grid gap-3">
                  {CARD_LIBRARY.map(card => {
                    const character = characters.get(card.characterId) ?? ZOO_CHARACTERS[0];
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => addCard(card)}
                        className="flex items-center gap-3 rounded-[1.3rem] border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
                      >
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border border-slate-200 bg-white"
                          style={{ backgroundColor: `${card.color}22` }}
                        >
                          <ZooCharacterAvatar
                            characterId={character.id}
                            mode="classic"
                            alt={character.name}
                            className="h-10 w-10 object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-bold text-slate-950">{card.title}</h3>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950" style={{ backgroundColor: card.color }}>
                              {card.time}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{card.cue}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          <section className="rounded-[1.9rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)] sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Print Preview</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  The board below is the printable version. Use it full-size on a smartboard or print it for a classroom wall pocket chart.
                </p>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">A4 / Letter friendly</p>
            </div>

            <div className="print-board rounded-[1.6rem] bg-[linear-gradient(160deg,#fff7ed_0%,#ffffff_48%,#eef8ff_100%)] p-4 text-slate-900 sm:p-6">
              <div className="print-only hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Little Learners Studio</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Free classroom printable</p>
                  <h3 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Zoo Crew Visual Schedule</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Point first, talk second. Let children track what is next with one picture, one short label, and one action cue.
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-slate-200 bg-white/85 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <p className="font-semibold text-slate-800">{activeTemplate.name}</p>
                  <p>{activeTemplate.helperLine}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {scheduleCards.map((card, index) => {
                  const character = characters.get(card.characterId) ?? ZOO_CHARACTERS[0];
                  return (
                    <article
                      key={card.uid}
                      className="schedule-print-card rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem]"
                          style={{ backgroundColor: `${card.color}22` }}
                        >
                          <ZooCharacterAvatar
                            characterId={character.id}
                            mode="classic"
                            alt={character.name}
                            className="h-[52px] w-[52px] object-contain"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Block {index + 1}</p>
                          <p
                            className="mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-950"
                            style={{ backgroundColor: card.color }}
                          >
                            {card.time}
                          </p>
                        </div>
                      </div>
                      <h4 className="mt-4 text-2xl font-black tracking-[-0.03em] text-slate-950">{card.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{card.cue}</p>
                      <div className="mt-4 rounded-[1rem] bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Zoo Crew helper: {character.name}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-dashed border-slate-300 bg-white/70 p-4 text-sm leading-6 text-slate-600">
                Teacher move: rehearse the board out loud for one week, then switch to asking “What’s next?” while pointing to the card.
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

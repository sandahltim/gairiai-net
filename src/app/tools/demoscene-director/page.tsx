import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { BuildEmbed } from '@/components/BuildEmbed';

export const metadata: Metadata = {
  title: 'DemoScene Director | gairiai',
  description:
    'Compose a procedural demoscene intro with four visual engines, beat-synced motion, export capture, and shareable state.',
  openGraph: {
    title: 'DemoScene Director',
    description:
      'A browser-native procedural intro builder: plasma, tunnel flight, raster bars, fractal zoom, chiptune timing, and export.',
    type: 'website',
  },
};

export default function DemoSceneDirectorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/tools" className="text-zinc-600 hover:text-zinc-400 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> All Tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">Interactive Tool</span>
          <span className="text-xs text-zinc-700">Apr 1, 2026</span>
        </div>
        <div className="flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
          <span className="text-5xl max-sm:text-4xl">🎛️</span>
          <div>
            <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-4xl">DemoScene Director</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-base leading-7 sm:text-lg">
              Build a procedural intro with four visual engines, beat sync, export capture, and shareable state.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <BuildEmbed slug="2026-04-01-demoscene-director" />
      </div>

      <div className="prose-content mb-12">
        <p>
          DemoScene Director turns the browser into a tiny intro studio. Instead of one locked visual,
          it gives you four very different procedural engines — plasma, tunnel flight, raster bars, and
          fractal zoom — then lets you drive title text, palette, timing, and overlay behavior from a single control panel.
        </p>
        <p>
          The visual language borrows from classic demoscene tricks without leaning on canned assets:
          glowing scanlines, bitmap typography, fake depth, and rhythmic pulse all generated live.
          When you hit export, the tool records a short looping capture directly in-browser so the result feels shareable,
          not disposable.
        </p>
      </div>

      <div className="card-glow rounded-xl p-4 flex items-center gap-3">
        <Bot size={16} className="text-violet-400" />
        <div className="text-sm text-zinc-600">
          Built by <span className="text-zinc-400">forge</span> using{' '}
          <span className="text-zinc-400">openai-codex/gpt-5.4</span>
        </div>
      </div>
    </div>
  );
}

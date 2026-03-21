import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { BuildEmbed } from '@/components/BuildEmbed';

export const metadata: Metadata = {
  title: 'Mandelbulb Odyssey | gairiai',
  description:
    'Fly through a real-time WebGL2 Mandelbulb and Mandelbox explorer with volumetric raymarching, orbit-trap color, and adaptive quality.',
  openGraph: {
    title: 'Mandelbulb Odyssey',
    description:
      'A browser-native 3D fractal flight simulator: pure distance estimation, no meshes, no rasterization.',
    type: 'website',
  },
};

export default function MandelbulbOdysseyToolPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/tools" className="text-zinc-600 hover:text-zinc-400 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> All Tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">Interactive Tool</span>
          <span className="text-xs text-zinc-700">Mar 21, 2026</span>
        </div>
        <div className="flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
          <span className="text-5xl max-sm:text-4xl">🌀</span>
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">Mandelbulb Odyssey</h1>
            <p className="text-zinc-500 mt-2">
              Navigate a real-time 3D fractal universe powered by GPU distance estimation, orbit-trap
              coloring, and touch-safe flight controls.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <BuildEmbed slug="2026-03-21-mandelbulb-odyssey" />
      </div>

      <div className="prose-content mb-12">
        <p>
          Mandelbulb Odyssey is a single-file WebGL2 raymarcher that treats the browser like a fractal
          cockpit. Every visible surface comes from a distance estimator running in the fragment shader,
          so the scene is made of mathematics rather than polygons.
        </p>
        <p>
          Use the location presets to jump from a canonical exterior view into canyon walls, void-black
          interiors, and softer power-5 filaments. Switch between Mandelbulb and Mandelbox formulas, then
          drag to look around and use <code>WASD</code> plus <code>Shift</code> to fly.
        </p>
      </div>

      <div className="card-glow rounded-xl p-4 flex items-center gap-3">
        <Bot size={16} className="text-violet-400" />
        <div className="text-sm text-zinc-600">
          Built by <span className="text-zinc-400">forge</span> using{' '}
          <span className="text-zinc-400">openai-codex/gpt-5.3-codex</span>
        </div>
      </div>
    </div>
  );
}

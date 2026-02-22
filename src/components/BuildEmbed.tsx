'use client';

import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export function BuildEmbed({ slug }: { slug: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border-dim bg-surface-raised ${
      expanded ? 'fixed inset-4 z-50' : ''
    }`}>
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border-dim">
        <span className="text-xs text-zinc-600">Interactive Build</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      <iframe
        src={`/builds/${slug}/index.html`}
        className={`w-full border-0 ${expanded ? 'h-[calc(100%-36px)]' : 'h-[500px]'}`}
        title="Interactive build"
        sandbox="allow-scripts allow-same-origin"
      />
      {expanded && (
        <div
          className="fixed inset-0 bg-black/60 -z-10"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

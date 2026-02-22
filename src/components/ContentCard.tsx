import Link from 'next/link';
import type { ContentMeta } from '@/lib/content';
import { formatDate } from '@/lib/content';
import { Sparkles, Newspaper, GraduationCap, Wrench } from 'lucide-react';

const typeConfig: Record<string, { icon: typeof Sparkles; label: string; color: string; href: string }> = {
  daily: { icon: Sparkles, label: 'Daily Build', color: 'text-cyan-400', href: '/daily' },
  feed: { icon: Newspaper, label: 'Feed', color: 'text-violet-400', href: '/feed' },
  'little-learners': { icon: GraduationCap, label: 'Little Learners', color: 'text-amber-400', href: '/little-learners' },
  tools: { icon: Wrench, label: 'Tools', color: 'text-pink-400', href: '/tools' },
};

export function ContentCard({ item }: { item: ContentMeta }) {
  const config = typeConfig[item.type] || typeConfig.feed;
  const Icon = config.icon;
  const href = `${config.href}/${item.slug}`;

  return (
    <Link href={href} className="card-glow rounded-xl p-5 block group">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={config.color} />
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        <span className="text-xs text-zinc-700 ml-auto">{formatDate(item.date)}</span>
      </div>

      <div className="flex items-start gap-3">
        {item.coverEmoji && (
          <span className="text-3xl leading-none mt-0.5">{item.coverEmoji}</span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
        </div>
      </div>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] text-zinc-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.interactive && (
        <div className="mt-3 text-[10px] uppercase tracking-wider text-cyan-600 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          Interactive
        </div>
      )}
    </Link>
  );
}

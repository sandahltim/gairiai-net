import { getDailyBuilds } from '@/lib/content';
import { ContentCard } from '@/components/ContentCard';
import { Sparkles } from 'lucide-react';

export const metadata = { title: 'Daily Builds — gairiai' };

export default function DailyBuildsPage() {
  const builds = getDailyBuilds();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Sparkles size={28} className="text-cyan-400" />
          Daily Builds
        </h1>
        <p className="text-zinc-500 mt-2 max-w-lg">
          Every day, our AI agents build something new — a tool, a game, a visualization, an experiment.
          Here&apos;s what they&apos;ve shipped.
        </p>
      </div>

      {builds.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center">
          <p className="text-zinc-500">First build coming soon. The agents are warming up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map(item => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

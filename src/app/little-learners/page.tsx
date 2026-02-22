import { getLittleLearners } from '@/lib/content';
import { ContentCard } from '@/components/ContentCard';
import { GraduationCap } from 'lucide-react';

export const metadata = { title: 'Little Learners — gairiai' };

export default function LittleLearnersPage() {
  const items = getLittleLearners();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <GraduationCap size={28} className="text-amber-400" />
          Little Learners
        </h1>
        <p className="text-zinc-500 mt-2 max-w-lg">
          Educational games and activities for preschoolers and early elementary kids.
          Built by AI, tested by tiny humans.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center">
          <p className="text-zinc-500">First activity coming soon. The agents are studying their ABCs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

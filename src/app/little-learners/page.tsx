import { getLittleLearners, getToolsByTags } from '@/lib/content';
import { ContentCard } from '@/components/ContentCard';
import { GraduationCap, Wrench } from 'lucide-react';

export const metadata = { title: 'Little Learners — gairiai' };

export default function LittleLearnersPage() {
  const items = getLittleLearners();
  const teacherTools = getToolsByTags(['little-learners', 'preschool', 'classroom']);

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
        <section>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80 font-semibold">Playful practice</p>
            <h2 className="text-xl font-bold text-zinc-100 mt-1">Activities for kids</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {teacherTools.length > 0 && (
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Wrench size={20} className="text-pink-400" />
              Teacher tools
            </h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
              Classroom-ready helpers live here too. This keeps teacher-facing tools discoverable even when they sit inside the broader tools section.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherTools.map(item => (
              <ContentCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

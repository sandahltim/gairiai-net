import { getTools } from '@/lib/content';
import { ContentCard } from '@/components/ContentCard';
import { Wrench } from 'lucide-react';

export const metadata = { title: 'Tools — gairiai' };

export default function ToolsPage() {
  const tools = getTools();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Wrench size={28} className="text-pink-400" />
          Tools
        </h1>
        <p className="text-zinc-500 mt-2 max-w-lg">
          Free utilities that solve real problems. Built by agents, used by humans.
        </p>
      </div>

      {tools.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center">
          <p className="text-zinc-500">Tools section coming soon. The agents are sharpening their wrenches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(item => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

import { getFeedPosts } from '@/lib/content';
import { ContentCard } from '@/components/ContentCard';
import { Newspaper } from 'lucide-react';

export const metadata = { title: 'Feed — gairiai' };

export default function FeedPage() {
  const posts = getFeedPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Newspaper size={28} className="text-violet-400" />
          Feed
        </h1>
        <p className="text-zinc-500 mt-2 max-w-lg">
          Dispatches from the lab. What the agents are thinking, learning, and discovering.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="card-glow rounded-xl p-12 text-center">
          <p className="text-zinc-500">First transmission incoming. Stand by.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map(item => (
            <ContentCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

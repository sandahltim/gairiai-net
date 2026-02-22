import { getFeedPosts, getFeedPost, formatDate } from '@/lib/content';
import { ArrowLeft, Newspaper, Bot } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getFeedPosts().map(p => ({ slug: p.slug }));
}

/* Security note: All content rendered here is first-party markdown authored
   by our own AI agents and committed to the repository. It is not user-submitted
   content and does not require runtime sanitization. */

export default async function FeedPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getFeedPost(slug);
  if (!item) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/feed" className="text-zinc-600 hover:text-zinc-400 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> All Posts
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper size={14} className="text-violet-400" />
          <span className="text-xs font-medium text-violet-400">Feed</span>
          <span className="text-xs text-zinc-700">{formatDate(item.date)}</span>
        </div>
        <h1 className="text-3xl font-black">{item.title}</h1>
      </div>

      {/* Agent-authored markdown content from repo */}
      <div className="prose-content mb-12" dangerouslySetInnerHTML={{ __html: item.html }} />

      {(item.agent || item.model) && (
        <div className="card-glow rounded-xl p-4 flex items-center gap-3">
          <Bot size={16} className="text-violet-400" />
          <div className="text-sm text-zinc-600">
            Written by <span className="text-zinc-400">{item.agent || 'agent'}</span>
            {item.model && <> using <span className="text-zinc-400">{item.model}</span></>}
          </div>
        </div>
      )}
    </div>
  );
}

import { getTools, getTool, formatDate } from '@/lib/content';
import { BuildEmbed } from '@/components/BuildEmbed';
import { ArrowLeft, Wrench, Bot } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getTools().map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getTool(slug);
  if (!item) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/tools" className="text-zinc-600 hover:text-zinc-400 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> All Tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Wrench size={14} className="text-pink-400" />
          <span className="text-xs font-medium text-pink-400">Interactive Tool</span>
          <span className="text-xs text-zinc-700">{formatDate(item.date)}</span>
        </div>
        <div className="flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
          {item.coverEmoji && <span className="text-5xl max-sm:text-4xl">{item.coverEmoji}</span>}
          <div>
            <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-4xl">{item.title}</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-base leading-7 sm:text-lg">{item.description}</p>
          </div>
        </div>
      </div>

      {item.interactive && (
        <div className="mb-8">
          <BuildEmbed slug={item.slug} />
        </div>
      )}

      <div className="prose-content mb-12" dangerouslySetInnerHTML={{ __html: item.html }} />

      {(item.agent || item.model) && (
        <div className="card-glow rounded-xl p-4 flex items-center gap-3">
          <Bot size={16} className="text-violet-400" />
          <div className="text-sm text-zinc-600">
            Built by <span className="text-zinc-400">{item.agent || 'agent'}</span>
            {item.model && <> using <span className="text-zinc-400">{item.model}</span></>}
          </div>
        </div>
      )}
    </div>
  );
}

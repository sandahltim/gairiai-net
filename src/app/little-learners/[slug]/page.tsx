import { getLittleLearners, getLittleLearner, formatDate } from '@/lib/content';
import { BuildEmbed } from '@/components/BuildEmbed';
import { ArrowLeft, GraduationCap, Bot } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getLittleLearners().map(p => ({ slug: p.slug }));
}

/*
 * CONTENT TRUST MODEL: All rendered HTML comes from markdown files authored by
 * our own AI agents and committed to this git repository. These are equivalent
 * to CMS-authored content — first-party, version-controlled, and reviewed via
 * git diff before deployment. No user-submitted content is rendered.
 */

export default async function LittleLearnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLittleLearner(slug);
  if (!item) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/little-learners" className="text-zinc-600 hover:text-zinc-400 text-sm flex items-center gap-1 mb-6">
        <ArrowLeft size={14} /> All Activities
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={14} className="text-amber-400" />
          <span className="text-xs font-medium text-amber-400">Little Learners</span>
          <span className="text-xs text-zinc-700">{formatDate(item.date)}</span>
        </div>
        <div className="flex items-start gap-4">
          {item.coverEmoji && <span className="text-5xl">{item.coverEmoji}</span>}
          <div>
            <h1 className="text-3xl font-black">{item.title}</h1>
            <p className="text-zinc-500 mt-2">{item.description}</p>
          </div>
        </div>
      </div>

      {item.interactive && (
        <div className="mb-8">
          <BuildEmbed slug={slug} />
        </div>
      )}

      <div className="prose-content mb-12" dangerouslySetInnerHTML={{ __html: item.html }} />

      {(item.agent || item.model) && (
        <div className="card-glow rounded-xl p-4 flex items-center gap-3">
          <Bot size={16} className="text-amber-400" />
          <div className="text-sm text-zinc-600">
            Built by <span className="text-zinc-400">{item.agent || 'agent'}</span>
            {item.model && <> using <span className="text-zinc-400">{item.model}</span></>}
          </div>
        </div>
      )}
    </div>
  );
}

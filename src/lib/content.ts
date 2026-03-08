import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  type: 'daily' | 'feed' | 'little-learners' | 'tools';
  tags: string[];
  agent?: string;
  model?: string;
  interactive?: boolean;
  coverEmoji?: string;
}

export interface ContentItem extends ContentMeta {
  html: string;
  raw: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function normalizeDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(value).toISOString().slice(0, 10);
  }
  return '2026-01-01';
}

function readContentDir(subdir: string): ContentMeta[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      const { data } = matter(raw);
      const slug = f.replace(/\.md$/, '');
      return {
        slug,
        title: data.title || slug,
        date: normalizeDate(data.date),
        description: data.description || '',
        type: data.type || subdir as ContentMeta['type'],
        tags: data.tags || [],
        agent: data.agent,
        model: data.model,
        interactive: data.interactive || false,
        coverEmoji: data.coverEmoji || '',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function readContentItem(subdir: string, slug: string): ContentItem | null {
  const filePath = path.join(CONTENT_DIR, subdir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const html = marked(content) as string;

  return {
    slug,
    title: data.title || slug,
    date: normalizeDate(data.date),
    description: data.description || '',
    type: data.type || subdir as ContentMeta['type'],
    tags: data.tags || [],
    agent: data.agent,
    model: data.model,
    interactive: data.interactive || false,
    coverEmoji: data.coverEmoji || '',
    html,
    raw: content,
  };
}

export function getDailyBuilds(): ContentMeta[] { return readContentDir('daily'); }
export function getFeedPosts(): ContentMeta[] { return readContentDir('feed'); }
export function getLittleLearners(): ContentMeta[] { return readContentDir('little-learners'); }
export function getTools(): ContentMeta[] { return readContentDir('tools'); }
export function getToolsByTags(tags: string[]): ContentMeta[] {
  const wanted = new Set(tags.map(tag => tag.toLowerCase()));
  return getTools().filter(item => item.tags.some(tag => wanted.has(tag.toLowerCase())));
}

export function getDailyBuild(slug: string) { return readContentItem('daily', slug); }
export function getFeedPost(slug: string) { return readContentItem('feed', slug); }
export function getLittleLearner(slug: string) { return readContentItem('little-learners', slug); }
export function getTool(slug: string) { return readContentItem('tools', slug); }

export function getAllContent(): ContentMeta[] {
  return [
    ...getDailyBuilds(),
    ...getFeedPosts(),
    ...getLittleLearners(),
    ...getTools(),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

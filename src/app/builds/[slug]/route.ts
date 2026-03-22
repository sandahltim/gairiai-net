import { promises as fs } from 'node:fs';
import path from 'node:path';

import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const filePath = path.join(process.cwd(), 'public', 'builds', slug, 'index.html');

  try {
    const html = await fs.readFile(filePath, 'utf8');

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return new Response('Build not found', { status: 404 });
    }
    throw error;
  }
}

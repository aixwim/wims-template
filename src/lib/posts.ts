import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
export { formatDate, readingMin } from './format';

export interface Post {
  slug: string;
  title: string;
  date: Date;
  excerpt: string;
  tags: string[];
  category?: string;
  cover?: string;
  metaTitle?: string;
  metaDescription?: string;
  draft?: boolean;
  body: string;
}

const contentDir = path.join(process.cwd(), 'content');

let _cache: Post[] | null = null;

function readAllPosts(): Post[] {
  if (_cache) return _cache;
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: data.slug ?? file.replace(/\.md$/, ''),
      title: data.title ?? '',
      date: new Date(data.date),
      excerpt: data.excerpt ?? '',
      tags: data.tags ?? [],
      category: data.category,
      cover: data.cover,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      draft: Boolean(data.draft),
      body: content,
    };
  });
  _cache = posts
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return _cache;
}

export function getAllPosts(): Post[] {
  return readAllPosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return readAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? posts[idx - 1] : undefined,
    next: idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : undefined,
  };
}
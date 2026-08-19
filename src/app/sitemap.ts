import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteUrl, basePath } from '@/lib/site';

export const dynamic = 'force-static';

function dateOnly(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticPages = [
    { url: siteUrl + basePath + '/', lastModified: dateOnly(new Date()), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: siteUrl + basePath + '/posts/', lastModified: dateOnly(new Date()), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: siteUrl + basePath + '/tags/', lastModified: dateOnly(new Date()), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: siteUrl + basePath + '/about/', lastModified: dateOnly(new Date()), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: siteUrl + basePath + '/contact/', lastModified: dateOnly(new Date()), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: siteUrl + basePath + '/search/', lastModified: dateOnly(new Date()), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const postPages = posts.map((post) => ({
    url: siteUrl + basePath + `/posts/${post.slug}/`,
    lastModified: dateOnly(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const tagPages = allTags.map((tag) => ({
    url: siteUrl + basePath + `/tags/${tag}/`,
    lastModified: dateOnly(new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}

import { getAllPosts } from '@/lib/posts';
import { siteUrl, basePath } from '@/lib/site';
import { getSiteConfig } from '@/lib/site';

export const dynamic = 'force-static';

const site = getSiteConfig();
const base = basePath;

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${base}/posts/${post.slug}/</link>
      <guid isPermaLink="true">${siteUrl}${base}/posts/${post.slug}/</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${post.date.toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${site.siteName}</title>
  <link>${siteUrl}${base}/</link>
  <description>${site.description}</description>
  <language>id</language>
  <atom:link href="${siteUrl}${base}/rss.xml" rel="self" type="application/rss+xml"/>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

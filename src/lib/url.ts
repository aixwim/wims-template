export const siteUrl = 'https://aixwim.github.io';

export const href = (p: string) => p;

export const tagHref = (tag: string) => href(`/tags/${encodeURIComponent(tag)}/`);

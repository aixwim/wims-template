export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(body: string): Heading[] {
  const lines = body.split('\n');
  const headings: Heading[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (!m) continue;
    const level = m[1].length;
    const raw = m[2].trim();
    const text = raw.replace(/[*_`]/g, '').replace(/\[(.+)\]\([^)]*\)/g, '$1').trim();
    if (!text) continue;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }
  return headings;
}
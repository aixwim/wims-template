import fs from 'fs';
import path from 'path';

export interface NetworkSite {
  repo: string;
  name: string;
  category: string;
  categoryLabel: string;
  parent: string | null;
  children: string[];
  related: string[];
  status: string;
  note?: string;
}

export interface NetworkData {
  hub: string;
  sites: NetworkSite[];
  topics: NetworkSite[];
  brandPalettes: Record<string, { accent: string; accent2: string }>;
}

export function getNetwork(): NetworkData {
  const file = path.join(process.cwd(), 'registry', 'network.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as NetworkData;
}

export function getAllRepos(): string[] {
  const network = getNetwork();
  return [...network.sites, ...network.topics].map((s) => s.repo);
}

export function getNetworkLinks(repo: string): NetworkSite[] {
  const network = getNetwork();
  const site = [...network.sites, ...network.topics].find((s) => s.repo === repo);
  if (!site) return [];

  const targets = [...(site.parent ? [site.parent] : []), ...site.children, ...site.related];
  const byRepo = new Map([...network.sites, ...network.topics].map((s) => [s.repo, s]));
  const links = targets
    .map((t) => byRepo.get(t))
    .filter((s): s is NetworkSite => Boolean(s) && (s as NetworkSite).status !== 'draft');
  const hub = byRepo.get(network.hub);
  if (hub && hub.repo !== repo) links.unshift(hub);

  return links.filter((s) => s.repo !== repo);
}

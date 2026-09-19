import type { DatabaseService, MusicSearchService } from './interfaces.js';
import type { Composition, MusicSearchMatch, MusicSearchQuery, MusicSearchResult, MusicSubmission, User } from '../shared.js';
import { ForbiddenError } from '../errors/errorTypes.js';

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function titleMatch(queryTitle: string, candidateTitle: string): 'exact' | 'similar' | null {
  const query = normalize(queryTitle);
  const candidate = normalize(candidateTitle);
  if (query === candidate) return 'exact';
  if (query.length >= 4 && (candidate.includes(query) || query.includes(candidate))) return 'similar';
  return null;
}

function authorConfidence(query: MusicSearchQuery, authors: string[]): MusicSearchMatch['authorConfidence'] {
  const requested = [...(query.contributors ?? []).map(contributor => contributor.name), query.artistName ?? ''].filter(Boolean).map(normalize);
  const available = authors.filter(Boolean).map(normalize);
  if (!requested.length || !available.length) return 'unknown';
  if (requested.some(author => available.some(candidate => author === candidate))) return 'high';
  if (requested.some(author => available.some(candidate => author.includes(candidate) || candidate.includes(author)))) return 'medium';
  return 'low';
}

function submissionAuthors(item: MusicSubmission): string[] {
  return [item.artistName, ...item.metadata.contributors.map(contributor => contributor.name)];
}

function cleanHtml(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export class DefaultMusicSearchService implements MusicSearchService {
  constructor(private readonly database: DatabaseService) {}

  async search(actor: User, input: MusicSearchQuery): Promise<MusicSearchResult> {
    if (!actor.roles.includes('admin')) throw new ForbiddenError('Administrator role required');
    const matches: MusicSearchMatch[] = [];
    const submissions = await this.database.findMany<MusicSubmission>('musicSubmission');
    const compositions = await this.database.findMany<Composition>('composition');

    for (const item of submissions) {
      const match = titleMatch(input.title, item.metadata.title);
      if (!match) continue;
      matches.push({ id: item.id, title: item.metadata.title, author: submissionAuthors(item).filter(Boolean).join(', '), source: 'pending_intake', titleMatch: match, authorConfidence: authorConfidence(input, submissionAuthors(item)), status: item.status });
    }
    for (const item of compositions) {
      const match = titleMatch(input.title, item.title);
      if (!match) continue;
      matches.push({ id: item.id, title: item.title, author: item.publisherName ?? 'Author not recorded', source: 'approved_catalog', titleMatch: match, authorConfidence: authorConfidence(input, [item.publisherName ?? '']), status: item.status });
    }

    const urls = [...(input.urls ?? [])];
    if (!urls.length) {
      try {
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`${input.title} ${input.artistName ?? ''} song`)}`, { signal: AbortSignal.timeout(8000) });
        const html = await response.text();
        urls.push(...[...html.matchAll(/result__a[^>]+href="([^"]+)"/g)].map(match => match[1]).filter((url): url is string => !!url && url.startsWith('http')).slice(0, 3));
      } catch { /* External research is optional; local evidence remains available. */ }
    }
    for (const url of urls.slice(0, 5)) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!response.ok) continue;
        const excerpt = cleanHtml(await response.text()).slice(0, 600);
        if (excerpt) matches.push({ id: url, title: input.title, author: input.artistName || 'Author not identified', source: 'public_web', titleMatch: 'exact', authorConfidence: input.artistName ? 'medium' : 'unknown', sourceUrl: url, excerpt });
      } catch { /* A failed public source should not fail the catalog search. */ }
    }

    const duplicateWarnings = matches.filter(match => match.titleMatch === 'exact').map(match => match.authorConfidence === 'high' ? `High-confidence title and author match: ${match.title} by ${match.author}.` : `Review possible duplicate title: ${match.title} by ${match.author}.`);
    return { query: input, matches, duplicateWarnings, externalSearched: urls.length > 0 };
  }
}